import type { UserContext } from '@database/UserContext';

import { requestGeoIP } from './request';

export interface IUserIpLocation {
    code: string; // RU-SPE
    country: string;
    region: string;
    city: string;
}

const defaultLocation: IUserIpLocation = {
    code: 'RU-SPE',
    country: 'Россия',
    region: 'Санкт-Петербург',
    city: 'Санкт-Петербург',
};

export async function getUserIpLocation(ip: string, context: UserContext): Promise<IUserIpLocation> {
    if (ip === '127.0.0.1') return defaultLocation;

    const geoIp = await requestGeoIP(ip);

    if (!geoIp) return defaultLocation;

    const { countryCode, country, regionName, region, city } = geoIp;

    const result: IUserIpLocation = {
        code: `${countryCode}-${region}`,
        country,
        region: regionName,
        city,
    };

    // noinspection ES6MissingAwait
    context.tryPushRegion(result.code, result.country, result.region, result.city);

    return result;
}
