import { RootState } from './../store/store';
import { ROUTES } from 'constants/routes';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken, clearToken } from 'store/reducers/tokenSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.token.value);

  const updateToken = useCallback(
    (newToken: string | null) => {
      if (newToken) {
        dispatch(setToken(newToken));
        navigate(ROUTES.ROOT);
      } else {
        dispatch(clearToken());
        navigate(ROUTES.SIGN_IN);
      }
    },
    [dispatch, navigate]
  );

  return { token, setToken: updateToken };
};
