"use client";

import { useEffect, useState, useRef } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  vx: number;
  vy: number;
  connections: number[];
}

export function DynamicBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClient, setIsClient] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Initialize particles with more sophisticated properties
    const initialParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      speed: Math.random() * 0.3 + 0.1,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      connections: [],
    }));
    setParticles(initialParticles);

    // Mouse move handler with smooth interpolation
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition(prev => ({
        x: prev.x + (e.clientX - prev.x) * 0.1,
        y: prev.y + (e.clientY - prev.y) * 0.1,
      }));
    };

    // Scroll handler for parallax
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Animate particles with connections
    const animateParticles = () => {
      setParticles(prev => {
        const newParticles = prev.map(particle => {
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;
          
          // Boundary checking with bounce
          if (newX <= 0 || newX >= window.innerWidth) {
            particle.vx *= -1;
            newX = Math.max(0, Math.min(window.innerWidth, newX));
          }
          if (newY <= 0 || newY >= window.innerHeight) {
            particle.vy *= -1;
            newY = Math.max(0, Math.min(window.innerHeight, newY));
          }

          // Find nearby particles for connections
          const connections: number[] = [];
          prev.forEach(otherParticle => {
            if (otherParticle.id !== particle.id) {
              const distance = Math.sqrt(
                Math.pow(newX - otherParticle.x, 2) + 
                Math.pow(newY - otherParticle.y, 2)
              );
              if (distance < 120 && connections.length < 3) {
                connections.push(otherParticle.id);
              }
            }
          });

          return {
            ...particle,
            x: newX,
            y: newY,
            connections,
          };
        });

        return newParticles;
      });
      
      animationRef.current = requestAnimationFrame(animateParticles);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    animationRef.current = requestAnimationFrame(animateParticles);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Enhanced gradient mesh with parallax */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
          background: `
            radial-gradient(circle at ${20 + mousePosition.x * 0.02}% ${20 + mousePosition.y * 0.02}%, hsl(var(--primary) / 0.15) 0%, transparent 60%),
            radial-gradient(circle at ${80 - mousePosition.x * 0.03}% ${80 - mousePosition.y * 0.03}%, hsl(var(--primary) / 0.1) 0%, transparent 60%),
            radial-gradient(circle at ${50 + mousePosition.x * 0.01}% ${50 + mousePosition.y * 0.01}%, hsl(var(--primary) / 0.05) 0%, transparent 70%)
          `,
        }}
      />

      {/* Floating particles with connections */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Draw connections first (behind particles) */}
        {particles.map(particle => 
          particle.connections.map(connectionId => {
            const connectedParticle = particles.find(p => p.id === connectionId);
            if (!connectedParticle) return null;
            
            const distance = Math.sqrt(
              Math.pow(particle.x - connectedParticle.x, 2) + 
              Math.pow(particle.y - connectedParticle.y, 2)
            );
            const opacity = Math.max(0, (120 - distance) / 120) * 0.3;
            
            return (
              <line
                key={`${particle.id}-${connectionId}`}
                x1={particle.x}
                y1={particle.y}
                x2={connectedParticle.x}
                y2={connectedParticle.y}
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                opacity={opacity}
                className="connection-line"
              />
            );
          })
        )}
        
        {/* Draw particles */}
        {particles.map(particle => (
          <circle
            key={particle.id}
            cx={particle.x + mousePosition.x * 0.005}
            cy={particle.y + mousePosition.y * 0.005}
            r={particle.size}
            fill="hsl(var(--primary))"
            opacity={particle.opacity * 1.5} // Increased opacity for better visibility
            className="particle-glow"
            style={{
              filter: `blur(${particle.size * 0.3}px)`,
            }}
          />
        ))}
      </svg>

      {/* Enhanced grid pattern with parallax */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015 - scrollY * 0.1}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      {/* Animated aurora-like bands with enhanced movement */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-full h-48 opacity-15 blur-3xl aurora-band-1"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.12), hsl(var(--primary) / 0.08), transparent)',
            top: '15%',
            transform: `translateX(${isClient ? mousePosition.x * 0.1 : 0}px) 
                        translateY(${scrollY * -0.2}px) rotate(12deg)`,
          }}
        />
        <div 
          className="absolute w-full h-64 opacity-10 blur-3xl aurora-band-2"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.08), hsl(var(--primary) / 0.06), transparent)',
            top: '65%',
            transform: `translateX(${isClient ? -mousePosition.x * 0.05 : 0}px) 
                        translateY(${scrollY * -0.3}px) rotate(-8deg)`,
          }}
        />
        <div 
          className="absolute w-full h-32 opacity-12 blur-2xl aurora-band-3"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.06), transparent)',
            top: '40%',
            transform: `translateY(${scrollY * -0.15}px) rotate(5deg)`,
          }}
        />
      </div>

      {/* Subtle geometric shapes floating */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-6 h-6 border border-primary/20 rotate-45 blur-sm floating-shape-1"
          style={{
            top: '25%',
            left: '15%',
            transform: `rotate(45deg) translateY(${scrollY * -0.4}px)`,
          }}
        />
        <div 
          className="absolute w-4 h-4 border border-primary/15 rounded-full blur-sm floating-shape-2"
          style={{
            top: '70%',
            right: '20%',
            transform: `translateY(${scrollY * -0.2}px)`,
          }}
        />
        <div 
          className="absolute w-8 h-1 bg-primary/10 rotate-12 blur-sm floating-shape-3"
          style={{
            top: '50%',
            left: '80%',
            transform: `rotate(12deg) translateY(${scrollY * -0.3}px)`,
          }}
        />
      </div>
    </div>
  );
}
