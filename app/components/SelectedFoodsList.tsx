'use client';

import { useState } from 'react';
import type { Material, CompositeFood } from '@/lib/expanded-catalogue';
import { getMaterialById, getCompositeFoodById, categories } from '@/lib/expanded-catalogue';
import QuantityInput, { type QuantityValue } from './QuantityInput';

export type SelectedFood = {
  id: string;
  type: 'material' | 'composite';
  name: string;
  category: string;
  quantity: QuantityValue;
  massGrams: number; // calculated mass in grams
  typicalServing: number;
  part?: string; // for materials with parts (flesh, peel, etc.)
};

interface SelectedFoodsListProps {
  foods: SelectedFood[];
  onUpdateQuantity: (id: string, quantity: QuantityValue, massGrams: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function SelectedFoodsList({
  foods,
  onUpdateQuantity,
  onRemove,
  onClear,
}: SelectedFoodsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (foods.length === 0) {
    return (
      <div className="selected-foods-empty">
        <div className="empty-icon">🌱</div>
        <p className="empty-title">No foods selected yet</p>
        <p className="empty-subtitle">
          Search and select foods above to start tracking your composting impact
        </p>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    const cat = categories[category as keyof typeof categories];
    return cat?.icon || '🍽️';
  };

  const totalMass = foods.reduce((sum, food) => sum + food.massGrams, 0);

  const handleQuantityChange = (id: string, typicalServing: number) => (value: QuantityValue) => {
    let massGrams: number;
    
    if (value.unit === 'grams') {
      massGrams = value.amount;
    } else if (value.unit === 'percentage') {
      massGrams = (value.amount / 100) * typicalServing;
    } else {
      // fraction or whole
      massGrams = value.amount * typicalServing;
    }
    
    onUpdateQuantity(id, value, massGrams);
  };

  const formatQuantity = (food: SelectedFood): string => {
    const { quantity } = food;
    
    if (quantity.unit === 'whole') {
      return quantity.amount === 1 ? '1 whole' : `${quantity.amount} whole`;
    }
    
    if (quantity.unit === 'fraction' && quantity.fraction) {
      return quantity.fraction;
    }
    
    if (quantity.unit === 'percentage') {
      return `${quantity.amount}%`;
    }
    
    if (quantity.unit === 'grams') {
      return `${Math.round(quantity.amount)}g`;
    }
    
    return String(quantity.amount);
  };

  return (
    <div className="selected-foods-list">
      {/* Header */}
      <div className="list-header">
        <div>
          <h3>Your Compost Pile</h3>
          <p className="list-subtitle">
            {foods.length} item{foods.length !== 1 ? 's' : ''} · {Math.round(totalMass)}g total
          </p>
        </div>
        {foods.length > 0 && (
          <button 
            className="clear-all-button"
            onClick={onClear}
            aria-label="Clear all foods"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Food items */}
      <div className="food-items">
        {foods.map((food) => (
          <div key={food.id} className="food-item">
            <div className="food-item-header">
              <div className="food-item-main">
                <span className="food-icon">{getCategoryIcon(food.category)}</span>
                <div className="food-info">
                  <div className="food-name">
                    {food.name}
                    {food.part && food.part !== 'whole' && (
                      <span className="food-part"> ({food.part})</span>
                    )}
                  </div>
                  <div className="food-quantity">
                    {formatQuantity(food)} · {Math.round(food.massGrams)}g
                  </div>
                </div>
              </div>
              
              <div className="food-actions">
                <button
                  className="edit-button"
                  onClick={() => setEditingId(editingId === food.id ? null : food.id)}
                  aria-label={`Edit quantity for ${food.name}`}
                  aria-expanded={editingId === food.id}
                >
                  {editingId === food.id ? '✓' : '⚙'}
                </button>
                <button
                  className="remove-button"
                  onClick={() => onRemove(food.id)}
                  aria-label={`Remove ${food.name}`}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Expandable quantity editor */}
            {editingId === food.id && (
              <div className="food-item-editor">
                <QuantityInput
                  typicalServing={food.typicalServing}
                  onQuantityChange={handleQuantityChange(food.id, food.typicalServing)}
                  initialValue={food.quantity}
                />
              </div>
            )}

            {/* Composite food breakdown */}
            {food.type === 'composite' && (
              <div className="composite-breakdown">
                <details>
                  <summary>
                    <span className="breakdown-label">View ingredients</span>
                    <span className="breakdown-icon">⌄</span>
                  </summary>
                  <div className="breakdown-content">
                    {(() => {
                      const composite = getCompositeFoodById(food.id);
                      if (!composite) return null;
                      
                      return composite.components.map((comp) => {
                        const material = getMaterialById(comp.materialId);
                        if (!material) return null;
                        
                        const componentMass = (food.massGrams * comp.percentage) / 100;
                        
                        return (
                          <div key={comp.materialId} className="breakdown-item">
                            <span className="breakdown-name">{material.name}</span>
                            <span className="breakdown-amount">
                              {comp.percentage}% · {Math.round(componentMass)}g
                            </span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </details>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary footer */}
      <div className="list-footer">
        <div className="footer-stat">
          <span className="stat-label">Total food waste</span>
          <span className="stat-value">{Math.round(totalMass)}g</span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">Items tracked</span>
          <span className="stat-value">{foods.length}</span>
        </div>
      </div>
    </div>
  );
}
