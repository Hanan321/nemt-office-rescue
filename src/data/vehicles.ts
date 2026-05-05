export type VehicleStatus =
  | "Ready"
  | "In service"
  | "Needs attention"
  | "Urgent"
  | "Out of service";

export type GasExpense = {
  id: string;
  date: string;
  gallons: number;
  amount: number;
  mileageAtFillUp?: number;
  vendor?: string;
  receiptNote?: string;
};

export type MaintenanceRecord = {
  id: string;
  date: string;
  service: string;
  description?: string;
  vendor: string;
  amount: number;
  mileage?: number;
  receiptNote?: string;
};

export type Vehicle = {
  id: string;
  unitNumber: string;
  makeModel: string;
  title: string;
  vin: string;
  plateNumber: string;
  mileage: number;
  assignedDriver: string;
  status: VehicleStatus;
  insuranceExpiration: string;
  inspectionExpiration: string;
  imageUrl: string;
  archived?: boolean;
  archiveReason?: string;
  warnings: string[];
  gasExpenses: GasExpense[];
  maintenanceHistory: MaintenanceRecord[];
};

// Local seed data for the first milestone. Later milestones can swap this
// module for a database-backed source without changing the card component API.
export const vehicles: Vehicle[] = [
  {
    id: "unit-09",
    unitNumber: "09",
    makeModel: "Dodge Grand Caravan",
    title: "Unit 09 - Dodge Grand Caravan",
    vin: "2C4RDGCG7KR612084",
    plateNumber: "NEMT-099",
    mileage: 78412,
    assignedDriver: "Andre Williams",
    status: "In service",
    insuranceExpiration: "2026-10-08",
    inspectionExpiration: "2026-08-28",
    imageUrl: "/vehicles/unit-9.png",
    warnings: [],
    gasExpenses: [
      { id: "gas-09-1", date: "2026-04-15", gallons: 16.8, amount: 60.14 },
      { id: "gas-09-2", date: "2026-04-27", gallons: 15.2, amount: 54.92 },
      { id: "gas-09-3", date: "2026-05-01", gallons: 14.6, amount: 52.36 },
    ],
    maintenanceHistory: [
      {
        id: "maint-09-1",
        date: "2026-03-22",
        service: "Oil change and fluid top-off",
        vendor: "Metro Fleet Care",
        amount: 109.75,
      },
    ],
  },
  {
    id: "unit-10",
    unitNumber: "10",
    makeModel: "Ford Transit Connect",
    title: "Unit 10 - Ford Transit Connect",
    vin: "NM0LS7E72L1462083",
    plateNumber: "NEMT-100",
    mileage: 69835,
    assignedDriver: "Sharon Kim",
    status: "Ready",
    insuranceExpiration: "2026-12-04",
    inspectionExpiration: "2026-11-18",
    imageUrl: "/vehicles/unit-10.png",
    warnings: [],
    gasExpenses: [
      { id: "gas-10-1", date: "2026-04-11", gallons: 13.5, amount: 48.48 },
      { id: "gas-10-2", date: "2026-04-26", gallons: 12.9, amount: 46.12 },
    ],
    maintenanceHistory: [
      {
        id: "maint-10-1",
        date: "2026-04-01",
        service: "Annual safety check",
        vendor: "Northside Auto",
        amount: 136,
      },
    ],
  },
  {
    id: "unit-11",
    unitNumber: "11",
    makeModel: "Chevrolet Express",
    title: "Unit 11 - Chevrolet Express",
    vin: "1GAZGPFG8N1185407",
    plateNumber: "NEMT-111",
    mileage: 103274,
    assignedDriver: "Nadia Coleman",
    status: "Needs attention",
    insuranceExpiration: "2026-07-30",
    inspectionExpiration: "2026-06-15",
    imageUrl: "/vehicles/unit-11.png",
    warnings: ["Front brake pads due for replacement"],
    gasExpenses: [
      { id: "gas-11-1", date: "2026-04-13", gallons: 21.6, amount: 80.35 },
      { id: "gas-11-2", date: "2026-04-28", gallons: 20.4, amount: 75.68 },
    ],
    maintenanceHistory: [
      {
        id: "maint-11-1",
        date: "2026-04-10",
        service: "Brake wear inspection",
        vendor: "Express Tire",
        amount: 89.5,
      },
    ],
  },
  {
    id: "unit-12",
    unitNumber: "12",
    makeModel: "Toyota Sienna",
    title: "Unit 12 - Toyota Sienna",
    vin: "5TDYK3DC8GS742918",
    plateNumber: "NEMT-124",
    mileage: 87420,
    assignedDriver: "Robert Johnson",
    status: "Urgent",
    insuranceExpiration: "2026-08-15",
    inspectionExpiration: "2026-05-20",
    imageUrl: "/vehicles/unit-12.png",
    warnings: [
      "Inspection expires this month",
      "Maintenance receipt missing",
      "Rear wheelchair strap needs supervisor review",
    ],
    gasExpenses: [
      { id: "gas-12-1", date: "2026-04-18", gallons: 13.8, amount: 48.25 },
      { id: "gas-12-2", date: "2026-04-25", gallons: 14.9, amount: 52.1 },
      { id: "gas-12-3", date: "2026-05-02", gallons: 12.6, amount: 44.76 },
    ],
    maintenanceHistory: [
      {
        id: "maint-12-1",
        date: "2026-03-28",
        service: "Oil change and tire rotation",
        vendor: "Metro Fleet Care",
        amount: 126.4,
      },
      {
        id: "maint-12-2",
        date: "2026-04-14",
        service: "Wheelchair lift safety check",
        vendor: "Mobility Van Pros",
        amount: 215,
      },
    ],
  },
  {
    id: "unit-08",
    unitNumber: "08",
    makeModel: "Ford Transit",
    title: "Unit 08 - Ford Transit",
    vin: "1FTBW2CM7JKB11052",
    plateNumber: "NEMT-088",
    mileage: 64215,
    assignedDriver: "Maya Patel",
    status: "Ready",
    insuranceExpiration: "2026-11-02",
    inspectionExpiration: "2026-10-12",
    imageUrl: "/vehicles/unit-08.png",
    warnings: [],
    gasExpenses: [
      { id: "gas-08-1", date: "2026-04-16", gallons: 18.2, amount: 68.98 },
      { id: "gas-08-2", date: "2026-04-29", gallons: 17.5, amount: 66.33 },
    ],
    maintenanceHistory: [
      {
        id: "maint-08-1",
        date: "2026-02-21",
        service: "Brake inspection",
        vendor: "Northside Auto",
        amount: 94.5,
      },
    ],
  },
  {
    id: "unit-13",
    unitNumber: "13",
    makeModel: "Honda Odyssey",
    title: "Unit 13 - Honda Odyssey",
    vin: "5FNRL6H79NB045331",
    plateNumber: "NEMT-133",
    mileage: 92108,
    assignedDriver: "Elena Garcia",
    status: "Needs attention",
    insuranceExpiration: "2026-09-28",
    inspectionExpiration: "2026-07-07",
    imageUrl: "/vehicles/unit-13.png",
    warnings: ["One tire-pressure warning"],
    gasExpenses: [
      { id: "gas-13-1", date: "2026-04-12", gallons: 15.1, amount: 54.12 },
      { id: "gas-13-2", date: "2026-04-30", gallons: 13.4, amount: 47.92 },
    ],
    maintenanceHistory: [
      {
        id: "maint-13-1",
        date: "2026-04-04",
        service: "Tire pressure sensor diagnostic",
        vendor: "Express Tire",
        amount: 72,
      },
    ],
  },
  {
    id: "unit-14",
    unitNumber: "14",
    makeModel: "Honda Odyssey",
    title: "Unit 14 - Honda Odyssey",
    vin: "5FNRL6H82PB031482",
    plateNumber: "NEMT-144",
    mileage: 38590,
    assignedDriver: "Dana Brooks",
    status: "Ready",
    insuranceExpiration: "2026-12-18",
    inspectionExpiration: "2026-09-09",
    imageUrl: "/vehicles/unit-14.png",
    warnings: [],
    gasExpenses: [
      { id: "gas-14-1", date: "2026-04-17", gallons: 14.2, amount: 51.12 },
      { id: "gas-14-2", date: "2026-05-01", gallons: 13.6, amount: 49.23 },
    ],
    maintenanceHistory: [
      {
        id: "maint-14-1",
        date: "2026-03-19",
        service: "Preventive maintenance inspection",
        vendor: "Metro Fleet Care",
        amount: 118,
      },
    ],
  },
  {
    id: "unit-15",
    unitNumber: "15",
    makeModel: "Chrysler Pacifica",
    title: "Unit 15 - Chrysler Pacifica",
    vin: "2C4RC1BG8NR214509",
    plateNumber: "NEMT-155",
    mileage: 52780,
    assignedDriver: "Marcus Lee",
    status: "In service",
    insuranceExpiration: "2026-10-24",
    inspectionExpiration: "2026-08-16",
    imageUrl: "/vehicles/unit-15.png",
    warnings: [],
    gasExpenses: [
      { id: "gas-15-1", date: "2026-04-20", gallons: 15.4, amount: 56.37 },
      { id: "gas-15-2", date: "2026-05-03", gallons: 12.9, amount: 46.94 },
    ],
    maintenanceHistory: [
      {
        id: "maint-15-1",
        date: "2026-04-08",
        service: "Cabin air filter replacement",
        vendor: "Northside Auto",
        amount: 82.25,
      },
    ],
  },
  {
    id: "unit-16",
    unitNumber: "16",
    makeModel: "Toyota Sienna",
    title: "Unit 16 - Toyota Sienna",
    vin: "5TDKRKEC4NS099741",
    plateNumber: "NEMT-166",
    mileage: 44635,
    assignedDriver: "Priya Shah",
    status: "Out of service",
    insuranceExpiration: "2026-09-14",
    inspectionExpiration: "2026-06-22",
    imageUrl: "/vehicles/unit-16.png",
    warnings: ["Wheelchair lift unavailable pending service"],
    gasExpenses: [
      { id: "gas-16-1", date: "2026-04-19", gallons: 13.1, amount: 47.88 },
      { id: "gas-16-2", date: "2026-05-02", gallons: 14.5, amount: 52.64 },
    ],
    maintenanceHistory: [
      {
        id: "maint-16-1",
        date: "2026-03-30",
        service: "Wheelchair lift lubrication",
        vendor: "Mobility Van Pros",
        amount: 164.5,
      },
    ],
  },
  {
    id: "unit-17",
    unitNumber: "17",
    makeModel: "Kia Carnival",
    title: "Unit 17 - Kia Carnival",
    vin: "1FTYE1CM3MKA24873",
    plateNumber: "NEMT-177",
    mileage: 31844,
    assignedDriver: "Calvin Moore",
    status: "Ready",
    insuranceExpiration: "2027-01-11",
    inspectionExpiration: "2026-12-02",
    imageUrl: "/vehicles/unit-17.png",
    warnings: [],
    gasExpenses: [
      { id: "gas-17-1", date: "2026-04-21", gallons: 18.6, amount: 69.15 },
      { id: "gas-17-2", date: "2026-05-03", gallons: 17.9, amount: 66.81 },
    ],
    maintenanceHistory: [
      {
        id: "maint-17-1",
        date: "2026-03-26",
        service: "Tire rotation and alignment check",
        vendor: "Metro Fleet Care",
        amount: 142.2,
      },
    ],
  },
  {
    id: "unit-18",
    unitNumber: "18",
    makeModel: "Ford Transit",
    title: "Unit 18 - Ford Transit",
    vin: "5TDYRKEC7PS118306",
    plateNumber: "NEMT-188",
    mileage: 24190,
    assignedDriver: "Grace Nguyen",
    status: "Urgent",
    insuranceExpiration: "2026-06-09",
    inspectionExpiration: "2026-05-12",
    imageUrl: "/vehicles/unit-18.png",
    warnings: [
      "Inspection expires next week",
      "Passenger-side ramp latch needs service",
    ],
    gasExpenses: [
      { id: "gas-18-1", date: "2026-04-22", gallons: 12.8, amount: 46.59 },
      { id: "gas-18-2", date: "2026-04-30", gallons: 13.7, amount: 49.86 },
    ],
    maintenanceHistory: [
      {
        id: "maint-18-1",
        date: "2026-04-18",
        service: "Ramp latch diagnostic",
        vendor: "Mobility Van Pros",
        amount: 188,
      },
    ],
  },
  {
    id: "unit-19",
    unitNumber: "19",
    makeModel: "Ford E-450 Shuttle Bus",
    title: "Unit 19 - Ford E-450 Shuttle Bus",
    vin: "2C4RC1DG3MR584219",
    plateNumber: "NEMT-199",
    mileage: 56305,
    assignedDriver: "Liam Carter",
    status: "In service",
    insuranceExpiration: "2026-11-21",
    inspectionExpiration: "2026-09-26",
    imageUrl: "/vehicles/unit-19.png",
    warnings: [],
    gasExpenses: [
      { id: "gas-19-1", date: "2026-04-14", gallons: 14.8, amount: 53.87 },
      { id: "gas-19-2", date: "2026-04-29", gallons: 15.6, amount: 56.44 },
      { id: "gas-19-3", date: "2026-05-02", gallons: 13.2, amount: 47.71 },
    ],
    maintenanceHistory: [
      {
        id: "maint-19-1",
        date: "2026-04-06",
        service: "Battery and charging system test",
        vendor: "Northside Auto",
        amount: 64.95,
      },
    ],
  },
];
