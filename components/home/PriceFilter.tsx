"use client";

import React from "react";
import { Range, getTrackBackground } from "react-range";

interface PriceFilterProps {
  minPriceSilder: number | null | undefined;
  maxPriceSilder: number | null | undefined;
  setMinPriceSilder: React.Dispatch<React.SetStateAction<number>>;
  setMaxPriceSilder: React.Dispatch<React.SetStateAction<number>>;
  absoluteMin: number;
  absoluteMax: number;
  applyFilters: () => void;
}

export default function PriceFilter({
  minPriceSilder,
  maxPriceSilder,
  setMinPriceSilder,
  setMaxPriceSilder,
  absoluteMin,
  absoluteMax,
  applyFilters,
}: PriceFilterProps) {
  const safeMin = Number(minPriceSilder ?? absoluteMin ?? 0);
  const safeMax = Number(maxPriceSilder ?? absoluteMax ?? 0);

  const formattedMin = safeMin.toLocaleString("en-IN");
  const formattedMax = safeMax.toLocaleString("en-IN");

  const values = [safeMin, safeMax];

  if (absoluteMax <= absoluteMin) {
    return (
      <div className="mb-6">
        <h3 className="font-semibold mb-4">Price</h3>
        <p className="text-sm text-gray-500">No price renge available</p>
      </div>
    );
  }
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-4">Price</h3>
      <div className="space-y-4">
        <div className="text-sm font-medium">
          ₹{formattedMin} - ₹{formattedMax}+
        </div>
        <div className="flex items-center gap-3">
          <Range
            values={values}
            step={100}
            min={absoluteMin}
            max={absoluteMax}
            onChange={(values) => {
              setMinPriceSilder(values[0]);
              setMaxPriceSilder(values[1]);
            }}
            renderTrack={({ props, children }) => (
              <div
                ref={props.ref}
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                className="w-full h-2 rounded-full"
                style={{
                  background: getTrackBackground({
                    values,
                    colors: ["#E5E7EB", "#2563EB", "#E5E7EB"],
                    min: absoluteMin,
                    max: absoluteMax,
                  }),
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ index, props }) => {
              const { key, ...rest } = props;
              return (
                <div
                  key={index}
                  {...rest}
                  className="h-5 w-5 rounded-full bg-blue-600 shadow-md border-2 border-white focus:outline-none"
                />
              );
            }}
          />
          <button
            onClick={applyFilters}
            className="border border-gray-300 rounded-md px-4 py-1 text-sm hover:bg-gray-50"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}
