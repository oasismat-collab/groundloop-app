'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type CompostEntry = {
  id: string;
  food: string;
  mass: number;
  date: string;
  points: number;
};

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

const POINTS_PER_ITEM = 50;

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

export default function Dashboard() {
  const [entries, setEntries] = useState<CompostEntry[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [userName, setUserName] = useState('Composter');
  
  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('compostEntries');
    if (stored) {
      const parsed = JSON.parse(stored);
      setEntries(parsed);
      setTotalPoints(parsed.reduce((sum: number, e: CompostEntry) => sum + e.points, 0));
    }
    
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);
  }, []);
  
  const { current, next, progress } = getCurrentRank(totalPoints);
  const totalItems = entries.length;
  const totalMass = entries.reduce((sum, e) => sum + e.mass, 0);
  
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <header style={{ padding: '1.5rem 2rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
            🌱 Groundwork
          </Link>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
            <Link href="/compost-tracker" style={{ color: 'white', textDecoration: 'none' }}>Track</Link>
            <Link href="/drop-off" style={{ color: 'white', textDecoration: 'none' }}>Drop-Off</Link>
          </nav>
        </div>
      </header>
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Welcome Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Welcome back, {userName}! 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
            Keep composting to level up and help the planet
          </p>
        </div>
        
        {/* Rank Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '2.5rem',
          marginBottom: '2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{current.icon}</div>
              <h2 style={{ fontSize: '2rem', color: current.color, margin: 0, fontWeight: 'bold' }}>
                {current.name}
              </h2>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>
                {totalPoints.toLocaleString()} points
              </p>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              {next ? (
                <>
                  <div style={{ fontSize: '1.5rem', opacity: 0.5 }}>{next.icon}</div>
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
                    Next: {next.name}
                  </p>
                  <p style={{ color: '#999', fontSize: '0.8rem' }}>
                    {next.minPoints - totalPoints} points to go
                  </p>
                </>
              ) : (
                <p style={{ color: current.color, fontWeight: 'bold', fontSize: '1.2rem' }}>
                  Max Rank! 🏆
                </p>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          {next && (
            <div style={{ marginTop: '2rem' }}>
              <div style={{ 
                width: '100%', 
                height: '30px', 
                background: '#f0f0f0', 
                borderRadius: '15px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${current.color}, ${next.color})`,
                  transition: 'width 0.5s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '15px', 
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗑️</div>
            <h3 style={{ margin: 0, color: '#333', fontSize: '1.1rem' }}>Items Composted</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea', margin: '0.5rem 0 0 0' }}>
              {totalItems}
            </p>
          </div>
          
          <div style={{ 
            background: 'white', 
            borderRadius: '15px', 
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚖️</div>
            <h3 style={{ margin: 0, color: '#333', fontSize: '1.1rem' }}>Total Weight</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#764ba2', margin: '0.5rem 0 0 0' }}>
              {(totalMass / 1000).toFixed(1)} kg
            </p>
          </div>
          
          <div style={{ 
            background: 'white', 
            borderRadius: '15px', 
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐</div>
            <h3 style={{ margin: 0, color: '#333', fontSize: '1.1rem' }}>Total Points</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#FF6B6B', margin: '0.5rem 0 0 0' }}>
              {totalPoints.toLocaleString()}
            </p>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ marginTop: 0, color: '#333' }}>Recent Activity</h2>
          
          {entries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
              <p style={{ fontSize: '3rem', margin: 0 }}>🌱</p>
              <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>No composting activity yet</p>
              <Link 
                href="/compost-tracker" 
                style={{
                  display: 'inline-block',
                  marginTop: '1.5rem',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Start Composting
              </Link>
            </div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {entries.slice().reverse().slice(0, 10).map(entry => (
                <div 
                  key={entry.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8f8f8'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>
                      {entry.food}
                    </p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#999' }}>
                      {new Date(entry.date).toLocaleDateString()} • {entry.mass}g
                    </p>
                  </div>
                  <div style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontWeight: 'bold'
                  }}>
                    +{entry.points} pts
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
