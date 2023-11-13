import { FormInput } from 'components/FormInput';
import styles from './UserRow.module.scss';
import { useEffect, useState } from 'react';
import { Fields, FieldName, MappedField } from '../types';
import { username, userEmail, userPassword, fieldsValidation, createUserFields } from '../CreateUserFields';
import { userAPI } from '../../../services/UserService';
import { useAuth } from 'hooks/useAuth';
import { CreateUserError, DeleteUserError, UpdateUserError, User } from 'models/User';

function isErrorWithDetail(error: any): error is UpdateUserError | CreateUserError | DeleteUserError {
    return error && 'data' in error && 'detail' in error.data;
}

interface Props {
    createRow?: boolean;
    setCreateRow?: React.Dispatch<React.SetStateAction<boolean>>;
    user?: User;
}

const UserRow: React.FC<Props> = ({ createRow, setCreateRow, user }) => {
    const { token } = useAuth();
    const [createUser, { error: createUserError, isLoading: createUserIsLoading }] = userAPI.useCreateUserMutation();
    const [deleteUser, { error: deleteUserError, isLoading: deleteUserIsLoading }] = userAPI.useDeleteUserMutation();
    const [updateUser, { error: updateUserError, isLoading: updateUserIsLoading }] = userAPI.useUpdateUserMutation();

    const [edit, setEdit] = useState(false);

    const [fields, setFields] = useState<Fields>({
        username: { ...username, value: user?.username || '' },
        userEmail: { ...userEmail, value: user?.email || '' },
        userPassword: { ...userPassword }
    });

    useEffect(() => {
        setFields({
            ...fields,
            username: { ...fields.username, value: user?.username || '' },
            userEmail: { ...fields.userEmail, value: user?.email || '' },
        })
    }, [user]);

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

    const validate = (unchangedFieldName?: string) => {
        let isValid = true;

        createUserFields.forEach((field: MappedField) => {
            const unchangedPassword = unchangedFieldName && (field.name === unchangedFieldName && !fields[unchangedFieldName].value);

            if (unchangedPassword) {
                return
            }

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

    const handleSaveCreate = async () => {
        try {
            const isValid = validate();
            if (!isValid) return;

            await createUser({
                username: fields.username.value,
                email: fields.userEmail.value,
                password: fields.userPassword.value,
            }).unwrap().then(result => {
                setCreateRow && setCreateRow(false);
            });
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }


    const handleSaveEdit = async () => {
        try {
            const isValid = validate(fields.userPassword.name);
            if (!isValid) return;

            await updateUser({
                uuid: user?.uuid || '',
                username: fields.username.value,
                email: fields.userEmail.value,
                password: fields.userPassword.value,
            }).unwrap().then(result => {
                result && setEdit(false);
            });
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    const handleCancel = () => setCreateRow && setCreateRow(false);

    const handleDelete = async () => {
        try {
            await deleteUser({
                user_uuid: user?.uuid || '',
                token: token
            });
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    return <div data-testid="UserRow" className={styles.userRow}>
        <div className={styles.fieldsContainer}>
            {
                createUserFields.map(field => {
                    return (edit || createRow) ?
                        <FormInput
                            key={field.name}
                            className={styles.formInput}
                            stateField={fields[field.name]}
                            field={field}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            hideLabel={true}
                        />
                        :
                        <div key={field.name} className={styles.fieldValue}>{fields[field.name].value}</div>
                })
            }
        </div>
        <div className={styles.buttons}>
            {
                createRow ? <>
                    <button className={styles.saveButton} onClick={handleSaveCreate}>Save</button>
                    <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
                </>
                    : <>
                        <button

                            className={styles.editButton}
                            onClick={edit ? handleSaveEdit : () => setEdit(true)}
                        >
                            {edit ? 'Save' : 'Edit'}
                        </button>
                        <button className={styles.deleteButton} onClick={handleDelete}>Delete</button>
                    </>
            }
        </div>
        {isErrorWithDetail(createUserError) && <div className={styles.error}>{createUserError.data.detail}</div>}
        {isErrorWithDetail(updateUserError) && <div className={styles.error}>{updateUserError.data.detail}</div>}
        {isErrorWithDetail(deleteUserError) && <div className={styles.error}>{deleteUserError.data.detail}</div>}
    </div>
}

export default UserRow;