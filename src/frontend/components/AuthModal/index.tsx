import * as React from 'react';
import Icon from '@mdi/react';
import Modal from '@components/Modal';
import items from '@components/AuthModal/items';

import { authModalCn, authModalIconCn, authModalItemCn, authModalServiceNameCn } from './const';

import './AuthModal.scss';

type IAuthModalProps = {
    visible: boolean;
    setVisible: (visible: boolean) => void;
};

const AuthModal: React.FC<IAuthModalProps> = (props) => {
    return (
        <Modal visible={props.visible} setVisible={props.setVisible}>
            <div className={authModalCn}>
                {items.map(item => (
                    <a
                        className={authModalItemCn}
                        key={item.link}
                        href={item.link}
                    >
                        <Icon
                            className={authModalIconCn}
                            path={item.icon.path}
                            color={item.icon.color}
                        />
                        <span className={authModalServiceNameCn}>{item.title}</span>
                    </a>
                ))}
            </div>
        </Modal>
    );
};

export default AuthModal;
