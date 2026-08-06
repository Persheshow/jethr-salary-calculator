export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Calcolatore Retribuzione Netta
          </h1>
          <p className="text-slate-600 mt-1">
            Proiezione annuale e mensile (Dipendente standard • Milano)
          </p>
        </header>

        {/* Qui inseriremo presto InputSection e BreakdownCard */}
        <main className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm text-slate-400">Sezione Input in arrivo...</p>
          </div>
          <div className="md:col-span-7 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm text-slate-400">Sezione Risultati in arrivo...</p>
          </div>
        </main>
      </div>
    </div>
  );
}