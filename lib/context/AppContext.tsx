'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface FoodItem {
  id: string;
  name: string;
  caloriesPerUnit: number;
  proteinPerUnit: number;
  unit: string;
  referenceQuantity?: number;
  referenceCalories?: number;
  referenceProtein?: number;
  version?: number;
}

export interface FoodEntry {
  foodId: string;
  date: string;
  amount: number;
}

export interface UserSettings {
  minCalories: number;
  minProtein: number;
}

interface AppContextType {
  foodItems: FoodItem[];
  foodEntries: FoodEntry[];
  userSettings: UserSettings;
  addFoodItem: (item: Omit<FoodItem, 'id'>) => void;
  addFoodEntry: (entry: FoodEntry) => void;
  updateFoodEntry: (foodId: string, date: string, amount: number) => void;
  getFoodEntry: (foodId: string, date: string) => FoodEntry | undefined;
  getDayTotals: (date: string) => { calories: number; protein: number };
  updateUserSettings: (settings: UserSettings) => void;
  getWeeklyStats: () => Array<{ date: string; calories: number; protein: number }>;
}

const AppContext = createContext<AppContextType | null>(null);

const defaultFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Chicken Breast',
    caloriesPerUnit: 1.65,
    proteinPerUnit: 0.31,
    unit: 'g',
    referenceQuantity: 100,
    referenceCalories: 165,
    referenceProtein: 31,
    version: 2
  },
  {
    id: '2',
    name: 'Brown Rice',
    caloriesPerUnit: 1.23,
    proteinPerUnit: 0.026,
    unit: 'g',
    referenceQuantity: 100,
    referenceCalories: 123,
    referenceProtein: 2.6,
    version: 2
  },
  {
    id: '3',
    name: 'Greek Yogurt',
    caloriesPerUnit: 100,
    proteinPerUnit: 10,
    unit: 'cup',
    referenceQuantity: 1,
    referenceCalories: 100,
    referenceProtein: 10,
    version: 2
  },
  {
    id: '4',
    name: 'Banana',
    caloriesPerUnit: 105,
    proteinPerUnit: 1.3,
    unit: 'piece',
    referenceQuantity: 1,
    referenceCalories: 105,
    referenceProtein: 1.3,
    version: 2
  },
  {
    id: '5',
    name: 'Almonds',
    caloriesPerUnit: 5.76,
    proteinPerUnit: 0.21,
    unit: 'g',
    referenceQuantity: 100,
    referenceCalories: 576,
    referenceProtein: 21,
    version: 2
  }
];

const FOOD_ITEM_VERSION = 2;

const normalizeFoodItem = (item: any): FoodItem => {
  const rawUnit = typeof item.unit === 'string' && item.unit.trim() ? item.unit.trim() : 'unit';

  const candidateReferenceQuantity = Number(
    item.referenceQuantity ?? item.unitQuantity ?? item.portionQuantity ?? 1
  );
  const referenceQuantity = Number.isFinite(candidateReferenceQuantity) && candidateReferenceQuantity > 0
    ? candidateReferenceQuantity
    : 1;

  const storedVersion = typeof item.version === 'number' ? item.version : 1;

  const storedCalories = Number(item.caloriesPerUnit) || 0;
  const storedProtein = Number(item.proteinPerUnit) || 0;

  const referenceCaloriesRaw = Number(
    item.referenceCalories ?? item.caloriesPerReference ?? item.totalCalories ?? storedCalories * referenceQuantity
  ) || 0;
  const referenceProteinRaw = Number(
    item.referenceProtein ?? item.proteinPerReference ?? item.totalProtein ?? storedProtein * referenceQuantity
  ) || 0;

  const caloriesPerUnit = storedVersion >= FOOD_ITEM_VERSION
    ? storedCalories
    : referenceQuantity ? storedCalories / referenceQuantity : storedCalories;

  const proteinPerUnit = storedVersion >= FOOD_ITEM_VERSION
    ? storedProtein
    : referenceQuantity ? storedProtein / referenceQuantity : storedProtein;

  return {
    id: item.id?.toString() ?? Date.now().toString(),
    name: item.name ?? '',
    unit: rawUnit,
    caloriesPerUnit,
    proteinPerUnit,
    referenceQuantity,
    referenceCalories: referenceCaloriesRaw > 0 ? referenceCaloriesRaw : caloriesPerUnit * referenceQuantity,
    referenceProtein: referenceProteinRaw > 0 ? referenceProteinRaw : proteinPerUnit * referenceQuantity,
    version: FOOD_ITEM_VERSION
  };
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(defaultFoodItems);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    minCalories: 2000,
    minProtein: 150
  });

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFoodItems = localStorage.getItem('dietTracker_foodItems');
      const savedFoodEntries = localStorage.getItem('dietTracker_foodEntries');
      const savedUserSettings = localStorage.getItem('dietTracker_userSettings');

      if (savedFoodItems) {
        const parsedItems = JSON.parse(savedFoodItems).map((item: any) =>
          normalizeFoodItem(item)
        );
        setFoodItems(parsedItems);
      }
      if (savedFoodEntries) {
        setFoodEntries(JSON.parse(savedFoodEntries));
      }
      if (savedUserSettings) {
        setUserSettings(JSON.parse(savedUserSettings));
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dietTracker_foodItems', JSON.stringify(foodItems));
    }
  }, [foodItems]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dietTracker_foodEntries', JSON.stringify(foodEntries));
    }
  }, [foodEntries]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dietTracker_userSettings', JSON.stringify(userSettings));
    }
  }, [userSettings]);

  const addFoodItem = (item: Omit<FoodItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString()
    };
    setFoodItems(prev => [...prev, normalizeFoodItem(newItem)]);
  };

  const addFoodEntry = (entry: FoodEntry) => {
    setFoodEntries(prev => {
      const existing = prev.find(e => e.foodId === entry.foodId && e.date === entry.date);
      if (existing) {
        return prev.map(e => 
          e.foodId === entry.foodId && e.date === entry.date
            ? { ...e, amount: e.amount + entry.amount }
            : e
        );
      }
      return [...prev, entry];
    });
  };

  const updateFoodEntry = (foodId: string, date: string, amount: number) => {
    setFoodEntries(prev => {
      const existing = prev.find(e => e.foodId === foodId && e.date === date);
      if (existing) {
        if (amount === 0) {
          return prev.filter(e => !(e.foodId === foodId && e.date === date));
        }
        return prev.map(e => 
          e.foodId === foodId && e.date === date
            ? { ...e, amount }
            : e
        );
      } else if (amount > 0) {
        return [...prev, { foodId, date, amount }];
      }
      return prev;
    });
  };

  const getFoodEntry = (foodId: string, date: string): FoodEntry | undefined => {
    return foodEntries.find(entry => entry.foodId === foodId && entry.date === date);
  };

  const getDayTotals = (date: string) => {
    const dayEntries = foodEntries.filter(entry => entry.date === date);
    let totalCalories = 0;
    let totalProtein = 0;

    dayEntries.forEach(entry => {
      const foodItem = foodItems.find(item => item.id === entry.foodId);
      if (foodItem) {
        totalCalories += (foodItem.caloriesPerUnit * entry.amount);
        totalProtein += (foodItem.proteinPerUnit * entry.amount);
      }
    });

    return {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein * 10) / 10
    };
  };

  const updateUserSettings = (settings: UserSettings) => {
    setUserSettings(settings);
  };

  const getWeeklyStats = () => {
    const today = new Date();
    const stats = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const totals = getDayTotals(dateStr);
      
      stats.push({
        date: dateStr,
        calories: totals.calories,
        protein: totals.protein
      });
    }

    return stats;
  };

  return (
    <AppContext.Provider value={{
      foodItems,
      foodEntries,
      userSettings,
      addFoodItem,
      addFoodEntry,
      updateFoodEntry,
      getFoodEntry,
      getDayTotals,
      updateUserSettings,
      getWeeklyStats
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};