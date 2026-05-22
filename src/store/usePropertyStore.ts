import { create } from 'zustand';
import type { Property } from '@/types/property';
import propertiesData from '@/data/properties.json';

interface PropertyStore {
  properties: Property[];
  selectedCity: string;
  selectedStatus: string;
  selectedPropertyType: string;
  searchQuery: string;
  setSelectedCity: (city: string) => void;
  setSelectedStatus: (status: string) => void;
  setSelectedPropertyType: (type: string) => void;
  setSearchQuery: (query: string) => void;
  updatePropertyStatus: (id: string, status: 'Approved' | 'Pending' | 'Rejected') => void;
  getFilteredProperties: () => Property[];
}

export const usePropertyStore = create<PropertyStore>((set, get) => ({
  properties: propertiesData as Property[],
  selectedCity: 'All Cities',
  selectedStatus: 'All',
  selectedPropertyType: 'All',
  searchQuery: '',

  setSelectedCity: (city) => set({ selectedCity: city }),
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  setSelectedPropertyType: (type) => set({ selectedPropertyType: type }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  updatePropertyStatus: (id, status) => set((s) => ({
    properties: s.properties.map((p) => p.property_id === id ? { ...p, status } : p)
  })),

  getFilteredProperties: () => {
    const { properties, selectedCity, selectedStatus, selectedPropertyType, searchQuery } = get();
    
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
  },
}));
