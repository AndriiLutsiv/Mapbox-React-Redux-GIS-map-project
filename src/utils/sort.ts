import { Project } from './../models/Project';
import { Scenario } from './../models/Scenario';
import { SORT_DIRECTION, SORT_OPTION } from 'constants/sorting';

export interface SortetItem {
  uuid: string
  area_uuid?: string
  name?: string
  description?: string
  last_updated?: string
  created_on?: string
  starred?: boolean
  num_of_projects?: number
  scenario_uuid?: string,
  num_of_properties?: number,
  head_end?: string
}

export function sortCards(
  cards: SortetItem[] | undefined,
  sortBy: SORT_OPTION,
  direction: SORT_DIRECTION
) {
  if (!cards) return [];
  let sortedCards;

  switch (sortBy) {
    case SORT_OPTION.CREATED:
      sortedCards = [...cards].sort((a, b) => {
        const compareResult = new Date((a as Scenario).created_on).valueOf() - new Date((b as Scenario).created_on).valueOf();
        return direction === SORT_DIRECTION.DESC ? -compareResult : compareResult;
      });
      break;
    case SORT_OPTION.MODIFIED:
      sortedCards = [...cards].sort((a, b) => {
        const compareResult = new Date((a as Scenario).last_updated).valueOf() - new Date((b as Scenario).last_updated).valueOf();
        return direction === SORT_DIRECTION.DESC ? -compareResult : compareResult;
      });
      break;
    case SORT_OPTION.PROJECTS:
      sortedCards = [...cards].sort((a, b) => {
        const compareResult = (a as Scenario).num_of_projects - (b as Scenario).num_of_projects;
        return direction === SORT_DIRECTION.DESC ? -compareResult : compareResult;
      });
      break;
    case SORT_OPTION.PROPERTY:
      sortedCards = [...cards].sort((a, b) => {
        const compareResult = (a as Project).num_of_properties - (b as Project).num_of_properties;
        return direction === SORT_DIRECTION.DESC ? -compareResult : compareResult;
      });
      break;
    case SORT_OPTION.TELEPHONE_EXCHANGE:
      sortedCards = [...cards].sort((a, b) => {
        const compareResult = (a as Project).head_end.localeCompare((b as Project).head_end);
        return direction === SORT_DIRECTION.DESC ? -compareResult : compareResult;
      });
      break;
    default:
      sortedCards = cards;
      break;
  }

  return sortedCards;
}