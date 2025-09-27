'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/lib/context/AppContext';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFoodModal({ isOpen, onClose }: AddFoodModalProps) {
  const { addFoodItem } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    caloriesPerUnit: '',
    proteinPerUnit: '',
    unit: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.caloriesPerUnit || !formData.proteinPerUnit || !formData.unit) {
      return;
    }

    addFoodItem({
      name: formData.name,
      caloriesPerUnit: parseFloat(formData.caloriesPerUnit),
      proteinPerUnit: parseFloat(formData.proteinPerUnit),
      unit: formData.unit
    });

    setFormData({ name: '', caloriesPerUnit: '', proteinPerUnit: '', unit: '' });
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

          <div>
            <Label htmlFor="unit" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Unit
            </Label>
            <Input
              id="unit"
              type="text"
              value={formData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              placeholder="e.g., 100g, 1 cup, 1 piece"
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="calories" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Calories per unit
              </Label>
              <Input
                id="calories"
                type="number"
                value={formData.caloriesPerUnit}
                onChange={(e) => handleInputChange('caloriesPerUnit', e.target.value)}
                placeholder="165"
                className="mt-1"
                min="0"
                step="0.1"
                required
              />
            </div>
            <div>
              <Label htmlFor="protein" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Protein per unit (g)
              </Label>
              <Input
                id="protein"
                type="number"
                value={formData.proteinPerUnit}
                onChange={(e) => handleInputChange('proteinPerUnit', e.target.value)}
                placeholder="31"
                className="mt-1"
                min="0"
                step="0.1"
                required
              />
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