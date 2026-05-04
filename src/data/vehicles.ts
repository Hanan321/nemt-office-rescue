export const vehicles = [
  {
    id: "1",
    unitNumber: "12",
    title: "Unit 12 – Toyota Sienna",
    vin: "5TDXZ3DC1LS123456",
    plate: "ABC-1234",
    status: "Attention",
    imageUrl: "/vehicles/unit-12.jpg",
    assignedDriver: "Robert Johnson",
    mileage: 87654,
    insuranceExpiration: "2026-08-15",
    inspectionExpiration: "2026-05-20",
    warnings: [
      "Inspection expires soon",
      "Maintenance receipt missing for April"
    ],
    gasExpenses: [
      { date: "2026-05-01", amount: 48.25 },
      { date: "2026-05-08", amount: 52.10 }
    ],
    maintenanceHistory: [
      { date: "2026-04-12", service: "Oil change", amount: 89.99 }
    ]
  }
];