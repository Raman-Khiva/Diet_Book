'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAppDispatch } from '@/lib/redux/hooks';
import { selectUser } from '@/lib/redux/slices/authSlice';
import { addFoodItem as addFoodItemThunk } from '@/lib/redux/slices/foodlogSlice';
import { useSelector } from 'react-redux';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFoodModal({ isOpen, onClose }: AddFoodModalProps) {

  const user = useSelector(selectUser);
  const uid = user?.uid;
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: '',
    referenceQuantity: '',
    referenceUnit: '',
    referenceCalories: '',
    referenceProtein: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !formData.name ||
      !formData.referenceQuantity ||
      !formData.referenceUnit ||
      !formData.referenceCalories ||
      !formData.referenceProtein
    ) {
      return;
    }

    const parsedReferenceQuantity = parseFloat(formData.referenceQuantity);
    const parsedReferenceCalories = parseFloat(formData.referenceCalories);
    const parsedReferenceProtein = parseFloat(formData.referenceProtein);

    if (
      Number.isNaN(parsedReferenceQuantity) ||
      Number.isNaN(parsedReferenceCalories) ||
      Number.isNaN(parsedReferenceProtein) ||
      parsedReferenceQuantity <= 0 ||
      parsedReferenceCalories < 0 ||
      parsedReferenceProtein < 0
    ) {
      return;
    }

    const caloriesPerUnit = parsedReferenceCalories / parsedReferenceQuantity;
    const proteinPerUnit = parsedReferenceProtein / parsedReferenceQuantity;
    
    if (uid) {
      dispatch(addFoodItemThunk({ uid, itemName: formData.name, unit: formData.referenceUnit, refAmt: parsedReferenceQuantity, calories: parsedReferenceCalories, protein: parsedReferenceProtein }));
    }
    

    setFormData({
      name: '',
      referenceQuantity: '',
      referenceUnit: '',
      referenceCalories: '',
      referenceProtein: ''
    });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Plus className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Add Food Item
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Food Name
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Chicken Breast"
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="referenceQuantity" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Reference amount
              </Label>
              <Input
                id="referenceQuantity"
                type="number"
                value={formData.referenceQuantity}
                onChange={(e) => handleInputChange('referenceQuantity', e.target.value)}
                placeholder="e.g., 100"
                className="mt-1"
                min="0"
                step="0.1"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter the amount you know nutrition for (1 g, 100 g, 1 piece, etc.).
              </p>
            </div>
            <div>
              <Label htmlFor="referenceUnit" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Unit label
              </Label>
              <Input
                id="referenceUnit"
                type="text"
                value={formData.referenceUnit}
                onChange={(e) => handleInputChange('referenceUnit', e.target.value)}
                placeholder="e.g., g, ml, piece"
                className="mt-1"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Base measurement name. 1 unit will equal 1 of these.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="referenceCalories" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Calories in amount
              </Label>
              <Input
                id="referenceCalories"
                type="number"
                value={formData.referenceCalories}
                onChange={(e) => handleInputChange('referenceCalories', e.target.value)}
                placeholder="e.g., 165"
                className="mt-1"
                min="0"
                step="0.1"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Calories contained in the reference amount above.
              </p>
            </div>
            <div>
              <Label htmlFor="referenceProtein" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Protein in amount (g)
              </Label>
              <Input
                id="referenceProtein"
                type="number"
                value={formData.referenceProtein}
                onChange={(e) => handleInputChange('referenceProtein', e.target.value)}
                placeholder="e.g., 31"
                className="mt-1"
                min="0"
                step="0.1"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Protein in grams for the same reference amount.
              </p>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              Add Food Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}