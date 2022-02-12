import * as React from 'react';
import { cnStarRating, starRatingStarCn } from './const';
import type { IClassNameProps } from '@frontend/typings';

import './StarRating.scss';

interface IStarRatingProps extends IClassNameProps {
    name: string;
    selected: number | null;
    setSelected: (rate: number) => void;
}

const levels: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const StarRating: React.FC<IStarRatingProps> = (props) => {
    const { selected, setSelected } = props;
    const onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSelected(Number((event.target as HTMLInputElement).value));
    }, []);

    return (
        <div className={cnStarRating(null, [props.className])}>
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
        </div>
    );
};

export default StarRating;
