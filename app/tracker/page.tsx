'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

import FoodEntryModal from '@/components/modals/FoodEntryModal';
import AddFoodModal from '@/components/modals/AddFoodModal';
import { useSelector } from 'react-redux';
import { selectAuthLoading, selectIsAuthed,selectUser } from '@/lib/redux/slices/authSlice';
import {useRouter } from 'next/navigation';
import { fetchFoodItemsByUser, selectDateEntries, selectFoodItems, selectFoodLogLoading } from '@/lib/redux/slices/foodlogSlice';
import { useAppDispatch } from '@/lib/redux/hooks';

export default function TrackerPage() {
  
  const [selectedFood, setSelectedFood] = useState<{ foodItemId: string; date: string } | null>(null);
  const [showAddFood, setShowAddFood] = useState(false);
  const authLoading = useSelector(selectAuthLoading);
  const foodLogLoading = useSelector(selectFoodLogLoading);
  const user = useSelector(selectUser);
  const isAuthed = useSelector(selectIsAuthed);
  let foodItemsList = useSelector(selectFoodItems);
  const dateEntries = useSelector(selectDateEntries) || [];
  const router = useRouter();
  const dispatch = useAppDispatch();

  foodItemsList = foodItemsList || [];




  useEffect(() => {
    console.log('[TrackerPage] Auth state changed', {
      isAuthed,
      authLoading,
      userUid: user?.uid ?? null,
    });
  }, [authLoading, foodLogLoading, isAuthed, user?.uid]);

  useEffect(() => {
    if (!isAuthed && !authLoading) {
      console.log('[TrackerPage] User not authenticated, redirecting to /auth');
      router.replace('/auth');
    }
  }, [authLoading, isAuthed, router]);

  useEffect(() => {
    const uid = user?.uid;
    if (!isAuthed || !uid) {
      console.log('[TrackerPage] Skipping food item fetch', { isAuthed, uid: uid ?? null });
      return;
    }
    dispatch(fetchFoodItemsByUser({uid : uid}));
  }, [isAuthed, user?.uid, dispatch]);


  const formatQuantity = (value: number | null) => {
    if (!Number.isFinite(value)) {
      return '0';
    }
    const fixed = value?.toFixed(2);
    return fixed?.replace(/\.0+$/, '').replace(/\.(?=0*$)/, '');
  };

  // Generate last 7 days
  const today = new Date();
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  const formatDate = (dateStr: string): string => {
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

  const handleCellClick = (foodItemId: string, date: string): void => {
    console.log('[TrackerPage] Cell clicked', { foodItemId, date });
    setSelectedFood({ foodItemId, date });
  };

  const handleOpenAddFood = () => {
    console.log('[TrackerPage] Opening add food modal');
    setShowAddFood(true);
  };

  const handleCloseAddFood = () => {
    console.log('[TrackerPage] Closing add food modal');
    setShowAddFood(false);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start 
            md:items-center mb-8 mt-6">

          <div>
            <h1 className="text-xl md:text-4xl leading-tight font-bold text-gray-900 dark:text-white mb-1">
              Food Tracker
            </h1>
            <p className="text-gray-600 max-md:text-sm dark:text-gray-300">
              Click any cell to log your food intake
            </p>
          </div>
          <Button
            onClick={handleOpenAddFood}
            className="bg-gradient-to-r p-2 max-md:text-xs from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 mt-4 md:mt-0"
          >
            <Plus className="h-3 w-3 mr-2" />
            Add Food Item
          </Button>
        </div>

        {/* Food Tracker Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b max-md:text-xs border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white min-w-[130px] overflow-x-auto">
                    Food Item
                  </th>
                  {dates.map(date => (
                    <th key={date} className="text-center p-4 font-semibold text-gray-900 dark:text-white min-w-[100px] overflow-x-auto">
                      <div className="">{formatDate(date)}</div>
                      
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                             
                {isAuthed && foodItemsList.map((foodItem, index) => (
                  <tr 
                    key={foodItem.id}
                    className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${
                      index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-700/20'
                    }`}
                  >
                    <td className="p-3">
                      <div>
                        <div className="font-[500] max-md:text-xs text-gray-900 mb-1 dark:text-white">
                          {foodItem.name}
                        </div>
                        <div className="text-md max-md:text-[10px] max-md:leading-tight text-gray-500 dark:text-gray-400">
                          {formatQuantity(foodItem.calories)} cal, {formatQuantity(foodItem.protein)}g protein <br/>per {formatQuantity(foodItem.refAmt ?? 1)} {foodItem.unit}
                        </div>
                    </div>
                    </td>
                    {dates.map(date => {
                      const entry = dateEntries.find(entry => entry.date === date && entry.foodItemId === foodItem.id);
                      const amount = entry?.amount || 0;
                      
                      return (
                        <td 
                          key={date}
                          className="p-1 text-center"
                        >
                          <button
                            onClick={() => handleCellClick(foodItem.id, date)}
                            className={`w-full h-16 rounded-lg border-2 border-dashed transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 group ${
                              amount > 0 
                                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600' 
                                : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                            }`}
                          >
                            {amount > 0 ? (
                              <div className="text-md max-md:text-xs space-y-1">
                                <div className="font-semibold text-blue-700 dark:text-blue-300">
                                  {formatQuantity(amount)}{foodItem.unit}
                                </div>
                                <div className="text-md max-md:text-[10px] font-[500] text-blue-600 dark:text-blue-400">
                                  {Math.round((foodItem.calPerUnit * amount))} cal · {formatQuantity(amount * foodItem.proteinPerUnit)} g
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                                <Plus className="h-3 w-3 mx-auto" />
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
                  <td className="p-4 font-bold max-md:text-xs   text-gray-900 dark:text-white">
                    Daily Totals
                  </td>
                  {dates.map(date => {
                    
                    const totals = dateEntries.filter(entry => entry.date === date).reduce((acc, entry) => {
                      const foodItem = foodItemsList.find(item => item.id === entry.foodItemId);
                      acc.calories += entry.amount * (foodItem?.calPerUnit ?? 0);
                      acc.protein += entry.amount * (foodItem?.proteinPerUnit ?? 0);
                      return acc;
                    }, { calories: 0, protein: 0 });

                    
                    return (
                      <td key={date} className=" pl-3 pr-1 py-5 max-md:text-xs text-center">
                        <div className="font-semibold">
                          <div className="text-gray-900 dark:text-white">
                            {totals.calories} cal
                          </div>
                          <div className="text-gray-900 dark:text-gray-300">
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
        {foodItemsList.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No food items yet
            </h3>
            <p className="text-gray-700 dark:text-gray-400 mb-4">
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
      {selectedFood && (
        <FoodEntryModal
          isOpen={!!selectedFood}
          onClose={() => {
            console.log('[TrackerPage] Closing food entry modal');
            setSelectedFood(null);
          }}
          foodItemId={selectedFood.foodItemId}
          date={selectedFood.date}
        />
        )}
      <AddFoodModal
      
        isOpen={showAddFood}
        onClose={handleCloseAddFood}
      />
    </div>
  );
}