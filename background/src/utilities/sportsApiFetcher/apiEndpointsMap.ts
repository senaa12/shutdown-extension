import { BasketballLeaguesEnum, FootballLeaguesEnum, SoccerLeaguesEnum, SportsEnum } from 'common';

/**
 * SPORTS API ENDPOINTS MAP
 *
 * To add new sport
 * 1. Add new value in SportsEnum in common project and its label in sportsLabel
 * 2. Add new leagues enum in common project
 * 3. Add new mapped value here in endpointsMap,
 *    that new value need to have baseEndpoint, leaguesEnum (newly created leagues enum)
 *    and leagues variable with values from league enum
 */

export default {
    [SportsEnum.Soccer]: {
        baseEndpoint: 'soccer',
        leaguesEnum: SoccerLeaguesEnum,
        leagues: {
            [SoccerLeaguesEnum.UefaNationsLeague]: 'uefa.nations',
            [SoccerLeaguesEnum.ConcafNationsLeague]: 'concacaf.nations.league',
            [SoccerLeaguesEnum.AfricaCupOfNations]: 'caf.nations',
            [SoccerLeaguesEnum.UefaEuroQualifying]: 'uefa.euroq',
            [SoccerLeaguesEnum.InternationalFriendly]: 'fifa.friendly',
            [SoccerLeaguesEnum.ChampionsLeague]: 'uefa.champions',
            [SoccerLeaguesEnum.ConcafChampionsLeague]: 'concacaf.champions',
            [SoccerLeaguesEnum.EuropaLeague]: 'uefa.europa',
            [SoccerLeaguesEnum.GermanyFirst]: 'ger.1',
            [SoccerLeaguesEnum.EnglandFirst]: 'eng.1',
            [SoccerLeaguesEnum.ItalyFirst]: 'ita.1',
            [SoccerLeaguesEnum.SpainFirst]: 'esp.1',
            [SoccerLeaguesEnum.FranceFirst]: 'fra.1',
            [SoccerLeaguesEnum.UsaFirst]: 'usa.1',
            [SoccerLeaguesEnum.ChineseFirst]: 'chn.1',
            [SoccerLeaguesEnum.AustraliaFirst]: 'aus.1'
        },
    },
    [SportsEnum.BasketBall]: {
        baseEndpoint: 'basketball',
        leaguesEnum: BasketballLeaguesEnum,
        leagues: {
            [BasketballLeaguesEnum.NBA]: 'nba',
        },
    },
    [SportsEnum.Football]: {
        baseEndpoint: 'football',
        leaguesEnum: FootballLeaguesEnum,
        leagues: {
            [FootballLeaguesEnum.NFL]: 'nfl',
        },
    },
};
