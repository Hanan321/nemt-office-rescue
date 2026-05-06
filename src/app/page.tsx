import VehicleFleet from "../components/VehicleFleet";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950 sm:px-8 lg:px-12">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
            NEMT Office Rescue
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Vehicle Card Demo
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            A local-only first milestone for reviewing fleet details, warnings,
            gas expenses, and maintenance history from fake vehicle data.
          </p>
        </div>

        <VehicleFleet />
      </section>
    </main>
  );
}
