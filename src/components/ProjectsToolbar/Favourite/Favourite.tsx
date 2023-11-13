import { useState } from 'react';
import styles from './Favourite.module.scss';
import { FAVOURITE_KEY, FavouriteDetails } from 'constants/sorting';

interface Props {
}

const Favourite: React.FC<Props> = () => {
    const [favourite, setFavourite] = useState(!!localStorage.getItem(FAVOURITE_KEY));

    const toggleFavourite = () => {
        const isStarred = localStorage.getItem(FAVOURITE_KEY);
        const newFavouriteValue = !isStarred;

        if (newFavouriteValue) {
            localStorage.setItem(FAVOURITE_KEY, FAVOURITE_KEY);
        } else {
            localStorage.removeItem(FAVOURITE_KEY);
        }

        setFavourite(newFavouriteValue);

        // Create a custom event (favourite)
        const customEvent = new CustomEvent<FavouriteDetails>(FAVOURITE_KEY, {
            detail: {
                isFavourite: newFavouriteValue,
            },
        });

        // Dispatch the custom event
        window.dispatchEvent(customEvent);
    };

    return <div data-testid='Favourite' className={styles.favourite} onClick={toggleFavourite}>
        {
            favourite ?
                <svg data-testid='favouriteIcon' width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.90229 2.8778C10.0944 2.48869 10.1904 2.29413 10.3208 2.23197C10.4342 2.17789 10.566 2.17789 10.6794 2.23197C10.8098 2.29413 10.9058 2.48869 11.0979 2.8778L12.9201 6.56944C12.9768 6.68432 13.0052 6.74176 13.0466 6.78635C13.0833 6.82584 13.1273 6.85783 13.1762 6.88056C13.2314 6.90623 13.2948 6.91549 13.4215 6.93402L17.4976 7.5298C17.9268 7.59253 18.1414 7.6239 18.2407 7.72874C18.3271 7.81995 18.3678 7.94529 18.3513 8.06985C18.3324 8.21302 18.1771 8.36436 17.8663 8.66702L14.918 11.5387C14.826 11.6282 14.7801 11.673 14.7504 11.7263C14.7242 11.7734 14.7073 11.8252 14.7008 11.8788C14.6935 11.9393 14.7043 12.0025 14.726 12.129L15.4217 16.1851C15.4951 16.6129 15.5318 16.8269 15.4628 16.9538C15.4028 17.0642 15.2962 17.1417 15.1726 17.1646C15.0306 17.1909 14.8385 17.0899 14.4543 16.8879L10.8104 14.9716C10.6969 14.9119 10.6401 14.882 10.5803 14.8703C10.5273 14.8599 10.4729 14.8599 10.4199 14.8703C10.3601 14.882 10.3033 14.9119 10.1898 14.9716L6.54585 16.8879C6.16168 17.0899 5.96959 17.1909 5.82756 17.1646C5.70398 17.1417 5.59735 17.0642 5.53736 16.9538C5.46842 16.8269 5.5051 16.6129 5.57848 16.1851L6.27415 12.129C6.29584 12.0025 6.30669 11.9393 6.29935 11.8788C6.29285 11.8252 6.27601 11.7734 6.24975 11.7263C6.2201 11.673 6.17415 11.6282 6.08224 11.5387L3.13388 8.66702C2.82313 8.36436 2.66776 8.21302 2.64885 8.06985C2.6324 7.94529 2.67304 7.81995 2.75946 7.72874C2.85878 7.6239 3.07339 7.59253 3.50262 7.5298L7.57867 6.93402C7.70543 6.91549 7.76882 6.90623 7.82401 6.88056C7.87288 6.85783 7.91688 6.82584 7.95357 6.78635C7.995 6.74176 8.02336 6.68432 8.08006 6.56944L9.90229 2.8778Z" fill="#FDB022" stroke="#FDB022" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                :
                <svg data-testid='notFavouriteIcon' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M9.40229 2.8778C9.59436 2.48869 9.6904 2.29413 9.82077 2.23197C9.9342 2.17789 10.066 2.17789 10.1794 2.23197C10.3098 2.29413 10.4058 2.48869 10.5979 2.8778L12.4201 6.56944C12.4768 6.68432 12.5052 6.74176 12.5466 6.78635C12.5833 6.82584 12.6273 6.85783 12.6762 6.88056C12.7314 6.90623 12.7948 6.91549 12.9215 6.93402L16.9976 7.5298C17.4268 7.59253 17.6414 7.6239 17.7407 7.72874C17.8271 7.81995 17.8678 7.94529 17.8513 8.06985C17.8324 8.21302 17.6771 8.36436 17.3663 8.66702L14.418 11.5387C14.326 11.6282 14.2801 11.673 14.2504 11.7263C14.2242 11.7734 14.2073 11.8252 14.2008 11.8788C14.1935 11.9393 14.2043 12.0025 14.226 12.129L14.9217 16.1851C14.9951 16.6129 15.0318 16.8269 14.9628 16.9538C14.9028 17.0642 14.7962 17.1417 14.6726 17.1646C14.5306 17.1909 14.3385 17.0899 13.9543 16.8879L10.3104 14.9716C10.1969 14.9119 10.1401 14.882 10.0803 14.8703C10.0273 14.8599 9.97286 14.8599 9.91991 14.8703C9.8601 14.882 9.80333 14.9119 9.6898 14.9716L6.04585 16.8879C5.66168 17.0899 5.46959 17.1909 5.32756 17.1646C5.20398 17.1417 5.09735 17.0642 5.03736 16.9538C4.96842 16.8269 5.0051 16.6129 5.07848 16.1851L5.77415 12.129C5.79584 12.0025 5.80669 11.9393 5.79935 11.8788C5.79285 11.8252 5.77601 11.7734 5.74975 11.7263C5.7201 11.673 5.67415 11.6282 5.58224 11.5387L2.63388 8.66702C2.32313 8.36436 2.16776 8.21302 2.14885 8.06985C2.1324 7.94529 2.17304 7.81995 2.25946 7.72874C2.35878 7.6239 2.57339 7.59253 3.00262 7.5298L7.07867 6.93402C7.20543 6.91549 7.26882 6.90623 7.32401 6.88056C7.37288 6.85783 7.41688 6.82584 7.45357 6.78635C7.495 6.74176 7.52336 6.68432 7.58006 6.56944L9.40229 2.8778Z" stroke="#F5F5F5" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
        }
    </div>
}

export default Favourite;