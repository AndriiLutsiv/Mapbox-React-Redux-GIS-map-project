import { useLocation, useParams } from 'react-router-dom';
import styles from './Scenarios.module.scss';
import { ScenarioCard } from 'components/ScenarioCard';
import { scenarioAPI } from 'services/ScenarioService';
import { useAuth } from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { FAVOURITE_KEY, FavouriteDetails, SORT_KEY, SortDetails, SORT_OPTION, SORT_DIRECTION } from 'constants/sorting';
import { sortCards } from '../../utils/sort';
import { Spinner } from 'components/Spinner';

interface Props {
}

const Scenarios: React.FC<Props> = () => {
  const { pathname } = useLocation();
  const { param1 } = useParams();

  const { token } = useAuth();
  const { data: scenarios, error: getScenariosError, isLoading: getScenariosIsLoading } = scenarioAPI.useGetScenariosQuery({ area_uuid: param1 || '' });

  const [favourite, setFavourite] = useState(!!localStorage.getItem(FAVOURITE_KEY));
  const [sortBy, setSortBy] = useState<SortDetails>({
    option: SORT_OPTION.MODIFIED,
    direction: SORT_DIRECTION.DESC,
    text: 'Last modified'
  });

  useEffect(() => {
    const favouriteListener = (event: CustomEvent<FavouriteDetails>) => {
      setFavourite(event.detail.isFavourite);
    };

    const sortListener = (event: CustomEvent<SortDetails>) => {
      setSortBy(event.detail)
    }

    window.addEventListener(FAVOURITE_KEY, favouriteListener as EventListener);
    window.addEventListener(SORT_KEY, sortListener as EventListener);

    return () => {
      window.removeEventListener(FAVOURITE_KEY, favouriteListener as EventListener);
      window.removeEventListener(SORT_KEY, sortListener as EventListener);
    };
  }, []);

  if (getScenariosIsLoading) {
    return <Spinner className={styles.customSpinner} />
  }

  return <div data-testid='Scenarios' className={styles.scenarios}>
    <div className={styles.cardsContainer}>
      {
        scenarios && sortCards(scenarios, sortBy.option, sortBy.direction)
          .filter((scenario) => favourite ? scenario.starred : scenario)
          .map((scenario) => (<ScenarioCard
            key={scenario.uuid}
            uuid={scenario.uuid}
            name={scenario.name!}
            description={scenario.description!}
            created_on={scenario.created_on!}
            last_updated={scenario.last_updated!}
            num_of_projects={scenario.num_of_projects!}
            starred={scenario.starred!}
            link={`${pathname}/${scenario.uuid}`}
          />))
      }
    </div>
  </div>
}

export default Scenarios;