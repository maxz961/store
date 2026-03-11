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
  const [localMin, setLocalMin] = useState(minVal);
  const [localMax, setLocalMax] = useState(maxVal);

  useEffect(() => {
    setLocalMin(minVal);
    setLocalMax(maxVal);
  }, [minVal, maxVal]);

  const minPercent = useMemo(
    () => (max === min ? 0 : ((localMin - min) / (max - min)) * 100),
    [localMin, min, max],
  );

  const maxPercent = useMemo(
    () => (max === min ? 100 : ((localMax - min) / (max - min)) * 100),
    [localMax, min, max],
  );

  const handleMinSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Math.min(Number(e.target.value), localMax - 1);
      setLocalMin(val);
    },
    [localMax],
  );

  const handleMaxSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Math.max(Number(e.target.value), localMin + 1);
      setLocalMax(val);
    },
    [localMin],
  );

  const handleRelease = useCallback(() => {
    onChange([localMin, localMax]);
  }, [onChange, localMin, localMax]);

  const handleMinInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setLocalMin(val === '' ? min : Number(val));
  }, [min]);

  const handleMaxInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setLocalMax(val === '' ? max : Number(val));
  }, [max]);

  const handleMinBlur = useCallback(() => {
    const clamped = Math.max(min, Math.min(localMin, localMax - 1));
    setLocalMin(clamped);
    onChange([clamped, localMax]);
  }, [min, localMin, localMax, onChange]);

  const handleMaxBlur = useCallback(() => {
    const clamped = Math.max(localMin + 1, Math.min(localMax, max));
    setLocalMax(clamped);
    onChange([localMin, clamped]);
  }, [max, localMin, localMax, onChange]);

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
          min={min}
          max={max}
          value={localMin}
          onChange={handleMinSlider}
          onMouseUp={handleRelease}
          onTouchEnd={handleRelease}
          className={s.rangeInput}
          aria-label="Минимальная цена (слайдер)"
        />
        <input
          type="range"
          min={min}
          max={max}
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
