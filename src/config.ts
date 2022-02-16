const keys = [
    'DATABASE_URI',
    'TELEGRAM_BOT_SECRET',
    'VK_APP_ID',
    'VK_APP_SECRET',
    'VK_APP_TOKEN',
    'VK_API_VERSION',
    'AUTH_URL_VK_REDIRECT',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REDIRECT_URI',
] as const;

type ConfigKey = typeof keys[number];
type ConfigMap = Record<ConfigKey, string>;

let errors = 0;
const config: Record<ConfigKey, string | undefined> = keys.reduce((config, key: ConfigKey) => {
    const value = process.env[key];

    if (value) {
        config[key] = value;
    } else {
        console.error(`${++errors}. Environment variable ${key} is not set!`);
    }

    return config;
}, {} as ConfigMap);

if (errors) {
    throw new Error(`${errors} variable(s) not found. Shut down...`);
}

export default config as ConfigMap;
