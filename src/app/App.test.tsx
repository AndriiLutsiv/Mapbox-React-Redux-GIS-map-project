import { MemoryRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import { setupStore } from 'store/store';

const store = setupStore();
describe('App', () => {
  it('renders the App component', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const app = getByTestId('App');
      expect(app).toBeInTheDocument();
    });
  });
});
