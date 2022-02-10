import * as crypto from 'crypto';
import type { ITelegramAuthResult } from './telegram.typings';

const GLUE = '\n';

const isValidTelegramHash = (data: ITelegramAuthResult, botSecret: string): boolean => {
    const secret = crypto.createHash('sha256')
        .update(botSecret)
        .digest();
    const checkString = `auth_date=${data.auth_date}${GLUE}first_name=${data.first_name}${GLUE}id=${data.id}${GLUE}username=${data.username}`;
    const hmac = crypto.createHmac('sha256', secret)
        .update(checkString)
        .digest('hex')
    return hmac === data.hash;
};

export default isValidTelegramHash;
