import React, { useState, useEffect } from "react";
import '../styles/animatedBannerLayout.css';

const ROWS = 8;
const COLS = 40;
const TOTAL = ROWS + COLS - 1;

function AnimatedFlipBanner() {
  const [flippedSquares, setFlippedSquares] = useState(
    new Array(ROWS * COLS).fill(false)
  );

  useEffect(() => {
    let timeouts = [];
    const waveDelay = 120;

    for (let d = 0; d < TOTAL; d++) {
      timeouts.push(
        setTimeout(() => {
          setFlippedSquares((prev) => {
            const newFlipped = [...prev];
            for (let row = 0; row < ROWS; row++) {
              for (let col = 0; col < COLS; col++) {
                if (row + col === d) {
                  newFlipped[row * COLS + col] = true;
                }
              }
            }
            return newFlipped;
          });
        }, d * waveDelay)
      );
    }

    return () => timeouts.forEach(clearTimeout);
  }, []);

  const squares = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const idx = row * COLS + col;
      squares.push(
        <div key={idx} className={`flip-square ${flippedSquares[idx] ? "flipped" : ""}`}>
          <div className="flip-inner">
            <div className="flip-front" />
            <div className="flip-back" />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flip-banner">
      <div
        className="flip-banner-grid"
        style={{
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        }}
      >
        {squares}
      </div>
      <div className="flip-text-overlay">Nuria Design Portfolio</div>
    </div>
  );
}

export default AnimatedFlipBanner;