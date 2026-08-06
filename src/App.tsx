import { useState, useMemo } from 'react';
import type { MonthsCount } from './types/payroll';
import { calculateSalary } from './domain/payrollCalculator';
import { InputSection } from './components/InputSection';
import { BreakdownCard } from './components/BreakdownCard';
import { AssumptionsDrawer } from './components/AssumptionsDrawer';

export default function App() {
  const [ral, setRal] = useState<number>(35000);
  const [months, setMonths] = useState<MonthsCount>(13);

  const salaryResult = useMemo(() => {
    return calculateSalary({ ral, months });
  }, [ral, months]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Intestazione minimalista senza icone decorative */}
        <header className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl text-slate-900 mt-1">
            Calcolatore Retribuzione Netta
          </h1>
        </header>

        {/* Cassetto informativo trasparente sulle regole usate */}
        <AssumptionsDrawer />

        {/* Layout principale */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 w-full">
            <InputSection
              ral={ral}
              months={months}
              onRalChange={setRal}
              onMonthsChange={setMonths}
            />
          </div>

          <div className="lg:col-span-7 w-full">
            <BreakdownCard result={salaryResult} />
          </div>
        </main>
      </div>
    </div>
  );
}