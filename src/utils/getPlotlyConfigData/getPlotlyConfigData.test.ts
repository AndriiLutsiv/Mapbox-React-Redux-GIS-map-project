import React from 'react';
import { render } from '@testing-library/react';
import { getPlotlyConfigData } from './getPlotlyConfigData'; // Update this path
import { Cashflow } from 'models/Cashflow';

// Mock CashflowResponse data for testing
const mockData: Cashflow[] = [
    {
        day: 0.0,
        this_day_uprn: 0.0,
        this_day_revenue: 0.0,
        this_day_opex_cost: 0.0,
        live_uprns: 0.0,
        this_day_voucher_revenue: 0.0,
        bank_balance: -1,
        capex_total: 1,
        revenue_total: 0.0,
        build_duration: 2,
        uprn_total: 0.0,
        project_id: 1,
        project: "project-name"
    },
    {
        day: 1.0,
        this_day_uprn: 1.0,
        this_day_revenue: 1.0,
        this_day_opex_cost: 1.0,
        live_uprns: 1.0,
        this_day_voucher_revenue: 1.0,
        bank_balance: -2,
        capex_total: 2,
        revenue_total: 1.0,
        build_duration: 3,
        uprn_total: 1.0,
        project_id: 2,
        project: "project-name2"
    }
];

describe('getPlotlyConfigData', () => {
    it('should generate plotly configuration data for a single project', () => {
        const projectId = 1; // Use a valid project ID from your mock data
        const plotlyConfig = getPlotlyConfigData(mockData, ['uprn_total'], [projectId]);

        expect(plotlyConfig).toHaveLength(1);
        expect(plotlyConfig[0].name).toContain(`project-name _ uprn_total`);
        // You can add more specific assertions based on your expected data
    });

    it('should generate plotly configuration data for multiple projects', () => {
        const projectIds = [1, 2]; // Use valid project IDs from your mock data
        const plotlyConfig = getPlotlyConfigData(mockData, ['uprn_total', 'live_uprns'], projectIds);

        expect(plotlyConfig).toHaveLength(projectIds.length * 2);
    });

});
