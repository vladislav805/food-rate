import type { IGlobalContext } from '@components/GlobalContext';
import isClient from '@utils/isClient';

declare global {
    interface IInitialData {
        key: string | undefined;
        data: any | undefined;
    }

    interface Window {
        /**
         * Контекст: например, информация об авторизованном пользователе
         */
        __context__: IGlobalContext;

        /**
         * Начальные данные, по которому производился серверный рендеринг
         */
        __initial__: IInitialData;
    }
}

export const __context__ = isClient() ? window.__context__ : {} as IGlobalContext;
export const __initial__ = isClient() ? window.__initial__ : {} as IInitialData;
