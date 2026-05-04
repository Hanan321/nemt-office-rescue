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

  const summaryCards = filters.map((filter) => ({
    filter,
    label: filter === "All" ? "Total vehicles" : filter,
    value:
      filter === "All"
        ? vehicles.length
        : vehicles.filter((vehicle) => vehicle.status === filter).length,
  }));

  const filteredVehicles =
    activeFilter === "All"
      ? vehicles
      : vehicles.filter((vehicle) => vehicle.status === activeFilter);

  return (
    <div className="space-y-6">
      <section
        aria-label="Filter vehicles by fleet summary"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6"
      >
        {summaryCards.map((card) => {
          const isActive = activeFilter === card.filter;

          return (
            <button
              aria-label={`Show ${card.label.toLowerCase()} vehicles`}
              aria-pressed={isActive}
              className={`cursor-pointer rounded-lg border px-4 py-3 text-left shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isActive
                  ? "border-slate-950 bg-slate-950 text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-950 hover:border-slate-300 hover:bg-slate-50"
              }`}
              key={card.label}
              onClick={() => setActiveFilter(card.filter)}
              type="button"
            >
              <span
                className={`block text-xs font-semibold uppercase tracking-wide ${
                  isActive ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {card.label}
              </span>
              <span className="mt-2 block text-2xl font-bold">
                {card.value}
              </span>
            </button>
          );
        })}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
}
