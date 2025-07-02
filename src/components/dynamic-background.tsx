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
  const [scrollY, setScrollY] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClient, setIsClient] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Wait for client-side initialization
    
    startTimeRef.current = Date.now(); // Initialize start time only on client
    
    // Initialize particles with enhanced movement for visual richness
    const initialParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1.5, // Increased size variety
      opacity: Math.random() * 0.3 + 0.7, // Higher opacity range (0.7-1.0)
      speed: Math.random() * 1.2 + 0.5, // Significantly increased movement speed
      vx: (Math.random() - 0.5) * 1.5, // More dynamic velocity
      vy: (Math.random() - 0.5) * 1.5,
      connections: [],
    }));
    setParticles(initialParticles);

    // Scroll handler for parallax
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Enhanced animation with more dynamic movement
    const animateParticles = () => {
      setParticles(prev => {
        const newParticles = prev.map(particle => {
          // Enhanced movement with time-based oscillation using client-side time
          const time = (Date.now() - startTimeRef.current) * 0.0001;
          const oscillationX = Math.sin(time + particle.id) * 0.3;
          const oscillationY = Math.cos(time + particle.id * 0.5) * 0.2;
          
          let newX = particle.x + particle.vx + oscillationX;
          let newY = particle.y + particle.vy + oscillationY;
          
          // Enhanced boundary checking with smooth rebounds
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          
          if (newX <= 0 || newX >= windowWidth) {
            particle.vx *= -0.8; // Softer bounce with energy loss
            newX = Math.max(5, Math.min(windowWidth - 5, newX));
          }
          if (newY <= 0 || newY >= windowHeight) {
            particle.vy *= -0.8;
            newY = Math.max(5, Math.min(windowHeight - 5, newY));
          }

          // Enhanced connection logic with distance-based relationships
          const connections: number[] = [];
          prev.forEach(otherParticle => {
            if (otherParticle.id !== particle.id && connections.length < 3) { // Allow more connections
              const distance = Math.sqrt(
                Math.pow(newX - otherParticle.x, 2) + 
                Math.pow(newY - otherParticle.y, 2)
              );
              if (distance < 120) { // Increased connection distance
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
      
      // Increased frame rate for smoother animation
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(animateParticles);
      }, 20); // ~50fps for smoother movement
    };

    window.addEventListener('scroll', handleScroll);
    
    // Start animation immediately after client-side initialization
    animationRef.current = requestAnimationFrame(animateParticles);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    }, [isClient]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Enhanced gradient mesh with parallax */}
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-30"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
          background: `
            radial-gradient(circle at 20% 20%, hsl(var(--foreground) / 0.15) 0%, transparent 60%),
            radial-gradient(circle at 80% 80%, hsl(var(--foreground) / 0.08) 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, hsl(var(--foreground) / 0.05) 0%, transparent 70%)
          `,
        }}
      />

      {/* Floating particles with connections */}
      <svg className="absolute inset-0 w-full h-full particle-canvas" style={{ zIndex: 1 }}>
        {/* Draw connections first (behind particles) */}
        {particles.map(particle => 
          particle.connections.slice(0, 3).map(connectionId => { // Allow more connections
            const connectedParticle = particles.find(p => p.id === connectionId);
            if (!connectedParticle) return null;
            
            // Enhanced parallax for connections with depth
            const parallaxY1 = scrollY * (particle.size / 4) * 0.3;
            const parallaxY2 = scrollY * (connectedParticle.size / 4) * 0.3;
            
            const distance = Math.sqrt(
              Math.pow(particle.x - connectedParticle.x, 2) + 
              Math.pow((particle.y - parallaxY1) - (connectedParticle.y - parallaxY2), 2)
            );
            const opacity = Math.max(0, (140 - distance) / 140) * 0.2; // Reduced opacity for light mode
            
            return (
              <line
                key={`${particle.id}-${connectionId}`}
                x1={particle.x}
                y1={particle.y - parallaxY1}
                x2={connectedParticle.x}
                y2={connectedParticle.y - parallaxY2}
                strokeWidth="1" // Slightly thicker for better visibility
                opacity={opacity}
                className="connection-line"
              />
            );
          })
        )}
        
        {/* Draw particles */}
        {particles.map(particle => {
          // Enhanced parallax effect with depth and movement
          const parallaxY = scrollY * (particle.size / 3) * 0.4; // Increased parallax effect
          
          return (
            <circle
              key={particle.id}
              cx={particle.x}
              cy={particle.y - parallaxY}
              r={particle.size}
              className="particle-dot"
              opacity={particle.opacity * 0.4} // Reduced opacity for light mode
              style={{
                filter: `blur(${particle.size * 0.1}px)`, // Reduced blur for subtlety
              }}
            />
          );
        })}
      </svg>

      {/* Enhanced grid pattern with dynamic parallax */}
      <div 
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground) / 0.5) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground) / 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px', // Tighter grid
          transform: `translateY(${-scrollY * 0.15}px)`, // Only scroll-based parallax
          transition: 'transform 0.2s ease-out', // Faster response
        }}
      />

      {/* Animated aurora-like bands with enhanced movement */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-full h-48 opacity-6 dark:opacity-12 blur-3xl aurora-band-1"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(var(--foreground) / 0.1), hsl(var(--foreground) / 0.06), transparent)',
            top: '15%',
            transform: `translateY(${scrollY * -0.25}px) rotate(12deg)`,
          }}
        />
        <div 
          className="absolute w-full h-64 opacity-4 dark:opacity-10 blur-3xl aurora-band-2"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(var(--foreground) / 0.08), hsl(var(--foreground) / 0.04), transparent)',
            top: '65%',
            transform: `translateY(${scrollY * -0.35}px) rotate(-8deg)`,
          }}
        />
        <div 
          className="absolute w-full h-32 opacity-5 dark:opacity-8 blur-2xl aurora-band-3"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(var(--foreground) / 0.06), transparent)',
            top: '40%',
            transform: `translateY(${scrollY * -0.2}px) rotate(5deg)`,
          }}
        />
      </div>

      {/* Enhanced geometric shapes with dynamic movement */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-6 h-6 border border-foreground/12 rotate-45 blur-sm floating-shape-1"
          style={{
            top: '25%',
            left: '15%',
            transform: `rotate(${45 + scrollY * 0.1}deg) translateY(${scrollY * -0.5}px)`,
          }}
        />
        <div 
          className="absolute w-4 h-4 border border-foreground/10 rounded-full blur-sm floating-shape-2"
          style={{
            top: '70%',
            right: '20%',
            transform: `translateY(${scrollY * -0.3}px)`,
          }}
        />
        <div 
          className="absolute w-8 h-1 bg-foreground/8 rotate-12 blur-sm floating-shape-3"
          style={{
            top: '50%',
            left: '80%',
            transform: `rotate(${12 + scrollY * 0.05}deg) translateY(${scrollY * -0.4}px)`,
          }}
        />
        <div 
          className="absolute w-3 h-3 border border-foreground/8 rounded-sm blur-sm floating-shape-4"
          style={{
            top: '35%',
            left: '75%',
            transform: `rotate(${scrollY * 0.08}deg) translateY(${scrollY * -0.25}px)`,
          }}
        />
        <div 
          className="absolute w-5 h-5 border-2 border-foreground/6 rounded-full blur-sm floating-shape-5"
          style={{
            top: '80%',
            left: '10%',
            transform: `translateY(${scrollY * -0.35}px)`,
          }}
        />
      </div>
    </div>
  );
}
