"use client";

import { FormEvent, type ReactNode, useEffect, useState } from "react";
import type {
  GasExpense,
  MaintenanceRecord,
  Vehicle,
  VehicleStatus,
} from "../data/vehicles";
import {
  archiveVehicle,
  getVehicles,
  resetToDemoData,
  saveVehicle,
  updateVehicle,
  restoreVehicle,
} from "../lib/vehicleStore";
import VehicleCard from "./VehicleCard";

type FleetFilter = "All" | VehicleStatus;
type EditorMode = "create" | "edit";
type RecordPanel = { type: "gas" | "maintenance"; vehicleId: string } | null;
type VehicleDraft = Pick<
  Vehicle,
  | "id"
  | "unitNumber"
  | "makeModel"
  | "vin"
  | "plateNumber"
  | "mileage"
  | "assignedDriver"
  | "status"
  | "insuranceExpiration"
  | "inspectionExpiration"
  | "imageUrl"
> & {
  warningsText: string;
};

type GasDraft = {
  id: string;
  date: string;
  amount: number;
  gallons: number;
  mileageAtFillUp: number;
  vendor: string;
  receiptNote: string;
};

type MaintenanceDraft = {
  id: string;
  date: string;
  service: string;
  description: string;
  amount: number;
  vendor: string;
  mileage: number;
  receiptNote: string;
};

const statusFilters: VehicleStatus[] = [
  "Ready",
  "In service",
  "Needs attention",
  "Urgent",
  "Out of service",
];

const filters: FleetFilter[] = ["All", ...statusFilters];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const mileageFormatter = new Intl.NumberFormat("en-US");

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function createVehicleDraft(vehicle?: Vehicle): VehicleDraft {
  if (vehicle) {
    return {
      id: vehicle.id,
      unitNumber: vehicle.unitNumber,
      makeModel: vehicle.makeModel,
      vin: vehicle.vin,
      plateNumber: vehicle.plateNumber,
      mileage: vehicle.mileage,
      assignedDriver: vehicle.assignedDriver,
      status: vehicle.status,
      insuranceExpiration: vehicle.insuranceExpiration,
      inspectionExpiration: vehicle.inspectionExpiration,
      imageUrl: vehicle.imageUrl,
      warningsText: vehicle.warnings.join("\n"),
    };
  }

  return {
    id: "",
    unitNumber: "",
    makeModel: "",
    vin: "",
    plateNumber: "",
    mileage: 0,
    assignedDriver: "",
    status: "Ready",
    insuranceExpiration: "",
    inspectionExpiration: "",
    imageUrl: "/vehicles/unit-10.png",
    warningsText: "",
  };
}

function createGasDraft(record?: GasExpense): GasDraft {
  return {
    id: record?.id ?? "",
    date: record?.date ?? todayInputValue(),
    amount: record?.amount ?? 0,
    gallons: record?.gallons ?? 0,
    mileageAtFillUp: record?.mileageAtFillUp ?? 0,
    vendor: record?.vendor ?? "",
    receiptNote: record?.receiptNote ?? "",
  };
}

function buildGasRecord(draft: GasDraft): GasExpense {
  return {
    id: draft.id || `gas-${Date.now()}`,
    date: draft.date,
    amount: Number(draft.amount) || 0,
    gallons: Number(draft.gallons) || 0,
    mileageAtFillUp: Number(draft.mileageAtFillUp) || undefined,
    vendor: draft.vendor.trim() || undefined,
    receiptNote: draft.receiptNote.trim() || undefined,
  };
}

function createMaintenanceDraft(record?: MaintenanceRecord): MaintenanceDraft {
  return {
    id: record?.id ?? "",
    date: record?.date ?? todayInputValue(),
    service: record?.service ?? "",
    description: record?.description ?? "",
    amount: record?.amount ?? 0,
    vendor: record?.vendor ?? "",
    mileage: record?.mileage ?? 0,
    receiptNote: record?.receiptNote ?? "",
  };
}

function buildMaintenanceRecord(draft: MaintenanceDraft): MaintenanceRecord {
  return {
    id: draft.id || `maint-${Date.now()}`,
    date: draft.date,
    service: draft.service.trim(),
    description: draft.description.trim() || undefined,
    amount: Number(draft.amount) || 0,
    vendor: draft.vendor.trim(),
    mileage: Number(draft.mileage) || undefined,
    receiptNote: draft.receiptNote.trim() || undefined,
  };
}

function buildVehicleFromDraft(draft: VehicleDraft, existing?: Vehicle): Vehicle {
  const unitNumber = draft.unitNumber.trim();
  const makeModel = draft.makeModel.trim();

  return {
    id: draft.id.trim(),
    unitNumber,
    makeModel,
    title: `Unit ${unitNumber} - ${makeModel}`,
    vin: draft.vin.trim(),
    plateNumber: draft.plateNumber.trim(),
    mileage: Number(draft.mileage) || 0,
    assignedDriver: draft.assignedDriver.trim(),
    status: draft.status,
    insuranceExpiration: draft.insuranceExpiration,
    inspectionExpiration: draft.inspectionExpiration,
    imageUrl: draft.imageUrl.trim() || "/vehicles/unit-10.png",
    archived: existing?.archived ?? false,
    archiveReason: existing?.archiveReason,
    warnings: draft.warningsText
      .split("\n")
      .map((warning) => warning.trim())
      .filter(Boolean),
    gasExpenses: existing?.gasExpenses ?? [],
    maintenanceHistory: existing?.maintenanceHistory ?? [],
  };
}

function downloadVehicles(vehicles: Vehicle[]) {
  const blob = new Blob([JSON.stringify(vehicles, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "nemt-office-rescue-vehicles.json";
  link.click();
  URL.revokeObjectURL(url);
}

function Modal({
  children,
  title,
  onClose,
}: {
  children: ReactNode;
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/55 px-4 py-8">
      <section className="w-full max-w-4xl rounded-lg bg-white p-5 text-slate-950 shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

export default function VehicleFleet() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeFilter, setActiveFilter] = useState<FleetFilter>("All");
  const [draft, setDraft] = useState<VehicleDraft | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("edit");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showArchivedVehicles, setShowArchivedVehicles] = useState(false);
  const [recordPanel, setRecordPanel] = useState<RecordPanel>(null);
  const [gasDraft, setGasDraft] = useState<GasDraft | null>(null);
  const [maintenanceDraft, setMaintenanceDraft] =
    useState<MaintenanceDraft | null>(null);

  useEffect(() => {
    getVehicles()
      .then(setVehicles)
      .catch(() =>
        setErrorMessage("Vehicle data could not be loaded from this browser."),
      )
      .finally(() => setIsLoading(false));
  }, []);

  const activeVehicles = vehicles.filter((vehicle) => vehicle.archived !== true);
  const archivedVehicles = vehicles.filter((vehicle) => vehicle.archived === true);

  const summaryCards = filters.map((filter) => ({
    filter,
    label: filter === "All" ? "Total vehicles" : filter,
    value:
      filter === "All"
        ? activeVehicles.length
        : activeVehicles.filter((vehicle) => vehicle.status === filter).length,
  }));

  const filteredVehicles =
    activeFilter === "All"
      ? activeVehicles
      : activeVehicles.filter((vehicle) => vehicle.status === activeFilter);
  const recordPanelVehicle = recordPanel
    ? vehicles.find((vehicle) => vehicle.id === recordPanel.vehicleId)
    : undefined;

  function handleDraftChange<Key extends keyof VehicleDraft>(
    key: Key,
    value: VehicleDraft[Key],
  ) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }

  function handleGasDraftChange<Key extends keyof GasDraft>(
    key: Key,
    value: GasDraft[Key],
  ) {
    setGasDraft((current) => (current ? { ...current, [key]: value } : current));
  }

  function handleMaintenanceDraftChange<Key extends keyof MaintenanceDraft>(
    key: Key,
    value: MaintenanceDraft[Key],
  ) {
    setMaintenanceDraft((current) =>
      current ? { ...current, [key]: value } : current,
    );
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft) {
      return;
    }

    const existingVehicle = vehicles.find((vehicle) => vehicle.id === draft.id);
    const nextVehicle = buildVehicleFromDraft(draft, existingVehicle);

    try {
      const nextVehicles =
        editorMode === "create"
          ? await saveVehicle(nextVehicle)
          : await updateVehicle(nextVehicle.id, nextVehicle);

      setVehicles(nextVehicles);
      setDraft(null);
      setEditorMode("edit");
      setErrorMessage("");
    } catch {
      setErrorMessage("Vehicle changes could not be saved.");
    }
  }

  async function handleSaveGasRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!recordPanelVehicle || !gasDraft) {
      return;
    }

    const nextRecord = buildGasRecord(gasDraft);
    const recordExists = recordPanelVehicle.gasExpenses.some(
      (record) => record.id === nextRecord.id,
    );
    const gasExpenses = recordExists
      ? recordPanelVehicle.gasExpenses.map((record) =>
          record.id === nextRecord.id ? nextRecord : record,
        )
      : [...recordPanelVehicle.gasExpenses, nextRecord];

    try {
      const nextVehicles = await updateVehicle(recordPanelVehicle.id, {
        gasExpenses,
      });

      setVehicles(nextVehicles);
      setGasDraft(null);
      setErrorMessage("");
    } catch {
      setErrorMessage("Gas record could not be saved.");
    }
  }

  async function handleSaveMaintenanceRecord(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!recordPanelVehicle || !maintenanceDraft) {
      return;
    }

    const nextRecord = buildMaintenanceRecord(maintenanceDraft);
    const recordExists = recordPanelVehicle.maintenanceHistory.some(
      (record) => record.id === nextRecord.id,
    );
    const maintenanceHistory = recordExists
      ? recordPanelVehicle.maintenanceHistory.map((record) =>
          record.id === nextRecord.id ? nextRecord : record,
        )
      : [...recordPanelVehicle.maintenanceHistory, nextRecord];

    try {
      const nextVehicles = await updateVehicle(recordPanelVehicle.id, {
        maintenanceHistory,
      });

      setVehicles(nextVehicles);
      setMaintenanceDraft(null);
      setErrorMessage("");
    } catch {
      setErrorMessage("Maintenance record could not be saved.");
    }
  }

  async function handleArchive(vehicleId: string) {
    if (
      !window.confirm(
        "Archive this vehicle?\n\nThis will hide the vehicle from the active dashboard, but its records will be kept.",
      )
    ) {
      return;
    }

    const archiveReason =
      window.prompt(
        "Archive reason? Use Sold, Eliminated, Replaced, or Other.",
        "Other",
      ) || "Other";

    try {
      const nextVehicles = await archiveVehicle(vehicleId, archiveReason);

      setVehicles(nextVehicles);
      setDraft((current) => (current?.id === vehicleId ? null : current));
      setErrorMessage("");
    } catch {
      setErrorMessage("Vehicle could not be archived.");
    }
  }

  async function handleRestore(vehicleId: string) {
    try {
      const nextVehicles = await restoreVehicle(vehicleId);

      setVehicles(nextVehicles);
      setErrorMessage("");
    } catch {
      setErrorMessage("Vehicle could not be restored.");
    }
  }

  async function handleReset() {
    if (
      !window.confirm(
        "Reset local demo data?\n\nThis will replace the current local browser data with the original demo data. Export JSON first if you want to keep a copy of current records.",
      )
    ) {
      return;
    }

    try {
      const nextVehicles = await resetToDemoData();

      setVehicles(nextVehicles);
      setDraft(null);
      setErrorMessage("");
    } catch {
      setErrorMessage("Demo vehicle data could not be restored.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Fleet records
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Add vehicles and review active fleet status, warnings, gas
              expenses, and maintenance notes.
            </p>
            {errorMessage ? (
              <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
                {errorMessage}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-md bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              onClick={() => {
                setDraft(createVehicleDraft());
                setEditorMode("create");
              }}
              type="button"
            >
              Add vehicle
            </button>
          </div>
        </div>

      </section>

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

      {isLoading ? (
        <p className="rounded-lg border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600">
          Loading vehicle records from this browser...
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              onArchive={handleArchive}
              onEdit={(vehicle) => {
                setDraft(createVehicleDraft(vehicle));
                setEditorMode("edit");
              }}
              onViewGasRecords={(vehicle) => {
                setRecordPanel({ type: "gas", vehicleId: vehicle.id });
                setGasDraft(null);
              }}
              onViewMaintenanceRecords={(vehicle) => {
                setRecordPanel({ type: "maintenance", vehicleId: vehicle.id });
                setMaintenanceDraft(null);
              }}
              vehicle={vehicle}
            />
          ))}
        </div>
      )}

      <section className="border-t border-slate-200 pt-6">
        <button
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          onClick={() => setShowArchivedVehicles((current) => !current)}
          type="button"
        >
          {showArchivedVehicles
            ? "Hide archived vehicles"
            : "View archived vehicles"}
        </button>

        {showArchivedVehicles ? (
          <div className="mt-5 rounded-lg border border-slate-300 bg-slate-50 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Archived Vehicles
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Vehicles removed from the active fleet but kept for records.
                </p>
              </div>
              <p className="text-sm font-bold text-slate-700">
                Archived vehicles: {archivedVehicles.length}
              </p>
            </div>

            {archivedVehicles.length > 0 ? (
              <div className="mt-5 grid gap-6 lg:grid-cols-3">
                {archivedVehicles.map((vehicle) => (
                  <VehicleCard
                    isArchived
                    key={vehicle.id}
                    onRestore={handleRestore}
                    vehicle={vehicle}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600">
                No archived vehicles yet.
              </p>
            )}
          </div>
        ) : null}

        <details className="mt-5 rounded-md border border-slate-200 bg-white/70 px-4 py-3">
          <summary className="cursor-pointer text-sm font-bold text-slate-600">
            Admin tools
          </summary>
          <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-200 pt-4">
            <button
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              onClick={() => downloadVehicles(vehicles)}
              type="button"
            >
              Export JSON
            </button>
            <button
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              onClick={handleReset}
              type="button"
            >
              Reset local demo data
            </button>
          </div>
        </details>
      </section>

      {draft ? (
        <Modal
          onClose={() => setDraft(null)}
          title={editorMode === "create" ? "Add Vehicle" : "Edit Vehicle"}
        >
          <form className="mt-5" onSubmit={handleSave}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <label className="text-sm font-semibold text-slate-700">
                Record ID
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                  disabled={editorMode === "edit"}
                  onChange={(event) =>
                    handleDraftChange("id", event.target.value)
                  }
                  required
                  value={draft.id}
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Unit number
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                  onChange={(event) =>
                    handleDraftChange("unitNumber", event.target.value)
                  }
                  required
                  value={draft.unitNumber}
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Make and model
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                  onChange={(event) =>
                    handleDraftChange("makeModel", event.target.value)
                  }
                  required
                  value={draft.makeModel}
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Status
                <select
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                  onChange={(event) =>
                    handleDraftChange("status", event.target.value as VehicleStatus)
                  }
                  value={draft.status}
                >
                  {statusFilters.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-700">
                VIN
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                  onChange={(event) => handleDraftChange("vin", event.target.value)}
                  required
                  value={draft.vin}
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Plate
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                  onChange={(event) =>
                    handleDraftChange("plateNumber", event.target.value)
                  }
                  required
                  value={draft.plateNumber}
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Mileage
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                  min={0}
                  onChange={(event) =>
                    handleDraftChange("mileage", Number(event.target.value))
                  }
                  required
                  type="number"
                  value={draft.mileage}
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Driver
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                  onChange={(event) =>
                    handleDraftChange("assignedDriver", event.target.value)
                  }
                  required
                  value={draft.assignedDriver}
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Insurance expiration
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                  onChange={(event) =>
                    handleDraftChange("insuranceExpiration", event.target.value)
                  }
                  required
                  type="date"
                  value={draft.insuranceExpiration}
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Inspection expiration
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                  onChange={(event) =>
                    handleDraftChange("inspectionExpiration", event.target.value)
                  }
                  required
                  type="date"
                  value={draft.inspectionExpiration}
                />
              </label>
              <label className="text-sm font-semibold text-slate-700 lg:col-span-2">
                Image URL
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                  onChange={(event) =>
                    handleDraftChange("imageUrl", event.target.value)
                  }
                  required
                  value={draft.imageUrl}
                />
              </label>
              <label className="text-sm font-semibold text-slate-700 md:col-span-2 lg:col-span-4">
                Warnings
                <textarea
                  className="mt-1 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                  onChange={(event) =>
                    handleDraftChange("warningsText", event.target.value)
                  }
                  placeholder="One warning per line"
                  value={draft.warningsText}
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                onClick={() => setDraft(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                type="submit"
              >
                Save vehicle
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {recordPanel?.type === "gas" && recordPanelVehicle ? (
        <Modal
          onClose={() => {
            setRecordPanel(null);
            setGasDraft(null);
          }}
          title={`${recordPanelVehicle.title} Gas Records`}
        >
          <div className="mt-5 flex justify-between gap-4">
            <p className="text-sm text-slate-600">
              Full fuel history for this vehicle.
            </p>
            <button
              className="rounded-md bg-blue-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              onClick={() => setGasDraft(createGasDraft())}
              type="button"
            >
              Add gas record
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {recordPanelVehicle.gasExpenses.map((record) => (
              <div
                className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3"
                key={record.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-950">{record.date}</p>
                    <p className="text-sm text-slate-600">
                      {record.gallons.toFixed(1)} gal
                      {record.vendor ? ` at ${record.vendor}` : ""}
                      {record.mileageAtFillUp
                        ? ` - ${mileageFormatter.format(record.mileageAtFillUp)} mi`
                        : ""}
                    </p>
                    {record.receiptNote ? (
                      <p className="mt-1 text-sm text-slate-500">
                        {record.receiptNote}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-950">
                      {currencyFormatter.format(record.amount)}
                    </p>
                    <button
                      className="mt-2 text-sm font-bold text-blue-700 hover:text-blue-900"
                      onClick={() => setGasDraft(createGasDraft(record))}
                      type="button"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {gasDraft ? (
            <form
              className="mt-5 rounded-md border border-slate-200 bg-white p-4"
              onSubmit={handleSaveGasRecord}
            >
              <h3 className="text-base font-bold text-slate-950">
                {gasDraft.id ? "Edit gas record" : "Add gas record"}
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="text-sm font-semibold text-slate-700">
                  Date
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    onChange={(event) =>
                      handleGasDraftChange("date", event.target.value)
                    }
                    required
                    type="date"
                    value={gasDraft.date}
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Amount paid
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    min={0}
                    onChange={(event) =>
                      handleGasDraftChange("amount", Number(event.target.value))
                    }
                    required
                    step="0.01"
                    type="number"
                    value={gasDraft.amount}
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Gallons
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    min={0}
                    onChange={(event) =>
                      handleGasDraftChange("gallons", Number(event.target.value))
                    }
                    required
                    step="0.1"
                    type="number"
                    value={gasDraft.gallons}
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Mileage at fill-up
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    min={0}
                    onChange={(event) =>
                      handleGasDraftChange(
                        "mileageAtFillUp",
                        Number(event.target.value),
                      )
                    }
                    type="number"
                    value={gasDraft.mileageAtFillUp}
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                  Gas station/vendor
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    onChange={(event) =>
                      handleGasDraftChange("vendor", event.target.value)
                    }
                    value={gasDraft.vendor}
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700 md:col-span-3">
                  Receipt note
                  <textarea
                    className="mt-1 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2"
                    onChange={(event) =>
                      handleGasDraftChange("receiptNote", event.target.value)
                    }
                    value={gasDraft.receiptNote}
                  />
                </label>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700"
                  onClick={() => setGasDraft(null)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white"
                  type="submit"
                >
                  Save gas record
                </button>
              </div>
            </form>
          ) : null}
        </Modal>
      ) : null}

      {recordPanel?.type === "maintenance" && recordPanelVehicle ? (
        <Modal
          onClose={() => {
            setRecordPanel(null);
            setMaintenanceDraft(null);
          }}
          title={`${recordPanelVehicle.title} Maintenance Records`}
        >
          <div className="mt-5 flex justify-between gap-4">
            <p className="text-sm text-slate-600">
              Full service and repair history for this vehicle.
            </p>
            <button
              className="rounded-md bg-blue-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              onClick={() => setMaintenanceDraft(createMaintenanceDraft())}
              type="button"
            >
              Add maintenance record
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {recordPanelVehicle.maintenanceHistory.map((record) => (
              <div
                className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3"
                key={record.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-950">{record.service}</p>
                    <p className="text-sm text-slate-600">
                      {record.date} at {record.vendor}
                      {record.mileage
                        ? ` - ${mileageFormatter.format(record.mileage)} mi`
                        : ""}
                    </p>
                    {record.description ? (
                      <p className="mt-1 text-sm text-slate-600">
                        {record.description}
                      </p>
                    ) : null}
                    {record.receiptNote ? (
                      <p className="mt-1 text-sm text-slate-500">
                        {record.receiptNote}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-950">
                      {currencyFormatter.format(record.amount)}
                    </p>
                    <button
                      className="mt-2 text-sm font-bold text-blue-700 hover:text-blue-900"
                      onClick={() =>
                        setMaintenanceDraft(createMaintenanceDraft(record))
                      }
                      type="button"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {maintenanceDraft ? (
            <form
              className="mt-5 rounded-md border border-slate-200 bg-white p-4"
              onSubmit={handleSaveMaintenanceRecord}
            >
              <h3 className="text-base font-bold text-slate-950">
                {maintenanceDraft.id
                  ? "Edit maintenance record"
                  : "Add maintenance record"}
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="text-sm font-semibold text-slate-700">
                  Date
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    onChange={(event) =>
                      handleMaintenanceDraftChange("date", event.target.value)
                    }
                    required
                    type="date"
                    value={maintenanceDraft.date}
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Service type
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    onChange={(event) =>
                      handleMaintenanceDraftChange("service", event.target.value)
                    }
                    required
                    value={maintenanceDraft.service}
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Amount
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    min={0}
                    onChange={(event) =>
                      handleMaintenanceDraftChange(
                        "amount",
                        Number(event.target.value),
                      )
                    }
                    required
                    step="0.01"
                    type="number"
                    value={maintenanceDraft.amount}
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Vendor/mechanic
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    onChange={(event) =>
                      handleMaintenanceDraftChange("vendor", event.target.value)
                    }
                    required
                    value={maintenanceDraft.vendor}
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Mileage
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    min={0}
                    onChange={(event) =>
                      handleMaintenanceDraftChange(
                        "mileage",
                        Number(event.target.value),
                      )
                    }
                    type="number"
                    value={maintenanceDraft.mileage}
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700 md:col-span-3">
                  Description
                  <textarea
                    className="mt-1 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2"
                    onChange={(event) =>
                      handleMaintenanceDraftChange(
                        "description",
                        event.target.value,
                      )
                    }
                    value={maintenanceDraft.description}
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700 md:col-span-3">
                  Receipt note
                  <textarea
                    className="mt-1 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2"
                    onChange={(event) =>
                      handleMaintenanceDraftChange(
                        "receiptNote",
                        event.target.value,
                      )
                    }
                    value={maintenanceDraft.receiptNote}
                  />
                </label>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700"
                  onClick={() => setMaintenanceDraft(null)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white"
                  type="submit"
                >
                  Save maintenance record
                </button>
              </div>
            </form>
          ) : null}
        </Modal>
      ) : null}
    </div>
  );
}
