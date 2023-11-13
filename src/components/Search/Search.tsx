import { ChangeEventHandler, useState } from "react";
import styles from './styles.module.scss';

const Search = ({ onChange, value }: any) => {
    const [isLabelHidden, setLabelHidden] = useState(false);

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event: { target: { value: any; }; }) => {
        onChange(event.target.value);
        setLabelHidden(!!event.target.value.length);
    };

    return <div data-testid="Search" className={styles.inputWrapper}>
        {!isLabelHidden && <label data-testid="SearchLabel" htmlFor='search' className={styles.inputLabel}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z" stroke="#D6D6D6" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Search

        </label>}
        <input data-testid="SearchInput"
        className={styles.input}
         type="text" 
         id="search" 
         onChange={handleChange}
         value={value} />
    </div>
}

export default Search;