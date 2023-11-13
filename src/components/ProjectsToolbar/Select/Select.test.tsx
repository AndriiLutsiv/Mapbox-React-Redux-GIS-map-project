import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Select, { ProjectsOptions, ScenariosOptions } from './Select';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('Select', () => {
    it('renders Select component', () => {
        render(<MemoryRouter><Select /></MemoryRouter>);

        const selectElement = screen.getByTestId('Select');
        expect(selectElement).toBeInTheDocument();
    });

    it('should have class active when isOpen is true', () => {
        render(<MemoryRouter><Select /></MemoryRouter>);

        const selectComponent = screen.getByTestId('Select');
        const selectArrow = screen.getByTestId('select-arrow');

        expect(selectComponent).not.toHaveClass('active');
        expect(selectArrow).not.toHaveClass('active');

        fireEvent.click(selectComponent);
        expect(selectComponent).toHaveClass('active');
        expect(selectArrow).toHaveClass('active');
    });

    it('should render ScenariosOptions when not on projects page', () => {
        render(
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<Select />} />
                </Routes>
            </MemoryRouter>
        );

        const scenariosOptions = screen.getAllByTestId('option-item');
        expect(scenariosOptions.length).toBe(ScenariosOptions.length);

        scenariosOptions.forEach((option, index) => {
            expect(option.textContent).toBe(ScenariosOptions[index].text);
        });
    });

    it('should render ProjectsOptions when on projects page', () => {
        const testProjectRoute = "/areas/param1/param2"; // replace param1 and param2 with the actual parameter values

        render(
            <MemoryRouter initialEntries={[testProjectRoute]}>
                <Routes>
                    <Route path="/" element={<Select />} />
                    <Route path="/areas/:param1/:param2" element={<Select />} />
                </Routes>
            </MemoryRouter>
        );

        const projectsOptions = screen.getAllByTestId('option-item');
        expect(projectsOptions.length).toBe(ProjectsOptions.length);

        projectsOptions.forEach((option, index) => {
            expect(option.textContent).toBe(ProjectsOptions[index].text);
        });
    });
});
