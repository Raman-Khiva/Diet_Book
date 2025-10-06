'use client';

import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { TrendingUp, Target, Calendar, Award, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';


import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '@/lib/redux/slices/authSlice';



type FoodItemRow = {
  id: string;
  name: string;
  calories: number | null;
  protein: number | null;
  updatedAt: Date | null;
};

function formatNumber(value?: number | null): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '-';
  }

  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1);
}

function formatUpdatedAt(date?: Date | null): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export default function ActivityPage() {
  
  const weeklyStats = [
    { date: '2025-09-25', calories: 2500, protein: 150 },
    { date: '2025-09-26', calories: 2600, protein: 160 },
    { date: '2025-09-27', calories: 2700, protein: 170 },
    { date: '2025-09-28', calories: 2800, protein: 180 },
    { date: '2025-09-29', calories: 2900, protein: 190 },
    { date: '2025-09-30', calories: 3000, protein: 200 },
    { date: '2025-10-01', calories: 3100, protein: 210 },
  ];
  const [viewMode, setViewMode] = useState<'calories' | 'protein'>('calories');
  const [showSettings, setShowSettings] = useState(false);
  const user = useSelector(selectUser);
  const [foodItems, setFoodItems] = useState<FoodItemRow[]>([]);
  const [foodItemsLoading, setFoodItemsLoading] = useState(false);
  const [foodItemsError, setFoodItemsError] = useState<string | null>(null);
  const formattedFoodItems = useMemo(() => foodItems.map(item => ({
    ...item,
    caloriesDisplay: formatNumber(item.calories),
    proteinDisplay: formatNumber(item.protein),
    lastUpdatedDisplay: formatUpdatedAt(item.updatedAt)
  })), [foodItems]);
  

  
  // Calculate average daily intake
  const totalDays = weeklyStats.filter(day => day.calories > 0 || day.protein > 0).length;
  const avgCalories = totalDays > 0 ? Math.round(weeklyStats.reduce((sum, day) => sum + day.calories, 0) / weeklyStats.length) : 0;
  const avgProtein = totalDays > 0 ? Math.round((weeklyStats.reduce((sum, day) => sum + day.protein, 0) / weeklyStats.length) * 10) / 10 : 0;
  
  // Calculate goal achievement percentage
  const daysMetCalorieGoal = 4;
  const daysMetProteinGoal = 5;
  const calorieGoalPercentage = Math.round((daysMetCalorieGoal / 7) * 100);
  const proteinGoalPercentage = Math.round((daysMetProteinGoal / 7) * 100);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };


  const barData = weeklyStats.map(day => ({
    ...day,
    displayDate: formatDate(day.date),
    minValue: viewMode === 'calories' ? 30 : 20
  }));

  const renderDateTick = ({ x, y, payload }: { x: number; y: number; payload: { value: string } }) => {
    const [month, day] = payload.value.split(' ');

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={8}
          textAnchor="middle"
          fill="#6B7280"
          fontSize={11}
        >
          {month}
        </text>
        <text
          x={0}
          y={0}
          dy={22}
          textAnchor="middle"
          fill="#9CA3AF"
          fontSize={11}
          fontWeight={600}
        >
          {day}
        </text>
      </g>
    );
  };

  useEffect(() => {
    const uid = user?.uid;
    if (!uid) {
      setFoodItems([]);
      setFoodItemsLoading(false);
      return;
    }

    const fetchFoodItems = async () => {
      setFoodItemsLoading(true);
      setFoodItemsError(null);

      try {
        const snapshot = await getDocs(collection(db, 'users', uid, 'foodItems'));
        const items: FoodItemRow[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const updatedAt = data.updatedAt?.toDate?.() ?? null;
          const calories = typeof data.calories === 'number' ? data.calories : Number(data.calories ?? 0);
          const protein = typeof data.protein === 'number' ? data.protein : Number(data.protein ?? 0);

          return {
            
            id: docSnap.id,
            name: data.name ?? 'Untitled item',
            calories: Number.isFinite(calories) ? calories : null,
            protein: Number.isFinite(protein) ? protein : null,
            updatedAt,
          } satisfies FoodItemRow;
        });

        items.sort((a, b) => {
          const timeA = a.updatedAt?.getTime() ?? 0;
          const timeB = b.updatedAt?.getTime() ?? 0;
          return timeB - timeA;
        });

        setFoodItems(items);
      } catch (error) {
        console.error('[ActivityPage] Failed to load food items:', error);
        setFoodItemsError('Failed to load food items. Please try again later.');
      } finally {
        setFoodItemsLoading(false);
      }
    };

    fetchFoodItems();
  }, [user?.uid]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mt-8 mb-8">
          <div>
            <h1 className="text-xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Activity Dashboard
            </h1>
            <p className="text-gray-600 max-md:text-sm dark:text-gray-300">
              Track your nutrition progress and insights
            </p>
          </div>
          <Button
            onClick={() => setShowSettings(true)}
            variant="outline"
            className="flex items-center max-md:text-xs px-3 py-1 space-x-1"
          >
            <Settings className="h-4 w-4" />
            <span>Goals</span>
          </Button>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 shadow-lg  border border-gray-200 dark:border-gray-700">
            <div className="flex items-start flex-col  gap-2">
              <div className='flex items-center space-x-2'>
                <div className="w-[30px] h-[30px] bg-blue-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <p className="text-[26px] font-bold text-gray-900 dark:text-white">{avgCalories}</p>
              </div> 
               <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Daily Calories</p>
              
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center space-x-2">
                <div className="w-[30px] h-[30px] bg-green-500 rounded-lg flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <p className="text-[26px] font-bold text-gray-900 dark:text-white">{avgProtein}g</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Daily Protein</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center space-x-2">
                <div className="w-[30px] h-[30px] bg-orange-500 rounded-lg flex items-center justify-center">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <p className="text-[26px] font-bold text-gray-900 dark:text-white">{calorieGoalPercentage}%</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Calorie Goal Achievement</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center space-x-2">
                <div className="w-[30px] h-[30px] bg-purple-500 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <p className="text-[26px] font-bold text-gray-900 dark:text-white">{proteinGoalPercentage}%</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Protein Goal Achievement</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-6 md:p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
              Weekly {viewMode === 'calories' ? 'Calorie' : 'Protein'} Intake
            </h2>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'calories' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calories')}
                className={viewMode === 'calories' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              >
                Calories
              </Button>
              <Button
                variant={viewMode === 'protein' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('protein')}
                className={viewMode === 'protein' ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                Protein
              </Button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer className="" width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 8, right: 16, left: 0, bottom: 32 }}
                barCategoryGap="10%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis 
                  dataKey="displayDate" 
                  stroke="#6B7280"
                  fontSize={12}
                  height={40}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={renderDateTick}
                />
                <YAxis 
                  
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)'
                  }}
                  formatter={(value, name) => [
                    `${value}${viewMode === 'protein' ? 'g' : ''}`,
                    viewMode === 'calories' ? 'Calories' : 'Protein'
                  ]}
                />
                <Bar 
                  dataKey={viewMode}
                  fill={viewMode === 'calories' ? '#3B82F6' : '#10B981'}
                  radius={[4, 4, 0, 0]}
                  barSize={26}
                  maxBarSize={32}
                />
                <Line
                  type="monotone"
                  dataKey="minValue"
                  stroke={viewMode === 'calories' ? '#EF4444' : '#F59E0B'}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded ${viewMode === 'calories' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                <span>Daily Intake</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-1 ${viewMode === 'calories' ? 'bg-red-500' : 'bg-yellow-500'}`} style={{borderStyle: 'dashed'}}></div>
                <span>Minimum Goal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Insights */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Weekly Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Active Days</span>
                <span className="font-semibold text-gray-900 dark:text-white">{totalDays}/7</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Days Met Calorie Goal</span>
                <span className="font-semibold text-gray-900 dark:text-white">{daysMetCalorieGoal}/7</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400">Days Met Protein Goal</span>
                <span className="font-semibold text-gray-900 dark:text-white">{daysMetProteinGoal}/7</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Current Goals
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Daily Calorie Target</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{30}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400">Daily Protein Target</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{20}g</span>
              </div>
            </div>
            <Button
              onClick={() => setShowSettings(true)}
              variant="outline"
              size="sm"
              className="w-full mt-4"
            >
              Update Goals
            </Button>
          </div>
        </div>

        {/* Food Items Table */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Food Items</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Entries synced from your Firestore account</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-4 md:px-6 py-3">Food Item</th>
                  <th className="px-4 md:px-6 py-3">Calories</th>
                  <th className="px-4 md:px-6 py-3">Protein</th>
                  <th className="px-4 md:px-6 py-3">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {foodItemsLoading ? (
                  <tr>
                    <td colSpan={4} className="px-4 md:px-6 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                      Loading food items…
                    </td>
                  </tr>
                ) : foodItemsError ? (
                  <tr>
                    <td colSpan={4} className="px-4 md:px-6 py-6 text-center text-sm text-red-600 dark:text-red-400">
                      {foodItemsError}
                    </td>
                  </tr>
                ) : formattedFoodItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 md:px-6 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                      No food items found for your account yet.
                    </td>
                  </tr>
                ) : (
                  formattedFoodItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 md:px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{item.caloriesDisplay !== '-' ? `${item.caloriesDisplay}` : '—'}</td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{item.proteinDisplay !== '-' ? `${item.proteinDisplay}` : '—'}</td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.lastUpdatedDisplay}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      
    </div>
  );
}


