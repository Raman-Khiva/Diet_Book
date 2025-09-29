'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Target, Calendar, Award, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/lib/context/AppContext';
import SettingsModal from '@/components/modals/SettingsModal';

export default function ActivityPage() {
  const { getWeeklyStats, userSettings } = useAppContext();
  const [viewMode, setViewMode] = useState<'calories' | 'protein'>('calories');
  const [showSettings, setShowSettings] = useState(false);
  
  const weeklyStats = getWeeklyStats();
  
  // Calculate average daily intake
  const totalDays = weeklyStats.filter(day => day.calories > 0 || day.protein > 0).length;
  const avgCalories = totalDays > 0 ? Math.round(weeklyStats.reduce((sum, day) => sum + day.calories, 0) / weeklyStats.length) : 0;
  const avgProtein = totalDays > 0 ? Math.round((weeklyStats.reduce((sum, day) => sum + day.protein, 0) / weeklyStats.length) * 10) / 10 : 0;
  
  // Calculate goal achievement percentage
  const daysMetCalorieGoal = weeklyStats.filter(day => day.calories >= userSettings.minCalories).length;
  const daysMetProteinGoal = weeklyStats.filter(day => day.protein >= userSettings.minProtein).length;
  const calorieGoalPercentage = Math.round((daysMetCalorieGoal / 7) * 100);
  const proteinGoalPercentage = Math.round((daysMetProteinGoal / 7) * 100);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const barData = weeklyStats.map(day => ({
    ...day,
    displayDate: formatDate(day.date),
    minValue: viewMode === 'calories' ? userSettings.minCalories : userSettings.minProtein
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
                <span className="font-semibold text-blue-600 dark:text-blue-400">{userSettings.minCalories}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400">Daily Protein Target</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{userSettings.minProtein}g</span>
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
      </div>

      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}