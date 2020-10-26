import { SportApiMatchModel, SportsApiRequest, SportsApiRequestType, SportsEnum } from 'common';
import sportEndpointsMap from './apiEndpointsMap';

class SportsApiFetcher {
    private sportsApiEndpointBase = 'http://site.api.espn.com/apis/site/v2/sports/';
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
            default:
                const exhaustiveCheck: never = requestType.type;
                break;
        }
    }

    private getLiveMathes = async(): Promise<Array<SportApiMatchModel>> => {
        const today = new Date();
        const dateQueryLabel = this.formatDateToRequestString(today);

        const matches: Array<SportApiMatchModel> = new Array<SportApiMatchModel>();

        const sports = Object.keys(SportsEnum).filter((x) => !isNaN(parseInt(x)));

        // parallel async operation, map needs to be instead of forEach because map returns
        // promise that you can await, while forEach is void
        await Promise.all(sports.map(async(sport) => {
            const leagues = Object.keys(sportEndpointsMap[sport].leaguesEnum).filter((x) => !isNaN(parseInt(x)));

            await Promise.all(leagues.map(async (league) => {
                const uri = `${sportEndpointsMap[sport].baseEndpoint}/${sportEndpointsMap[sport].leagues[league]}/scoreboard?dates=${dateQueryLabel}`;

                const result = await this.executeRequest(uri);
                result.events
                    .filter((x) => x.status.type.state === this.matchInGameKeyWord)
                    .forEach((event) => {
                    const competitors = event.competitions[0].competitors;
                    matches.push({
                        id: event.id,
                        sport: parseInt(sport) as SportsEnum,
                        league: parseInt(league) as any,
                        competitionName: result.leagues[0].name,
                        awayTeam: competitors.find((x) => x.homeAway === 'away').team.displayName,
                        homeTeam: competitors.find((x) => x.homeAway === 'home').team.displayName,
                    });
                });
            }));
        }));

        return matches;
    }

    private isEventCompleted = async(event: SportApiMatchModel) => {
        const uri = `${sportEndpointsMap[event.sport].baseEndpoint}/${sportEndpointsMap[event.sport].leagues[event.league]}/scoreboard/${event.id}`;

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
        const resp = await fetch(`${this.sportsApiEndpointBase}${uri}`);

        const data = await resp.json();
        if (resp.ok) {

            console.log(`${this.sportsApiEndpointBase}${uri}`);
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
