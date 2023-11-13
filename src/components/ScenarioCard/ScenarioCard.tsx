import { CardSettings } from 'components/CardSettings';
import styles from './ScenarioCard.module.scss';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { scenarioAPI } from 'services/ScenarioService';
import { useAuth } from 'hooks/useAuth';
import { useState, MouseEvent, useRef, ChangeEvent } from 'react';

interface Props {
    uuid?: string;
    area_uuid?: string;
    name: string;
    description: string;
    last_updated: string
    created_on: string
    num_of_projects: number;
    starred: boolean;
    link: string;
}

const ScenarioCard: React.FC<Props> = ({ uuid, name, description, starred, created_on, last_updated, num_of_projects, link }) => {
    const navigate = useNavigate();
    const { token } = useAuth();

    const editRef = useRef<HTMLInputElement | null>(null);

    const [updateScenario, { error: updateScenarioError, isLoading: updateScenarioIsLoading }] = scenarioAPI.useUpdateScenarioMutation();

    const [edit, setEdit] = useState(false);
    const [editValue, setEditValue] = useState(name);

    const rename = () => setEdit(true);

    const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const trimmedValue = inputValue.replace(/\s{2,}/g, ' ');
        setEditValue(trimmedValue);
    }

    const handleBlur = async () => {
        if (!editValue) {
            setEdit(false);
        } else {
            try {
                await updateScenario({
                    uuid: uuid || '',
                    name: editValue
                });
            } catch (error) {
                console.error(error);
            } finally {
                setEdit(false);
            }
        }
    };

    const toggleFavourite = async (e: MouseEvent) => {
        e.stopPropagation();
        try {
            const result = await updateScenario({
                uuid: uuid || '',
                starred: !starred
            })
        } catch (error) {
            console.error(error);
        }
    };

    return <div data-testid='ScenarioCard' className={styles.scenarioCard} onClick={() => navigate(link)}>
        {
            edit ?
                <input
                    data-testid='ScenarioCardTitle'
                    ref={editRef}
                    type="text"
                    className={styles.editField}
                    value={editValue}
                    onClick={(e: MouseEvent) => e.stopPropagation()}
                    onChange={handleEditChange}
                    onBlur={handleBlur}
                    autoFocus
                />
                :
                <h1 className={styles.title} onClick={(e: MouseEvent) => edit ? e.stopPropagation() : undefined}>
                    {name}
                </h1>
        }
        <p className={styles.description}>{description}</p>
        <div data-testid="star-icon" className={styles.star} onClick={toggleFavourite}>
            {
                starred ? <svg data-starred={true} width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.90229 2.8778C10.0944 2.48869 10.1904 2.29413 10.3208 2.23197C10.4342 2.17789 10.566 2.17789 10.6794 2.23197C10.8098 2.29413 10.9058 2.48869 11.0979 2.8778L12.9201 6.56944C12.9768 6.68432 13.0052 6.74176 13.0466 6.78635C13.0833 6.82584 13.1273 6.85783 13.1762 6.88056C13.2314 6.90623 13.2948 6.91549 13.4215 6.93402L17.4976 7.5298C17.9268 7.59253 18.1414 7.6239 18.2407 7.72874C18.3271 7.81995 18.3678 7.94529 18.3513 8.06985C18.3324 8.21302 18.1771 8.36436 17.8663 8.66702L14.918 11.5387C14.826 11.6282 14.7801 11.673 14.7504 11.7263C14.7242 11.7734 14.7073 11.8252 14.7008 11.8788C14.6935 11.9393 14.7043 12.0025 14.726 12.129L15.4217 16.1851C15.4951 16.6129 15.5318 16.8269 15.4628 16.9538C15.4028 17.0642 15.2962 17.1417 15.1726 17.1646C15.0306 17.1909 14.8385 17.0899 14.4543 16.8879L10.8104 14.9716C10.6969 14.9119 10.6401 14.882 10.5803 14.8703C10.5273 14.8599 10.4729 14.8599 10.4199 14.8703C10.3601 14.882 10.3033 14.9119 10.1898 14.9716L6.54585 16.8879C6.16168 17.0899 5.96959 17.1909 5.82756 17.1646C5.70398 17.1417 5.59735 17.0642 5.53736 16.9538C5.46842 16.8269 5.5051 16.6129 5.57848 16.1851L6.27415 12.129C6.29584 12.0025 6.30669 11.9393 6.29935 11.8788C6.29285 11.8252 6.27601 11.7734 6.24975 11.7263C6.2201 11.673 6.17415 11.6282 6.08224 11.5387L3.13388 8.66702C2.82313 8.36436 2.66776 8.21302 2.64885 8.06985C2.6324 7.94529 2.67304 7.81995 2.75946 7.72874C2.85878 7.6239 3.07339 7.59253 3.50262 7.5298L7.57867 6.93402C7.70543 6.91549 7.76882 6.90623 7.82401 6.88056C7.87288 6.85783 7.91688 6.82584 7.95357 6.78635C7.995 6.74176 8.02336 6.68432 8.08006 6.56944L9.90229 2.8778Z" fill="#FDB022" stroke="#FDB022" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                    : <svg data-starred={false} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.40217 2.8778C9.59424 2.48869 9.69028 2.29413 9.82065 2.23197C9.93408 2.17789 10.0659 2.17789 10.1793 2.23197C10.3097 2.29413 10.4057 2.48869 10.5978 2.8778L12.42 6.56944C12.4767 6.68432 12.5051 6.74176 12.5465 6.78635C12.5832 6.82584 12.6272 6.85783 12.6761 6.88056C12.7313 6.90623 12.7946 6.91549 12.9214 6.93402L16.9975 7.5298C17.4267 7.59253 17.6413 7.6239 17.7406 7.72874C17.827 7.81995 17.8677 7.94529 17.8512 8.06985C17.8323 8.21302 17.6769 8.36436 17.3662 8.66702L14.4178 11.5387C14.3259 11.6282 14.28 11.673 14.2503 11.7263C14.2241 11.7734 14.2072 11.8252 14.2007 11.8788C14.1934 11.9393 14.2042 12.0025 14.2259 12.129L14.9216 16.1851C14.995 16.6129 15.0317 16.8269 14.9627 16.9538C14.9027 17.0642 14.7961 17.1417 14.6725 17.1646C14.5305 17.1909 14.3384 17.0899 13.9542 16.8879L10.3103 14.9716C10.1967 14.9119 10.14 14.882 10.0802 14.8703C10.0272 14.8599 9.97274 14.8599 9.91979 14.8703C9.85998 14.882 9.80321 14.9119 9.68967 14.9716L6.04573 16.8879C5.66156 17.0899 5.46947 17.1909 5.32744 17.1646C5.20386 17.1417 5.09723 17.0642 5.03724 16.9538C4.96829 16.8269 5.00498 16.6129 5.07835 16.1851L5.77403 12.129C5.79572 12.0025 5.80656 11.9393 5.79923 11.8788C5.79273 11.8252 5.77589 11.7734 5.74963 11.7263C5.71998 11.673 5.67402 11.6282 5.58211 11.5387L2.63376 8.66702C2.32301 8.36436 2.16764 8.21302 2.14873 8.06985C2.13228 7.94529 2.17292 7.81995 2.25933 7.72874C2.35866 7.6239 2.57327 7.59253 3.0025 7.5298L7.07855 6.93402C7.20531 6.91549 7.26869 6.90623 7.32389 6.88056C7.37276 6.85783 7.41676 6.82584 7.45345 6.78635C7.49488 6.74176 7.52323 6.68432 7.57994 6.56944L9.40217 2.8778Z" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
            }
        </div>
        <CardSettings editHandler={rename} deleteHandler={() => { }} editText='Rename' />
        <p className={styles.text}>Created on:  {format(new Date(created_on), 'dd/MM/yy')}</p>
        <p className={styles.text}>Last modified: {format(new Date(last_updated), 'dd/MM/yy')}</p>
        <p className={styles.text}>Projects: {num_of_projects}</p>
    </div>
}

export default ScenarioCard;