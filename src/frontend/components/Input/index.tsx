import * as React from 'react';
import type { IClassNameProps } from '@frontend/typings';

import { cnInput } from './const';

import './Input.scss';

interface IInputValue<T> {
    value: T;
    setValue: (value: T) => void;
}

interface IInputProps extends IInputValue<string>, IClassNameProps {
    type: 'text' | 'textarea' | 'password' | 'url' | 'search';
    name: string;
    readOnly?: boolean;
    disabled?: boolean;
    placeholder?: string;
    onInput?: React.FormEventHandler;
}

const Input: React.FC<IInputProps> = props => {
    const { type, value, setValue, className, ...rest } = props;

    const onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue((event.target as HTMLInputElement).value);
    }, []);

    const classNameReady = React.useMemo(() => cnInput(null, [className]), [className]);

    if (type === 'textarea') {
        return (
            <textarea
                className={classNameReady}
                {...rest}
                value={value}
                onChange={onChange}
            />
        );
    } else {
        return (
            <input
                className={classNameReady}
                type={type}
                {...rest}
                value={value}
                onChange={onChange}
                autoComplete="off"
            />
        );
    }
};

export default Input;
