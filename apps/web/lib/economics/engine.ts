import { EconomicsScenarioInput, EconomicsRunResult, CashFlowRow } from '@petrosquare/types';

export class EconomicsEngine {

  static run(input: EconomicsScenarioInput): EconomicsRunResult {
    const { rows, totalVolume } = this.generateCashFlows(input);
    const kpis = this.calculateKPIs(rows, totalVolume, input);

    return {
      kpis,
      cashflows: rows
    };
  }

  private static generateCashFlows(input: EconomicsScenarioInput): { rows: CashFlowRow[], totalVolume: number } {
    const rows: CashFlowRow[] = [];
    const durationMonths = input.general.project_duration_years * 12;
    const startDate = new Date(input.general.start_date);

    let cumulativeCashFlow = 0;
    let totalVolume = 0;

    for (let m = 0; m < durationMonths; m++) {
      const currentDate = new Date(startDate);
      currentDate.setMonth(startDate.getMonth() + m);
      const periodStr = currentDate.toISOString().slice(0, 7); // YYYY-MM

      // 1. Production
      const dailyRate = this.getProductionVolume(input, m);
      const daysInMonth = 30.44; // Avg days
      const monthlyVolume = dailyRate * daysInMonth;
      totalVolume += monthlyVolume;

      // 2. Price
      const price = this.getPrice(input, m);

      // 3. Revenue
      const revenue = monthlyVolume * price;

      // 4. Costs
      const opexFixed = input.costs.opex_fixed_monthly;
      const opexVariable = input.costs.opex_variable_per_bbl * monthlyVolume;
      const opex = opexFixed + opexVariable;

      // 5. Royalties
      const royalties = revenue * (input.costs.royalty_rate_percent / 100);

      // 6. Capex
      let capex = 0;
      if (m === 0) {
        capex += input.costs.capex_initial;
      }
      if (m === durationMonths - 1) {
        capex += input.costs.capex_abandonment;
      }

      // 7. Taxes (Simplified)
      // Taxable Income = Revenue - Royalties - Opex - Capex
      const operatingIncome = revenue - royalties - opex - capex;
      const taxes = operatingIncome > 0 ? operatingIncome * (input.costs.tax_rate_percent / 100) : 0;

      // 8. Net Cash Flow
      const netCashFlow = revenue - royalties - opex - capex - taxes;
      cumulativeCashFlow += netCashFlow;

      rows.push({
        period: periodStr,
        revenue,
        opex,
        capex,
        royalties,
        taxes,
        net_cash_flow: netCashFlow,
        cumulative_cash_flow: cumulativeCashFlow
      });
    }

    return { rows, totalVolume };
  }

  private static getProductionVolume(input: EconomicsScenarioInput, monthIndex: number): number {
    const { production } = input;

    if (production.curve_type === 'FLAT') {
      return production.initial_rate;
    }

    if (production.curve_type === 'DECLINE') {
        // Exponential decline: q(t) = qi * e^(-Di * t)
        // input.decline_rate_percent is effective annual decline
        const d_eff_annual = (production.decline_rate_percent || 0) / 100;
        if (d_eff_annual >= 1) return 0;

        const d_nom_annual = -Math.log(1 - d_eff_annual);
        const t_years = monthIndex / 12;

        return production.initial_rate * Math.exp(-d_nom_annual * t_years);
    }

    // Custom profile placeholder
    return 0;
  }

  private static getPrice(input: EconomicsScenarioInput, monthIndex: number): number {
    const { pricing } = input;

    if (pricing.oil_price_model === 'FLAT') {
        const basePrice = pricing.flat_price || 0;
        if (pricing.escalation_percent) {
            return basePrice * Math.pow(1 + pricing.escalation_percent / 100, monthIndex / 12);
        }
        return basePrice;
    }
    return 0;
  }

  private static calculateKPIs(cashflows: CashFlowRow[], totalVolume: number, input: EconomicsScenarioInput): EconomicsRunResult['kpis'] {
    const totalRevenue = cashflows.reduce((sum, row) => sum + row.revenue, 0);
    const totalOpex = cashflows.reduce((sum, row) => sum + row.opex, 0);
    const totalCapex = cashflows.reduce((sum, row) => sum + row.capex, 0);

    const r_annual = input.general.discount_rate_percent / 100;
    const r_monthly = Math.pow(1 + r_annual, 1/12) - 1;

    let npv = 0;
    cashflows.forEach((row, i) => {
        // t=0 for first period (immediate) or t=1?
        // Standard NPV assumes cash flows occur at end of period.
        // We'll treat m=0 as t=1 (end of month 1).
        const t = i + 1;
        npv += row.net_cash_flow / Math.pow(1 + r_monthly, t);
    });

    // IRR
    // We pass the net cash flow array.
    // If initial investment is in Month 0 (t=1), IRR will be calculated based on that stream.
    // Usually there's a negative cash flow at t=0 (Time 0).
    // Our model puts initial capex in Month 0 (which is t=1). This delays investment by 1 month.
    // Ideally, "Initial Capex" is at t=0.
    // Let's prepend a t=0 cashflow if needed, but our rows start at Period 1.
    // To get a "correct" IRR, we often assume initial capex is at t=0.
    // Let's modify the stream for IRR calculation only: move Month 0 Capex to t=0?
    // Or just calculate based on the stream we have.
    // Let's stick to the stream: period 0 is month 1.
    const irrMonthly = this.calculateIRR(cashflows.map(c => c.net_cash_flow));
    const irrPercent = (Math.pow(1 + irrMonthly, 12) - 1) * 100;

    // Payout Period
    const payoutRowIndex = cashflows.findIndex(c => c.cumulative_cash_flow >= 0);
    const payoutPeriodMonths = payoutRowIndex >= 0 ? payoutRowIndex + 1 : 0;

    // ROI = (Total Net Cash / Total Capex) * 100
    const totalNetCash = cashflows.reduce((sum, c) => sum + c.net_cash_flow, 0);
    const roiPercent = totalCapex > 0 ? (totalNetCash / totalCapex) * 100 : 0;

    // Breakeven (Undiscounted) = (Total Capex + Total Opex) / Total Volume
    // This is "Break-even Cost per Barrel".
    // If users want "Breakeven Oil Price", it is this value (assuming price is flat).
    // If price varies, it's more complex.
    const breakevenPrice = totalVolume > 0 ? (totalCapex + totalOpex) / totalVolume : 0;

    return {
      npv,
      irr_percent: isNaN(irrPercent) ? 0 : irrPercent,
      payout_period_months: payoutPeriodMonths,
      breakeven_price: breakevenPrice,
      total_revenue: totalRevenue,
      total_capex: totalCapex,
      total_opex: totalOpex,
      roi_percent: roiPercent
    };
  }

  private static calculateIRR(values: number[]): number {
    // Newton-Raphson
    let guess = 0.1; // 10% monthly
    const maxIter = 50;
    const eps = 1e-5;

    for (let i = 0; i < maxIter; i++) {
        let f = 0;
        let df = 0;
        for (let j = 0; j < values.length; j++) {
            const t = j + 1; // 1-based indexing matching NPV logic
            const d = Math.pow(1 + guess, t);
            f += values[j] / d;
            df -= (t * values[j]) / (d * (1 + guess));
        }

        if (Math.abs(df) < 1e-9) break; // Avoid division by zero

        const newGuess = guess - f / df;
        if (Math.abs(newGuess - guess) < eps) return newGuess;
        guess = newGuess;
    }
    return 0;
  }
}
