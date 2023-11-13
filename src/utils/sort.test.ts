import { sortCards } from './sort';
import { SORT_DIRECTION, SORT_OPTION } from 'constants/sorting';

describe('sortCards', () => {
    const cards = [
        {
            uuid: '1',
            created_on: '2023-01-01',
            last_updated: '2023-01-02',
            num_of_projects: 5,
            num_of_properties: 2,
            head_end: 'A'

        },
        {
            uuid: '2',
            created_on: '2023-01-02',
            last_updated: '2023-01-01',
            num_of_projects: 10,
            num_of_properties: 3,
            head_end: 'B'
        },
        {
            uuid: '3',
            created_on: '2023-01-03',
            last_updated: '2023-01-03',
            num_of_projects: 8,
            num_of_properties: 4,
            head_end: 'C'
        }
    ];

    it('should sort cards by created date in ascending order', () => {
        const sortBy = SORT_OPTION.CREATED;
        const direction = SORT_DIRECTION.ASC;
        const sortedCards = sortCards(cards, sortBy, direction);
        expect(sortedCards).toEqual([
            {
                uuid: '1',
                created_on: '2023-01-01',
                last_updated: '2023-01-02',
                num_of_projects: 5,
                num_of_properties: 2,
                head_end: 'A'
            },
            {
                uuid: '2',
                created_on: '2023-01-02',
                last_updated: '2023-01-01',
                num_of_projects: 10,
                num_of_properties: 3,
                head_end: 'B'
            },
            {
                uuid: '3',
                created_on: '2023-01-03',
                last_updated: '2023-01-03',
                num_of_projects: 8,
                num_of_properties: 4,
                head_end: 'C'
            }
        ]);
    });

    it('should sort cards by created date in descending order', () => {
        const sortBy = SORT_OPTION.CREATED;
        const direction = SORT_DIRECTION.DESC;
        const sortedCards = sortCards(cards, sortBy, direction);
        expect(sortedCards).toEqual([
            {
                uuid: '3',
                created_on: '2023-01-03',
                last_updated: '2023-01-03',
                num_of_projects: 8,
                num_of_properties: 4,
                head_end: 'C'
            },
            {
                uuid: '2',
                created_on: '2023-01-02',
                last_updated: '2023-01-01',
                num_of_projects: 10,
                num_of_properties: 3,
                head_end: 'B'
            },
            {
                uuid: '1',
                created_on: '2023-01-01',
                last_updated: '2023-01-02',
                num_of_projects: 5,
                num_of_properties: 2,
                head_end: 'A'
            }
        ]);
    });

    it('should sort cards by last modified date in ascending order', () => {
        const sortBy = SORT_OPTION.MODIFIED;
        const direction = SORT_DIRECTION.ASC;
        const sortedCards = sortCards(cards, sortBy, direction);
        expect(sortedCards).toEqual([
            {
                uuid: '2',
                created_on: '2023-01-02',
                last_updated: '2023-01-01',
                num_of_projects: 10,
                num_of_properties: 3,
                head_end: 'B'
            },
            {
                uuid: '1',
                created_on: '2023-01-01',
                last_updated: '2023-01-02',
                num_of_projects: 5,
                num_of_properties: 2,
                head_end: 'A'
            },
            {
                uuid: '3',
                created_on: '2023-01-03',
                last_updated: '2023-01-03',
                num_of_projects: 8,
                num_of_properties: 4,
                head_end: 'C'
            }
        ]);
    });

    it('should sort cards by last modified date in descending order', () => {
        const sortBy = SORT_OPTION.MODIFIED;
        const direction = SORT_DIRECTION.DESC;
        const sortedCards = sortCards(cards, sortBy, direction);
        expect(sortedCards).toEqual([
            {
                uuid: '3',
                created_on: '2023-01-03',
                last_updated: '2023-01-03',
                num_of_projects: 8,
                num_of_properties: 4,
                head_end: 'C'
            },
            {
                uuid: '1',
                created_on: '2023-01-01',
                last_updated: '2023-01-02',
                num_of_projects: 5,
                num_of_properties: 2,
                head_end: 'A'
            },
            {
                uuid: '2',
                created_on: '2023-01-02',
                last_updated: '2023-01-01',
                num_of_projects: 10,
                num_of_properties: 3,
                head_end: 'B'
            }
        ]);
    });

    it('should sort cards by number of projects in ascending order', () => {
        const sortBy = SORT_OPTION.PROJECTS;
        const direction = SORT_DIRECTION.ASC;
        const sortedCards = sortCards(cards, sortBy, direction);
        expect(sortedCards).toEqual([
            {
                uuid: '1',
                created_on: '2023-01-01',
                last_updated: '2023-01-02',
                num_of_projects: 5,
                num_of_properties: 2,
                head_end: 'A'
            },
            {
                uuid: '3',
                created_on: '2023-01-03',
                last_updated: '2023-01-03',
                num_of_projects: 8,
                num_of_properties: 4,
                head_end: 'C'
            },
            {
                uuid: '2',
                created_on: '2023-01-02',
                last_updated: '2023-01-01',
                num_of_projects: 10,
                num_of_properties: 3,
                head_end: 'B'
            }
        ]);
    });

    it('should sort cards by number of projects in descending order', () => {
        const sortBy = SORT_OPTION.PROJECTS;
        const direction = SORT_DIRECTION.DESC;
        const sortedCards = sortCards(cards, sortBy, direction);
        expect(sortedCards).toEqual([
            {
                uuid: '2',
                created_on: '2023-01-02',
                last_updated: '2023-01-01',
                num_of_projects: 10,
                num_of_properties: 3,
                head_end: 'B'
            },
            {
                uuid: '3',
                created_on: '2023-01-03',
                last_updated: '2023-01-03',
                num_of_projects: 8,
                num_of_properties: 4,
                head_end: 'C'
            },
            {
                uuid: '1',
                created_on: '2023-01-01',
                last_updated: '2023-01-02',
                num_of_projects: 5,
                num_of_properties: 2,
                head_end: 'A'
            }
        ]);
    });

    it('should sort cards by number of properties in ascending order', () => {
        const sortBy = SORT_OPTION.PROPERTY;
        const direction = SORT_DIRECTION.ASC;
        const sortedCards = sortCards(cards, sortBy, direction);
        expect(sortedCards).toEqual([
            {
                uuid: '1',
                created_on: '2023-01-01',
                last_updated: '2023-01-02',
                num_of_projects: 5,
                num_of_properties: 2,
                head_end: 'A'
            },
            {
                uuid: '2',
                created_on: '2023-01-02',
                last_updated: '2023-01-01',
                num_of_projects: 10,
                num_of_properties: 3,
                head_end: 'B'
            },
            {
                uuid: '3',
                created_on: '2023-01-03',
                last_updated: '2023-01-03',
                num_of_projects: 8,
                num_of_properties: 4,
                head_end: 'C'
            }
        ]);
    });

    it('should sort cards by number of properties in descending order', () => {
        const sortBy = SORT_OPTION.PROPERTY;
        const direction = SORT_DIRECTION.DESC;
        const sortedCards = sortCards(cards, sortBy, direction);
        expect(sortedCards).toEqual([
            {
                uuid: '3',
                created_on: '2023-01-03',
                last_updated: '2023-01-03',
                num_of_projects: 8,
                num_of_properties: 4,
                head_end: 'C'
            },
            {
                uuid: '2',
                created_on: '2023-01-02',
                last_updated: '2023-01-01',
                num_of_projects: 10,
                num_of_properties: 3,
                head_end: 'B'
            },
            {
                uuid: '1',
                created_on: '2023-01-01',
                last_updated: '2023-01-02',
                num_of_projects: 5,
                num_of_properties: 2,
                head_end: 'A'
            },
        ]);
    });

    it('should sort cards by head end in ascending order', () => {
        const sortBy = SORT_OPTION.TELEPHONE_EXCHANGE;
        const direction = SORT_DIRECTION.ASC;
        const sortedCards = sortCards(cards, sortBy, direction);
        expect(sortedCards).toEqual([
            {
                uuid: '1',
                created_on: '2023-01-01',
                last_updated: '2023-01-02',
                num_of_projects: 5,
                num_of_properties: 2,
                head_end: 'A'
            },
            {
                uuid: '2',
                created_on: '2023-01-02',
                last_updated: '2023-01-01',
                num_of_projects: 10,
                num_of_properties: 3,
                head_end: 'B'
            },
            {
                uuid: '3',
                created_on: '2023-01-03',
                last_updated: '2023-01-03',
                num_of_projects: 8,
                num_of_properties: 4,
                head_end: 'C'
            },
        ]);
    });

    it('should sort cards by head end in descending order', () => {
        const sortBy = SORT_OPTION.TELEPHONE_EXCHANGE;
        const direction = SORT_DIRECTION.DESC;
        const sortedCards = sortCards(cards, sortBy, direction);
        expect(sortedCards).toEqual([
            {
                uuid: '3',
                created_on: '2023-01-03',
                last_updated: '2023-01-03',
                num_of_projects: 8,
                num_of_properties: 4,
                head_end: 'C'
            },
            {
                uuid: '2',
                created_on: '2023-01-02',
                last_updated: '2023-01-01',
                num_of_projects: 10,
                num_of_properties: 3,
                head_end: 'B'
            },
            {
                uuid: '1',
                created_on: '2023-01-01',
                last_updated: '2023-01-02',
                num_of_projects: 5,
                num_of_properties: 2,
                head_end: 'A'
            },
        ]);
    });
});