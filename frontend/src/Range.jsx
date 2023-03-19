import React, { useState } from "react";

export const Range = (props) => {
  const { min, max, state, onChange } = props;
  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        step="0.01"
        value={state}
        onChange={onChange}
      />
      <span>{state}</span>
    </div>
  );
};