import { useEffect, useRef, useState, type RefObject } from "react";

interface ConfettiBurstProps {
  active: boolean;
  onComplete: () => void;
  anchorRef?: RefObject<HTMLElement | null>;
}

interface Particle {
  id: number;
  originX: number;
  originY: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
}

const COLORS = [
  "var(--primary)",
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-info)",
  "var(--foreground)",
];

const DURATION = 2200;
const PARTICLE_COUNT = 80;

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const wave = i < 40 ? 0 : i < 65 ? 1 : 2;
    const waveDelay = wave * 200;

    const angle = Math.random() * Math.PI * 2;
    const distance = 15 + Math.random() * 80;
    const stretchX = 1.8;

    return {
      id: i,
      originX: (Math.random() - 0.5) * 40,
      originY: (Math.random() - 0.5) * 4,
      x: Math.cos(angle) * distance * stretchX,
      y: Math.sin(angle) * distance,
      rotation: Math.random() * 720 - 360,
      color: COLORS[i % COLORS.length],
      size: Math.random() * 7 + 3,
      delay: waveDelay + Math.random() * 180,
    };
  });
}

export function ConfettiBurst({ active, onComplete, anchorRef }: ConfettiBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const originRef = useRef<{ x: number; y: number }>({ x: 50, y: 33 });

  useEffect(() => {
    if (!active) return;

    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      originRef.current = {
        x: ((rect.left + rect.width / 2) / window.innerWidth) * 100,
        y: ((rect.top + rect.height / 2) / window.innerHeight) * 100,
      };
    }

    setParticles(createParticles());
    const timer = setTimeout(() => {
      setParticles([]);
      onComplete();
    }, DURATION);

    return () => clearTimeout(timer);
  }, [active, onComplete, anchorRef]);

  if (particles.length === 0) return null;

  const { x, y } = originRef.current;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
      data-testid="confetti-burst"
    >
      <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-sm"
            style={
              {
                left: `${p.originX}vw`,
                top: `${p.originY}vh`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                transform: "translate(0, 0) scale(0) rotate(0deg)",
                animation: `confetti-particle ${DURATION - p.delay}ms cubic-bezier(0.16, 1, 0.3, 1) ${p.delay}ms forwards`,
                "--confetti-x": `${p.x}vw`,
                "--confetti-y": `${p.y}vh`,
                "--confetti-rot": `${p.rotation}deg`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
