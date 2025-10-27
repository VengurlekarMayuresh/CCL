import { useState } from "react";
import { StarIcon } from "lucide-react";

export default function StarRating({ rating = 0, handleRating, size = 22 }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hovered || rating);
        return (
          <StarIcon
            key={star}
            size={size}
            onClick={() => handleRating?.(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className={`cursor-pointer transition-transform duration-150 ${
              isFilled
                ? "fill-yellow-400 stroke-yellow-400"
                : "fill-gray-200 stroke-gray-400"
            } hover:scale-110`}
          />
        );
      })}
    </div>
  );
}
