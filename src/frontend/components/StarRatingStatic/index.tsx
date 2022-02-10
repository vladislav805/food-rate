import * as React from 'react';
import pluralize from '@utils/pluralize';
import type { IPluralizeCases } from '@utils/pluralize';

import { cnStarRatingStatic, starRatingStaticBlockCn, starRatingStaticEmptyCn, starRatingStaticFilledCn, starRatingStaticVotersCn } from './const';

import './StarRatingStatic.scss';

type IStarRatingStaticProps = {
    value: number;
    count?: number;
};

const MAX = 10;

const STAR_BLACK = '★';
const STAR_WHITE = '☆';

const votersPluralize: IPluralizeCases = {
    none: 'Ни одной оценки',
    one: '{} оценка',
    some: '{} оценки',
    many: '{} оценок',
};

const StarRatingStatic: React.FC<IStarRatingStaticProps> = ({ value, count }) => {
    const valueInt = Math.round(value);
    return (
        <div className={cnStarRatingStatic()}>
            <div className={starRatingStaticBlockCn}>
                <div className={starRatingStaticFilledCn}>{STAR_BLACK.repeat(valueInt)}</div>
                <div className={starRatingStaticEmptyCn}>{STAR_WHITE.repeat(MAX - valueInt)}</div>
            </div>
            {count !== undefined && (
                <div className={starRatingStaticVotersCn}>{pluralize(count, votersPluralize)}</div>
            )}
        </div>
    );
};

export default StarRatingStatic;
