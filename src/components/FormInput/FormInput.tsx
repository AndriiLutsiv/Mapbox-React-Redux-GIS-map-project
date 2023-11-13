import classNames from 'classnames';
import styles from './FormInput.module.scss';
interface Props {
  stateField: { name: string, value: string, isValid: boolean, errorText?: string };
  field: { type: string, name: string, label: string, placeholder: string };
  onChange: (e: React.ChangeEvent<{
    name: string | undefined;
    value: string;
  }>, name: any) => void;
  onFocus: (name: any) => void;
  onBlur: (name: any) => void;
  className?: string;
  hideLabel?: boolean;
}

const FormInput: React.FC<Props> = ({ stateField, field, onChange, onFocus, onBlur, className, hideLabel }) => {
  return <div className={classNames(styles.formInput, className)}>
    {!hideLabel && <div className={styles.label}>{field.label}</div>}
    <input
      type={field.type}
      name={field.name}
      value={stateField.value}
      placeholder={field.placeholder}
      onChange={(e) => onChange(e, field.name)}
      onFocus={() => onFocus(field.name)}
      onBlur={() => onBlur(field.name)}
    />
    {
      !stateField.isValid && <div className={styles.errorText}>{stateField.errorText}</div>
    }
  </div>
}

export default FormInput;