import classNames from "classnames";
import styles from '../Table.module.scss';


export const getIcon = (
  label: string,
  sortBy: string | null,
  sortOrder: string | null) => {
    
  let asc = null;

  if (label !== sortBy || sortOrder === null) {
    return;
  }

  if (sortOrder === "asc") {
    asc = true;
  }

  if (sortOrder === "desc") {
    asc = false;
  }

  return (<svg className={classNames(styles.arrow, { [styles.asc]: asc })} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3.33301V12.6663M8 12.6663L12.6667 7.99967M8 12.6663L3.33333 7.99967" stroke="#E5E5E5" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>)
}
