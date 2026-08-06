import React, { useState } from 'react';

export const AssumptionsDrawer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
            >
                <div>
                    <span className="text-sm text-slate-800 block">
                        Assunzioni di calcolo e semplificazioni adottate:
                    </span>
                    <span className="text-xs text-slate-500">
                        Impiegato indeterminato - Milano - Anno fiscale corrente.
                    </span>
                </div>
                <span className="text-xs text-slate-500 underline ml-2">
                    {isOpen ? 'nascondi' : 'mostra dettagli'}
                </span>
            </button>

            {isOpen && (
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 space-y-4 text-xs text-slate-600">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                            <span className="text-slate-900 block">Profilo lavoratore</span>
                            <ul className="space-y-1 list-disc list-inside text-slate-600">
                                <li>Contratto dipendente a tempo indeterminato nel settore privato.</li>
                                <li>Residenza e luogo di lavoro: Milano (Lombardia).</li>
                                <li>Nessun carico di famiglia o agevolazione speciale applicata.</li>
                            </ul>
                        </div>

                        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                            <span className="text-slate-900 block">Regole previdenziali e fiscali</span>
                            <ul className="space-y-1 list-disc list-inside text-slate-600">
                                <li>INPS dipendente: Aliquota standard al 9,19% sulla RAL.</li>
                                <li>IRPEF: 3 scaglioni progressivi (23% fino 28k€, 35% fino 50k€, 43% oltre 50k€).</li>
                                <li>Detrazioni lavoro dipendente standard su formula progressiva.</li>
                                <li>Addizionale regionale Lombardia (a scaglioni) e comunale Milano (0,80% sopra 23.000 € di imponibile).</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};