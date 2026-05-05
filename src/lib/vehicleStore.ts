import { vehicles as demoVehicles, type Vehicle } from "../data/vehicles";

const DB_NAME = "nemt-office-rescue";
const DB_VERSION = 1;
const VEHICLE_STORE = "vehicles";

function cloneVehicles(vehicles: Vehicle[]) {
  return structuredClone(vehicles);
}

function openVehicleDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(VEHICLE_STORE)) {
        database.createObjectStore(VEHICLE_STORE, { keyPath: "id" });
      }
    };

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function runStoreRequest<T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>,
) {
  return new Promise<T>((resolve, reject) => {
    openVehicleDatabase()
      .then((database) => {
        const transaction = database.transaction(VEHICLE_STORE, mode);
        const store = transaction.objectStore(VEHICLE_STORE);
        const request = action(store);
        let result: T;

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          result = request.result;
        };
        transaction.oncomplete = () => {
          database.close();
          resolve(result);
        };
        transaction.onerror = () => {
          database.close();
          reject(transaction.error);
        };
      })
      .catch(reject);
  });
}

function saveVehicles(vehicles: Vehicle[]) {
  return new Promise<void>((resolve, reject) => {
    openVehicleDatabase()
      .then((database) => {
        const transaction = database.transaction(VEHICLE_STORE, "readwrite");
        const store = transaction.objectStore(VEHICLE_STORE);

        store.clear();
        vehicles.forEach((vehicle) => store.put(vehicle));

        transaction.oncomplete = () => {
          database.close();
          resolve();
        };
        transaction.onerror = () => {
          database.close();
          reject(transaction.error);
        };
      })
      .catch(reject);
  });
}

function sortVehicles(vehicles: Vehicle[]) {
  return vehicles.sort((a, b) => a.unitNumber.localeCompare(b.unitNumber));
}

export async function getVehicles() {
  const vehicles = await runStoreRequest<Vehicle[]>("readonly", (store) =>
    store.getAll(),
  );

  if (vehicles.length > 0) {
    return sortVehicles(vehicles);
  }

  const seededVehicles = cloneVehicles(demoVehicles);
  await saveVehicles(seededVehicles);
  return sortVehicles(seededVehicles);
}

export async function saveVehicle(vehicle: Vehicle) {
  await runStoreRequest<IDBValidKey>("readwrite", (store) => store.put(vehicle));
  return getVehicles();
}

export async function updateVehicle(vehicleId: string, changes: Partial<Vehicle>) {
  const currentVehicle = await runStoreRequest<Vehicle | undefined>(
    "readonly",
    (store) => store.get(vehicleId),
  );

  if (!currentVehicle) {
    throw new Error(`Vehicle ${vehicleId} was not found.`);
  }

  return saveVehicle({ ...currentVehicle, ...changes, id: vehicleId });
}

export async function archiveVehicle(vehicleId: string, archiveReason?: string) {
  return updateVehicle(vehicleId, {
    archived: true,
    archiveReason: archiveReason?.trim() || "Other",
  });
}

export async function restoreVehicle(vehicleId: string) {
  return updateVehicle(vehicleId, {
    archived: false,
    archiveReason: undefined,
  });
}

export async function resetToDemoData() {
  const seededVehicles = cloneVehicles(demoVehicles);
  await saveVehicles(seededVehicles);
  return sortVehicles(seededVehicles);
}
