import * as React from 'react';
import type { IAnimatedComponentProps, IAnimateVisibilityStyleObject } from '@components/withAnimateVisibility';
import withAnimateVisibility from '@components/withAnimateVisibility';
import Overlay from '@components/Overlay';
import { root__scrollDisable } from '@components/Root/const';
import type { IClassNameProps } from '@frontend/typings';

import { cnModal, cnModalWindow } from './const';

import './Modal.scss';

type IModalProps = React.PropsWithChildren<IAnimatedComponentProps & IAnimateVisibilityStyleObject & IClassNameProps>;

const Modal: React.FC<IModalProps> = ({ visible, animateStyles, setVisible, children, className }) => {
    const closeModal = React.useMemo(() => () => setVisible(false), [setVisible]);

    React.useEffect(() => {
        document.body.classList.toggle(root__scrollDisable, visible);
    });
   
    return (
        <div className={cnModal()}>
            <Overlay
                visible={visible}
                setVisible={setVisible}
                onClick={closeModal}
            />
            <div className={cnModalWindow(null, [className])} style={animateStyles}>
                {children}
            </div>
        </div>
    );
};

export default withAnimateVisibility(Modal, {
    inName: 'fadeInUp',
    outName: 'fadeOutDown',
    duration: 500,
    hard: true,
});
