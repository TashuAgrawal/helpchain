// src/app/components/user-dashboard/BadgeSystem.tsx
import React, { JSX } from "react";
import { UserBadge } from "./types";

// We need to define userBadges here or import it if it's in types.ts
// For this example, I'll move its definition here.
const userBadges: UserBadge[] = [
    {
      id: 1,
      name: "Bronze Supporter",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.392 4.278a1 1 0 00.95.69h4.505c.969 0 1.371 1.24.588 1.81l-3.647 2.64a1 1 0 00-.364 1.118l1.392 4.278c.3.92-.755 1.688-1.538 1.118l-3.647-2.64a1 1 0 00-1.176 0l-3.647 2.64c-.783.57-1.838-.197-1.538-1.118l1.392-4.278a1 1 0 00-.364-1.118L2.623 9.705c-.783-.57-.38-1.81.588-1.81h4.505a1 1 0 00.95-.69l1.392-4.278z"/></svg>,
      threshold: 100,
      description: "Donated at least ₹100",
      colorClass: "text-orange-600 dark:text-orange-400",
    },
    // ... other badges ...
    {
      id: 4,
      name: "Platinum Supporter",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.392 4.278a1 1 0 00.95.69h4.505c.969 0 1.371 1.24.588 1.81l-3.647 2.64a1 1 0 00-.364 1.118l1.392 4.278c.3.92-.755 1.688-1.538 1.118l-3.647-2.64a1 1 0 00-1.176 0l-3.647 2.64c-.783.57-1.838-.197-1.538-1.118l1.392-4.278a1 1 0 00-.364-1.118L2.623 9.705c-.783-.57-.38-1.81.588-1.81h4.505a1 1 0 00.95-.69l1.392-4.278z"/></svg>,
      threshold: 5000,
      description: "Donated ₹5000 or more - Elite Donor!",
      colorClass: "text-purple-600 dark:text-purple-400",
    },
];

export function BadgeSystem({ totalDonated }: { totalDonated: number }) {
  const earnedBadges = userBadges.filter((b) => totalDonated >= b.threshold);
  const highestBadge = earnedBadges.length > 0 ? earnedBadges[earnedBadges.length - 1] : null;
  
  return (
    <div className="mt-3">
      {!highestBadge ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">Donate ₹100 to earn your first badge!</p>
      ) : (
        <div className="flex items-center gap-2" title={highestBadge.description}>
          <div className={`p-1.5 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 ${highestBadge.colorClass} transition-colors duration-300`}>
            {highestBadge.icon}
          </div>
          <span className="text-xs text-gray-700 dark:text-gray-300">
            {highestBadge.name}
          </span>
        </div>
      )}
    </div>
  );
}