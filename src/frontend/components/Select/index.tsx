import * as React from 'react';
import Icon from '@mdi/react';
import { mdiCheckBold } from '@mdi/js';
import Modal from '@components/Modal';

import {
    cnSelect,
    cnSelectItem,
    selectItemActiveIconCn,
    selectItemIconCn,
    selectItemTitleCn,
    selectValueCn,
} from './const';

import './Select.scss';

type ISelectProps<T extends string | number = string | number> = {
    items: ISelectItem<T>[];
    value: T;
    setValue: SelectChanger<T>;
    inline?: boolean
};

export type SelectChanger<T extends string | number = string | number> = (value: T) => void;

export type ISelectItem<T extends string | number = string | number> = {
    value: T;
    title: string;
    icon?: string;
};

const Select: React.FC<ISelectProps> = props => {
    const { items, value, setValue, inline } = props;
    const [visible, setVisible] = React.useState<boolean>(false);

    const { show } = React.useMemo(() => ({
        show: () => setVisible(true),
    }), [setVisible]);

    const onChangeValue = React.useMemo(() => {
        return (value: string | number) => {
            setValue(value);
            setVisible(false);
        };
    }, []);

    const selectedItem = React.useMemo(() => items.find(item => item.value === value)?.title, [items, value]);

    return (
        <div className={cnSelect({ inline })}>
            <button
                type="button"
                className={selectValueCn}
                onClick={show}
            >{selectedItem ?? '—'}</button>
            <Modal
                setVisible={setVisible}
                visible={visible}
            >
                {items.map(item => (
                    <Item
                        key={item.value}
                        item={item}
                        active={item.value === value}
                        onChangeValue={onChangeValue}
                    />
                ))}
            </Modal>
        </div>
    );
};

type IItemProps = {
    item: ISelectItem;
    active: boolean;
    onChangeValue: (value: string | number) => void;
};

const Item: React.FC<IItemProps> = ({ item, active, onChangeValue }) => {
    const onClick = React.useCallback(() => {
        onChangeValue(item.value);
    }, []);
    return (
        <button
            type="button"
            className={cnSelectItem({ active })}
            onClick={onClick}
        >
            {item.icon && (
                <Icon
                    path={item.icon}
                    className={selectItemIconCn}
                />
            )}
            <span className={selectItemTitleCn}>{item.title}</span>
            {active && (
                <Icon path={mdiCheckBold} className={selectItemActiveIconCn} />
            )}
        </button>
    );
};

export default Select;
