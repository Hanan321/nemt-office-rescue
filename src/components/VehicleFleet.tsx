"use client";

import { useState } from "react";
import type { Vehicle } from "../data/vehicles";
import VehicleCard from "./VehicleCard";

type FleetFilter = "All" | Vehicle["status"];

type VehicleFleetProps = {
  vehicles: Vehicle[];
};

const filters: FleetFilter[] = [
  "All",
  "Ready",
  "In service",
  "Needs attention",
  "Urgent",
  "Out of service",
];

export default function VehicleFleet({ vehicles }: VehicleFleetProps) {
  const [activeFilter, setActiveFilter] = useState<FleetFilter>("All");

  const filteredVehicles =
    activeFilter === "All"
      ? vehicles
      : vehicles.filter((vehicle) => vehicle.status === activeFilter);

  return (
    <div className="space-y-6">
      <div
        aria-label="Filter vehicles by status"
        className="flex flex-wrap gap-2"
        role="tablist"
      >
        {filters.map((filter) => {
          const isActive = activeFilter === filter;

          return (
            <button
              aria-selected={isActive}
              className={`rounded-md border px-3 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isActive
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              role="tab"
              type="button"
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
}
