import * as React from 'react';
import type { IClassNameProps } from '@frontend/typings';

import { cnImage, imageImgCn } from './const';

import './Image.scss';

export interface IImageProps extends IClassNameProps {
    url: string;
    alt: string;
    imageWidth?: number;
    imageHeight?: number;
    cover?: boolean;
    circle?: boolean;
    onClick?: () => void;
}

const Image = React.forwardRef<HTMLDivElement, IImageProps>((props, ref) => {
    const { url, alt, imageWidth, imageHeight, className, onClick, cover, circle } = props;

    const [loaded, setLoaded] = React.useState<boolean>(false);

    const onLoad = React.useCallback(() => setLoaded(true), []);

    React.useEffect(() => setLoaded(false), [url]);

    const styles = React.useMemo(() => ({
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        '--aspect-ratio': imageHeight && imageWidth ? imageHeight / imageWidth : undefined,
    } as React.CSSProperties), [imageWidth, imageHeight]);

    return (
        <div
            onClick={onClick}
            ref={ref}
            className={cnImage({ loaded, cover, circle }, [className])}
            style={styles}
        >
            <img
                src={url}
                alt={alt}
                className={imageImgCn}
                onLoad={onLoad}
            />
        </div>
    );
});

export default Image;
