import React, { useState } from 'react';
import type { SalaryResult } from '../types/payroll';

interface BreakdownCardProps {
    result: SalaryResult;
}

export const BreakdownCard: React.FC<BreakdownCardProps> = ({ result }) => {
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    const { breakdown } = result;

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Box principale nero ardesia, pulito, zero gradienti */}
            <div className="bg-slate-900 text-white p-6">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Stima Netto Mensile</span>
                    <span>{result.months} mensilità</span>
                </div>

                <div className="flex items-baseline gap-2">
                    <span className="text-4xl tracking-tight text-white">
                        {formatCurrency(result.netMonthly)}
                    </span>
                    <span className="text-slate-400 text-sm">/ mese</span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div>
                        <span className="text-slate-400">Netto Annuale: </span>
                        <span className="text-white">
                            {formatCurrency(result.netYearly)}
                        </span>
                    </div>
                    <div>
                        <span className="text-slate-400">Pressione trattenute: </span>
                        <span className="text-slate-300">
                            {result.effectiveTaxRate}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Barra lineare di composizione del lordo */}
            <div className="px-6 pt-5">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                        <span>Composizione RAL ({formatCurrency(result.ral)})</span>
                    </div>

                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        <div
                            style={{
                                width: `${Math.max(0, 100 - result.effectiveTaxRate)}%`,
                            }}
                            className="bg-slate-900 h-full"
                            title="Netto percepito"
                        />
                        <div
                            style={{ width: `${breakdown.inps.percentageOfRal || 0}%` }}
                            className="bg-slate-500 h-full"
                            title="INPS"
                        />
                        <div
                            style={{ width: `${breakdown.irpef.percentageOfRal || 0}%` }}
                            className="bg-slate-400 h-full"
                            title="IRPEF"
                        />
                        <div
                            style={{
                                width: `${(breakdown.regionalTax.percentageOfRal || 0) +
                                    (breakdown.municipalTax.percentageOfRal || 0)
                                    }%`,
                            }}
                            className="bg-slate-300 h-full"
                            title="Addizionali Territoriali"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-slate-900 inline-block" />
                            Netto
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-slate-500 inline-block" />
                            INPS
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                            IRPEF
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
                            Addizionali Territoriali
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabella analitica trattenute al lordo */}
            <div className="p-6 space-y-3">
                <h3 className="text-xs text-slate-400 uppercase tracking-wider">
                    Dettaglio trattenute annue al lordo
                </h3>

                <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                    {Object.values(breakdown).map((item) => (
                        <div
                            key={item.id}
                            className="py-3 flex items-start justify-between gap-4 text-sm"
                        >
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2 text-slate-800">
                                    <span>{item.label}</span>
                                    {item.description && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveTooltip(
                                                    activeTooltip === item.id ? null : item.id
                                                )
                                            }
                                            className="text-xs text-slate-400 hover:text-slate-900 underline focus:outline-none"
                                        >
                                            dettaglio
                                        </button>
                                    )}
                                </div>

                                {activeTooltip === item.id && item.description && (
                                    <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-200 max-w-sm mt-1">
                                        {item.description}
                                    </p>
                                )}
                            </div>

                            <div className="text-right whitespace-nowrap">
                                <div className="text-slate-900">
                                    - {formatCurrency(item.yearlyAmount)}
                                </div>
                                <div className="text-xs text-slate-400">
                                    (- {formatCurrency(item.monthlyAmount)} / mese)
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Totale imposte */}
                <div className="bg-slate-50 rounded-lg p-3.5 flex items-center justify-between text-sm">
                    <span className="text-slate-600">
                        Totale Tasse e Contributi
                    </span>
                    <span className="text-slate-900">
                        - {formatCurrency(result.totalTaxesAndContributions)}
                    </span>
                </div>
            </div>
        </div>
    );
};