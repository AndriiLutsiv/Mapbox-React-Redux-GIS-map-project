//sort favourite
export const FAVOURITE_KEY = 'FAVOURITE_KEY';
export interface FavouriteDetails {
    isFavourite: boolean;
}

//sort select
export enum SORT_OPTION {
    MODIFIED = 'last_updated',
    CREATED = 'created_on',
    PROJECTS = 'num_of_projects',
    PROPERTY = 'num_of_properties',
    TELEPHONE_EXCHANGE = 'head_end'
}

export enum SORT_DIRECTION {
    ASC = 'asc',
    DESC = 'desc'
}

export type SortText = 'Created' | 'Last modified' | 'Projects' | 'Property Count' | 'Telephone Exchange';

export interface SortDetails {
    option: SORT_OPTION,
    direction: SORT_DIRECTION,
    text?: SortText
}

export const SORT_KEY = 'Sort_Scenarios';