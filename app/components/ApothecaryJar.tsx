/**
 * Apothecary Jar Component
 * 
 * Vintage pharmacy-style jar that fills up with nutrients/water
 * Shows absolute amounts with visual progress toward monthly targets
 */

import { type Element } from '@/lib/expanded-catalogue';
import { formatMass, getNutrientName } from '@/lib/nutrient-calculator';

type ApothecaryJarProps = {
  element: Element | 'water';
  amount: number; // grams for nutrients, liters for water
  target: number; // monthly target
  unit?: string; // Optional unit override
};

export default function ApothecaryJar({
  element,
  amount,
  target,
  unit,
}: ApothecaryJarProps) {
  // Calculate fill percentage (0-100)
  const fillPercentage = Math.min((amount / target) * 100, 100);
  
  // Determine color scheme based on element
  const getColorScheme = () => {
    if (element === 'water') {
      return {
        primary: '#4A90E2',
        light: '#7FB3E8',
        glow: 'rgba(74, 144, 226, 0.3)',
        name: 'Water',
        symbol: 'H₂O',
      };
    }

    const schemes: Record<Element, { primary: string; light: string; glow: string; name: string; symbol: string }> = {
      N: { primary: '#6B8E4E', light: '#8DAA6C', glow: 'rgba(107, 142, 78, 0.3)', name: 'Nitrogen', symbol: 'N' },
      P: { primary: '#B8860B', light: '#D4A849', glow: 'rgba(184, 134, 11, 0.3)', name: 'Phosphorus', symbol: 'P' },
      K: { primary: '#8B4513', light: '#A0684F', glow: 'rgba(139, 69, 19, 0.3)', name: 'Potassium', symbol: 'K' },
      Ca: { primary: '#708090', light: '#8FA2AC', glow: 'rgba(112, 128, 144, 0.3)', name: 'Calcium', symbol: 'Ca' },
      Mg: { primary: '#556B2F', light: '#738A4A', glow: 'rgba(85, 107, 47, 0.3)', name: 'Magnesium', symbol: 'Mg' },
      S: { primary: '#DAA520', light: '#E6B840', glow: 'rgba(218, 165, 32, 0.3)', name: 'Sulfur', symbol: 'S' },
      Fe: { primary: '#8B4726', light: '#A66A47', glow: 'rgba(139, 71, 38, 0.3)', name: 'Iron', symbol: 'Fe' },
      Zn: { primary: '#4A5F7A', light: '#687F96', glow: 'rgba(74, 95, 122, 0.3)', name: 'Zinc', symbol: 'Zn' },
    };

    return schemes[element];
  };

  const colorScheme = getColorScheme();

  // Format display value
  const displayAmount = element === 'water' 
    ? `${amount.toFixed(1)} L`
    : formatMass(amount);

  const targetDisplay = element === 'water'
    ? `${target.toFixed(0)} L`
    : formatMass(target);

  return (
    <div className="apothecary-jar">
      {/* Glass jar */}
      <div className="jar-container">
        <svg
          className="jar-svg"
          viewBox="0 0 120 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Jar body outline */}
          <path
            d="M 30 20 L 30 150 Q 30 165 45 165 L 75 165 Q 90 165 90 150 L 90 20"
            stroke="#263B2D"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
          
          {/* Jar neck */}
          <rect x="40" y="5" width="40" height="15" rx="2" stroke="#263B2D" strokeWidth="2" fill="none" opacity="0.3" />
          
          {/* Cork/stopper */}
          <rect x="38" y="2" width="44" height="8" rx="3" fill="#8B6F47" stroke="#6B5437" strokeWidth="1" />
          <ellipse cx="60" cy="2" rx="22" ry="3" fill="#A0856B" />

          {/* Liquid fill with gradient */}
          <defs>
            <linearGradient id={`liquid-gradient-${element}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colorScheme.light} stopOpacity="0.9" />
              <stop offset="100%" stopColor={colorScheme.primary} stopOpacity="0.95" />
            </linearGradient>
            
            {/* Glass shine effect */}
            <linearGradient id="glass-shine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="30%" stopColor="white" stopOpacity="0.15" />
              <stop offset="70%" stopColor="white" stopOpacity="0.15" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Animated liquid fill */}
          <g clipPath="url(#jar-clip)">
            <path
              className="liquid-fill"
              d={`M 30 ${170 - (fillPercentage * 1.4)} L 30 150 Q 30 165 45 165 L 75 165 Q 90 165 90 150 L 90 ${170 - (fillPercentage * 1.4)} Z`}
              fill={`url(#liquid-gradient-${element})`}
            />
            
            {/* Liquid surface wave effect */}
            {fillPercentage > 0 && (
              <ellipse
                className="liquid-surface"
                cx="60"
                cy={170 - (fillPercentage * 1.4)}
                rx="30"
                ry="3"
                fill={colorScheme.light}
                opacity="0.6"
              />
            )}
          </g>

          {/* Glass body clip path */}
          <clipPath id="jar-clip">
            <path d="M 30 20 L 30 150 Q 30 165 45 165 L 75 165 Q 90 165 90 150 L 90 20 Z" />
          </clipPath>

          {/* Glass shine overlay */}
          <rect x="32" y="22" width="10" height="120" rx="2" fill="url(#glass-shine)" opacity="0.4" />
          
          {/* Measurement marks */}
          {[25, 50, 75].map(mark => (
            <g key={mark} opacity="0.2">
              <line
                x1="32"
                y1={170 - (mark * 1.4)}
                x2="38"
                y2={170 - (mark * 1.4)}
                stroke="#263B2D"
                strokeWidth="1"
              />
              <line
                x1="82"
                y1={170 - (mark * 1.4)}
                x2="88"
                y2={170 - (mark * 1.4)}
                stroke="#263B2D"
                strokeWidth="1"
              />
            </g>
          ))}
        </svg>

        {/* Glow effect when filling */}
        {fillPercentage > 0 && (
          <div 
            className="jar-glow"
            style={{
              background: `radial-gradient(circle, ${colorScheme.glow} 0%, transparent 70%)`,
            }}
          />
        )}
      </div>

      {/* Label */}
      <div className="jar-label">
        <div className="jar-symbol">{colorScheme.symbol}</div>
        <div className="jar-name">{colorScheme.name}</div>
        <div className="jar-amount">{displayAmount}</div>
        <div className="jar-progress">
          <div 
            className="jar-progress-bar"
            style={{ 
              width: `${fillPercentage}%`,
              backgroundColor: colorScheme.primary,
            }}
          />
        </div>
        <div className="jar-target">of {targetDisplay} monthly</div>
      </div>

      <style jsx>{`
        .apothecary-jar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, #fafaf8 0%, #f5f6f0 100%);
          border: 1px solid #e0e3d8;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
        }

        .apothecary-jar:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(38, 59, 45, 0.12);
          border-color: #c8cdbf;
        }

        .jar-container {
          position: relative;
          width: 120px;
          height: 180px;
        }

        .jar-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
        }

        .jar-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .liquid-fill {
          transition: d 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .liquid-surface {
          animation: wave 3s ease-in-out infinite;
        }

        @keyframes wave {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-2px) scaleY(0.95); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        .jar-label {
          text-align: center;
          width: 100%;
        }

        .jar-symbol {
          font-size: 24px;
          font-weight: 700;
          color: var(--ink);
          font-family: 'Georgia', serif;
          margin-bottom: 4px;
        }

        .jar-name {
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6a745e;
          margin-bottom: 8px;
        }

        .jar-amount {
          font-size: 20px;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 8px;
        }

        .jar-progress {
          width: 100%;
          height: 4px;
          background: #e0e3d8;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .jar-progress-bar {
          height: 100%;
          border-radius: 2px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .jar-target {
          font-size: 11px;
          color: #8a9478;
        }
      `}</style>
    </div>
  );
}
