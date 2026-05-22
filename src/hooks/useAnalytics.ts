import { useMemo } from 'react';
import type { Property, CityStats, MonthlyTrend, WardStats } from '@/types/property';
import { CITIES, WARDS, PROPERTY_TYPES } from '@/constants/cities';
import { format, parseISO } from 'date-fns';

export function useAnalytics(properties: Property[]) {
  const cityStats = useMemo<CityStats[]>(() => {
    return CITIES.map((city) => {
      const cityProps = properties.filter((p) => p.tenant === city);
      const approved = cityProps.filter((p) => p.status === 'Approved');
      const pending = cityProps.filter((p) => p.status === 'Pending');
      const rejected = cityProps.filter((p) => p.status === 'Rejected');
      const totalTax = cityProps.reduce((sum, p) => sum + p.annual_tax_inr, 0);
      const totalCollection = cityProps.reduce((sum, p) => sum + p.collection_inr, 0);

      const propertyTypes: Record<string, number> = {};
      PROPERTY_TYPES.forEach((t) => {
        propertyTypes[t] = cityProps.filter((p) => p.property_type === t).length;
      });

      const wardStats: Record<string, WardStats> = {};
      WARDS.forEach((w) => {
        const wardProps = cityProps.filter((p) => p.ward === w);
        wardStats[w] = {
          total: wardProps.length,
          approved: wardProps.filter((p) => p.status === 'Approved').length,
          pending: wardProps.filter((p) => p.status === 'Pending').length,
          rejected: wardProps.filter((p) => p.status === 'Rejected').length,
          collection: wardProps.reduce((s, p) => s + p.collection_inr, 0),
          tax: wardProps.reduce((s, p) => s + p.annual_tax_inr, 0),
        };
      });

      return {
        city,
        totalProperties: cityProps.length,
        approved: approved.length,
        pending: pending.length,
        rejected: rejected.length,
        totalTax,
        totalCollection,
        collectionRate: totalTax > 0 ? (totalCollection / totalTax) * 100 : 0,
        avgArea: cityProps.length > 0 ? cityProps.reduce((s, p) => s + p.area_sqft, 0) / cityProps.length : 0,
        propertyTypes,
        wardStats,
      };
    });
  }, [properties]);

  const totalStats = useMemo(() => {
    const total = properties.length;
    const approved = properties.filter((p) => p.status === 'Approved').length;
    const pending = properties.filter((p) => p.status === 'Pending').length;
    const rejected = properties.filter((p) => p.status === 'Rejected').length;
    const totalTax = properties.reduce((s, p) => s + p.annual_tax_inr, 0);
    const totalCollection = properties.reduce((s, p) => s + p.collection_inr, 0);
    const avgTax = total > 0 ? totalTax / total : 0;
    const collectionRate = totalTax > 0 ? (totalCollection / totalTax) * 100 : 0;
    const avgArea = total > 0 ? properties.reduce((s, p) => s + p.area_sqft, 0) / total : 0;

    return { total, approved, pending, rejected, totalTax, totalCollection, avgTax, collectionRate, avgArea };
  }, [properties]);

  const monthlyTrends = useMemo<MonthlyTrend[]>(() => {
    const monthMap = new Map<string, { count: number; collection: number }>();

    properties.forEach((p) => {
      const date = parseISO(p.registration_date);
      const key = format(date, 'yyyy-MM');
      const existing = monthMap.get(key) || { count: 0, collection: 0 };
      existing.count += 1;
      existing.collection += p.collection_inr;
      monthMap.set(key, existing);
    });

    return Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, data]) => {
        const [year, month] = key.split('-').map(Number);
        return {
          month: format(new Date(year, month - 1), 'MMM yyyy'),
          year,
          count: data.count,
          collection: data.collection,
        };
      });
  }, [properties]);

  const propertyTypeDistribution = useMemo(() => {
    return PROPERTY_TYPES.map((type) => ({
      name: type,
      value: properties.filter((p) => p.property_type === type).length,
    }));
  }, [properties]);

  const wardAnalysis = useMemo(() => {
    return WARDS.map((ward) => {
      const wardProps = properties.filter((p) => p.ward === ward);
      return {
        ward,
        total: wardProps.length,
        approved: wardProps.filter((p) => p.status === 'Approved').length,
        pending: wardProps.filter((p) => p.status === 'Pending').length,
        rejected: wardProps.filter((p) => p.status === 'Rejected').length,
        collection: wardProps.reduce((s, p) => s + p.collection_inr, 0),
        tax: wardProps.reduce((s, p) => s + p.annual_tax_inr, 0),
      };
    });
  }, [properties]);

  const topCities = useMemo(() => {
    return [...cityStats].sort((a, b) => b.totalCollection - a.totalCollection);
  }, [cityStats]);

  const approvalRates = useMemo(() => {
    return cityStats.map((cs) => ({
      city: cs.city,
      rate: cs.totalProperties > 0 ? (cs.approved / cs.totalProperties) * 100 : 0,
      approved: cs.approved,
      total: cs.totalProperties,
    }));
  }, [cityStats]);

  const revenueByWard = useMemo(() => {
    const data: { city: string; ward: string; revenue: number }[] = [];
    cityStats.forEach((cs) => {
      Object.entries(cs.wardStats).forEach(([ward, stats]) => {
        data.push({ city: cs.city, ward, revenue: stats.collection });
      });
    });
    return data;
  }, [cityStats]);

  return {
    cityStats,
    totalStats,
    monthlyTrends,
    propertyTypeDistribution,
    wardAnalysis,
    topCities,
    approvalRates,
    revenueByWard,
  };
}
