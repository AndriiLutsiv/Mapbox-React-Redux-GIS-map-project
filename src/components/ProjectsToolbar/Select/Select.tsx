import { useState, useEffect } from 'react';
import styles from './Select.module.scss';
import classNames from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';
import { SORT_DIRECTION, SORT_OPTION, SortDetails, SORT_KEY, SortText } from 'constants/sorting';
import { useLocation, useParams } from 'react-router-dom';

interface Option {
    id: SORT_OPTION,
    text: SortText
}
export const ScenariosOptions: Option[] = [
    { id: SORT_OPTION.CREATED, text: 'Created' },
    { id: SORT_OPTION.MODIFIED, text: 'Last modified' },
    { id: SORT_OPTION.PROJECTS, text: 'Projects' }
];

export const ProjectsOptions: Option[] = [
    { id: SORT_OPTION.PROPERTY, text: 'Property Count' },
    { id: SORT_OPTION.TELEPHONE_EXCHANGE, text: 'Telephone Exchange' },
];

const defaultScenarios: SortDetails = {
    option: SORT_OPTION.MODIFIED,
    direction: SORT_DIRECTION.DESC,
    text: 'Last modified'
};

const defaultProjects: SortDetails = {
    option: SORT_OPTION.PROPERTY,
    direction: SORT_DIRECTION.DESC,
    text: 'Property Count'
}

interface Props {
}

const Select: React.FC<Props> = () => {
    const params = useParams();
    const location = useLocation();

    const [isOpen, setOpen] = useState(false);

    const [sortBy, setSortBy] = useState<SortDetails | null>(null);

    useEffect(() => {
        const scenariosPage = Object.keys(params).length === 1;
        const projectsPage = params.param2;

        scenariosPage && setSortBy(defaultScenarios);
        projectsPage && setSortBy(defaultProjects);

    }, [location]);

    const toggleContent = () => {
        setOpen((prev) => !prev);
    }

    const handleSortBy = (option: SORT_OPTION, text: SortText) => {
        let newDirection: SORT_DIRECTION;
        if (sortBy?.option === option && sortBy.direction === SORT_DIRECTION.DESC) {
            newDirection = SORT_DIRECTION.ASC;
        } else {
            newDirection = SORT_DIRECTION.DESC;
        }

        const newSort: SortDetails = { option, direction: newDirection, text };
        localStorage.setItem(SORT_KEY, JSON.stringify(newSort));
        setSortBy(newSort);

        // Create a custom event (sort)
        const customEvent = new CustomEvent<SortDetails>(SORT_KEY, {
            detail: { ...newSort }
        });

        // Dispatch the custom event
        window.dispatchEvent(customEvent);
    };

    const projectsPage = params.param2;

    return <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
        <div
            data-testid="Select"
            className={classNames(styles.select, { [styles.active]: isOpen })}
            onClick={toggleContent}
        >
            <div className={styles.sortContent}>
                <div className={styles.selectionName}>Sort:</div>
                <div className={styles.optionItem}>
                    {sortBy?.text} {sortBy?.direction === SORT_DIRECTION.DESC ? '\u2193' : '\u2191'}
                </div>
                <svg data-testid='select-arrow' className={classNames(styles.arrow, { [styles.active]: isOpen })} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#F5F5F5" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className={styles.options}>
                {
                    (projectsPage ? ProjectsOptions : ScenariosOptions)
                        .map(option => <div
                            key={option.id}
                            data-testid='option-item'
                            className={styles.optionItem}
                            onClick={() => handleSortBy(option.id, option.text)}
                        >
                            {option.text}
                        </div>)
                }
            </div>
        </div>
    </OutsideClickHandler>
}

export default Select;