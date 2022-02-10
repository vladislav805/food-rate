import * as React from 'react';
import { starRatingCn, starRatingStarCn } from './const';

import './StarRating.scss';

type IStarRatingProps = {
    name: string;
    selected?: number;
};

const levels: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const StarRating: React.FC<IStarRatingProps> = (props) => {
    const [selected, setSelected] = React.useState<number>(props.selected ?? 0);

    const onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSelected(Number((event.target as HTMLInputElement).value));
    }, []);

    return (
        <div className={starRatingCn}>
            {levels.map(level => (
                <input
                    key={level}
                    className={starRatingStarCn}
                    type="radio"
                    name={props.name}
                    value={level}
                    aria-label={String(level)}
                    checked={selected === level}
                    onChange={onChange}
                />
            ))}
        </div>
    );
};

export default StarRating;
