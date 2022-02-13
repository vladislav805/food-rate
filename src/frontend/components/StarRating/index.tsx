import * as React from 'react';
import type { IClassNameProps } from '@frontend/typings';

import { cnStarRating, starRatingFireCn, starRatingStarCn } from './const';

import './StarRating.scss';

interface IStarRatingProps extends IClassNameProps {
    name: string;
    selected: number | null;
    setSelected: (rate: number) => void;
}

const levels: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const StarRating: React.FC<IStarRatingProps> = (props) => {
    const { selected, setSelected } = props;
    const ref = React.createRef<HTMLDivElement>();
    const onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSelected(Number((event.target as HTMLInputElement).value));
    }, []);

    React.useEffect(() => {
        const fire = ref.current;

        if (fire) {
            const animation = fire.style.animation;
            fire.style.animation = 'none';
            void fire.offsetWidth;
            fire.style.animation = animation;
        }
    }, [selected, ref.current]);

    const cssVar = React.useMemo(() => ({
        '--star-index': String(selected)
    } as React.CSSProperties), [selected]);

    return (
        <div
            className={cnStarRating(null, [props.className])}
            style={cssVar}
            data-index={selected}
        >
            {levels.map(level => (
                <input
                    key={level}
                    className={starRatingStarCn}
                    type="radio"
                    name={props.name}
                    value={level}
                    autoComplete="off"
                    aria-label={String(level)}
                    checked={selected === level}
                    onChange={onChange}
                />
            ))}
            <div ref={ref} className={starRatingFireCn} />
        </div>
    );
};

export default StarRating;
