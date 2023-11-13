import { FormInput } from 'components/FormInput';
import { AuthGreeting } from '../../components/AuthGreeting';
import styles from './SignIn.module.scss';
import { FormEvent, useState } from 'react';
import { FormCheckbox } from 'components/FormCheckbox';
import { Fields, FieldName, MappedField } from './types';
import { email, password, fieldsValidation, signinFields } from './SignInFields';
import { tokenAPI } from '../../services/TokenService';
import { Link } from 'react-router-dom';
import { ROUTES } from 'constants/routes';
import { useAuth } from 'hooks/useAuth';
import { ErrorResponse } from 'models/Token';

function isErrorWithDetail(error: any): error is ErrorResponse {
  return error && 'data' in error && 'detail' in error.data;
}

const SignIn: React.FC = () => {
  const { setToken } = useAuth();
  const [fields, setFields] = useState<Fields>({ email, password });
  const [checked, setChecked] = useState(false);

  const [fetchLoginToken, { error: fetchLoginTokenError, isLoading: fetchLoginTokenIsLoading }] = tokenAPI.useFetchLoginTokenMutation();

  const handleChange = (e: React.ChangeEvent<{ name: string | undefined; value: string; }>, name: FieldName) => {
    setFields((prevState) => ({
      ...prevState, [name]: { ...prevState[name], value: e.target.value.trim(), isValid: true }
    }));
  };

  const handleFocus = (name: FieldName) => {
    setFields((prevState) => ({ ...prevState, [name]: { ...prevState[name], isValid: true } }));
  };

  const handleBlur = (name: FieldName) => {
    let errorText = "";

    fieldsValidation[name].forEach((validator) => {
      if (errorText) {
        return;
      }

      const fieldErrorText = validator(fields[name].value);

      if (fieldErrorText) {
        errorText = fieldErrorText;
      }

      setFields((prevState) => ({
        ...prevState,
        [name]: {
          ...prevState[name], isValid: !errorText, errorText
        }
      }));
    });
  };

  const validate = () => {
    let isValid = true;

    signinFields.forEach((field: MappedField) => {
      let errorText = "";
      fieldsValidation[field.name].forEach((validator) => {
        if (errorText) {
          return;
        }

      const fieldErrorText = validator(fields[field.name].value);

        if (fieldErrorText) {
          isValid = false;
          errorText = fieldErrorText;
        }

        setFields((prevState) => ({
          ...prevState,
          [field.name]: { ...prevState[field.name], isValid: !errorText, errorText },
        }));
      });
    });

    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validate();

    if (isValid) {
      //const fullAccess = 'layer:read layer:write project:read project:write company:read company:write user:read user:write';

      const body = new URLSearchParams({
        username: fields.email.value,
        password: fields.password.value,
        scope: 'all'
      });

      const result = await fetchLoginToken(body);
      //@ts-ignore
      setToken(result?.data?.access_token)
    }
  };

  return <form data-testid='SignIn' className={styles.signIn} onSubmit={handleSubmit}>
    <AuthGreeting
      title='Log in to your account'
      subtitle='Welcome back! Please enter your details.'
    />
    {
      signinFields && signinFields.map(field => <FormInput
        key={field.name}
        stateField={fields[field.name]}
        field={field}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />)
    }
    <div className={styles.upperInfo}>
      <div className={styles.checkbox} onClick={() => setChecked(prev => !prev)}>
        <FormCheckbox text='Remember me' checked={checked} />
      </div>
      <a href='#' className={styles.link}>Forgot password</a>
    </div>
    <button type='submit' className={styles.button}>Sign in</button>
    <div className={styles.lowerInfo}>
      <div className={styles.lowerText}>Don`t have an account?</div>
      <Link to={ROUTES.SIGN_UP}>Sign up</Link>
    </div>
    {
      isErrorWithDetail(fetchLoginTokenError) && <div className={styles.errorText}>{fetchLoginTokenError.data.detail}</div>
    }
  </form>
}

export default SignIn;