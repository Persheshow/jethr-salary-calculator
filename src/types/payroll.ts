/**
 * Numero di mensilità su cui dividere la retribuzione annuale.
 * Standard: 13 mensilità (con opzione per 14 mensilità).
 */
export type MonthsCount = 13 | 14;

/**
 * Input richiesti al calcolatore.
 */
export interface SalaryInput {
    /** Retribuzione Annua Lorda in Euro */
    ral: number;
    /** Numero di mensilità contrattuali */
    months: MonthsCount;
}

/**
 * Dettaglio di una singola voce del cedolino/calcolo fiscale.
 * Utile per renderizzare la tabella delle trattenute in modo dinamico.
 */
export interface PayrollItem {
    /** ID univoco della voce (es. 'inps', 'irpef_netta') */
    id: string;
    /** Nome leggibile per l'interfaccia (es. 'Contributi INPS (9,19%)') */
    label: string;
    /** Valore annuale in Euro */
    yearlyAmount: number;
    /** Valore mensile in Euro (su base `months`) */
    monthlyAmount: number;
    /** Percentuale rispetto alla RAL totale (opzionale per progress bar o grafici) */
    percentageOfRal?: number;
    /** Nota esplicativa per l'utente sulla regola applicata */
    description?: string;
}

/**
 * Risultato completo restituito dal motore di calcolo (`payrollCalculator`).
 */
export interface SalaryResult {
    // --- Metriche di Sintesi ---
    /** RAL di partenza */
    ral: number;
    /** Numero di mensilità considerate */
    months: MonthsCount;
    /** Retribuzione netta annuale effettivamente percepita */
    netYearly: number;
    /** Retribuzione netta per singola mensilità */
    netMonthly: number;
    /** Totale complessivo di tutte le tasse e contributi trattenuti al lordo */
    totalTaxesAndContributions: number;
    /** Percentuale totale di trattenuta rispetto al lordo (pressione fiscale/contributiva media) */
    effectiveTaxRate: number;

    // --- Imponibili e Dettagli Fiscali ---
    /** Imponibile ai fini IRPEF (RAL - Contributi INPS) */
    taxableIrpef: number;
    /** IRPEF lorda prima delle detrazioni */
    grossIrpef: number;
    /** Detrazioni da lavoro dipendente applicate */
    employeeTaxDeductions: number;

    // --- Breakdown Voce per Voce ---
    /** Lista ordinata di tutte le voci di trattenuta da mostrare in UI */
    breakdown: {
        inps: PayrollItem;
        irpef: PayrollItem;
        regionalTax: PayrollItem;
        municipalTax: PayrollItem;
    };
}