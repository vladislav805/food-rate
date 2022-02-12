import * as React from 'react';
import pluralize from '@utils/pluralize';
import type { IPluralizeCases } from '@utils/pluralize';

import {
    cnStarRatingStatic,
    starRatingStaticBlockCn,
    starRatingStaticEmptyCn,
    starRatingStaticFilledCn,
    starRatingStaticValueCn,
    starRatingStaticVotersCn
} from './const';

import './StarRatingStatic.scss';

type IStarRatingStaticProps = {
    value: number;
    count?: number;
    large?: boolean;
    centered?: boolean;
    showValue?: boolean;
};

const MAX = 10;

const STAR_BLACK = '★';
const STAR_WHITE = '☆';

const nbsp = '\xA0';

const votersPluralize: IPluralizeCases = {
    none: `Оценок${nbsp}нет`,
    one: `{}${nbsp}оценка`,
    some: `{}${nbsp}оценки`,
    many: `{}${nbsp}оценок`,
};

const StarRatingStatic: React.FC<IStarRatingStaticProps> = (props) => {
    const { value, count, large, centered, showValue } = props;
    const valueInt = Math.round(value);
    return (
        <div className={cnStarRatingStatic({ large, centered })}>
            {showValue && (
                <div className={starRatingStaticValueCn}>{value.toFixed(1)}</div>
            )}
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
