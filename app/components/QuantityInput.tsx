'use client';

import { useState, useEffect } from 'react';

export type QuantityValue = {
  amount: number;
  unit: 'whole' | 'fraction' | 'percentage' | 'grams';
  fraction?: string; // e.g., '1/2', '1/3', '2/3'
};

interface QuantityInputProps {
  typicalServing: number;
  onQuantityChange: (value: QuantityValue) => void;
  initialValue?: QuantityValue;
}

const commonFractions = [
  { value: '1/4', label: '1/4', decimal: 0.25 },
  { value: '1/3', label: '1/3', decimal: 0.333 },
  { value: '1/2', label: '1/2', decimal: 0.5 },
  { value: '2/3', label: '2/3', decimal: 0.667 },
  { value: '3/4', label: '3/4', decimal: 0.75 },
  { value: '1', label: '1 (whole)', decimal: 1 },
  { value: '1.5', label: '1 1/2', decimal: 1.5 },
  { value: '2', label: '2', decimal: 2 },
  { value: '3', label: '3', decimal: 3 },
];

export default function QuantityInput({
  typicalServing,
  onQuantityChange,
  initialValue,
}: QuantityInputProps) {
  const [mode, setMode] = useState<'quick' | 'custom'>('quick');
  const [selectedFraction, setSelectedFraction] = useState('1');
  const [customGrams, setCustomGrams] = useState(String(typicalServing));
  const [customPercentage, setCustomPercentage] = useState('100');
  const [customUnit, setCustomUnit] = useState<'grams' | 'percentage'>('grams');

  // Initialize with initial value if provided
  useEffect(() => {
    if (initialValue) {
      if (initialValue.unit === 'fraction' || initialValue.unit === 'whole') {
        setMode('quick');
        setSelectedFraction(initialValue.fraction || String(initialValue.amount));
      } else {
        setMode('custom');
        setCustomUnit(initialValue.unit === 'grams' ? 'grams' : 'percentage');
        if (initialValue.unit === 'grams') {
          setCustomGrams(String(initialValue.amount));
        } else if (initialValue.unit === 'percentage') {
          setCustomPercentage(String(initialValue.amount));
        }
      }
    }
  }, [initialValue]);

  // Emit changes
  useEffect(() => {
    if (mode === 'quick') {
      const fraction = commonFractions.find(f => f.value === selectedFraction);
      if (fraction) {
        onQuantityChange({
          amount: fraction.decimal,
          unit: fraction.decimal === 1 ? 'whole' : 'fraction',
          fraction: fraction.value,
        });
      }
    } else {
      if (customUnit === 'grams') {
        const grams = parseFloat(customGrams);
        if (!isNaN(grams) && grams > 0) {
          onQuantityChange({
            amount: grams,
            unit: 'grams',
          });
        }
      } else {
        const percentage = parseFloat(customPercentage);
        if (!isNaN(percentage) && percentage > 0) {
          onQuantityChange({
            amount: percentage,
            unit: 'percentage',
          });
        }
      }
    }
  }, [mode, selectedFraction, customGrams, customPercentage, customUnit, onQuantityChange]);

  const handleQuickSelect = (value: string) => {
    setSelectedFraction(value);
  };

  const calculateGrams = () => {
    if (mode === 'quick') {
      const fraction = commonFractions.find(f => f.value === selectedFraction);
      return fraction ? Math.round(fraction.decimal * typicalServing) : typicalServing;
    }
    
    if (customUnit === 'grams') {
      return parseFloat(customGrams) || 0;
    }
    
    const percentage = parseFloat(customPercentage) || 0;
    return Math.round((percentage / 100) * typicalServing);
  };

  return (
    <div className="quantity-input">
      {/* Mode toggle */}
      <div className="quantity-mode-toggle">
        <button
          className={`mode-button ${mode === 'quick' ? 'active' : ''}`}
          onClick={() => setMode('quick')}
        >
          Quick Select
        </button>
        <button
          className={`mode-button ${mode === 'custom' ? 'active' : ''}`}
          onClick={() => setMode('custom')}
        >
          Custom Amount
        </button>
      </div>

      {/* Quick select mode */}
      {mode === 'quick' && (
        <div className="quick-select">
          <label className="quantity-label">How much are you composting?</label>
          <div className="fraction-grid">
            {commonFractions.map(({ value, label }) => (
              <button
                key={value}
                className={`fraction-button ${selectedFraction === value ? 'selected' : ''}`}
                onClick={() => handleQuickSelect(value)}
                aria-label={`${label} of typical serving`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="quantity-preview">
            <span className="preview-icon">≈</span>
            <span className="preview-value">{calculateGrams()}g</span>
            <span className="preview-text">of food waste</span>
          </div>
        </div>
      )}

      {/* Custom input mode */}
      {mode === 'custom' && (
        <div className="custom-input">
          <label className="quantity-label">Enter amount:</label>
          
          {/* Unit selector */}
          <div className="unit-selector">
            <button
              className={`unit-button ${customUnit === 'grams' ? 'active' : ''}`}
              onClick={() => setCustomUnit('grams')}
            >
              Grams (g)
            </button>
            <button
              className={`unit-button ${customUnit === 'percentage' ? 'active' : ''}`}
              onClick={() => setCustomUnit('percentage')}
            >
              Percentage (%)
            </button>
          </div>

          {/* Input field */}
          <div className="custom-input-field">
            {customUnit === 'grams' ? (
              <input
                type="number"
                min="1"
                max="10000"
                step="1"
                value={customGrams}
                onChange={(e) => setCustomGrams(e.target.value)}
                placeholder="Enter grams"
                aria-label="Amount in grams"
              />
            ) : (
              <input
                type="number"
                min="1"
                max="1000"
                step="1"
                value={customPercentage}
                onChange={(e) => setCustomPercentage(e.target.value)}
                placeholder="Enter percentage"
                aria-label="Percentage of typical serving"
              />
            )}
            <span className="input-unit">
              {customUnit === 'grams' ? 'g' : '%'}
            </span>
          </div>

          <div className="quantity-preview">
            {customUnit === 'percentage' && (
              <>
                <span className="preview-icon">≈</span>
                <span className="preview-value">{calculateGrams()}g</span>
                <span className="preview-text">
                  ({customPercentage}% of {typicalServing}g typical serving)
                </span>
              </>
            )}
            {customUnit === 'grams' && (
              <span className="preview-text">
                Typical serving: {typicalServing}g
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
