import axios from 'axios';

/**
 * Ответ от API: в случае успеха, информация о местоположении
 */
export interface IGeoIpResult {
    status: 'success';

    /** Россия */
    country: string;

    /** RU, UA, BY */
    countryCode: string;

    /** SPE, ROS, MOW, BA, VI */
    region: string;

    /** Санкт-Петербург, Ростовская область, Москва, Башкортостан, Витебская область */
    regionName: string;

    /** Санкт-Петербург, Ростов-на-Дону, Москва, Уфа, Витебск */
    city: string;
}

/**
 * Ответ от API: в случае, если не удалось определить местоположение
 */
export interface IGeoIpError {
    status: 'fail';
    message: string;
}

/**
 * Общий тип ответа API
 */
export type IGeoIpResponse = IGeoIpResult | IGeoIpError;

/**
 * Возращает адрес API
 * @param ip IP-адрес, информацию о котором необходимо получить
 */
function getEndpointUrl(ip: string): string {
    // noinspection HttpUrlsUsage
    return `http://ip-api.com/json/${ip}?lang=ru&fields=status,message,countryCode,region,regionName,city`;
}

/**
 * Некий кэш, в котором будет храниться информация о уже пробитых IP, чтобы не исчерпать лимит
 */
const cache = new Map<string, IGeoIpResult>();

/**
 * Определение примерного местоположения по IP до города
 * @param ip Требуемый IP-адрес
 */
export async function requestGeoIP(ip: string): Promise<IGeoIpResult | null> {
    if (cache.has(ip)) {
        return cache.get(ip) as IGeoIpResult;
    }

    const { status, statusText, data } = await axios.get<IGeoIpResponse>(getEndpointUrl(ip), {
        responseType: 'json',
        timeout: 1000,
    });

    if (status !== 200) {
        console.error(`Cannot retrieve GeoIp for ${ip}: ${status} ${statusText}`);
        return null;
    }

    if (data.status === 'fail') {
        console.error(`Failed GeoIp for ${ip}: ${data.message}`);
        return null;
    }

    cache.set(ip, data);

    return data;
}
