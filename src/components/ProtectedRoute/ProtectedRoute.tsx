import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { userAPI } from 'services/UserService';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from 'components/Spinner';
import styles from './ProtectedRoute.module.scss';

interface Props {
    children: ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const { data: currentUser, error: getCurrentUserError, isLoading: getCurrentUserIsLoading } = userAPI.useGetCurrentUserQuery();

    if (getCurrentUserIsLoading) {
        return <Spinner className={styles.customSpinner}/>;
    }

    if (!currentUser?.is_superuser) {
        // User does not have the required role, redirect to a Not Found page
        return <Navigate to="/404" replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;