import * as React from 'react';

import type { ICategory } from '@typings/objects';

import { categoryListCn, categoryListContentCn, categoryListLinkCn, cnCategoryListItem } from './const';

import './CategoryList.scss';

type ICategoryListProps = {
    categories: ICategory[];
    selected?: ICategory;
    onChange?: (category: ICategory | undefined) => void;
};

const CategoryList: React.FC<ICategoryListProps> = (props) => {
    const { categories, selected, onChange } = props;

    const onCategoryClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        if (!onChange) return;

        const button = (event.target as HTMLButtonElement);
        const categoryId = Number(button.dataset.categoryId);
        const category = categories.find(category => category.id === categoryId);

        const target = !category || category.id === selected?.id ? undefined : category;

        onChange(target);
    }, [categories, selected, onChange]);

    return (
        <div className={categoryListCn}>
            <ul className={categoryListContentCn}>
                {categories.map(category => (
                    <li
                        key={category.id}
                        className={cnCategoryListItem({
                            selected: selected?.id === category.id,
                        })}
                    >
                        <button
                            className={categoryListLinkCn}
                            data-category-id={category.id}
                            onClick={onCategoryClick}
                        >
                            {category.title}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
