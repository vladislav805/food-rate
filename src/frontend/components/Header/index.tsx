import * as React from 'react';
import Icon from '@mdi/react';
import { mdiHamburger, mdiMagnify } from '@mdi/js';

import { headerCn, headerHamburgerCn, headerSearchCn, headerTitleCn } from './const';

import './Header.scss';

type IHeaderProps = {
    title: string;
    toggleMenu: () => void;
    openSearch: () => void;
};

const Header: React.FC<IHeaderProps> = ({ title, toggleMenu, openSearch }) => {
    return (
        <div className={headerCn}>
            <button
                className={headerHamburgerCn}
                onClick={toggleMenu}
            >
                <Icon
                    path={mdiHamburger}
                    color={null}
                />
            </button>
            <div className={headerTitleCn}>{title}</div>
            <button
                className={headerSearchCn}
                onClick={openSearch}
            >
                <Icon
                    path={mdiMagnify}
                    color={null}
                />
            </button>
        </div>
    );
};

export default Header;
