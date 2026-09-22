import React, { createContext, useContext, useState, useEffect } from 'react';
import { Car, CarFilters, SavedSearch } from '../types.ts';
import { useAuth } from './AuthContext.tsx';

interface CarContextType {
  cars: Car[];
  loading: boolean;
  filters: CarFilters;
  setFilters: React.Dispatch<React.SetStateAction<CarFilters>>;
  resetFilters: () => void;
  fetchCars: () => Promise<void>;
  selectedCar: Car | null;
  setSelectedCar: (car: Car | null) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  favorites: Car[];
  isFavorite: (carId: number) => boolean;
  toggleFavorite: (carId: number) => Promise<void>;
  comparisonCars: Car[];
  addToComparison: (car: Car) => void;
  removeFromComparison: (carId: number) => void;
  clearComparison: () => void;
  isCompared: (carId: number) => boolean;
  savedSearches: SavedSearch[];
  saveCurrentSearch: (name: string) => Promise<void>;
  applySavedSearch: (search: SavedSearch) => void;
  carToPromote: Car | null;
  setCarToPromote: (car: Car | null) => void;
  chatCar: Car | null;
  setChatCar: (car: Car | null) => void;
}

const initialFilters: CarFilters = {
  search: '',
  brand: 'all',
  model: '',
  minPrice: undefined,
  maxPrice: undefined,
  minYear: undefined,
  maxYear: undefined,
  minMileage: undefined,
  maxMileage: undefined,
  fuelType: 'all',
  country: 'all',
  city: '',
  transmission: 'all',
  bodyType: 'all',
  saleType: 'all',
  promotionOnly: false,
  sortBy: 'price_asc',
};

const CarContext = createContext<CarContextType | undefined>(undefined);

export const CarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<CarFilters>(initialFilters);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [activeView, setActiveView] = useState<string>('search');
  const [favorites, setFavorites] = useState<Car[]>([]);
  const [comparisonCars, setComparisonCars] = useState<Car[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [carToPromote, setCarToPromote] = useState<Car | null>(null);
  const [chatCar, setChatCar] = useState<Car | null>(null);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.brand && filters.brand !== 'all') params.append('brand', filters.brand);
      if (filters.model) params.append('model', filters.model);
      if (filters.minPrice) params.append('minPrice', String(filters.minPrice));
      if (filters.maxPrice) params.append('maxPrice', String(filters.maxPrice));
      if (filters.minYear) params.append('minYear', String(filters.minYear));
      if (filters.maxYear) params.append('maxYear', String(filters.maxYear));
      if (filters.minMileage) params.append('minMileage', String(filters.minMileage));
      if (filters.maxMileage) params.append('maxMileage', String(filters.maxMileage));
      if (filters.fuelType && filters.fuelType !== 'all') params.append('fuelType', filters.fuelType);
      if (filters.country && filters.country !== 'all') params.append('country', filters.country);
      if (filters.city) params.append('city', filters.city);
      if (filters.transmission && filters.transmission !== 'all') params.append('transmission', filters.transmission);
      if (filters.bodyType && filters.bodyType !== 'all') params.append('bodyType', filters.bodyType);
      if (filters.saleType && filters.saleType !== 'all') params.append('saleType', filters.saleType);
      if (filters.promotionOnly) params.append('promotionOnly', 'true');
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const res = await fetch(`/api/cars?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCars(data);
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [filters]);

  // Fetch favorites
  const fetchFavorites = async () => {
    try {
      const res = await fetch(`/api/favorites?userId=${currentUser.id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setFavorites(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [currentUser.id]);

  const isFavorite = (carId: number) => {
    return favorites.some((c) => c.id === carId);
  };

  const toggleFavorite = async (carId: number) => {
    try {
      const res = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, carId }),
      });
      const data = await res.json();
      if (data.favorited) {
        const found = cars.find((c) => c.id === carId);
        if (found) setFavorites((prev) => [...prev, found]);
      } else {
        setFavorites((prev) => prev.filter((c) => c.id !== carId));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Comparison system (up to 4 cars)
  const addToComparison = (car: Car) => {
    if (comparisonCars.some((c) => c.id === car.id)) return;
    if (comparisonCars.length >= 4) {
      alert('Puedes comparar un máximo de 4 vehículos simultáneamente.');
      return;
    }
    setComparisonCars((prev) => [...prev, car]);
  };

  const removeFromComparison = (carId: number) => {
    setComparisonCars((prev) => prev.filter((c) => c.id !== carId));
  };

  const clearComparison = () => {
    setComparisonCars([]);
  };

  const isCompared = (carId: number) => {
    return comparisonCars.some((c) => c.id === carId);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // Saved searches
  const saveCurrentSearch = async (name: string) => {
    try {
      const res = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          name,
          filters,
        }),
      });
      const data = await res.json();
      setSavedSearches((prev) => [data, ...prev]);
    } catch (e) {
      console.error('Error saving search:', e);
    }
  };

  const applySavedSearch = (search: SavedSearch) => {
    setFilters({ ...initialFilters, ...search.filters });
    setActiveView('search');
  };

  return (
    <CarContext.Provider
      value={{
        cars,
        loading,
        filters,
        setFilters,
        resetFilters,
        fetchCars,
        selectedCar,
        setSelectedCar,
        activeView,
        setActiveView,
        favorites,
        isFavorite,
        toggleFavorite,
        comparisonCars,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isCompared,
        savedSearches,
        saveCurrentSearch,
        applySavedSearch,
        carToPromote,
        setCarToPromote,
        chatCar,
        setChatCar,
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export const useCar = () => {
  const context = useContext(CarContext);
  if (!context) throw new Error('useCar must be used within CarProvider');
  return context;
};
