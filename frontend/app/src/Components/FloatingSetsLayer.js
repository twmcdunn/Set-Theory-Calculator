import React from "react";
import { useFloatingSets } from "./useFloatingSets"; // adjust path as needed

export default function FloatingSetsLayer({ count = 20 }) {
  const sets = useFloatingSets(count);

  return (
    <div className="floating-sets" aria-hidden="true">
      {sets.map((s, i) => (
        <span key={i} className="floating-set" style={s.style}>
          {s.token}
        </span>
      ))}
    </div>
  );
}
