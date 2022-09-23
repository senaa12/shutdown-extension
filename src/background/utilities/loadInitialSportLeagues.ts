import { getStorageLocal, setStorageLocal, SportLeagueModel, SportsApiRequestType, SportsEnum, StorageLocalKeys } from 'common';
import apiEndpointsMap from './sportsApiFetcher/apiEndpointsMap';
import sportsApiFetcher from './sportsApiFetcher/sportsApiFetcher';

export const loadInitialSportLeaguesToCollect = async() => {
    const currentState = await getStorageLocal(StorageLocalKeys.SelectedSports);

    if (!Object.keys(currentState).length) {
        const leagues = await sportsApiFetcher.Fetch({
            type: SportsApiRequestType.GetLeaguesInSports,
        }) as Array<SportLeagueModel>;

        const selectedLeagues = new Array<SportLeagueModel>();

        // get first 10 leagues from each sport
        Object.keys(SportsEnum).map((x) => parseInt(x)).filter((x) => !isNaN(x)).forEach((s) => {
            selectedLeagues.push(
                ...leagues.filter((l) => l.sport === s).splice(0, apiEndpointsMap[s].initialSelectionLength),
            );
        });

        await setStorageLocal(StorageLocalKeys.SelectedSports, selectedLeagues);
    }
};
