import type { Property } from '@/types/property';
import { CITIES, WARDS, PROPERTY_TYPES } from '@/constants/cities';

export function generateContext(properties: Property[]): string {
  const total = properties.length;
  const approved = properties.filter((p) => p.status === 'Approved').length;
  const pending = properties.filter((p) => p.status === 'Pending').length;
  const rejected = properties.filter((p) => p.status === 'Rejected').length;
  const totalTax = properties.reduce((s, p) => s + p.annual_tax_inr, 0);
  const totalCollection = properties.reduce((s, p) => s + p.collection_inr, 0);
  const avgCollectionRate = totalTax > 0 ? (totalCollection / totalTax) * 100 : 0;

  let ctx = `=== UPYOG PLATFORM SUMMARY ===
Total Properties: ${total}
Approved: ${approved}
Pending Review: ${pending}
Rejected: ${rejected}
Total Tax Demand: ₹${totalTax.toLocaleString('en-IN')}
Total Collected: ₹${totalCollection.toLocaleString('en-IN')}
Platform Collection Rate: ${avgCollectionRate.toFixed(2)}%

=== MUNICIPALITY STATS ===\n`;

  CITIES.forEach((city) => {
    const cityProps = properties.filter((p) => p.tenant === city);
    if (cityProps.length === 0) return;
    const cApproved = cityProps.filter((p) => p.status === 'Approved').length;
    const cPending = cityProps.filter((p) => p.status === 'Pending').length;
    const cRejected = cityProps.filter((p) => p.status === 'Rejected').length;
    const cTax = cityProps.reduce((s, p) => s + p.annual_tax_inr, 0);
    const cColl = cityProps.reduce((s, p) => s + p.collection_inr, 0);
    const cRate = cTax > 0 ? (cColl / cTax) * 100 : 0;

    ctx += `${city}: ${cityProps.length} properties (Approved: ${cApproved}, Pending: ${cPending}, Rejected: ${cRejected}) | Demand: ₹${cTax.toLocaleString('en-IN')}, Collected: ₹${cColl.toLocaleString('en-IN')}, Rate: ${cRate.toFixed(1)}%\n`;
  });

  ctx += `\n=== PROPERTY TYPES ===\n`;
  PROPERTY_TYPES.forEach((type) => {
    const count = properties.filter((p) => p.property_type === type).length;
    const share = total > 0 ? (count / total) * 100 : 0;
    ctx += `${type}: ${count} properties (${share.toFixed(1)}% share)\n`;
  });

  ctx += `\n=== WARD BREAKDOWN ===\n`;
  WARDS.forEach((ward) => {
    const wardProps = properties.filter((p) => p.ward === ward);
    const wColl = wardProps.reduce((s, p) => s + p.collection_inr, 0);
    ctx += `${ward}: ${wardProps.length} properties | Collected: ₹${wColl.toLocaleString('en-IN')}\n`;
  });

  return ctx;
}
