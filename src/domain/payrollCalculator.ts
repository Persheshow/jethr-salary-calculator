import type { SalaryInput, SalaryResult, PayrollItem } from '../types/payroll';

/**
 * Aliquota contributiva INPS standard per il dipendente privato.
 * Semplificazione: Assumiamo 9,19% fisso per tutta la RAL, escludendo
 * massimali temporanei o decontribuzioni straordinarie.
 */
const INPS_RATE = 0.0919;

/**
 * Calcola l'IRPEF Lorda sulla base della riforma a 3 scaglioni.
 * - Fino a 28.000 €: 23%
 * - Da 28.001 € a 50.000 €: 35%
 * - Oltre 50.000 €: 43%
 */
function calculateGrossIrpef(taxableIncome: number): number {
    if (taxableIncome <= 0) return 0;

    if (taxableIncome <= 28000) {
        return taxableIncome * 0.23;
    }

    const firstBracketTax = 28000 * 0.23; // 6.440 €

    if (taxableIncome <= 50000) {
        return firstBracketTax + (taxableIncome - 28000) * 0.35;
    }

    const secondBracketTax = (50000 - 28000) * 0.35; // 7.700 €
    return firstBracketTax + secondBracketTax + (taxableIncome - 50000) * 0.43;
}

/**
 * Calcola la detrazione per lavoro dipendente in base all'imponibile IRPEF.
 * Formule standard decrescenti con imponibile sino a 50.000 €.
 */
function calculateEmployeeDeductions(taxableIncome: number): number {
    if (taxableIncome <= 0 || taxableIncome > 50000) return 0;

    if (taxableIncome <= 15000) {
        // Fino a 15.000 €, detrazione fissa minima garanzia di 690€, standard 1955€
        return 1955;
    }

    if (taxableIncome <= 28000) {
        // Tra 15.001 € e 28.000 €
        const deduction =
            1910 + 1190 * ((28000 - taxableIncome) / (28000 - 15000));
        return Math.max(0, deduction);
    }

    // Tra 28.001 € e 50.000 €
    const deduction = 1910 * ((50000 - taxableIncome) / (50000 - 28000));
    return Math.max(0, deduction);
}

/**
 * Calcola l'addizionale regionale della Lombardia a scaglioni progressivi.
 * - Fino a 15.000 €: 1,23%
 * - Da 15.001 € a 28.000 €: 1,58%
 * - Da 28.001 € a 50.000 €: 1,72%
 * - Oltre 50.000 €: 1,73%
 */
function calculateRegionalTaxLombardia(taxableIncome: number): number {
    if (taxableIncome <= 0) return 0;

    let tax = 0;

    // Scaglione 1: Fino a 15.000 €
    const s1 = Math.min(taxableIncome, 15000);
    tax += s1 * 0.0123;
    if (taxableIncome <= 15000) return tax;

    // Scaglione 2: 15.001 - 28.000 €
    const s2 = Math.min(taxableIncome, 28000) - 15000;
    tax += s2 * 0.0158;
    if (taxableIncome <= 28000) return tax;

    // Scaglione 3: 28.001 - 50.000 €
    const s3 = Math.min(taxableIncome, 50000) - 28000;
    tax += s3 * 0.0172;
    if (taxableIncome <= 50000) return tax;

    // Scaglione 4: Oltre 50.000 €
    const s4 = taxableIncome - 50000;
    tax += s4 * 0.0173;

    return tax;
}

/**
 * Calcola l'addizionale comunale per il Comune di Milano.
 * Regola: Esenzione totale se l'imponibile IRPEF <= 23.000 €.
 * Se l'imponibile supera i 23.000 €, si applica l'aliquota unica dello 0,80%
 * sull'intero reddito imponibile.
 */
function calculateMunicipalTaxMilano(taxableIncome: number): number {
    if (taxableIncome <= 23000) return 0;
    return taxableIncome * 0.008;
}

/**
 * Utility interna per arrotondare ai 2 decimali in modo pulito ed evitare
 * imprecisioni di floating point su JS.
 */
function roundCurrency(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Funzione principale che esegue l'intera proiezione retributiva.
 * 
 * @param input - Oggetto contenente RAL e numero di mensilità (13 o 14)
 * @returns Oggetto `SalaryResult` completo di tutte le voci annue e mensili
 */
export function calculateSalary({ ral, months }: SalaryInput): SalaryResult {
    const cleanRal = Math.max(0, ral);

    // 1. INPS (Contributi previdenziali dipendente)
    const yearlyInps = roundCurrency(cleanRal * INPS_RATE);

    // 2. Imponibile IRPEF
    const taxableIrpef = roundCurrency(Math.max(0, cleanRal - yearlyInps));

    // 3. IRPEF Lorda e Detrazioni lavoro dipendente
    const grossIrpef = roundCurrency(calculateGrossIrpef(taxableIrpef));
    const deductions = roundCurrency(calculateEmployeeDeductions(taxableIrpef));

    // 4. IRPEF Netta (non può essere inferiore a 0)
    const yearlyIrpef = roundCurrency(Math.max(0, grossIrpef - deductions));

    // 5. Addizionali territoriali (Lombardia + Milano)
    const yearlyRegionalTax = roundCurrency(calculateRegionalTaxLombardia(taxableIrpef));
    const yearlyMunicipalTax = roundCurrency(calculateMunicipalTaxMilano(taxableIrpef));

    // --- Sintesi di Totali ---
    const totalTaxesAndContributions = roundCurrency(
        yearlyInps + yearlyIrpef + yearlyRegionalTax + yearlyMunicipalTax
    );

    const netYearly = roundCurrency(Math.max(0, cleanRal - totalTaxesAndContributions));
    const netMonthly = roundCurrency(netYearly / months);

    // Calcolo dell'aliquota media di trattenuta totale sul lordo (in percentuale, es. 35.4)
    const effectiveTaxRate = cleanRal > 0
        ? roundCurrency((totalTaxesAndContributions / cleanRal) * 100)
        : 0;

    // --- Composizione del Breakdown per l'Interfaccia ---
    const buildItem = (
        id: string,
        label: string,
        yearlyAmount: number,
        description: string
    ): PayrollItem => ({
        id,
        label,
        yearlyAmount,
        monthlyAmount: roundCurrency(yearlyAmount / months),
        percentageOfRal: cleanRal > 0 ? roundCurrency((yearlyAmount / cleanRal) * 100) : 0,
        description
    });

    return {
        ral: cleanRal,
        months,
        netYearly,
        netMonthly,
        totalTaxesAndContributions,
        effectiveTaxRate,
        taxableIrpef,
        grossIrpef,
        employeeTaxDeductions: deductions,
        breakdown: {
            inps: buildItem(
                'inps',
                'Contributi INPS (9,19%)',
                yearlyInps,
                'Contributi previdenziali a carico del dipendente per pensione e ammortizzatori sociali.'
            ),
            irpef: buildItem(
                'irpef',
                'IRPEF Netta (a scaglioni)',
                yearlyIrpef,
                `Imposta sul reddito delle persone fisiche calcolata sui 3 scaglioni (23%, 35%, 43%) al netto di € ${deductions.toLocaleString('it-IT')} di detrazioni lavoro dipendente.`
            ),
            regionalTax: buildItem(
                'regionalTax',
                'Addizionale Regionale (Lombardia)',
                yearlyRegionalTax,
                'Imposta regionale applicata per scaglioni di reddito sulla Lombardia.'
            ),
            municipalTax: buildItem(
                'municipalTax',
                'Addizionale Comunale (Milano)',
                yearlyMunicipalTax,
                'Imposta comunale di Milano (esenzione fino a € 23.000, 0,80% sopra tale soglia).'
            )
        }
    };
}