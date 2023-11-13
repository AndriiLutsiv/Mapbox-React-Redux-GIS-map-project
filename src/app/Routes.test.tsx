import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RoutesComponent from './Routes';
import { ROUTES } from 'constants/routes';
import { renderWithProviders } from 'test-utils';
import { MapProvider } from './providers/MapProvider';
import { projectAPI } from 'services/ProjectService';

describe('routes', () => {
    it('renders Main page for root route', () => {
        renderWithProviders(
            <MemoryRouter initialEntries={[ROUTES.ROOT]}>
                <MapProvider>
                    <RoutesComponent />
                </MapProvider>
            </MemoryRouter>
        );
        expect(screen.getByTestId('MainPage')).toBeInTheDocument();
    });

    it('renders SignIn page for sign in route', () => {
        renderWithProviders(
            <MemoryRouter initialEntries={[ROUTES.SIGN_IN]}>
                <MapProvider>
                    <RoutesComponent />
                </MapProvider>
            </MemoryRouter>
        );
        expect(screen.getByTestId('SignIn')).toBeInTheDocument();
    });

    it.skip('renders Map page for map route', () => {
        renderWithProviders(
            <MemoryRouter initialEntries={[`${ROUTES.AREAS}/testParam/testParam/testParam`]}>
                <MapProvider>
                    <RoutesComponent />
                </MapProvider>
            </MemoryRouter>
        );
        expect(screen.getByTestId('Map')).toBeInTheDocument();
    });

    it.skip('renders CreateUser page for create user route', async () => {
        renderWithProviders(
            <MemoryRouter initialEntries={[ROUTES.CREATE_USER]}>
                <MapProvider>
                    <RoutesComponent />
                </MapProvider>
            </MemoryRouter>
        );
        const createUserElement = await screen.findByTestId('CreateUser');
        expect(createUserElement).toBeInTheDocument();
    });

    it('renders SignUp page for sign up route', () => {
        renderWithProviders(
            <MemoryRouter initialEntries={[ROUTES.SIGN_UP]}>
                <MapProvider>
                    <RoutesComponent />
                </MapProvider>
            </MemoryRouter>
        );
        expect(screen.getByTestId('SignUp')).toBeInTheDocument();
    });

    it('renders Areas page for areas route', async () => {
        renderWithProviders(
            <MemoryRouter initialEntries={[ROUTES.AREAS]}>
                <MapProvider>
                    <RoutesComponent />
                </MapProvider>
            </MemoryRouter>
        );
        const areasElement = await screen.findByTestId('Areas');
        expect(areasElement).toBeInTheDocument();
    });

    it.skip('renders ProjectsTable page for projects route',  async () => {
        renderWithProviders(
            <MemoryRouter initialEntries={[`${ROUTES.DASHBOARD}/testParam`]}>
                <MapProvider>
                    <RoutesComponent />
                </MapProvider>
            </MemoryRouter>
        );
        const projectsTableElement = await screen.findByTestId('ProjectsTable',{}, { timeout: 5000 });
        expect(projectsTableElement).toBeInTheDocument();
    });


    it('renders Scenarios page for scenarios route', async () => {
        renderWithProviders(
            <MemoryRouter initialEntries={[`${ROUTES.AREAS}/testParam`]}>
                <MapProvider>
                    <RoutesComponent />
                </MapProvider>
            </MemoryRouter>
        );
        const scenariosElement = await screen.findByTestId('Scenarios', {}, { timeout: 5000 });
        expect(scenariosElement).toBeInTheDocument();
    });

    it('renders Projects page for projects route', async () => {
        renderWithProviders(
            <MemoryRouter initialEntries={[`${ROUTES.AREAS}/testParam/testParam`]}>
                <MapProvider>
                    <RoutesComponent />
                </MapProvider>
            </MemoryRouter>
        );

        const projectsElement = await screen.findByTestId('Projects', {}, { timeout: 5000 });
        expect(projectsElement).toBeInTheDocument();
    });

    it('renders NotFound page for non-existent route', async () => {
        renderWithProviders(
            <MemoryRouter initialEntries={['/non-existent-route']}>
                <MapProvider>
                    <RoutesComponent />
                </MapProvider>
            </MemoryRouter>
        );
        expect(screen.getByTestId('NotFound')).toBeInTheDocument();
    });
});
