import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const AuthWrapper: React.FC<Props> = ({ children }) => {
  const token = useSelector((state: RootState) => state.token.value);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/sign-in');
    }
  }, [token, navigate]);

  return <>{children}</>;
};

export default AuthWrapper;
