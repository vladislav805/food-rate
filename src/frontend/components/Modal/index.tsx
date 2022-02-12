import * as React from 'react';

import { cnModal, modalOverlayCn, modalWindowCn } from './const';

import './Modal.scss';

type IModalProps = React.PropsWithChildren<{
    visible: boolean;
    setVisible: (visible: boolean) => void;
}>;

const Modal: React.FC<IModalProps> = props => {
    const modalRoot = React.createRef<HTMLDivElement>();

    const closeModal = React.useCallback(() => {
        if (!modalRoot.current) return;

        const root = modalRoot.current;

        root.classList.add('Modal_closing');
        root.addEventListener('animationend', () => {
            props.setVisible(false);
        });
    }, [modalRoot]);

    if (!props.visible) return null;
   
    return (
        <div
            ref={modalRoot}
            className={cnModal()}
        >
            <div className={modalOverlayCn} onClick={closeModal} />
            <div className={modalWindowCn}>
                {props.children}
            </div>
        </div>
    );
};

export default Modal;
