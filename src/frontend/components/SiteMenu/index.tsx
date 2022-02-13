import * as React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import Overlay from '@components/Overlay';
import { root__menuOpened } from '@components/Root/const';
import useMenuItems from '@components/SiteMenu/items';

import { siteMenuCn, siteMenuItemCn, siteMenuItemIconCn, siteMenuItemTitleCn } from './const';

import './SiteMenu.scss';

type ISiteMenuProps = {
    visible: boolean;
    setVisible: (visible: boolean) => void;
};

const SiteMenu: React.FC<ISiteMenuProps> = ({ visible, setVisible }) => {
    React.useEffect(() => {
        document.body.classList.toggle(root__menuOpened, visible);
    }, [visible]);

    const closeMenu = React.useCallback(() => setVisible(false), [visible]);

    const items = useMenuItems();

    return (
        <>
            <Overlay
                visible={visible}
                setVisible={setVisible}
                onClick={closeMenu}
            />
            <div className={siteMenuCn}>
                {items.map(item => (
                    <Link
                        className={siteMenuItemCn}
                        key={item.path}
                        onClick={closeMenu}
                        to={item.path}
                    >
                        <Icon
                            className={siteMenuItemIconCn}
                            path={item.icon}
                        />
                        <span className={siteMenuItemTitleCn}>{item.title}</span>
                    </Link>
                ))}
            </div>
        </>
    );
};

export default SiteMenu;