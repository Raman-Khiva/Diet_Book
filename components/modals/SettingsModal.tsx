'use client';

import { useState, useEffect } from 'react';
import { X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/lib/context/AppContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { userSettings, updateUserSettings } = useAppContext();
  const [minCalories, setMinCalories] = useState(userSettings.minCalories);
  const [minProtein, setMinProtein] = useState(userSettings.minProtein);

  useEffect(() => {
    setMinCalories(userSettings.minCalories);
    setMinProtein(userSettings.minProtein);
  }, [userSettings]);

  const handleSave = () => {
    updateUserSettings({
      minCalories: Math.max(0, minCalories),
      minProtein: Math.max(0, minProtein)
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Daily Goals
            </h2>
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
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Minimum Daily Calories
            </Label>
            <Input
              type="number"
              value={minCalories}
              onChange={(e) => setMinCalories(Math.max(0, parseInt(e.target.value) || 0))}
              min="0"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Your daily calorie goal
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Minimum Daily Protein (g)
            </Label>
            <Input
              type="number"
              value={minProtein}
              onChange={(e) => setMinProtein(Math.max(0, parseFloat(e.target.value) || 0))}
              min="0"
              step="0.1"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Your daily protein goal in grams
            </p>
          </div>
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
            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}