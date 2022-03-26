import * as React from 'react';

import {
    cnKeyValue,
    keyValueItemCn,
    keyValueItemTitleCn,
    keyValueItemValueCn,
    keyValueItemValueContentCn
} from './const';

import './KeyValue.scss';

type IKeyValueProps = {
    items: IKeyValueItemProps[];
    layout?: 'column' | 'inline' | 'toc';
};

type IKeyValueItemProps = {
    title: React.ReactNode;
    value: React.ReactNode;
};

const KeyValue: React.FC<IKeyValueProps> = props => {
    const className = React.useMemo(() => cnKeyValue({ layout: props.layout || 'column' }), [props.layout]);

    return (
        <div className={className}>
            {props.items.map(item => (
                <div className={keyValueItemCn} key={String(item.title)}>
                    <div className={keyValueItemTitleCn}>{item.title}</div>
                    <div className={keyValueItemValueCn}>
                        <div className={keyValueItemValueContentCn}>{item.value}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KeyValue;
