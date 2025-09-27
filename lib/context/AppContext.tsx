'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface FoodItem {
  id: string;
  name: string;
  caloriesPerUnit: number;
  proteinPerUnit: number;
  unit: string;
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
    caloriesPerUnit: 165,
    proteinPerUnit: 31,
    unit: '100g'
  },
  {
    id: '2',
    name: 'Brown Rice',
    caloriesPerUnit: 123,
    proteinPerUnit: 2.6,
    unit: '100g'
  },
  {
    id: '3',
    name: 'Greek Yogurt',
    caloriesPerUnit: 100,
    proteinPerUnit: 10,
    unit: '1 cup'
  },
  {
    id: '4',
    name: 'Banana',
    caloriesPerUnit: 105,
    proteinPerUnit: 1.3,
    unit: '1 piece'
  },
  {
    id: '5',
    name: 'Almonds',
    caloriesPerUnit: 576,
    proteinPerUnit: 21,
    unit: '100g'
  }
];

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
        setFoodItems(JSON.parse(savedFoodItems));
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
    setFoodItems(prev => [...prev, newItem]);
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