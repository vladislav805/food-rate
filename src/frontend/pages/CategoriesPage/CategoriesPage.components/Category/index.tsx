import * as React from 'react';
import type { ICategory } from '@typings/objects';
import Button from '@components/Button';
import { fetchers } from '@frontend/pages@client';

import {
    categoryCn,
    categoryDeleteCn,
    categoryTitleCn,
} from './const';

import './Cateogy.scss';

type ICategoryProps = {
    category: ICategory;
    onCategoryDelete: (category: ICategory) => void;
};

const Category: React.FC<ICategoryProps> = ({ category, onCategoryDelete }) => {
    const onClickDelete = React.useCallback(() => {
        fetchers.deleteCategory({ categoryId: category.id }).then(() => onCategoryDelete(category));
    }, [category, onCategoryDelete]);

    return (
        <div className={categoryCn}>
            <div className={categoryTitleCn}>{category.title}</div>
            <div className={categoryDeleteCn}>
                <Button text="Удалить" onClick={onClickDelete} />
            </div>
        </div>
    );
};

export default Category;
