import * as React from 'react';

import { cnLabel, cnLabelTitle } from './const';

import './Label.scss';

type IWithLabel<T> = T & {
    label: string;
    id: string;
    classNameLabelWrap?: string;
    classNameLabelText?: string;
};

export default function withLabel<T>(Component: React.ComponentType<T>): React.ComponentType<IWithLabel<T>> {
    return (props: IWithLabel<T>) => {
        return (
            <div
                className={cnLabel(null, [props.classNameLabelWrap])}
            >
                <label
                    className={cnLabelTitle(null, [props.classNameLabelText])}
                    htmlFor={props.id}
                >
                    {props.label}
                </label>
                <Component
                    {...props}
                    id={props.id}
                />
            </div>
        )
    };
}