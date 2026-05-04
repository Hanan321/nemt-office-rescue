"use client";

import Image from "next/image";
import { useState } from "react";
import type { Vehicle } from "../data/vehicles";

type VehicleCardProps = {
  vehicle: Vehicle;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const mileageFormatter = new Intl.NumberFormat("en-US");

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

const statusStyles: Record<
  Vehicle["status"],
  {
    card: string;
    body: string;
    frontBadge: string;
    statusBadge: string;
    dot: string;
    image: string;
    warningsPanel: string;
    warningsHeading: string;
    warningsText: string;
  }
> = {
  Ready: {
    card: "border-slate-200",
    body: "bg-white",
    frontBadge: "border-emerald-200 bg-emerald-50 text-emerald-800",
    statusBadge: "bg-emerald-100 text-emerald-800",
    dot: "bg-emerald-500",
    image: "",
    warningsPanel: "border-slate-200 bg-slate-50",
    warningsHeading: "text-slate-950",
    warningsText: "text-slate-600",
  },
  "In service": {
    card: "border-slate-200",
    body: "bg-white",
    frontBadge: "border-blue-200 bg-blue-50 text-blue-800",
    statusBadge: "bg-blue-100 text-blue-800",
    dot: "bg-blue-500",
    image: "",
    warningsPanel: "border-slate-200 bg-slate-50",
    warningsHeading: "text-slate-950",
    warningsText: "text-slate-600",
  },
  "Needs attention": {
    card: "border-amber-300 bg-amber-50/45 shadow-amber-100",
    body: "bg-amber-50/55",
    frontBadge: "border-amber-300 bg-amber-50 text-amber-800",
    statusBadge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-500",
    image: "",
    warningsPanel: "border-amber-200 bg-amber-50",
    warningsHeading: "text-amber-950",
    warningsText: "text-amber-900",
  },
  Urgent: {
    card: "border-red-400 bg-red-50/45 shadow-red-100",
    body: "bg-red-50/55",
    frontBadge: "border-red-300 bg-red-50 text-red-800",
    statusBadge: "bg-red-100 text-red-800",
    dot: "bg-red-500",
    image: "",
    warningsPanel: "border-red-200 bg-red-50",
    warningsHeading: "text-red-950",
    warningsText: "text-red-900",
  },
  "Out of service": {
    card: "border-slate-400 bg-slate-100 shadow-slate-200",
    body: "bg-slate-100",
    frontBadge: "border-slate-500 bg-slate-800 text-white",
    statusBadge: "bg-slate-800 text-white",
    dot: "bg-slate-500",
    image: "opacity-70 brightness-110 saturate-50",
    warningsPanel: "border-slate-300 bg-white",
    warningsHeading: "text-slate-950",
    warningsText: "text-slate-700",
  },
};

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const hasWarnings = vehicle.warnings.length > 0;
  const showFrontBadge = vehicle.status !== "Ready" && vehicle.status !== "In service";
  const styles = statusStyles[vehicle.status];

  // The shell handles click and keyboard flipping while the details sections
  // stop click propagation so they can expand without flipping the card back.
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={`${vehicle.title} card. ${
        isFlipped ? "Click to return to overview." : "Click to view details."
      }`}
      onClick={() => setIsFlipped((current) => !current)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsFlipped((current) => !current);
        }
      }}
      className="group h-[660px] w-full max-w-md cursor-pointer [perspective:1400px] focus:outline-none"
    >
      <span
        className={`relative block h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-focus-visible:[filter:drop-shadow(0_0_0.5rem_rgba(37,99,235,0.45))] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <span
          className={`absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-lg border bg-white text-left shadow-sm [backface-visibility:hidden] ${
            styles.card
          }`}
        >
          <span className="relative block h-80 overflow-hidden bg-slate-100">
            <Image
              src={vehicle.imageUrl}
              alt={`${vehicle.title} vehicle photo`}
              fill
              sizes="(min-width: 1024px) 384px, 100vw"
              className={`object-cover transition duration-500 group-hover:scale-105 ${styles.image}`}
              priority={vehicle.id === "unit-12"}
            />
            {showFrontBadge ? (
              <span
                className={`absolute right-4 top-4 flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${styles.frontBadge}`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
                {vehicle.status}
              </span>
            ) : null}
          </span>

          <span
            className={`flex flex-1 flex-col justify-between p-6 ${styles.body}`}
          >
            <span>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Vehicle overview
              </span>
              <span className="mt-2 block text-2xl font-bold text-slate-950">
                {vehicle.title}
              </span>
              <span className="mt-4 block rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600">
                Click card to view details
              </span>
            </span>

            <span className="grid grid-cols-2 gap-3 text-sm">
              <span className="rounded-md bg-slate-900 px-4 py-3 text-white">
                <span className="block text-xs text-slate-300">Driver</span>
                <span className="mt-1 block font-semibold">
                  {vehicle.assignedDriver}
                </span>
              </span>
              <span className="rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-900">
                <span className="block text-xs text-slate-500">Status</span>
                <span className="mt-1 flex items-center gap-2 font-semibold">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${styles.dot}`}
                    aria-hidden="true"
                  />
                  {vehicle.status}
                </span>
              </span>
            </span>
          </span>
        </span>

        <span
          className={`absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-lg border p-6 text-left shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)] ${styles.card} ${styles.body}`}
        >
          <span className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <span>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Vehicle details
              </span>
              <span className="mt-1 block text-xl font-bold text-slate-950">
                {vehicle.title}
              </span>
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                styles.statusBadge
              }`}
            >
              {vehicle.status}
            </span>
          </span>

          <dl className="mt-4 grid grid-cols-2 gap-3">
            <DetailRow label="VIN" value={vehicle.vin} />
            <DetailRow label="Plate" value={vehicle.plateNumber} />
            <DetailRow
              label="Mileage"
              value={`${mileageFormatter.format(vehicle.mileage)} mi`}
            />
            <DetailRow label="Driver" value={vehicle.assignedDriver} />
            <DetailRow
              label="Insurance"
              value={formatDate(vehicle.insuranceExpiration)}
            />
            <DetailRow
              label="Inspection"
              value={formatDate(vehicle.inspectionExpiration)}
            />
          </dl>

          <section
            className={`mt-4 rounded-md border p-3 ${styles.warningsPanel}`}
          >
            <h3 className={`text-sm font-bold ${styles.warningsHeading}`}>
              Warnings
            </h3>
            {hasWarnings ? (
              <ul className={`mt-2 space-y-1 text-sm ${styles.warningsText}`}>
                {vehicle.warnings.map((warning) => (
                  <li key={warning}>- {warning}</li>
                ))}
              </ul>
            ) : (
              <p className={`mt-2 text-sm ${styles.warningsText}`}>
                No active warnings for this vehicle.
              </p>
            )}
          </section>

          {/* Native details elements keep the demo small while still expandable. */}
          <div
            className="mt-4 space-y-3 overflow-y-auto pr-1"
            onClick={(event) => event.stopPropagation()}
          >
            <details className="rounded-md border border-slate-200 bg-white">
              <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-slate-950">
                Gas expenses
              </summary>
              <div className="border-t border-slate-200 px-4 py-3">
                <ul className="space-y-3">
                  {vehicle.gasExpenses.map((expense) => (
                    <li
                      key={expense.id}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span>
                        <span className="block font-semibold text-slate-900">
                          {formatDate(expense.date)}
                        </span>
                        <span className="block text-slate-500">
                          {expense.gallons.toFixed(1)} gallons
                        </span>
                      </span>
                      <span className="font-bold text-slate-950">
                        {currencyFormatter.format(expense.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>

            <details className="rounded-md border border-slate-200 bg-white">
              <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-slate-950">
                Maintenance history
              </summary>
              <div className="border-t border-slate-200 px-4 py-3">
                <ul className="space-y-3">
                  {vehicle.maintenanceHistory.map((record) => (
                    <li key={record.id} className="text-sm">
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className="block font-semibold text-slate-900">
                            {record.service}
                          </span>
                          <span className="block text-slate-500">
                            {formatDate(record.date)} at {record.vendor}
                          </span>
                        </span>
                        <span className="font-bold text-slate-950">
                          {currencyFormatter.format(record.amount)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>

          <span className="mt-auto block pt-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
            Click card to return
          </span>
        </span>
      </span>
    </div>
  );
}
