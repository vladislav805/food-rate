import * as React from 'react';
import Icon from '@mdi/react';
import { mdiHamburger } from '@mdi/js';

import { headerCn, headerHamburgerCn, headerTitleCn } from './const';

import './Header.scss';

type IHeaderProps = {
    title: string;
    toggleMenu: () => void;
};

const Header: React.FC<IHeaderProps> = ({ title, toggleMenu }) => {
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
        </div>
    );
};

export default Header;
