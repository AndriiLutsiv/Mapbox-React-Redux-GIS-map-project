import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './SectionDraw.module.scss';
import { Map } from 'components/Map';
import { HighlightedText } from './HiglightedText';
import { useMap } from 'app/providers/MapProvider';

interface Item {
    id: number;
    name: string;
}

const searchItems: Item[] = [
    { id: 1, name: 'Couple of words' },
    { id: 2, name: 'Sunny Beach' },
    { id: 3, name: 'Mountain Retreat' },
    { id: 4, name: 'Vintage Bicycle' },
    { id: 5, name: 'Delicious Cupcakes' },
    { id: 6, name: 'Starry Night Sky' },
    { id: 7, name: 'Tropical Paradise' },
    { id: 8, name: 'Cozy Fireplace' },
    { id: 9, name: 'Waterfall Adventure' },
    { id: 10, name: 'Enchanted Forest' },
];

interface Props {
    validationErrors: { name: string; polygon: string; };
    setValidationErrors: React.Dispatch<React.SetStateAction<{ name: string; polygon: string; }>>;
}

const SectionDraw: React.FC<Props> = ({ validationErrors, setValidationErrors }) => {
    const { areas } = useMap();

    const isMounted = useRef(false);

    const [isFocused, setFocused] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);

    //skip validation on first render
    useEffect(() => {
        if (isMounted.current) {
            setValidationErrors((prevState) => ({ ...prevState, polygon: areas[0] ? '' : 'Please draw a polygon' }));
        } else {
            isMounted.current = true;
        }
    }, [areas]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const userInput = e.target.value;
        setSearchValue(userInput);

        // Filter searchItems based on user input
        const filteredItems = searchItems.filter((item) => {
            const lowerCasedItemName = item.name.toLowerCase();
            const lowerCasedUserInput = userInput.toLowerCase();

            // Return the item if it starts with the user input
            return lowerCasedItemName.startsWith(lowerCasedUserInput)
                ? { ...item }
                : null;
        });

        setFilteredItems(filteredItems);
    };

    return (
        <div data-testid="SectionDraw" className={styles.sectionDraw}>
            <h1 className={styles.title}>Draw area</h1>
            <h2 className={styles.subtitle}>??????</h2>
            <section className={styles.drawContainer}>
                <div className={styles.mapBlock}>
                    <Map polygon />
                </div>
                {validationErrors.polygon && <div className={styles.errorText}>{validationErrors.polygon}</div>}
                <div className={styles.searchBlock}>
                    <div className={classNames(styles.field, { [styles.active]: isFocused })}>
                        {!isFocused && (<svg className={styles.magnifierIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z" stroke="#D6D6D6" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" /></svg>)}
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Search postcode"
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            value={searchValue}
                            onChange={handleChange}
                        />
                        {isFocused && (<svg className={styles.arrow} xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none"><path d="M5 8L10 13L15 8" stroke="#F5F5F5" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" /></svg>)}
                    </div>
                </div>
                {
                    (isFocused && (filteredItems.length > 0)) &&
                    <div data-testid="hidden-content" className={styles.hiddenContent}>
                        <div className={styles.contentWrapper}>
                            {
                                filteredItems.map((item: any) => (
                                    <div key={item.id} className={styles.searchedItem}>
                                        <HighlightedText text={item.name} userInput={searchValue} />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                }
            </section>
        </div>
    );
};

export default SectionDraw;