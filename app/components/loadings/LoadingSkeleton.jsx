"use client";

export default function LoadingSkeleton({ rows = 5, columns = 6 }) {
  return (
    <div className="animate-pulse space-y-2">
      {[...Array(rows)].map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4">
          {[...Array(columns)].map((_, colIdx) => (
            <div
              key={colIdx}
              className="h-6 flex-1 bg-gray-200 rounded-md"
              style={{ minWidth: "80px" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
