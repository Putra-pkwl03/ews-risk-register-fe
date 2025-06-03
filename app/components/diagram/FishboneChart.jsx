"use client";
import React, { useRef, useState } from "react";

export default function FishboneMindmap({ causes, riskName }) {

const [scale, setScale] = useState(1);

function zoomIn() {
          setScale((prev) => Math.min(prev + 0.1, 3)); // maksimal 3x
}

function zoomOut() {
          setScale((prev) => Math.max(prev - 0.1, 0.3)); // minimal 0.3x
}

  const baseWidth = 650;
  const baseHeight = 400;

  const subSpacingX = 180;
  const maxSubCount = Math.max(
    ...causes.map((c) => c.sub_causes?.length || 0),
    1
  );

  const causeSpacingX = Math.max(300, maxSubCount * subSpacingX + 5);
  const maxCauseCount = causes.length || 1;

  const width = Math.max(baseWidth, (maxCauseCount - 1) * causeSpacingX + 300);
  const height = baseHeight + maxSubCount * 80;

  const rootX = width / 2;
  const rootY = 50;
  const childY = 180;

  const maxBoxWidth = 160;
  const minBoxHeight = 40;
  const lineHeight = 16;

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  function handleMouseDown(e) {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }

  function handleMouseMove(e) {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  }

  function handleMouseUp() {
    isDragging.current = false;
  }

  function getWrappedLines(text, maxCharsPerLine = 20) {
    const words = text.split(" ");
    let lines = [];
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
        currentLine = (currentLine + " " + word).trim();
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  function getBoxHeight(lines) {
    return Math.max(minBoxHeight, lines.length * lineHeight + 16);
  }

          return (
            <div
              style={{
                width: "100%",
                height: "600px",
                border: "1px solid #ccc",
                overflow: "hidden",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 24,
                  right: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  zIndex: 10,
                }}
              >
                <button
                  onClick={zoomIn}
                  style={{
                    width: 40,
                    height: 40,
                    fontSize: 24,
                    borderRadius: 8,
                    backgroundColor: "#16a34a",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
                <button
                  onClick={zoomOut}
                  style={{
                    width: 40,
                    height: 40,
                    fontSize: 24,
                    borderRadius: 8,
                    backgroundColor: "#dc2626",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  -
                </button>
              </div>

              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${width} ${height}`}
                style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
              >
                <g
                  transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}
                >
                  {/* Root Node */}
                  <rect
                    x={rootX - maxBoxWidth / 2}
                    y={rootY - 20}
                    width={maxBoxWidth}
                    height={minBoxHeight}
                    fill="#f97316"
                    rx={10}
                    ry={10}
                  />
                  <text
                    x={rootX}
                    y={rootY + 7}
                    textAnchor="middle"
                    fill="white"
                    fontSize="16"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {riskName || "Problem"}
                  </text>

                  {/* Causes dan sub-causes */}
                  {causes.map((cause, i) => {
                    const x =
                      rootX -
                      ((maxCauseCount - 1) * causeSpacingX) / 2 +
                      i * causeSpacingX;
                    const y = childY;

                    const causeText = `${capitalize(cause.category)}: ${
                      cause.main_cause
                    }`;
                    const causeLines = getWrappedLines(causeText);
                    const causeBoxHeight = getBoxHeight(causeLines);

                    const subCount = cause.sub_causes?.length || 0;
                    const totalSubWidth =
                      subCount > 0 ? (subCount - 1) * subSpacingX : 0;
                    const subStartX = x - totalSubWidth / 2;
                    const subY = y + causeBoxHeight / 2 + 80;

                    return (
                      <g key={i}>
                        <line
                          x1={rootX}
                          y1={rootY + minBoxHeight / 2}
                          x2={x}
                          y2={y - causeBoxHeight / 2}
                          stroke="#999"
                          strokeWidth={2}
                        />
                        <rect
                          x={x - maxBoxWidth / 2}
                          y={y - causeBoxHeight / 2}
                          width={maxBoxWidth}
                          height={causeBoxHeight}
                          fill="#facc15"
                          rx={8}
                          ry={8}
                        />
                        {causeLines.map((line, idx) => (
                          <text
                            key={idx}
                            x={x}
                            y={y - causeBoxHeight / 2 + 20 + idx * lineHeight}
                            textAnchor="middle"
                            fill="#92400e"
                            fontSize="14"
                            pointerEvents="none"
                          >
                            {line}
                          </text>
                        ))}

                        {/* Garis vertikal dan horizontal ke sub-causes */}
                        {subCount > 0 && (
                          <>
                            <line
                              x1={x}
                              y1={y + causeBoxHeight / 2}
                              x2={x}
                              y2={subY - 20}
                              stroke="#999"
                              strokeWidth={2}
                            />
                            <line
                              x1={subStartX}
                              y1={subY - 20}
                              x2={subStartX + totalSubWidth}
                              y2={subY - 20}
                              stroke="#999"
                              strokeWidth={2}
                            />
                          </>
                        )}

                        {/* Sub-causes */}
                        {cause.sub_causes?.map((sub, subIndex) => {
                          const subX = subStartX + subIndex * subSpacingX;
                          const subLines = getWrappedLines(sub.sub_cause);
                          const subBoxHeight = getBoxHeight(subLines);

                          const pathD = `
                    M ${x} ${y + causeBoxHeight / 2}
                    L ${subX} ${y + causeBoxHeight / 2}
                    L ${subX} ${subY - subBoxHeight / 2}
                  `;

                          return (
                            <g key={subIndex}>
                              <path
                                d={pathD}
                                stroke="#999"
                                strokeWidth={1.5}
                                fill="none"
                              />
                              <rect
                                x={subX - maxBoxWidth / 2}
                                y={subY - subBoxHeight / 2}
                                width={maxBoxWidth}
                                height={subBoxHeight}
                                fill="#2563eb"
                                rx={6}
                                ry={6}
                              />
                              {subLines.map((line, idx) => (
                                <text
                                  key={idx}
                                  x={subX}
                                  y={
                                    subY -
                                    subBoxHeight / 2 +
                                    20 +
                                    idx * lineHeight
                                  }
                                  textAnchor="middle"
                                  fill="white"
                                  fontSize="12"
                                  pointerEvents="none"
                                >
                                  {line}
                                </text>
                              ))}
                            </g>
                          );
                        })}
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
