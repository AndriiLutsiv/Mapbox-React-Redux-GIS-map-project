import { Route, Routes } from "react-router-dom";
import { ROUTES } from 'constants/routes';
import Main from 'pages/Main';
import { SignIn } from '../pages/SignIn';
import { SignUp } from "pages/SignInUp";
import { Map } from 'components/Map';
import { NotFound } from 'pages/NotFound';
import { CreateUser } from "pages/CreateUser";
import { Areas } from "pages/Areas";
import { Scenarios } from "pages/Scenarios";
import { Projects } from "pages/Projects";
import { ProjectsToolbar } from "components/ProjectsToolbar";
import { DashboardToolbar } from "components/DashboardToolbar";
import { HelicopterView } from "pages/HelicopterView";
import { ProjectsTable } from "pages/ProjectsTable";
import { ProtectedRoute } from "../components/ProtectedRoute";

function RoutesComponent() {
  return (
    <Routes>
      <Route path={ROUTES.ROOT} element={<Main />} />
      <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
      <Route path={ROUTES.CREATE_USER} element={<ProtectedRoute><CreateUser /></ProtectedRoute>} />
      <Route path={`${ROUTES.SIGN_UP}/:token?`} element={<SignUp />} />
      <Route path={ROUTES.AREAS} element={<ProjectsToolbar />}>
        <Route index element={<Areas />} />
        <Route path={`${ROUTES.AREAS}/:param1`} element={<Scenarios />} />
        <Route path={`${ROUTES.AREAS}/:param1/:param2`} element={<Projects />} />
      </Route>
      <Route path={ROUTES.DASHBOARD} element={<DashboardToolbar />}>
        <Route index element={<HelicopterView />} />
        <Route path={`${ROUTES.DASHBOARD}/:param1`} element={<ProjectsTable />} />
      </Route>
      <Route path={`${ROUTES.AREAS}/:param1/:param2/:param3`} element={<Map properties layersPanel isMapPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesComponent;
