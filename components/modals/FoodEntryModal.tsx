'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useAppDispatch} from '@/lib/redux/hooks';
import { selectUser } from '@/lib/redux/slices/authSlice';
import { addDateToFoodItem, selectFoodItems} from '@/lib/redux/slices/foodlogSlice';
import { useSelector } from 'react-redux';

interface FoodEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  foodItemId: string;
  date: string;
}

export default function FoodEntryModal({ isOpen, onClose, foodItemId, date }: FoodEntryModalProps) {
 
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser); 
  const uid = user?.uid;
  const [amountInput, setAmountInput] = useState('0');
  const foodItemsList = useSelector(selectFoodItems);

  const parsedAmount = parseFloat(amountInput);
  const amount = Number.isNaN(parsedAmount) ? 0 : Math.max(0, parsedAmount);

  const formatQuantity = (value: number) => {
    if (!Number.isFinite(value)) {
      return '0';
    }
    const fixed = value.toFixed(2);
    return fixed.replace(/\.0+$/, '').replace(/\.(?=0*$)/, '');
  };

  const formatNumber = (value: number) => {
    if (!Number.isFinite(value)) {
      return '0';
    }
    const fixed = value.toFixed(2);
    return fixed.replace(/\.0+$/, '').replace(/\.(?=0*$)/, '');
  };

 

  const handleSave = () => {
    if (uid) {
      dispatch(addDateToFoodItem({
        uid,
        foodItemId: foodItemId,
        date,
        amount}));
    }
    onClose();
  };

  if (!isOpen) return null;

  const unitLabel ='unit';
  const referenceQuantity =1;
  const referenceCalories = 0;
  const referenceProtein = 0;

  const totalCalories = 1;
  const totalProtein = 0;
  const formattedAmount = formatQuantity(amount);
  const referenceSummary = `${formatQuantity(referenceQuantity)} ${unitLabel}`;
  const totalReferenceQuantity = amount * referenceQuantity;

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
              {foodItemId}
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
              For {referenceSummary}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Calories:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {formatNumber(referenceCalories)}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Protein:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {formatNumber(referenceProtein)}g
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Per 1 {unitLabel}: {formatNumber(0)} cal, {formatNumber(0)}g protein.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount ({unitLabel})
            </label>
            <Input
              type="number"
              value={amountInput}
              onChange={(e) => {
                const { value } = e.target;
                if (value === '') {
                  setAmountInput('');
                  return;
                }

                const numericValue = Number(value);
                if (!Number.isNaN(numericValue) && numericValue >= 0) {
                  setAmountInput(value);
                }
              }}
              step="0.1"
              min="0"
              className="w-full"
              autoFocus
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter how many {unitLabel} you consumed.
            </p>
          </div>

          {amount > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                Total for {formattedAmount} {unitLabel}{formattedAmount !== '1' ? 's' : ''}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 dark:text-blue-400">Calories:</span>
                  <span className="ml-2 font-bold text-blue-700 dark:text-blue-300">
                    {formatNumber(totalCalories)}
                  </span>
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-400">Protein:</span>
                  <span className="ml-2 font-bold text-blue-700 dark:text-blue-300">
                    {formatNumber(totalProtein)}g
                  </span>
                </div>
              </div>
              
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-6">
          <Button
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