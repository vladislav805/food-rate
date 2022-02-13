import * as React from 'react';
import Overlay from '@components/Overlay';
import { root__menuOpened } from '@components/Root/const';

import { siteMenuCn } from './const';

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

    return (
        <>
            <Overlay
                visible={visible}
                setVisible={setVisible}
                onClick={closeMenu}
            />
            <div className={siteMenuCn}>
                menu
            </div>
        </>
    );
};

export default SiteMenu;