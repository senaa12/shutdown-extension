import { getStorageLocal, SportApiMatchModel, SportLeagueModel,
    SportsApiRequest, SportsApiRequestType, SportsEnum, StorageLocalKeys } from 'common';
import apiEndpointsMap from './apiEndpointsMap';
import sportEndpointsMap from './apiEndpointsMap';

class SportsApiFetcher {
    private sportsApiEndpointBase = 'http://site.api.espn.com/apis/site/v2/';
    private matchInGameKeyWord = 'in';

    private isThrottled: boolean = false;
    private throttlingDate: Date;

    public async Fetch(requestType: SportsApiRequest) {
        if (this.isThrottled) {
            const thisMoment = new Date();
            if (thisMoment.getTime() - this.throttlingDate.getTime() > 61 * 1000) {
                this.isThrottled = false;
            } else {
                return;
            }
        }

        switch (requestType.type) {
            case SportsApiRequestType.IsEventCompleted: {
                return await this.isEventCompleted(requestType.data!);
            }
            case SportsApiRequestType.GetLiveGames: {
                return await this.getLiveMathes();
            }
            case SportsApiRequestType.GetLeaguesInSports: {
                return await this.getLeaguesFromSports();
            }
            default:
                const exhaustiveCheck: never = requestType.type;
                break;
        }
    }

    private getLeaguesFromSports = async(): Promise<any> => {
        const sports = Object.keys(SportsEnum).filter((x) => !isNaN(parseInt(x)));

        const leagues: Array<SportLeagueModel> = new Array<SportLeagueModel>();

        await Promise.all(sports.map(async(sp) => {
            const uri = `leagues/dropdown?sport=${apiEndpointsMap[sp].baseEndpoint}`;
            const result = await this.executeRequest(uri);

            result.leagues.forEach((r) => {
                leagues.push({
                    sport: parseInt(sp) as SportsEnum,
                    leagueId: parseInt(r.id),
                    name: r.name,
                    endpoint: r[apiEndpointsMap[sp].endpointKey],
                } as SportLeagueModel);
            });

            return Promise.resolve();
        }));

        return leagues;
    }

    private getLiveMathes = async(): Promise<Array<SportApiMatchModel>> => {
        const today = new Date();
        const dateQueryLabel = this.formatDateToRequestString(today);

        const matches: Array<SportApiMatchModel> = new Array<SportApiMatchModel>();

        const selectedLeagues = await getStorageLocal<Array<SportLeagueModel>>(StorageLocalKeys.SelectedSports);

        // parallel async operation, map needs to be instead of forEach because map returns
        // promise that you can await, while forEach is void
        await Promise.all(selectedLeagues!.map(async(league) => {
            const uri = `sports/${sportEndpointsMap[league.sport].baseEndpoint}/${[league.endpoint]}/scoreboard?dates=${dateQueryLabel}`;

            const result = await this.executeRequest(uri);
            result.events
                    .filter((x) => x.status.type.state === this.matchInGameKeyWord)
                    .forEach((event) => {
                    const competitors = event.competitions[0].competitors;
                    matches.push({
                            id: event.id,
                            sport: league.sport,
                            leagueEndpoint: league.endpoint,
                            competitionName: result.leagues[0].name,
                            awayTeam: competitors.find((x) => x.homeAway === 'away').team.displayName,
                            homeTeam: competitors.find((x) => x.homeAway === 'home').team.displayName,
                        });
                    });

            return Promise.resolve();
        }));

        return matches;
    }

    private isEventCompleted = async(event: SportApiMatchModel) => {
        const uri = `sports/${sportEndpointsMap[event.sport].baseEndpoint}/${event.leagueEndpoint}/scoreboard/${event.id}`;

        const result = await this.executeRequest(uri);

        return result.status.type.completed;
    }

    private formatDateToRequestString = (date: Date) => {
        let dateString: string = '';
        dateString += date.getFullYear();
        dateString += date.getMonth() < 9
            ? `0${date.getMonth() + 1}`
            : date.getMonth() + 1;
        dateString += date.getDate() < 10
            ? `0${date.getDate()}`
            : date.getDate();

        return dateString;
    }

    private executeRequest = async(uri: string): Promise<any> => {
        console.log(`${this.sportsApiEndpointBase}${uri}`);

        const resp = await fetch(`${this.sportsApiEndpointBase}${uri}`);

        const data = await resp.json();
        if (resp.ok) {

            console.log(data);
            return Promise.resolve(data);
        } else {
            if (resp.status === 429) {
                this.isThrottled = true;
                this.throttlingDate = new Date();
            }

            console.error(data);
            return Promise.reject(data);
        }
    }
}

export default new SportsApiFetcher();
