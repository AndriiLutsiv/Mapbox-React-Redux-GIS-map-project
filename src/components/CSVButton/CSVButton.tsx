import { Button } from "components/Button"
import { getDownloadData } from "components/RetoolChartsBlock/utils/getDownloadData/getDownloadData";
import React, { useEffect, useState } from "react"
import { CSVLink } from "react-csv";

interface Props {
    filename: string;
    data: any;
    arrOfProps?: string[];
    preparedData?: any;
}
const CSVButton: React.FC<Props> = ({ data, preparedData, filename, arrOfProps }) => {
    const [csvData, setCSVData] = useState<{ [key: string]: any }[]>([{}]);
    useEffect(() => {

        if(preparedData) {
            setCSVData(preparedData)
        }

        if (data.length) {
            const csvData = getDownloadData(data, arrOfProps || []);
            
            setCSVData(csvData)
        }
    }, [data, arrOfProps, preparedData]);

    const filenameFile = filename.includes('.csv') ? filename : `${filename}.csv`


    return <CSVLink
        data-testid='link'
        data={csvData || 'No Data'}
        filename={filename || filenameFile}>
        <Button data-testid='download'
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.5 12.5V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V12.5M14.1667 8.33333L10 12.5M10 12.5L5.83333 8.33333M10 12.5V2.5" stroke="#F5F5F5" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>}>
            <>
                Download
            </>
        </Button></CSVLink>
}

export default CSVButton;