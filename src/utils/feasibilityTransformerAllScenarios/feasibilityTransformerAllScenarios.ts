// initial project level calcs

import { ProjectSummaryReport, ProjectSummaryReportResponse } from "models/ProjectSummaryReport";
import { ScenarioReportResponse } from "models/ScenarioReport";

export interface ScenarioLevelData {
    gross_profit_over_year_period: number;
    ev_minus_coupon_plus_period_gp_net_EV: number;
    MIP_at_20pct_net_EV: number;
    EV_margin_per_prem_connected_and_passed: number;
    net_EV_plus_coupon_as_pct_of_total_cash_outlay: number;
    net_EV_plus_coupon_as_pct_of_commercial_contribution: number;
    dense_cppp_prune: null;
    rural_cppp_prune: null;
    temp_gross_profit_over_year_period: number;
    EV_per_prem_connected_and_passed: number;
    coupon_reducing_over_roi_period: number;
    scenario_name: string;
    scenario_order: number;
    unique_property_count: number;
    total_capex: number;
    total_capex1: number;
    total_opex_per_annum: number;
    uprn_count: number;
    total_vouchers: number;
    average_cppp: number;
    average_pia_oppp_pa: number;
    capex_spine_100_pct_leadin: number;
    voucher_contribution: number;
    commercial_contribution_cppc: number;
    avg_commercial_contribution_cppc_passed: number;
    avg_commercial_contribution_cppc_connected: number;
    prems_connected: number;
    revenue_first_year: number;
    total_pia_oppp_pa: number;
    gross_profit_pa_year_3: number;
    roi_at_pen_rate_years: number;
}

export interface ProjectLevelData {
    total_capex: number;
    total_vouchers: number;
    scenario_name: string | number;
    total_leadin_capex: number;
    vouchers_in_rural: number;
    vouchers_in_dense: number;
    revenue_d30_r80: number;
    total_oppp_pa: number;
    total_capex1: number;
    voucher_subsidy: number;
    gross_profit_pa: number;
    roi_at_pen_rate_years: number;
    prems_connected: number;
    EV_per_prem_connected_and_passed: number;
    coupon_reducing_over_roi_period: number;
    gross_profit_over_year_period: number;
    uprn_count: number;
    capex_spine_100_pct_leadin: number;
    commercial_contribution_cppc: number;
    ev_minus_coupon_plus_period_gp_net_EV: number;
    MIP_at_20pct_net_EV: number;
    EV_margin_per_prem_connected_and_passed: number;
    net_EV_plus_coupon_as_pct_of_total_cash_outlay: number;
    net_EV_plus_coupon_as_pct_of_commercial_contribution: number;
}
interface Variables {
    averageVoucherValue: number;
    avgOpppPa: number;
    revenuePeriod: number;
    cpppAssetValue: number;
    cppcAssetvalue: number;
    couponRate: number;
}

type Data = {
    areasId: number,
    avg_cppp: number,
    avg_oppp_per_annum: number,
    description: string,
    id: number,
    name: string,
    omr_black_count: number,
    omr_grey_count: number,
    omr_under_review_count: number,
    omr_white_count: number,
    roi: number,
    total_capex: number,
    total_opex_per_annum: number,
    total_uprns_within_75m_of_dn: number,
    total_vouchers: number,
    uprn_count: number,
    vouchers_in_dense: number,
    vouchers_in_rural: number,
}
export const feasibilityTransformerAllScenarios = (data: any, rawScenarios: ScenarioReportResponse, variables: Variables) => {
    const { averageVoucherValue, avgOpppPa, revenuePeriod, cpppAssetValue, cppcAssetvalue, couponRate } = variables;
    const groupBy = (items: any[], key: string | number) =>
        items.reduce(
            (result, item) => ({
                ...result,
                [item[key]]: [...(result[item[key]] || []), item],
            }),
            {}
        );

    const sumBy = (items: any, key: string | number) => items.reduce((a: any, b: any) => a + (b[key] || 0), 0);

    const scenarios = rawScenarios.map((v: { label: string; }) => v.label);
    const scenarioOrder: { [key: string]: number } = {}
    for (let i = 0; i < scenarios.length; i++) {
        scenarioOrder[scenarios[i]] = i;
    }

    const tempProjectLevel1 = data.map((v: { uprn_count: number; total_capex: number; total_vouchers: number; vouchers_in_rural: number; vouchers_in_dense: number; scenario_name: string | number; }) => {
        // const tempProjectLevel1 = data.map((v) => {
        return {
            amortized_pmo: 50 * v.uprn_count,
            survey_and_design: 15 * v.uprn_count,
            // insert amortized_feasibility
            total_capex1: v.total_capex + 50 * v.uprn_count + 15 * v.uprn_count, // insert amortized_feasibility
            total_non_vouchers: v.uprn_count - v.total_vouchers,
            prems_connected: (0.3 * v.total_vouchers) + (0.8 * (v.uprn_count - v.total_vouchers)),
            total_leadin_capex: 500 * (0.3 * v.total_vouchers) + (0.8 * (v.uprn_count - v.total_vouchers)),
            voucher_subsidy: averageVoucherValue * ((0.8 * v.vouchers_in_rural) + (0.3 * v.vouchers_in_dense)),
            scenario_order: scenarioOrder[v.scenario_name],
            ...v
        };
    });

    const tempProjectLevel2 = tempProjectLevel1.map((v: { total_capex1: any; total_leadin_capex: any; voucher_subsidy: number; prems_connected: number; vouchers_in_rural: number; vouchers_in_dense: number; }) => {
        return {
            capex_spine_100_pct_leadin: v.total_capex1 + v.total_leadin_capex,
            commercial_contribution_cppc: (v.total_capex1 + v.total_leadin_capex) - v.voucher_subsidy, // require voucher topup
            revenue_d30_r80: v.prems_connected * 32 * 12,
            penrate_leadin_pia_oppp_pa: 11.9 * v.prems_connected,
            total_oppp_pa: (11.9 * v.prems_connected) + avgOpppPa * ((0.8 * v.vouchers_in_rural) + (0.3 * v.vouchers_in_dense)),
            ...v
        };
    })

    const tempProjectLevel3 = tempProjectLevel2.map((v: { revenue_d30_r80: number; total_oppp_pa: number; total_capex1: number; voucher_subsidy: number; }) => {
        return {
            gross_profit_pa: v.revenue_d30_r80 - v.total_oppp_pa,
            roi_at_pen_rate_years: (v.total_capex1 - v.voucher_subsidy) / (v.revenue_d30_r80 - v.total_oppp_pa),
            ...v
        };
    })

    const tempProjectLevel4 = tempProjectLevel3.map((v: { gross_profit_pa: number; roi_at_pen_rate_years: number; uprn_count: number; prems_connected: number; capex_spine_100_pct_leadin: number; }) => {
        return {
            gross_profit_over_year_period: v.gross_profit_pa * (revenuePeriod - v.roi_at_pen_rate_years),
            EV_per_prem_connected_and_passed: ((v.uprn_count - v.prems_connected) * cpppAssetValue) + (v.prems_connected * cppcAssetvalue),
            coupon_reducing_over_roi_period: v.capex_spine_100_pct_leadin * couponRate * ((1 + v.roi_at_pen_rate_years) / 2),
            ...v
        };
    })

    const projectLevel = tempProjectLevel4.map((v: { EV_per_prem_connected_and_passed: number; coupon_reducing_over_roi_period: number; gross_profit_over_year_period: number; uprn_count: number; capex_spine_100_pct_leadin: number; commercial_contribution_cppc: number; }) => {
        return {
            // add in ev minus coupon plus preiod gross profit
            ev_minus_coupon_plus_period_gp_net_EV: v.EV_per_prem_connected_and_passed - v.coupon_reducing_over_roi_period + v.gross_profit_over_year_period,
            // add MIP
            MIP_at_20pct_net_EV: 0.2 * (v.EV_per_prem_connected_and_passed - v.coupon_reducing_over_roi_period + v.gross_profit_over_year_period),
            // add ev margin per prem connected + passed
            EV_margin_per_prem_connected_and_passed: (v.EV_per_prem_connected_and_passed - v.coupon_reducing_over_roi_period + v.gross_profit_over_year_period) / v.uprn_count,
            // add Net EV + Coupon as % of Total Cash Outlay
            net_EV_plus_coupon_as_pct_of_total_cash_outlay: (v.EV_per_prem_connected_and_passed - v.coupon_reducing_over_roi_period + v.gross_profit_over_year_period + v.coupon_reducing_over_roi_period) / v.capex_spine_100_pct_leadin,
            // add Net EV + Coupon as % of Commercial Contribution
            net_EV_plus_coupon_as_pct_of_commercial_contribution: (v.EV_per_prem_connected_and_passed - v.coupon_reducing_over_roi_period + v.gross_profit_over_year_period + v.coupon_reducing_over_roi_period) / v.commercial_contribution_cppc,
            ...v
        };
    })

    // group up to scenario
    const groupedScenarios = groupBy(projectLevel, "scenario_name");
    let tempScenarioLevel1 = [];

    for (const [scenario_name, values] of Object.entries(groupedScenarios)) {
        tempScenarioLevel1.push({
            // scenario
            scenario_name: scenario_name,
            scenario_order: scenarioOrder[scenario_name],
            // build stats
            unique_property_count: (values as any).length,
            total_capex: sumBy(values, "total_capex"),
            total_capex1: sumBy(values, "total_capex1"),
            total_opex_per_annum: sumBy(values, "total_opex_per_annum"),
            uprn_count: sumBy(values, "uprn_count"),
            total_vouchers: sumBy(values, "total_vouchers"),
            average_cppp: sumBy(values, "total_capex1") / sumBy(values, "uprn_count"),
            average_pia_oppp_pa: sumBy(values, "total_opex_per_annum") / sumBy(values, "uprn_count"),
            // build area prune comparison
            capex_spine_100_pct_leadin: sumBy(values, "capex_spine_100_pct_leadin"),
            voucher_contribution: sumBy(values, "voucher_subsidy"),
            commercial_contribution_cppc: sumBy(values, "commercial_contribution_cppc"),
            avg_commercial_contribution_cppc_passed: sumBy(values, "commercial_contribution_cppc") / sumBy(values, "uprn_count"),
            avg_commercial_contribution_cppc_connected: sumBy(values, "commercial_contribution_cppc") / sumBy(values, "prems_connected"),
            // pnl
            prems_connected: sumBy(values, "prems_connected"),
            revenue_first_year: sumBy(values, "revenue_d30_r80"),
            total_pia_oppp_pa: sumBy(values, "total_oppp_pa"),
            gross_profit_pa_year_3: sumBy(values, "gross_profit_pa"),
            roi_at_pen_rate_years: (sumBy(values, "total_capex1") - sumBy(values, "voucher_subsidy")) / sumBy(values, "gross_profit_pa")
        });
    }

    const tempScenarioLevel2 = tempScenarioLevel1.map(v => {
        return {
            dense_cppp_prune: null,
            rural_cppp_prune: null,
            temp_gross_profit_over_year_period: v.gross_profit_pa_year_3 * (revenuePeriod - v.roi_at_pen_rate_years),
            EV_per_prem_connected_and_passed: ((v.uprn_count - v.prems_connected) * cpppAssetValue) + (v.prems_connected * cppcAssetvalue),
            // add in peak negative bank balance/roi: return over capex/adjusted rio: revenue minus interest payment over capex
            // initial EV at coupon = leading_capex(500 x uprn) * coupon * ((1 + roi period) / 2) 
            coupon_reducing_over_roi_period: v.capex_spine_100_pct_leadin * couponRate * ((1 + v.roi_at_pen_rate_years) / 2),
            ...v
        }
    })

    const tempScenarioLevel3 = tempScenarioLevel2.map(v => {
        const gross_profit_over_year_period = v.temp_gross_profit_over_year_period < 0.0 ? 0 : v.temp_gross_profit_over_year_period;
        return {
            gross_profit_over_year_period: gross_profit_over_year_period,
            // add in ev minus coupon plus preiod gross profit
            ev_minus_coupon_plus_period_gp_net_EV: v.EV_per_prem_connected_and_passed - v.coupon_reducing_over_roi_period + gross_profit_over_year_period,
            ...v
        }
    })

    const scenarioLevel = tempScenarioLevel3.map(v => {
        return {
            // add MIP
            MIP_at_20pct_net_EV: 0.2 * v.ev_minus_coupon_plus_period_gp_net_EV,
            // add ev margin per prem connected + passed
            EV_margin_per_prem_connected_and_passed: v.ev_minus_coupon_plus_period_gp_net_EV / v.uprn_count,
            // add Net EV + Coupon as % of Total Cash Outlay
            net_EV_plus_coupon_as_pct_of_total_cash_outlay: (v.coupon_reducing_over_roi_period + v.ev_minus_coupon_plus_period_gp_net_EV) / v.capex_spine_100_pct_leadin,
            // add Net EV + Coupon as % of Commercial Contribution
            net_EV_plus_coupon_as_pct_of_commercial_contribution: (v.coupon_reducing_over_roi_period + v.ev_minus_coupon_plus_period_gp_net_EV) / v.commercial_contribution_cppc,
            ...v
        }
    })

    return { scenario_level: scenarioLevel, project_level: projectLevel }
}
