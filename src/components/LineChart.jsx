import React from "react";
import { Box } from "@mui/material";

export default function LineChart({ data = [], width = 600, height = 180, strokeWidth = 2 }) {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height }}>
        No data
      </Box>
    );
  }

 
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.1 || max * 0.05 || 1;
  const yMin = min - padding;
  const yMax = max + padding;

  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = ((yMax - d.value) / (yMax - yMin)) * height;
    return `${x},${y}`;
  });
  const polylinePoints = points.join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
      <polyline
        fill="none"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        points={polylinePoints}
      />
      {points.map((pt, i) => {
        const [x, y] = pt.split(",");
        return <circle key={i} cx={x} cy={y} r={1.5} fill="currentColor" />;
      })}
    </svg>
  );
}
