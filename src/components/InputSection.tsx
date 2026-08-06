import React from 'react';
import type { MonthsCount } from '../types/payroll';

interface InputSectionProps {
  ral: number;
  months: MonthsCount;
  onRalChange: (newRal: number) => void;
  onMonthsChange: (newMonths: MonthsCount) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  ral,
  months,
  onRalChange,
  onMonthsChange,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      onRalChange(0);
    } else {
      onRalChange(Math.max(0, Math.min(val, 500000)));
    }
  };

  const quickRals = [25000, 35000, 45000, 60000, 80000];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
      <div>
        <h2 className="text-base text-slate-900">
          Retribuzione lorda e mensilità
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Inserisci la RAL e seleziona le mensilità previste dal contratto.
        </p>
      </div>

      {/* Input RAL testuale pulito */}
      <div className="space-y-2">
        <label htmlFor="ral-input" className="block text-xs text-slate-600">
          Retribuzione Annua Lorda (RAL)
        </label>

        <div className="relative rounded-lg border border-slate-300 focus-within:border-slate-800">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-slate-400 text-sm">€</span>
          </div>
          <input
            type="number"
            id="ral-input"
            min="0"
            max="500000"
            step="500"
            value={ral || ''}
            onChange={handleInputChange}
            placeholder="35000"
            className="block w-full rounded-lg py-2.5 pl-8 pr-12 text-slate-900 text-base focus:outline-none"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-slate-400 text-xs">/anno</span>
          </div>
        </div>

        {/* Tag per test rapidi, essenziali e minimal */}
        <div className="flex items-center gap-1.5 pt-1 flex-wrap">
          <span className="text-xs text-slate-400">Test rapidi:</span>
          {quickRals.map((quickRal) => (
            <button
              key={quickRal}
              type="button"
              onClick={() => onRalChange(quickRal)}
              className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                ral === quickRal
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {(quickRal / 1000).toFixed(0)}k
            </button>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Selettore 13 / 14 mensilità */}
      <div className="space-y-2">
        <label className="block text-xs text-slate-600">
          Suddivisione mensilità
        </label>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onMonthsChange(13)}
            className={`py-2.5 px-3 rounded-lg border text-sm transition-colors text-center ${
              months === 13
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            13 mensilità
          </button>

          <button
            type="button"
            onClick={() => onMonthsChange(14)}
            className={`py-2.5 px-3 rounded-lg border text-sm transition-colors text-center ${
              months === 14
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            14 mensilità
          </button>
        </div>
      </div>
    </div>
  );
};