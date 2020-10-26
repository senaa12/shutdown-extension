
export enum SportsEnum {
    Soccer,
    BasketBall,
    Football,
}

export const sportsLabel = {
    [SportsEnum.Soccer]: 'Football',
    [SportsEnum.BasketBall]: 'Basketball',
    [SportsEnum.Football]: 'American Football'
}

export enum SoccerLeaguesEnum {
    // national teams
    UefaNationsLeague,
    ConcafNationsLeague,
    AfricaCupOfNations,
    UefaEuroQualifying,
    InternationalFriendly,

    // clubs
    ChampionsLeague,
    ConcafChampionsLeague,
    EuropaLeague,
    GermanyFirst,
    EnglandFirst,
    ItalyFirst,
    SpainFirst,
    FranceFirst,
    UsaFirst,
    ChineseFirst,
    AustraliaFirst
}

export enum BasketballLeaguesEnum {
    NBA,
}

export enum FootballLeaguesEnum {
    NFL,
}

export interface SportApiMatchModel {
    sport: SportsEnum;
    league: SoccerLeaguesEnum;
    id: number;
    homeTeam: string;
    awayTeam: string;
    competitionName: string;
}

export enum SportsApiRequestType {
    GetLiveGames,
    IsEventCompleted,
}

export interface SportsApiRequest {
    type: SportsApiRequestType;
    data?: SportApiMatchModel;
}
