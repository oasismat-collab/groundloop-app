'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FoodSearch from '../components/FoodSearch';
import QuantityInput, { type QuantityValue } from '../components/QuantityInput';
import SelectedFoodsList, { type SelectedFood } from '../components/SelectedFoodsList';
import NutrientResults from '../components/NutrientResults';
import AvoidedImpacts from '../components/AvoidedImpacts';
import CumulativeTracker from '../components/CumulativeTracker';
import { getMaterialById, getCompositeFoodById, type Material, type CompositeFood } from '@/lib/expanded-catalogue';
import { calculateCompostImpact, type NutrientResults as NutrientResultsType } from '@/lib/nutrient-calculator';
import { saveCompostSession } from '@/lib/storage';
import '../components/components.css';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

function Sprout({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M24 43V23M24 29C8 30 5 17 7 7c13 0 22 7 17 22ZM24 22C23 8 34 4 43 5c0 12-6 20-19 17Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CompostTracker() {
  const router = useRouter();
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [pendingSelection, setPendingSelection] = useState<{
    type: 'material' | 'composite';
    item: Material | CompositeFood;
    category: string;
  } | null>(null);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [calculatedResults, setCalculatedResults] = useState<NutrientResultsType | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [trackerKey, setTrackerKey] = useState(0); // Force re-render of tracker

  const handleFoodSelect = (result: { type: 'material' | 'composite'; item: Material | CompositeFood; category: string }) => {
    setPendingSelection(result);
    setShowQuantityModal(true);
  };

  const handleQuantityConfirm = (quantity: QuantityValue) => {
    if (!pendingSelection) return;

    const { type, item, category } = pendingSelection;
    const typicalServing = 'typicalServing' in item ? item.typicalServing : 100;
    
    // Calculate mass in grams
    let massGrams: number;
    if (quantity.unit === 'grams') {
      massGrams = quantity.amount;
    } else if (quantity.unit === 'percentage') {
      massGrams = (quantity.amount / 100) * typicalServing;
    } else {
      massGrams = quantity.amount * typicalServing;
    }

    const newFood: SelectedFood = {
      id: `${item.id}-${Date.now()}`, // Unique ID for multiple same items
      type,
      name: item.name,
      category,
      quantity,
      massGrams,
      typicalServing,
      part: type === 'material' && 'part' in item ? item.part : undefined,
    };

    setSelectedFoods([...selectedFoods, newFood]);
    setPendingSelection(null);
    setShowQuantityModal(false);
  };

  const handleUpdateQuantity = (id: string, quantity: QuantityValue, massGrams: number) => {
    setSelectedFoods(foods =>
      foods.map(food =>
        food.id === id
          ? { ...food, quantity, massGrams }
          : food
      )
    );
  };

  const handleRemove = (id: string) => {
    setSelectedFoods(foods => foods.filter(f => f.id !== id));
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all foods?')) {
      setSelectedFoods([]);
    }
  };

  const totalMass = selectedFoods.reduce((sum, food) => sum + food.massGrams, 0);

  const handleCalculate = () => {
    if (selectedFoods.length === 0) {
      alert('Please add some foods to your compost pile first!');
      return;
    }

    // Prepare data for calculator
    const foodsForCalculation = selectedFoods.map(food => ({
      id: food.id,
      type: food.type,
      massGrams: food.massGrams,
    }));

    // Calculate results
    const results = calculateCompostImpact(foodsForCalculation);
    setCalculatedResults(results);
    setShowResults(true);

    // Scroll to results
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleSaveSession = () => {
    if (!calculatedResults) return;

    // Extract food names from selected foods
    const foodNames = selectedFoods.map(food => food.name);

    // Save to localStorage
    saveCompostSession(calculatedResults, foodNames);

    // Clear the form
    setSelectedFoods([]);
    setCalculatedResults(null);
    setShowResults(false);

    // Refresh the cumulative tracker
    setTrackerKey(prev => prev + 1);

    // Show success message
    alert('✅ Session saved! Check your cumulative impact below.');

    // Scroll to tracker
    setTimeout(() => {
      document.getElementById('cumulative-tracker-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  return (
    <>
      <header className="site-header">
        <a className="brand" href={`${BASE}/`}>
          <Sprout />
          groundwork<span className="brand-dot">.</span>
        </a>
        <a className="header-link" href={`${BASE}/#soil-story`}>
          Track your composting impact <span>↗</span>
        </a>
      </header>

      <main style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        <section className="hero" style={{ padding: '40px 20px', gridTemplateColumns: '1fr' }}>
          <div>
            <div className="eyebrow">
              <span /> COMPOST IMPACT TRACKER
            </div>
            <h1 style={{ fontSize: '56px', maxWidth: '600px' }}>
              Track your impact.
              <br />
              <em>Build better soil.</em>
            </h1>
            <p className="hero-copy" style={{ maxWidth: '520px' }}>
              Select the foods you're composting and see exactly how many nutrients you're returning to the soil.
              Track your cumulative impact over time.
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="input-panel" style={{ marginBottom: '32px' }}>
          <div className="step-label">
            01 <span>SEARCH FOR FOODS</span>
          </div>
          <h2 style={{ marginBottom: '12px' }}>What are you composting today?</h2>
          <p style={{ marginBottom: '20px' }}>
            Search from over 30 common foods and composite meals. Select quantities for each item.
          </p>

          <FoodSearch onSelect={handleFoodSelect} autoFocus />
        </section>

        {/* Selected Foods Section */}
        <section className="input-panel">
          <div className="step-label">
            02 <span>YOUR COMPOST PILE</span>
          </div>
          <h2 style={{ marginBottom: '12px' }}>Items you're composting</h2>
          <p style={{ marginBottom: '20px' }}>
            {selectedFoods.length === 0
              ? 'Select foods above to start building your compost pile.'
              : `You've added ${selectedFoods.length} item${selectedFoods.length !== 1 ? 's' : ''} totaling ${Math.round(totalMass)}g of food waste.`}
          </p>

          <SelectedFoodsList
            foods={selectedFoods}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
            onClear={handleClear}
          />

          {selectedFoods.length > 0 && (
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button
                className="primary"
                onClick={handleCalculate}
                style={{ display: 'inline-block' }}
              >
                Calculate nutrient impact <span aria-hidden="true">↗</span>
              </button>
            </div>
          )}
        </section>

        {/* Results Section */}
        {showResults && calculatedResults && (
          <section id="results-section" className="input-panel" style={{ marginTop: '32px' }}>
            <NutrientResults results={calculatedResults} showRetentionFactors={true} />
            <AvoidedImpacts results={calculatedResults} />
            
            {/* Save Session Button */}
            <div style={{ marginTop: '32px', textAlign: 'center', padding: '24px', background: 'linear-gradient(135deg, #f5f9fc 0%, #fafcfd 100%)', borderRadius: '12px', border: '1px solid #d4e3f0' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '20px' }}>Ready to track your impact?</h3>
              <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#6a745e' }}>
                Save this session to see your cumulative nutrients and water savings build up over time.
              </p>
              <button
                className="primary"
                onClick={handleSaveSession}
                style={{ display: 'inline-block' }}
              >
                Save to my tracker <span aria-hidden="true">↓</span>
              </button>
            </div>
          </section>
        )}

        {/* Cumulative Tracker Section */}
        <section id="cumulative-tracker-section" style={{ marginTop: '48px' }}>
          <CumulativeTracker key={trackerKey} />
        </section>
        

        {/* Quantity Modal */}
        {showQuantityModal && pendingSelection && (
          <div
            className="modal-overlay"
            onClick={() => {
              setShowQuantityModal(false);
              setPendingSelection(null);
            }}
          >
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>How much {pendingSelection.item.name}?</h3>
                <button
                  className="modal-close"
                  onClick={() => {
                    setShowQuantityModal(false);
                    setPendingSelection(null);
                  }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <QuantityInput
                typicalServing={'typicalServing' in pendingSelection.item ? pendingSelection.item.typicalServing : 100}
                onQuantityChange={handleQuantityConfirm}
              />
            </div>
          </div>
        )}

        {/* Info Section */}
        <aside className="reality" style={{ marginTop: '48px' }}>
          <Sprout />
          <p>
            <strong>How it works:</strong> Search and select foods you're composting, specify quantities,
            and we'll calculate the nutrients returned to soil based on composting retention rates from EPA research.
            Data comes from USDA FoodData Central (public domain).
          </p>
        </aside>
      </main>

      <footer>
        <a className="brand" href={`${BASE}/`}>
          <Sprout />
          groundwork.
        </a>
        <p>Food is best eaten. Composting gives unavoidable scraps another purpose.</p>
        <span>Small steps. Honest science.</span>
      </footer>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(38, 59, 45, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 480px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 12px 48px rgba(38, 59, 45, 0.25);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 24px 16px;
          border-bottom: 1px solid #eef1e8;
        }

        .modal-header h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        .modal-close {
          background: #f0f2e8;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #6a745e;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: #e0e3d8;
          color: var(--ink);
        }

        .modal-content :global(.quantity-input) {
          margin: 24px;
          border: none;
          padding: 0;
        }
      `}</style>
    </>
  );
}
