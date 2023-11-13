import styles from './SectionDraw.module.scss';
// Component for highlighting text
export const HighlightedText: React.FC<{ text: string; userInput: string }> = ({ text, userInput }) => {
    const lowerCasedText = text.toLowerCase();
    const lowerCasedUserInput = userInput.toLowerCase();

    const startIndex = lowerCasedText.indexOf(lowerCasedUserInput);
    const endIndex = startIndex + lowerCasedUserInput.length;

    if (startIndex === -1) {
        return <span className={styles.unhighlighted}>{text}</span>;
    }

    return (
        <>
            <span className={styles.highlighted}>{text.substring(startIndex, endIndex)}</span>
            <span className={styles.unhighlighted}>{text.substring(endIndex)}</span>
        </>
    );
};