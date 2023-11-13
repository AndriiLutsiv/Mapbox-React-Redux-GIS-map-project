import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import SectionDescribe from './SectionDescribe';

describe('SectionDescribe', () => {
    const mockProps = {
        description: '',
        setDescription: jest.fn(),
        areaName: '',
        setAreaName: jest.fn(),
        validationErrors: { name: '', polygon: '' },
        setValidationErrors: jest.fn(),
        area_uuid: undefined,
    };

    it('renders the component correctly', () => {
        render(<SectionDescribe {...mockProps} />);
        const titleElement = screen.getByText('Add area');
        expect(titleElement).toBeInTheDocument();

        const nameLabelElement = screen.getByText('Area name');
        expect(nameLabelElement).toBeInTheDocument();

        const descriptionLabelElement = screen.getByText('Description');
        expect(descriptionLabelElement).toBeInTheDocument();
    });

    it('handles input change', () => {
        render(<SectionDescribe {...mockProps} />);
        const inputElement = screen.getByLabelText('Area name');

        const inputValue = 'Test area';
        fireEvent.change(inputElement, { target: { value: inputValue } });

        expect(mockProps.setAreaName).toHaveBeenCalledWith(inputValue);
    });

    it('renders validation error message', () => {
        const validationErrors = { name: 'Field is required', polygon: '' };
        render(<SectionDescribe {...mockProps} validationErrors={validationErrors} />);
        const errorMessage = screen.getByText('Field is required');
        expect(errorMessage).toBeInTheDocument();
    });

    it('calls setDescription when description textarea changes', () => {
        const description = 'Test description';
        render(<SectionDescribe {...mockProps} description={description} />);
        const textareaElement = screen.getByLabelText('Description');

        fireEvent.change(textareaElement, { target: { value: 'New description' } });

        expect(mockProps.setDescription).toHaveBeenCalled();
    });

    it('displays "Add area" title when area_uuid is undefined', () => {
        render(<SectionDescribe {...mockProps} />);
        const addAreaTitle = screen.getByText('Add area');
        const editAreaTitle = screen.queryByText('Edit area');
        expect(addAreaTitle).toBeInTheDocument();
        expect(editAreaTitle).toBeNull();
    });

    it('displays "Edit area" title when area_uuid is defined', () => {
        const area_uuid = 'some-unique-id';
        render(<SectionDescribe {...mockProps} area_uuid={area_uuid} />);
        const editAreaTitleRendered = screen.getByText('Edit area');
        const addAreaTitleRendered = screen.queryByText('Add area');
        expect(editAreaTitleRendered).toBeInTheDocument();
        expect(addAreaTitleRendered).toBeNull();
    });
});
