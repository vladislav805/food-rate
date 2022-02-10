import * as React from 'react';

type IDateFormatProps = {
    date: Date | string | number;
};

const months: string[] = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

const DateFormat: React.FC<IDateFormatProps> = ({ date }) => {
    const d: Date = React.useMemo(() => {
        return typeof date === 'number' || typeof date === 'string' ? new Date(date) : date;
    }, [date]);

    const string = React.useMemo(() => `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`, [d]);

    return <>{string}</>;
};

export default DateFormat;
