import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Table } from './Table';

describe('Table', () => {
  const sampleData = [
    { id: 1, name: 'Item 1', value: 100 },
    { id: 2, name: 'Item 2', value: 200 },
  ];

  const sampleConfig = [
    {
      label: 'ID',
      render: (rowData: any) => rowData.id,
      sortedHandler: jest.fn(),
      sortedIcon: () => <span>SortIcon</span>,
    },
    {
      label: 'Name',
      render: (rowData: any) => rowData.name,
      sortedIcon: () => <span>SortIcon</span>,
    },
    {
      label: 'Value',
      render: (rowData: any) => rowData.value,
      sortedHandler: jest.fn(),
      sortedIcon: () => <span>SortIcon</span>,
    },
  ];

  it('renders the table with correct headers and data', () => {
    render(
      <MemoryRouter>
        <Table data={sampleData} config={sampleConfig} isClickable={false} />
      </MemoryRouter>
    );

    const headerLabels = sampleConfig.map((config) => config.label);
    const headerCells = screen.getAllByRole('columnheader');
    headerCells.forEach((cell, index) => {
      expect(cell).toHaveTextContent(headerLabels[index]);

      if (sampleConfig[index].sortedHandler) {
        expect(cell).toHaveTextContent('SortIcon');
        fireEvent.click(cell); 

        expect(sampleConfig[index].sortedHandler).toHaveBeenCalled();
      }
    });

    sampleData.forEach((row) => {
      expect(screen.getByText(row.name)).toBeInTheDocument();
      expect(screen.getByText(row.value.toString())).toBeInTheDocument();
    });
  });
});
