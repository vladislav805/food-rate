import * as React from 'react';
import GlobalContext from '@components/GlobalContext';
import {
    mdiAccount,
    mdiCommentTextOutline,
    mdiHamburger,
    mdiHamburgerPlus,
    mdiLogoutVariant,
    mdiMagnify,
    mdiMapSearch
} from '@mdi/js';

type IMenuItem = {
    path: string;
    icon: string;
    title: string;
    standard?: boolean;
} | {
    placeholder: MenuPlaceholderName;
};

export type MenuPlaceholderName = 'authorize';

export default function useMenuItems(): IMenuItem[] {
    const context = React.useContext(GlobalContext);

    return React.useMemo(() => {
        const user = context.user;

        return [
            {
                path: '/',
                icon: mdiHamburger,
                title: 'Главная',
            },
            {
                path: '/map',
                icon: mdiMapSearch,
                title: 'Карта заведений',
            },
            !user && {
                placeholder: 'authorize',
            },
            {
                path: '/search',
                icon: mdiMagnify,
                title: 'Поиск',
            },
            user && {
                path: `/user/${user.id}`,
                icon: mdiAccount,
                title: user.name,
            },
            user && {
                path: `/user/${user.id}/reviews`,
                icon: mdiCommentTextOutline,
                title: 'Мои отзывы',
            },
            user && {
                path: `/restaurant/new`,
                icon: mdiHamburgerPlus, // todo
                title: 'Добавить заведение',
            },
            user && {
                path: '/auth/logout',
                icon: mdiLogoutVariant,
                title: 'Выход',
                standard: true,
            },
        ].filter(Boolean) as IMenuItem[];
    }, [context.user]);
}