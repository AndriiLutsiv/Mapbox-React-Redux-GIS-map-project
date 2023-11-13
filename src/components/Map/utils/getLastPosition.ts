import { LAST_POSITION } from "./constants";

type ResultType = { zoom: number, x: number, y: number, url: string } | undefined;

const isValidUuid = (fromStorage: string, currentUuid: string): boolean => {
    const storedUuid = new URL(fromStorage).pathname.split('/')[4];
    return storedUuid === currentUuid;
};

// Get zoom, x, y from a given URL
export const getParamsFromURL = (urlString: string): ResultType => {
    const url = new URL(urlString);

    const zoom = url.searchParams.get('zoom');
    const x = url.searchParams.get('x');
    const y = url.searchParams.get('y');

    if (zoom && x && y) {
        return {
            zoom: Number(zoom),
            x: Number(x),
            y: Number(y),
            url: url.toString()
        };
    }
    return undefined;
}

export const getLastPosition = (currentUuid?: string): ResultType => {
    // First, check current window URL
    const fromWindow = getParamsFromURL(window.location.href);
    if (fromWindow) {
        const baseUrl = window.location.origin + window.location.pathname;
        window.history.replaceState(null, '', baseUrl);
        return fromWindow;
    }

    // If not present in current URL, then check local storage
    const fromStorage = localStorage.getItem(LAST_POSITION);
    
    if (fromStorage) {
        // If currentUuid is provided, validate against stored UUID
        return currentUuid ? (isValidUuid(fromStorage, currentUuid) ? getParamsFromURL(fromStorage) : undefined) : getParamsFromURL(fromStorage);
    }

    // If neither URL nor local storage has the values, return undefined
    return undefined;
}
