export interface Cashflow {
    day: number,
    this_day_uprn: number,
    this_day_revenue: number,
    this_day_opex_cost: number,
    live_uprns: number,
    this_day_voucher_revenue: number,
    bank_balance: number,
    capex_total: number,
    revenue_total: number,
    build_duration: number,
    uprn_total: number,
    project_id: number,
    project: string
  }

export type CashflowResponse = Cashflow[];