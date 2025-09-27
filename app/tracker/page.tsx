'use client';

import { useState } from 'react';
import { Plus, CreditCard as Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/lib/context/AppContext';
import FoodEntryModal from '@/components/modals/FoodEntryModal';
import AddFoodModal from '@/components/modals/AddFoodModal';

export default function TrackerPage() {
  const { foodItems, getFoodEntry, getDayTotals } = useAppContext();
  const [selectedFood, setSelectedFood] = useState<{ foodId: string; date: string } | null>(null);
  const [showAddFood, setShowAddFood] = useState(false);
  
  // Generate last 7 days
  const today = new Date();
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleCellClick = (foodId: string, date: string) => {
    setSelectedFood({ foodId, date });
  };

  const selectedFoodItem = selectedFood 
    ? foodItems.find(item => item.id === selectedFood.foodId)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Food Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Click any cell to log your food intake
            </p>
          </div>
          <Button
            onClick={() => setShowAddFood(true)}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Food Item
          </Button>
        </div>

        {/* Food Tracker Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white min-w-[200px]">
                    Food Item
                  </th>
                  {dates.map(date => (
                    <th key={date} className="text-center p-4 font-semibold text-gray-900 dark:text-white min-w-[120px]">
                      <div className="text-sm">{formatDate(date)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(date).getDate()}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {foodItems.map((food, index) => (
                  <tr 
                    key={food.id}
                    className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${
                      index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-700/20'
                    }`}
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {food.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {food.caloriesPerUnit} cal, {food.proteinPerUnit}g protein per {food.unit}
                        </div>
                      </div>
                    </td>
                    {dates.map(date => {
                      const entry = getFoodEntry(food.id, date);
                      const amount = entry?.amount || 0;
                      
                      return (
                        <td 
                          key={date}
                          className="p-2 text-center"
                        >
                          <button
                            onClick={() => handleCellClick(food.id, date)}
                            className={`w-full h-16 rounded-lg border-2 border-dashed transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 group ${
                              amount > 0 
                                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600' 
                                : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                            }`}
                          >
                            {amount > 0 ? (
                              <div className="text-sm">
                                <div className="font-semibold text-blue-700 dark:text-blue-300">
                                  {amount} {food.unit}
                                </div>
                                <div className="text-xs text-blue-600 dark:text-blue-400">
                                  {Math.round(food.caloriesPerUnit * amount)} cal
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                                <Plus className="h-5 w-5 mx-auto" />
                              </div>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                
                {/* Daily Totals Row */}
                <tr className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 border-t-2 border-gray-200 dark:border-gray-600">
                  <td className="p-4 font-bold text-gray-900 dark:text-white">
                    Daily Totals
                  </td>
                  {dates.map(date => {
                    const totals = getDayTotals(date);
                    return (
                      <td key={date} className="p-4 text-center">
                        <div className="text-sm font-semibold">
                          <div className="text-gray-900 dark:text-white">
                            {totals.calories} cal
                          </div>
                          <div className="text-gray-600 dark:text-gray-300">
                            {totals.protein}g protein
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {foodItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No food items yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add your first food item to start tracking your nutrition
            </p>
            <Button
              onClick={() => setShowAddFood(true)}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Food Item
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedFood && selectedFoodItem && (
        <FoodEntryModal
          isOpen={!!selectedFood}
          onClose={() => setSelectedFood(null)}
          foodItem={selectedFoodItem}
          date={selectedFood.date}
        />
      )}

      <AddFoodModal
        isOpen={showAddFood}
        onClose={() => setShowAddFood(false)}
      />
    </div>
  );
}