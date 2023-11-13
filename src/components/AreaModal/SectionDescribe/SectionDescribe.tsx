import styles from './SectionDescribe.module.scss';
import { ChangeEvent, useState } from 'react';

interface Props {
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    areaName: string;
    setAreaName: React.Dispatch<React.SetStateAction<string>>;
    validationErrors: { name: string; polygon: string; };
    setValidationErrors: React.Dispatch<React.SetStateAction<{ name: string; polygon: string; }>>;
    area_uuid?: string;
}

const SectionDescribe: React.FC<Props> = ({
    description, setDescription, areaName, setAreaName, validationErrors, setValidationErrors, area_uuid
}) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAreaName(e.target.value);
    }

    const handleFocus = () => setValidationErrors((prevState) => ({ ...prevState, name: '' }));

    const handleBlur = () => setValidationErrors((prevState) => {
        const valueEmpty = areaName.trim().length === 0;
        return {
            ...prevState,
            name: valueEmpty ? 'Field is required' : ''
        }
    });

    return <div className={styles.sectionDescribe}>
        <h1 className={styles.title}>{area_uuid ? 'Edit area' : 'Add area'}</h1>
        <h2 className={styles.subtitle}>Compare XYZ...</h2>

        <section className={styles.nameSection}>
            <label htmlFor="areaNameInput" className={styles.label}>
                Area name
            </label>
            <input
                id="areaNameInput"
                className={styles.input}
                type="text" value={areaName}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            {validationErrors.name && <div className={styles.errorText}>{validationErrors.name}</div>}
        </section>
        <section className={styles.descriptionSection}>
            <label htmlFor="descriptionTextarea" className={styles.label}>
                Description
            </label>
            <textarea
                id="descriptionTextarea"
                className={styles.textarea}
                placeholder="Enter a description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            ></textarea>
        </section>
    </div>
}

export default SectionDescribe;