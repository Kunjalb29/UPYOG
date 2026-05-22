import { useMemo } from 'react';
import { usePropertyStore } from '@/store/usePropertyStore';

export function useFilteredProperties() {
  const properties = usePropertyStore((s) => s.properties);
  const selectedCity = usePropertyStore((s) => s.selectedCity);
  const selectedStatus = usePropertyStore((s) => s.selectedStatus);
  const selectedPropertyType = usePropertyStore((s) => s.selectedPropertyType);
  const searchQuery = usePropertyStore((s) => s.searchQuery);

  return useMemo(() => {
    return properties.filter((p) => {
      if (selectedCity !== 'All Cities' && p.tenant !== selectedCity) return false;
      if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;
      if (selectedPropertyType !== 'All' && p.property_type !== selectedPropertyType) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          p.property_id.toLowerCase().includes(q) ||
          p.owner_name.toLowerCase().includes(q) ||
          p.tenant.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.ward.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [properties, selectedCity, selectedStatus, selectedPropertyType, searchQuery]);
}
