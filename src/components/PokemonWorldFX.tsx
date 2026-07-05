import type { CSSProperties } from "react";

const sparks = [
  { left: "7%", top: "76%", delay: "0.2s", duration: "13s", scale: 0.75 },
  { left: "16%", top: "34%", delay: "2.8s", duration: "16s", scale: 0.9 },
  { left: "24%", top: "88%", delay: "1.4s", duration: "15s", scale: 0.65 },
  { left: "34%", top: "16%", delay: "5.2s", duration: "18s", scale: 1 },
  { left: "42%", top: "68%", delay: "3.6s", duration: "14s", scale: 0.78 },
  { left: "51%", top: "28%", delay: "0.8s", duration: "17s", scale: 0.7 },
  { left: "58%", top: "83%", delay: "4.4s", duration: "16s", scale: 1.1 },
  { left: "67%", top: "20%", delay: "2s", duration: "15s", scale: 0.82 },
  { left: "75%", top: "61%", delay: "6s", duration: "19s", scale: 0.92 },
  { left: "84%", top: "37%", delay: "1s", duration: "14s", scale: 0.72 },
  { left: "92%", top: "78%", delay: "3.1s", duration: "18s", scale: 0.86 },
  { left: "48%", top: "8%", delay: "7.4s", duration: "20s", scale: 0.64 },
];

export const PokemonWorldFX = () => (
  <div className="pokemon-world-fx" aria-hidden="true">
    <span className="world-field" />
    <span className="world-scanline" />
    <span className="world-bolt world-bolt-1" />
    <span className="world-bolt world-bolt-2" />
    <span className="world-bolt world-bolt-3" />
    <span className="world-energy-rail world-energy-rail-1" />
    <span className="world-energy-rail world-energy-rail-2" />
    <span className="world-energy-rail world-energy-rail-3" />
    <div className="world-sparks">
      {sparks.map((spark) => (
        <span
          key={`${spark.left}-${spark.top}`}
          style={
            {
              left: spark.left,
              top: spark.top,
              animationDelay: spark.delay,
              animationDuration: spark.duration,
              "--spark-scale": spark.scale,
            } as CSSProperties
          }
        />
      ))}
    </div>
  </div>
);
