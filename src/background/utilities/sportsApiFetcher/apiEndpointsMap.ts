import { SportsEnum } from 'common';

/**
 * SPORTS API ENDPOINTS MAP
 *
 * To add new sport
 * 1. Add new value in SportsEnum in common project and its label in sportsLabel
 * 2. Add new mapped value here in endpointsMap, that new value need to have baseEndpoint
 *    and endpoint key in returned json
 */

export default {
    [SportsEnum.Soccer]: {
        baseEndpoint: 'soccer',
        endpointKey: 'midsizeName',
        initialSelectionLength: 9,
    },
    [SportsEnum.BasketBall]: {
        baseEndpoint: 'basketball',
        endpointKey: 'slug',
        initialSelectionLength: 2,
    },
    [SportsEnum.Football]: {
        baseEndpoint: 'football',
        endpointKey: 'slug',
        initialSelectionLength: 2,
    },
    [SportsEnum.Hockey]: {
        baseEndpoint: 'hockey',
        endpointKey: 'slug',
        initialSelectionLength: 2,
    },
    [SportsEnum.Baseball]: {
        baseEndpoint: 'baseball',
        endpointKey: 'slug',
        initialSelectionLength: 4,
    },
    [SportsEnum.Racing]: {
        baseEndpoint: 'racing',
        endpointKey: 'slug',
        initialSelectionLength: 1,
    },
};
