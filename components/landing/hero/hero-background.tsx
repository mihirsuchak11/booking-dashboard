"use client";

import FloatingLines from "./floating-lines";

const HERO_LINES_GRADIENT: string[] = ["#9333ea", "#a855f7", "#06b6d4", "#3b82f6"];
const HERO_ENABLED_WAVES: Array<"top" | "middle" | "bottom"> = ["top", "middle", "bottom"];
const HERO_LINE_COUNT: number[] = [4, 6, 4];
const HERO_LINE_DISTANCE: number[] = [4, 5, 4];
const HERO_TOP_WAVE_POSITION = { x: 10.0, y: 0.5, rotate: -0.4 };
const HERO_MIDDLE_WAVE_POSITION = { x: 5.0, y: 0.0, rotate: 0.2 };

export function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0">
      {/* Animated floating lines */}
      <FloatingLines
        linesGradient={HERO_LINES_GRADIENT}
        enabledWaves={HERO_ENABLED_WAVES}
        lineCount={HERO_LINE_COUNT}
        lineDistance={HERO_LINE_DISTANCE}
        topWavePosition={HERO_TOP_WAVE_POSITION}
        middleWavePosition={HERO_MIDDLE_WAVE_POSITION}
        animationSpeed={0.8}
        interactive={true}
        parallax={true}
        parallaxStrength={0.15}
      />

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/80 via-[#0a0a0f]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 via-transparent to-[#0a0a0f]/40" />
    </div>
  );
}
