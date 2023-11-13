import classNames from 'classnames';
import { useTheme } from "app/providers/ThemeProvider";
import { Navigation } from "components/Navigation";
import RoutesComponent from "./Routes";
import { useAuth } from 'hooks/useAuth';
import AuthWrapper from './providers/AuthWrapper';

function App() {
  const { theme } = useTheme();
  const { token } = useAuth();

  return (
    <AuthWrapper>
      <main data-testid="App" className={classNames('app', theme)}>
        <Navigation />
        <main className={classNames("pageContent", { "paddingLeft": !!token })}>
          {RoutesComponent()}
        </main>
      </main>
    </AuthWrapper>
  );
};

export default App;
