import ReactDOM from 'react-dom/client';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import { setupStore } from './store/store';
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.css';
import 'app/css/styles.scss';
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from 'app/providers/ThemeProvider';

// import { MapProvider } from 'app/providers/MapProvider';
import { MapProvider } from 'app/providers/MapProvider';

const store = setupStore();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        <MapProvider>
          <App />
        </MapProvider>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);

reportWebVitals();
