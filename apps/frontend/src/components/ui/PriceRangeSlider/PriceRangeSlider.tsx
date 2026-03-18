'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Props } from './PriceRangeSlider.types';
import { s } from './PriceRangeSlider.styled';


const THUMB_STYLES = `
  .price-range-slider input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    pointer-events: all;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: hsl(var(--primary));
    border: 2px solid hsl(var(--background));
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    cursor: pointer;
  }
  .price-range-slider input[type="range"]::-moz-range-thumb {
    pointer-events: all;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: hsl(var(--primary));
    border: 2px solid hsl(var(--background));
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    cursor: pointer;
  }
  .price-range-slider input[type="range"]::-webkit-slider-runnable-track {
    background: transparent;
  }
  .price-range-slider input[type="range"]::-moz-range-track {
    background: transparent;
  }
`;

export const PriceRangeSlider = ({ min, max, value: [minVal, maxVal], onChange }: Props) => {
  const rMin = Math.round(min);
  const rMax = Math.round(max);

  const [localMin, setLocalMin] = useState(Math.round(minVal));
  const [localMax, setLocalMax] = useState(Math.round(maxVal));

  useEffect(() => {
    setLocalMin(Math.round(minVal));
    setLocalMax(Math.round(maxVal));
  }, [minVal, maxVal]);

  const minPercent = useMemo(
    () => (rMax === rMin ? 0 : ((localMin - rMin) / (rMax - rMin)) * 100),
    [localMin, rMin, rMax],
  );

  const maxPercent = useMemo(
    () => (rMax === rMin ? 100 : ((localMax - rMin) / (rMax - rMin)) * 100),
    [localMax, rMin, rMax],
  );

  const handleMinSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Math.round(Math.min(Number(e.target.value), localMax - 1));
      setLocalMin(val);
    },
    [localMax],
  );

  const handleMaxSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Math.round(Math.max(Number(e.target.value), localMin + 1));
      setLocalMax(val);
    },
    [localMin],
  );

  const handleRelease = useCallback(() => {
    onChange([localMin, localMax]);
  }, [onChange, localMin, localMax]);

  const handleMinInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setLocalMin(val === '' ? rMin : Number(val));
  }, [rMin]);

  const handleMaxInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setLocalMax(val === '' ? rMax : Number(val));
  }, [rMax]);

  const handleMinBlur = useCallback(() => {
    const clamped = Math.max(rMin, Math.min(localMin, localMax - 1));
    setLocalMin(clamped);
    onChange([clamped, localMax]);
  }, [rMin, localMin, localMax, onChange]);

  const handleMaxBlur = useCallback(() => {
    const clamped = Math.max(localMin + 1, Math.min(localMax, rMax));
    setLocalMax(clamped);
    onChange([localMin, clamped]);
  }, [rMax, localMin, localMax, onChange]);

  return (
    <div className={s.wrapper}>
      <style>{THUMB_STYLES}</style>

      <div className={s.inputs}>
        <input
          type="text"
          inputMode="numeric"
          value={localMin}
          onChange={handleMinInput}
          onBlur={handleMinBlur}
          className={s.input}
          aria-label="Минимальная цена"
        />
        <span className={s.separator}>—</span>
        <input
          type="text"
          inputMode="numeric"
          value={localMax}
          onChange={handleMaxInput}
          onBlur={handleMaxBlur}
          className={s.input}
          aria-label="Максимальная цена"
        />
      </div>

      <div className={s.sliderWrapper}>
        <div className={s.rail} />
        <div
          className={s.fill}
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        <input
          type="range"
          min={rMin}
          max={rMax}
          value={localMin}
          onChange={handleMinSlider}
          onMouseUp={handleRelease}
          onTouchEnd={handleRelease}
          className={s.rangeInput}
          aria-label="Минимальная цена (слайдер)"
        />
        <input
          type="range"
          min={rMin}
          max={rMax}
          value={localMax}
          onChange={handleMaxSlider}
          onMouseUp={handleRelease}
          onTouchEnd={handleRelease}
          className={s.rangeInput}
          aria-label="Максимальная цена (слайдер)"
        />
      </div>
    </div>
  );
};
