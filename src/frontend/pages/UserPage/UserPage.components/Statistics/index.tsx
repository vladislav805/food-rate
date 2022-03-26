import * as React from 'react';
import type { IUserStatistics } from '@typings/synthetic';
import KeyValue from '@components/KeyValue';

type IStatisticsProps = {
    statistics: IUserStatistics | null;
};

const fields: { name: keyof IUserStatistics; title: string }[] = [
    { name: 'countOfVisitedRestaurants', title: 'Посещённых заведений' },
    { name: 'countOfTestedDishes', title: 'Опробованных блюд' },
    { name: 'averageRating', title: 'Средняя оценка' },
];

const Statistics: React.FC<IStatisticsProps> = React.memo(props => {
    if (!props.statistics) return null;

    const { statistics } = props;

    const items = React.useMemo(() => {
        return fields
            .filter(item => statistics[item.name] !== null)
            .map(({ name, title }) => ({ title, value: statistics[name] }));
    }, [statistics])

    return (
        <KeyValue items={items} layout="column" />
    );
});

export default Statistics;
