/**
 * Kitchen atmosphere intensity — edit these numbers and save to hot-reload.
 * All four effects read from this file.
 */

export const SCENE_W = 1536;
export const SCENE_H = 1024;

export const STEAM_CONFIG = {
  /** Peak opacity of a wisp (0.25 faint … 0.5 visible vapor … 0.8 blown-out). */
  peakOpacity: 0.5,
  /** How many wisps to draw (4–8). */
  wispCount: 7,
  /** Gaussian blur in SVG units (10 tighter … 18 soft … 28 very diffuse). */
  blur: 18,
  /** Size multiplier on each wisp (0.8 smaller … 1.2 larger). */
  size: 1.18,
  /** Typical rise duration in seconds (3 faster … 5 medium … 8 slower). */
  riseSpeed: 5,
};

export const LAMP_CONFIG = {
  /** Peak opacity of the halo (0.25 faint … 0.5 noticeable … 0.8 flare). */
  peakOpacity: 0.5,
  /** Glow radius in illustration pixels (120 tight … 180 medium … 240 wide). */
  glowRadius: 185,
  /** Scale at the brightest frame (1.02 subtle … 1.08 gentle … 1.15 obvious). */
  pulseScale: 1.08,
  /** Pulse loop duration in seconds (2 faster … 4 medium … 7 slower). */
  pulseSpeed: 4,
};

export const FIREFLY_CONFIG = {
  /** Peak opacity of a twinkle (0.4 faint … 0.9 clearly glowing … 1 solid). */
  peakOpacity: 0.95,
  /** Size multiplier on each dot (1 default … 1.5 larger). */
  size: 1.45,
  /** How many lights to draw (4–7). */
  count: 7,
  /** Typical twinkle cycle in seconds (2 faster … 3.5 medium … 6 slower). */
  twinkleSpeed: 3.5,
};

export const DUST_CONFIG = {
  /** Opacity of motes (0.15 barely … 0.4 perceptible … 0.7 obvious). */
  peakOpacity: 0.4,
  /** Size multiplier (1 default … 1.6 larger). */
  size: 1.45,
  /** How many motes to draw (6–12). */
  count: 10,
  /** Typical drift loop in seconds (8 faster … 12 medium … 18 slower). */
  driftSpeed: 12,
};
