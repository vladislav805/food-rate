import config from '%config';

const getAuthorizationUrl = () => {
    const params = new URLSearchParams({
        display: 'page',
        client_id: config.VK_APP_ID,
        redirect_uri: config.AUTH_URL_VK_REDIRECT,
        scope: 'offline',
        response_type: 'code',
        v: config.VK_API_VERSION,
    });
    return `https://oauth.vk.com/authorize?${params.toString()}`;
};

const VkClient = {
    getAuthorizationUrl,
};

export default VkClient;
