import * as React from 'react';
import { Link } from 'react-router-dom';
import { mdiAccount } from '@mdi/js';
import Icon from '@mdi/react';
import Overlay from '@components/Overlay';
import { root__menuOpened } from '@components/Root/const';
import useMenuItems from '@components/SiteMenu/items';
import AuthModal from '@components/AuthModal';

import { siteMenuCn, siteMenuItemCn, siteMenuItemIconCn, siteMenuItemTitleCn } from './const';

import './SiteMenu.scss';

type ISiteMenuProps = {
    visible: boolean;
    setVisible: (visible: boolean) => void;
};

const SiteMenu: React.FC<ISiteMenuProps> = ({ visible, setVisible }) => {
    const [authVisible, setAuthVisible] = React.useState<boolean>(false);

    React.useEffect(() => {
        document.body.classList.toggle(root__menuOpened, visible);
    }, [visible]);

    const closeMenu = React.useCallback(() => setVisible(false), [visible]);

    const openAuthModal = React.useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        closeMenu();
        setAuthVisible(true);
    }, [closeMenu, setAuthVisible]);

    const authButton = React.useMemo(() => {
        return (
            <Link
                className={siteMenuItemCn}
                key="authorize"
                onClick={openAuthModal}
                to="#"
            >
                <Icon
                    className={siteMenuItemIconCn}
                    path={mdiAccount}
                />
                <span className={siteMenuItemTitleCn}>Авторизация</span>
            </Link>
        );
    }, [openAuthModal, closeMenu]);

    const items = useMenuItems();

    return (
        <>
            <Overlay
                visible={visible}
                setVisible={setVisible}
                onClick={closeMenu}
            />
            <div className={siteMenuCn}>
                {items.map(item => {
                    if ('placeholder' in item) {
                        return item.placeholder === 'authorize' ? authButton : null;
                    }

                    if (item.standard) {
                        return (
                            <a
                                className={siteMenuItemCn}
                                key={item.path}
                                href={item.path}
                            >
                                <Icon
                                    className={siteMenuItemIconCn}
                                    path={item.icon}
                                />
                                <span className={siteMenuItemTitleCn}>{item.title}</span>
                            </a>
                        );
                    }

                    return (
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
                    );
                })}
            </div>
            <AuthModal visible={authVisible} setVisible={setAuthVisible} />
        </>
    );
};

export default SiteMenu;