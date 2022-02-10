import * as React from 'react';

import type { IList } from '@typings';
import type { ICategory } from '@typings/objects';
import { fetchers } from '@frontend/pages@client';
import { useFetch } from '@utils/useFetch';

export type ICategoriesPageData = {
    categories: IList<ICategory>;
};

const CategoriesPage: React.FC = () => {
    const { result, loading } = useFetch<ICategoriesPageData>('categories', fetchers.categories);

    if (!result) return <>loading...</>;

    return (
        <div>
            <p>Список категорий</p>
            <ol>
                {result.categories.items.map(category => (
                    <li key={category.id}>{category.title}</li>
                ))}
            </ol>
        </div>
    );
};

export default CategoriesPage;
