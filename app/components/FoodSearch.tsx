'use client';

import { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import { 
  materials, 
  compositeFoods,
  categories,
  type Material,
  type CompositeFood 
} from '@/lib/expanded-catalogue';
import type { Element } from '@/lib/expanded-catalogue';

type SearchResult = {
  type: 'material' | 'composite';
  item: Material | CompositeFood;
  category: string;
  score?: number;
};

interface FoodSearchProps {
  onSelect: (result: SearchResult) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function FoodSearch({ 
  onSelect, 
  placeholder = "Search foods... (e.g., banana, cheese, lettuce)",
  autoFocus = false 
}: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Create Fuse instance for fuzzy search
  const fuse = useRef<Fuse<SearchResult> | null>(null);

  useEffect(() => {
    // Prepare search data
    const searchData: SearchResult[] = [
      ...materials.map(m => ({
        type: 'material' as const,
        item: m,
        category: m.category,
      })),
      ...compositeFoods.map(cf => ({
        type: 'composite' as const,
        item: cf,
        category: cf.category,
      })),
    ];

    // Initialize Fuse with options
    fuse.current = new Fuse(searchData, {
      keys: [
        { name: 'item.name', weight: 2 },
        { name: 'item.aliases', weight: 1.5 },
        { name: 'category', weight: 0.5 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, []);

  // Handle search
  useEffect(() => {
    if (!query.trim()) {
      // Show all when empty, grouped by category
      const allResults: SearchResult[] = [
        ...materials.map(m => ({
          type: 'material' as const,
          item: m,
          category: m.category,
        })),
        ...compositeFoods.map(cf => ({
          type: 'composite' as const,
          item: cf,
          category: cf.category,
        })),
      ];
      
      // Filter by selected category if any
      const filtered = selectedCategory 
        ? allResults.filter(r => r.category === selectedCategory)
        : allResults;
      
      setResults(filtered.slice(0, 20)); // Limit to 20
      return;
    }

    if (fuse.current) {
      const searchResults = fuse.current.search(query);
      const mapped = searchResults.map(r => ({
        ...r.item,
        score: r.score,
      }));
      
      // Filter by category if selected
      const filtered = selectedCategory
        ? mapped.filter(r => r.category === selectedCategory)
        : mapped;
      
      setResults(filtered.slice(0, 20));
    }
  }, [query, selectedCategory]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        const selectedResult = results[highlightedIndex];
        if (selectedResult) {
          handleSelect(selectedResult);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (result: SearchResult) => {
    onSelect(result);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(0);
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (resultsRef.current) {
      const highlighted = resultsRef.current.children[highlightedIndex] as HTMLElement;
      if (highlighted) {
        highlighted.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedIndex]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(e.target as Node) &&
        resultsRef.current &&
        !resultsRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCategoryIcon = (cat: string) => {
    const catInfo = categories[cat as keyof typeof categories];
    return catInfo?.icon || '🍽️';
  };

  const getCategoryName = (cat: string) => {
    const catInfo = categories[cat as keyof typeof categories];
    return catInfo?.name || cat;
  };

  return (
    <div className="food-search">
      {/* Category filter chips */}
      <div className="category-filters">
        <button
          className={`category-chip ${!selectedCategory ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {Object.entries(categories).map(([key, cat]) => (
          <button
            key={key}
            className={`category-chip ${selectedCategory === key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(key)}
            title={cat.description}
          >
            <span className="chip-icon">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div className="search-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="search-input"
          autoFocus={autoFocus}
          aria-label="Search for food items"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={isOpen && results.length > 0}
        />
        {query && (
          <button
            className="clear-search"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search results dropdown */}
      {isOpen && results.length > 0 && (
        <div 
          ref={resultsRef}
          id="search-results" 
          className="search-results"
          role="listbox"
        >
          {results.map((result, index) => {
            const item = result.item;
            const isComposite = result.type === 'composite';
            const name = item.name;
            const serving = 'typicalServing' in item ? item.typicalServing : 0;
            
            return (
              <button
                key={`${result.type}-${item.id}`}
                className={`search-result-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setHighlightedIndex(index)}
                role="option"
                aria-selected={index === highlightedIndex}
              >
                <span className="result-icon">
                  {getCategoryIcon(result.category)}
                </span>
                <div className="result-content">
                  <div className="result-name">{name}</div>
                  <div className="result-meta">
                    {getCategoryName(result.category)}
                    {serving > 0 && <span className="meta-divider">·</span>}
                    {serving > 0 && <span>{serving}g typical</span>}
                    {isComposite && (
                      <>
                        <span className="meta-divider">·</span>
                        <span className="composite-badge">Mixed</span>
                      </>
                    )}
                  </div>
                </div>
                {!isComposite && 'part' in item && item.part !== 'whole' && (
                  <span className="result-part">{item.part}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* No results message */}
      {isOpen && query && results.length === 0 && (
        <div className="search-results">
          <div className="no-results">
            <span>🔍</span>
            <p>No foods found for "{query}"</p>
            <small>Try searching for banana, apple, cheese, or lettuce</small>
          </div>
        </div>
      )}
    </div>
  );
}
