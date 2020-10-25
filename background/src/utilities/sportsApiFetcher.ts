import { getStorageLocal, setStorageLocal, SportApiMatchModel,
    SportsApiFetchRequestType, StorageLocalKeysEnum } from 'common';

export interface TestRequestResponse {
    success: boolean;
    errorMsg?: string;
}

export const footballDataKeywords = {
    baseUri: 'http://api.football-data.org/v2/',
    endpoints: {
        matches: 'matches',
        competitions: 'competitions',
    },
    filters: {
        dateFrom: 'dateFrom',
        dateTo: 'dateTo',
        status: 'status',
    },
    matchStatuses: {
        inPlay: 'IN_PLAY',
        halftime: 'PAUSED',
    },
};

class SportsApiFetcher {
    private isThrottled: boolean = false;
    private throttlingDate: Date;

    public async Fetch(requestType: SportsApiFetchRequestType, token?: string) {
        if (this.isThrottled) {
            const thisMoment = new Date();
            if (thisMoment.getTime() - this.throttlingDate.getTime() > 61 * 1000) {
                this.isThrottled = false;
            } else {
                return;
            }
        }

        switch (requestType) {
            case SportsApiFetchRequestType.Test: {
                return await this.testRequest(token as string);
            }
            case SportsApiFetchRequestType.GetLiveMatches: {
                return await this.getLiveMathes();
            }
            default:
                const exhaustiveCheck: never = requestType;
                break;
        }
    }

    private getLiveMathes = async(): Promise<Array<SportApiMatchModel>> => {
        let relativeUri = `${footballDataKeywords.endpoints.matches}`;

        // const today = new Date();
        // const date = formatDate(today);
        // relativeUri += `?${footballDataKeywords.filters.dateFrom}=${date}&${footballDataKeywords.filters.dateTo}=${date}`;

        relativeUri += `?${footballDataKeywords.filters.status}=${footballDataKeywords.matchStatuses.halftime},${footballDataKeywords.matchStatuses.inPlay}`;

        const result = await this.executeRequest(relativeUri);
        return result.matches.map((m) => ({
            id: m.id,
            homeTeam: m.homeTeam.name,
            awayTeam: m.awayTeam.name,
            competitionName: m.competition.name,
        } as SportApiMatchModel));
    }

    private testRequest = async(token: string): Promise<TestRequestResponse> => {
        try {
            await this.executeRequest(footballDataKeywords.endpoints.competitions, token);

            await setStorageLocal(StorageLocalKeysEnum.SportsApiToken, token);

            return Promise.resolve({ success: true });
        } catch (error) {
            console.warn(error);

            return  Promise.reject({ success: false, errorMsg: error.message });
        }
    }

    private executeRequest = async(uri: string, token?: string): Promise<any> => {
        let headerToken;
        if (!token) {
            headerToken = await getStorageLocal<string>(StorageLocalKeysEnum.SportsApiToken);
        } else {
            headerToken = token;
        }

        const resp = await fetch(`${footballDataKeywords.baseUri}${uri}`, {
            headers: {
                'X-Auth-Token': headerToken,
            },
        });

        const data = await resp.json();
        if (resp.ok) {
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
