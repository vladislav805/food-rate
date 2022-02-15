import axios from 'axios';
import config from '%config';
import type { IVkApiResult, IVkAuthorizationResult, IVkError, IVkUser } from './typings';

/**
 * Получение токена и информации об авторизации
 * @param code Код, переданный ВК
 */
async function getAuthorizationInfoByCode(code: string): Promise<IVkAuthorizationResult> {
    const params = new URLSearchParams({
        client_id: config.VK_APP_ID,
        client_secret: config.VK_APP_SECRET,
        redirect_uri: config.AUTH_URL_VK_REDIRECT,
        code,
    });

    const url = `https://oauth.vk.com/access_token?${params.toString()}`;

    const { status, data } = await axios.get<IVkAuthorizationResult>(url, {
        responseType: 'json',
        validateStatus: () => true,
    });

    if (status === 200 || 'access_token' in data) {
        return data as IVkAuthorizationResult;
    }

    throw new Error('Unknown error');
}

/**
 * Получение базовой информации о пользователе по токену
 * @param token Токен, полученный при авторизации
 */
async function getUserInfo(token: string): Promise<IVkUser> {
    const params = new URLSearchParams({
        access_token: token,
        v: config.VK_API_VERSION,
        fields: 'photo_100,photo_200'
    });

    const url = `https://api.vk.com/method/users.get?${params.toString()}`;

    const { status, data } = await axios.get<IVkApiResult<IVkUser[]>>(url, {
        responseType: 'json',
        validateStatus: () => true,
    });

    if (status !== 200 || 'error' in data) {
        throw new Error((data as IVkError).error.error_msg);
    }

    const { response } = data;

    if (!Array.isArray(response) || !response.length) {
        throw new Error('Unknown error (no user)');
    }

    const [user] = response;

    return user;
}

const VkServer = {
    getAuthorizationInfoByCode,
    getUserInfo,
};

export default VkServer;
