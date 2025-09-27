'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext, FoodItem } from '@/lib/context/AppContext';

interface FoodEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  foodItem: FoodItem;
  date: string;
}

export default function FoodEntryModal({ isOpen, onClose, foodItem, date }: FoodEntryModalProps) {
  const { getFoodEntry, updateFoodEntry } = useAppContext();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const entry = getFoodEntry(foodItem.id, date);
      setAmount(entry?.amount || 0);
    }
  }, [isOpen, foodItem.id, date, getFoodEntry]);

  const handleSave = () => {
    updateFoodEntry(foodItem.id, date, amount);
    onClose();
  };

  if (!isOpen) return null;

  const totalCalories = Math.round(foodItem.caloriesPerUnit * amount);
  const totalProtein = Math.round(foodItem.proteinPerUnit * amount * 10) / 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {foodItem.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Per {foodItem.unit}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Calories:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {foodItem.caloriesPerUnit}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Protein:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {foodItem.proteinPerUnit}g
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount ({foodItem.unit})
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              step="0.1"
              min="0"
              className="w-full"
              autoFocus
            />
          </div>

          {amount > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                Total for {amount} {foodItem.unit}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 dark:text-blue-400">Calories:</span>
                  <span className="ml-2 font-bold text-blue-700 dark:text-blue-300">
                    {totalCalories}
                  </span>
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-400">Protein:</span>
                  <span className="ml-2 font-bold text-blue-700 dark:text-blue-300">
                    {totalProtein}g
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}