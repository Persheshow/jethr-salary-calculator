# Calcolatore di Retribuzione Netta — Prototipo per Jet HR

Un'applicazione web interattiva per simulare la proiezione della retribuzione netta annuale e mensile di un lavoratore dipendente, partendo dalla Retribuzione Annua Lorda (RAL) e mostrando nel dettaglio tutte le trattenute fiscali e previdenziali.

---

## 📋 Assunzioni di Dominio e Semplificazioni

Per rendere il modello di calcolo immediato e ispezionabile, il prototipo applica le seguenti assunzioni specificate nel brief di progetto:

* **Tipologia contrattuale:** Impiegato a tempo indeterminato (CCNL standard).
* **Luogo di lavoro e residenza:** Milano, Lombardia.
* **Agevolazioni:** Nessuna agevolazione o detrazione fiscale aggiuntiva (es. carichi di famiglia, esonero contributivo temporaneo, previdenza complementare).
* **Suddivisione mensile:** Calcolo predefinito su **13 mensilità**, con facoltà di selezione per **14 mensilità**.

### Regole fiscali applicate

1. **Contributi INPS (Dipendente):** Aliquota standard fissa del **9,19%** applicata all'intera RAL.
2. **Imponibile IRPEF:** Calcolato come `RAL - Contributi INPS`.
3. **IRPEF Lorda (3 Scaglioni):**
   * Fino a 28.000 €: **23%**
   * Da 28.001 € a 50.000 €: **35%**
   * Oltre 50.000 €: **43%**
4. **Detrazioni per Lavoro Dipendente:** Calcolate secondo la formula progressiva standard per scaglioni di reddito, decrescenti fino ad azzerarsi sopra i 50.000 € di reddito imponibile.
5. **Addizionale Regionale (Lombardia):** Calcolata per scaglioni progressivi (da 1,23% a 1,73%).
6. **Addizionale Comunale (Milano):** Aliquota dello **0,8%** applicata sull'intero imponibile per redditi superiori alla soglia di esenzione di **23.000 €**.

---

## 🛠 Stack Tecnologico

* **Linguaggio:** TypeScript
* **Libreria UI:** React 19
* **Bundler / Build Tool:** Vite
* **Styling:** Tailwind CSS v4
* **Linting:** ESLint
* **Icone:** Lucide React

---

## 🏗 Architettura e Progettazione

Il codice è organizzato per separare in modo netto la logica matematica di calcolo dagli elementi grafici di interfaccia:

* `src/domain/payrollCalculator.ts`: Contiene le formule di calcolo previdenziale e fiscale. Non presenta alcuna dipendenza da librerie di interfaccia grafica ed è interamente testabile in modo indipendente.
* `src/types/payroll.ts`: Definisce i tipi e le interfacce TypeScript per gli input del calcolatore e per il set completo di output (voci di trattenuta, totali annuali e mensili).
* `src/components/`: Componenti React modulari per la gestione degli input (`InputSection`), per la visualizzazione dettagliata dei risultati (`BreakdownCard`) e per la trasparenza sulle regole applicate (`AssumptionsDrawer`).

---

## 🚀 Avvio Rapido Locale

### 1. Clona il repository e installa le dipendenze
```bash
git clone <URL_DEL_REPO>
cd jethr-salary-calculator
npm install

```

### 2. Avvia il server di sviluppo

```bash
npm run dev

```

L'applicazione sarà accessibile all'indirizzo locale indicato dal terminale (normalmente `http://localhost:5173`).

### 3. Generazione della build per la produzione

```bash
npm run build

```