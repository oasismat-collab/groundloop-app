'use client';
import { useState, useEffect } from 'react';

type Rank = {
  name: string;
  minPoints: number;
  color: string;
  icon: string;
};

const RANKS: Rank[] = [
  { name: 'Seedling', minPoints: 0, color: '#90EE90', icon: '🌱' },
  { name: 'Sprout', minPoints: 500, color: '#98FB98', icon: '🌿' },
  { name: 'Sapling', minPoints: 1500, color: '#3CB371', icon: '🌳' },
  { name: 'Tree', minPoints: 3000, color: '#228B22', icon: '🌲' },
  { name: 'Grove', minPoints: 5000, color: '#006400', icon: '🌲🌲' },
  { name: 'Forest', minPoints: 10000, color: '#013220', icon: '🌲🌲🌲' },
];

function getCurrentRank(points: number): { current: Rank; next: Rank | null; progress: number } {
  let currentRank = RANKS[0];
  let nextRank: Rank | null = RANKS[1];
  
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (points >= RANKS[i].minPoints) {
      currentRank = RANKS[i];
      nextRank = i < RANKS.length - 1 ? RANKS[i + 1] : null;
      break;
    }
  }
  
  const progress = nextRank 
    ? ((points - currentRank.minPoints) / (nextRank.minPoints - currentRank.minPoints)) * 100
    : 100;
  
  return { current: currentRank, next: nextRank, progress };
}

export default function PointsTracker({ refreshKey }: { refreshKey?: number }) {
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem('compostEntries') || '[]');
    const points = entries.reduce((sum: number, e: any) => sum + e.points, 0);
    setTotalPoints(points);
    setTotalItems(entries.length);
  }, [refreshKey]);
  
  const { current, next, progress } = getCurrentRank(totalPoints);
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      padding: '2rem',
      marginBottom: '2rem',
      color: 'white',
      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{current.icon}</div>
          <h3 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 'bold' }}>
            {current.name} Rank
          </h3>
          <p style={{ opacity: 0.9, marginTop: '0.5rem', fontSize: '1.1rem' }}>
            {totalPoints.toLocaleString()} points • {totalItems} items
          </p>
        </div>
        
        {next && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', opacity: 0.7 }}>{next.icon}</div>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
              Next: {next.name}
            </p>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>
              {next.minPoints - totalPoints} pts to go
            </p>
          </div>
        )}
      </div>
      
      {next && (
        <div>
          <div style={{ 
            width: '100%', 
            height: '20px', 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: '10px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'rgba(255,255,255,0.9)',
              transition: 'width 0.5s ease',
              borderRadius: '10px'
            }} />
          </div>
          <p style={{ 
            marginTop: '0.5rem', 
            textAlign: 'center',
            fontSize: '0.85rem',
            opacity: 0.8
          }}>
            {Math.round(progress)}% to {next.name}
          </p>
        </div>
      )}
      
      {!next && (
        <p style={{ 
          textAlign: 'center',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          margin: '1rem 0 0 0'
        }}>
          🏆 Maximum Rank Achieved!
        </p>
      )}
    </div>
  );
}
