import * as React from 'react';
import type { IClassNameProps } from '@frontend/typings';

import { cnButton, buttonPressedCn } from './const';

import './Button.scss';

interface IButtonProps extends IClassNameProps {
    type?: 'button' | 'submit';
    name?: string;
    text: string;
    onClick?: () => void;
    disabled?: boolean;
}

const Button: React.FC<IButtonProps> = props => {
    const { type = 'button', text, className, ...rest } = props;

    const ref = React.createRef<HTMLButtonElement>();

    React.useEffect(() => {
        if (!ref.current) return;

        const button = ref.current;

        let timer: number;

        const listener = (event: MouseEvent) => {
            if (timer) {
                window.clearTimeout(timer);
                button.classList.remove(buttonPressedCn)
            }

            button.style.setProperty('--ripple-x', `${event.offsetX}px`);
            button.style.setProperty('--ripple-y', `${event.offsetY}px`);

            button.classList.add(buttonPressedCn);

            timer = window.setTimeout(() => button.classList.remove(buttonPressedCn), 400);
        };

        button.addEventListener('mousedown', listener);

        return () => {
            button.removeEventListener('mousedown', listener);
        };
    }, [ref?.current]);

    return (
        <button
            ref={ref}
            className={cnButton(null, [className])}
            type={type}
            {...rest}
        >
            {text}
        </button>
    );
};

export default Button;
