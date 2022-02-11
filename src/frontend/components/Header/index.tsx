import * as React from 'react';
import Icon from '@mdi/react';
import { mdiHamburger } from '@mdi/js';

import { cnHeader, headerHamburgerCn, headerTitleCn } from './const';

import './Header.scss';

type IHeaderProps = {
    title: string;
};

const Header: React.FC<IHeaderProps> = ({ title }) => {
    const [visibleMenu, setVisibilityMenu] = React.useState<boolean>(false);

    return (
        <div className={cnHeader({
            showMenu: visibleMenu,
        })}>
            <button className={headerHamburgerCn}>
                <Icon path={mdiHamburger} color={null} />
            </button>
            <div className={headerTitleCn}>{title}</div>
        </div>
    );
};

export default Header;
