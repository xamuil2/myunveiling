"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Play } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import { album } from "@/lib/music-data";

interface LandingSectionProps {
  onContinue: () => void;
}

export function LandingSection({ onContinue }: LandingSectionProps) {
  const { playTrack } = usePlayer();

  const handlePlay = () => {
    playTrack(album.tracks[0]);
    onContinue();
  };

  const handleScroll = () => {
    onContinue();
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative bg-gradient-to-b from-background via-background to-muted/10">
      <div className="max-w-4xl mx-auto text-center px-6 landing-animate">
        {/* Album Title */}
        <div className="mb-8 landing-animate-delay-1">
          <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-4 tracking-tight landing-title-glow">
            My Unveiling
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light landing-animate-delay-2">
            2025
          </p>
        </div>

        {/* Artistic Statement / Quote */}
        <div className="mb-12 max-w-3xl mx-auto landing-animate-delay-3">
          <blockquote className="text-lg md:text-xl text-muted-foreground leading-relaxed italic mb-4 hover:text-foreground/80 transition-colors duration-500">
            "Artworks...are not there to save us or perfect us (or damn or
corrupt us), but rather to complicate things, to create more complex nervous systems no longer subservient to the debilitating effects of
clichés, to show and release the possibilities of life."
          </blockquote>
          <cite className="text-sm text-muted-foreground/80">— John Rajchman</cite>
          
          {/* You can replace the above quote with your artistic statement */}
          <div className="mt-8 p-6 rounded-lg bg-card/50 backdrop-blur border border-border/50 elegant-hover">
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">

                In essence, art involves releasing externalities and conformities,
              challenging the familiar, and embracing the unknown.
                It is a process of unveiling, in which the artist and the audience are both transformed through the experience.
                              <br/><br/>This collection represents my first year of discovery and transformation in composition. 
                              Thank you to Dr. Sakata for your guidance and support, and my roommate for enduring my sometimes chaotic experiments.
            </p>
          </div>
        </div>

        {/* Headphones Notice */}
        <div className="mb-8 landing-animate-delay-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/60 max-w-fit mx-auto">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h1v-8H6a7 7 0 1 1 14 0h-1v8h1c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9zM8 12v6H6c-.55 0-1-.45-1-1v-5h3zm12 5c0 .55-.45 1-1 1h-2v-6h3v5z"/>
            </svg>
            <span>Headphones or AirPods recommended for optimal experience</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 landing-animate-delay-5">
          <Button
            size="lg"
            className="rounded-full px-8 py-6 text-lg font-medium elegant-hover shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handlePlay}
          >
            <Play className="w-5 h-5 mr-2" />
            Begin the Journey
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 py-6 text-lg font-medium elegant-hover"
            onClick={handleScroll}
          >
            Explore Album
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full p-2"
          onClick={handleScroll}
        >
          <ChevronDown className="w-6 h-6" />
        </Button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-primary/5 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
    </section>
  );
}
