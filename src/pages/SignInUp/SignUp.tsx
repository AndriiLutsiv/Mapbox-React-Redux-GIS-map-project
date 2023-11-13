import { FormInput } from 'components/FormInput';
import { AuthGreeting } from '../../components/AuthGreeting';
import styles from './SignUp.module.scss';
import { FormEvent, useState } from 'react';
import { Fields, FieldName, MappedField } from './types';
import { name, email, password, fieldsValidation, signupFields } from './SignUpFields';
import { userAPI } from '../../services/UserService';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from 'constants/routes';
import { SignUpUserError } from 'models/User';

function isErrorWithDetail(error: any): error is SignUpUserError {
  return error && 'data' in error && 'detail' in error.data;
}

const SignUp: React.FC = () => {
  const params = useParams() as { id: string };

  const [signupUser, { error: signupUserError, isLoading: signupUserIsLoading }] = userAPI.useSignupUserMutation();

  const [fields, setFields] = useState<Fields>({ name, email, password });

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

    signupFields.forEach((field: MappedField) => {
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
      await signupUser({
        username: fields.name.value,
        email: fields.email.value,
        password: fields.password.value,
        token: params.id
      });
    }
  };

  return <form data-testid='SignUp' className={styles.signUp} onSubmit={handleSubmit}>
    <AuthGreeting
      title='Create an account'
    />
    {
      signupFields.map(field => <FormInput
        key={field.name}
        stateField={fields[field.name]}
        field={field}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />)
    }
    <button type='submit' className={styles.button}>Get started</button>
    <div className={styles.lowerInfo}>
      <div className={styles.lowerText}>Already have an account?</div>
      <Link to={ROUTES.SIGN_IN}>Log in</Link>
    </div>
    {
      isErrorWithDetail(signupUserError) && <div className={styles.errorText}>{signupUserError.data.detail}</div>
    }
  </form>
}

export default SignUp;