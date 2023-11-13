import React, { Fragment, useEffect, useRef, useState } from "react";
import styles from './Table.module.scss';
import classNames from "classnames";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
    data: any,
    config: any,
    isClickable: boolean,
    round?: boolean;
    stickyColumn?: boolean;
    isSlim?: boolean;
}

export const Table: React.FC<Props> = ({ data, config, isClickable, round, stickyColumn, isSlim }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const [columnWidths, setColumnWidths] = useState(config.map(() => 180)); // Initial width 180px
    const resizingColumnIndex = useRef(-1);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);

    const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
        resizingColumnIndex.current = index;
        startXRef.current = e.clientX;
        startWidthRef.current = columnWidths[index];

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        // When the resize starts, prevent text selection.
        document.body.classList.add(styles.noSelect);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (resizingColumnIndex.current < 0) {
            return;
        }
        const currentX = e.clientX;
        const newWidths = [...columnWidths];
        newWidths[resizingColumnIndex.current] = Math.max(startWidthRef.current + currentX - startXRef.current, 50); // Minimum column width of 50px
        setColumnWidths(newWidths);
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        resizingColumnIndex.current = -1; // Reset the index

        // When the resize ends, allow text selection again.
        document.body.classList.remove(styles.noSelect);
    };

    const theadJSX = config.map((rowData: any, index: number) => {
        const isLast = index === config.length - 1;

        const isHandlerSort = 'sortedHandler' in rowData ;
        const handlerSort = isHandlerSort ? rowData.sortedHandler : () => {};

        return (
            <th
                key={rowData.label}
                style={{ width: columnWidths[index] }}
                className={classNames(styles.cellTitleText, styles.cellTitle, {
                    [styles.slim]: !!isSlim
                })}
                onClick={handlerSort}
            >
                {rowData.label}

                {isHandlerSort && rowData.sortedIcon()}
                {!isLast && <div data-testid='resizeHandle' className={styles.resizeHandle} onMouseDown={handleMouseDown(index)} />}
            </th>
        );
    });

    const rowsJSX = data.map((rowData: any) => {
        const renderedCells = config.map((configItem: any) => {
            return (
                <td
                    onClick={isClickable ? () => navigate(`${pathname}/${rowData.id}`) : undefined}
                    className={classNames(styles.cellPadding, styles.cellText, {
                        [styles.cellTextBold]: configItem.label.toLowerCase().includes('name'),
                        [styles.slim]: isSlim
                    })}
                    key={configItem.label + rowData.id}
                >
                    <div>{configItem.render(rowData as any)}</div>
                </td>
            );
        });

        return <tr key={rowData.id}>{renderedCells}</tr>;
    });

    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return <div className={styles.tableContainer}>
        <table className={classNames(styles.table, {
            [styles.round]: !!round,
            [styles.stickyColumn]: stickyColumn,
        })}>
            <thead>
                <tr>{theadJSX}</tr>
            </thead>
            <tbody>
                {rowsJSX}
            </tbody>
        </table>
    </div>
}