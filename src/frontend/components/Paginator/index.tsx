import * as React from 'react';
import { cnPaginatorItem, paginatorCn } from './const';

import './Paginator.scss';

type IPaginatorProps = {
    /** Количество данных всего */
    count: number;

    /** Количество элементов на одной странице */
    limit: number;

    /** Количество страниц, на которое можно сдвинуться влево и вправо от текущей страницы */
    range: number;

    /** Текущий сдвиг выборки по элементам */
    offset: number;

    /** Изменение сдвига */
    setOffset: (offset: number) => void;
};

const Paginator: React.FC<IPaginatorProps> = props => {
    const { count, limit, offset, setOffset, range } = props;
    const pagesCount = Math.ceil(count / limit);

    if (pagesCount <= 1) return null;

    const pages: number[] = React.useMemo(() => {
        return Array(range * 2 + 1)
            .fill(1)
            .map((_, index) => {
                const delta = index - range;
                return delta * limit;
            })
            .filter(offset => offset >= 0 && offset < count);
    }, [count, limit, offset, range]);

    const onClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        const button = event.target as HTMLButtonElement;
        const offset = Number(button.dataset.offset);
        setOffset(offset);
    }, [offset]);

    return (
        <div className={paginatorCn}>
            {pages.map(offset => (
                <button
                    key={offset}
                    className={cnPaginatorItem({
                        active: props.offset === offset,
                    })}
                    type="button"
                    data-offset={offset}
                    onClick={onClick}
                >
                    {(offset / limit) + 1}
                </button>
            ))}
        </div>
    );
};

export default Paginator;
