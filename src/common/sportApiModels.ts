
export enum SportsEnum {
    Soccer,
    BasketBall,
    Football,
    Hockey,
    Baseball,
    Racing,
}

export const sportsLabel = {
    [SportsEnum.Soccer]: 'Football',
    [SportsEnum.BasketBall]: 'Basketball',
    [SportsEnum.Football]: 'American Football',
    [SportsEnum.Hockey]: 'Hockey',
    [SportsEnum.Baseball]: 'Baseball',
    [SportsEnum.Racing]: 'Racing',
};

export interface SportApiMatchModel {
    sport: SportsEnum;
    leagueEndpoint: string;
    id: number;
    homeTeam: string;
    awayTeam: string;
    competitionName: string;
}

export interface SportLeagueModel {
    sport: SportsEnum;
    leagueId: number;
    name: string;
    endpoint: string;
}

export enum SportsApiRequestType {
    GetLiveGames,
    IsEventCompleted,
    GetLeaguesInSports,
}

export interface SportsApiRequest {
    type: SportsApiRequestType;
    data?: SportApiMatchModel;
}
