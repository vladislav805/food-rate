import * as React from 'react';
import type { IImageProps } from '@components/Image';
import useIntersectionObserver from '@utils/useIntersectionObserver';

import { DEFAULT_SPINNER } from '../const';

export default function withIntersection<T extends IImageProps>(Component: React.ComponentType<T>): React.ComponentType<T> {
    return props => {
        const ref = React.createRef<HTMLDivElement>();
        const [visible, setVisible] = React.useState<boolean>(false);

        useIntersectionObserver({
            target: ref,
            onIntersect: ([{ isIntersecting, target }], observer) => {
                if (isIntersecting) {
                    setVisible(true);
                    observer.unobserve(ref.current as HTMLElement);
                }
            },
            threshold: 0,
            margins: '0px',
        });

        return (
            <Component ref={ref} {...props} url={visible ? props.url : DEFAULT_SPINNER} />
        );
    };
}
