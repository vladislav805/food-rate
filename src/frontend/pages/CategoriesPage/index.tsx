import * as React from 'react';

import type { IList } from '@typings';
import type { ICategory } from '@typings/objects';
import { useDataProvider } from '@frontend/provider';
import { useFetch } from '@utils/useFetch';
import { addToList, deleteFromList } from '@utils/apiList';
import Modal from '@components/Modal';
import Button from '@components/Button';

import NewCategoryModal from './CategoriesPage.components/NewCategoryModal';
import Category from './CategoriesPage.components/Category';

import './CategoriesPage.scss';

export type ICategoriesPageData = {
    categories: IList<ICategory>;
};

const CategoriesPage: React.FC = () => {
    const provider = useDataProvider();
    const { result, loading, setResult } = useFetch('categories', provider.getCategories);
    const [visibleNewCategoryModal, setVisibleNewCategoryModal] = React.useState<boolean>(false);

    const openNewCategoryModal = React.useCallback(() => setVisibleNewCategoryModal(true), [setVisibleNewCategoryModal]);

    const onCategoryAdded = React.useCallback((category: ICategory) => {
        setVisibleNewCategoryModal(false);
        const categories = addToList(result!.categories, category);
        setResult({ categories });
    }, [result?.categories]);

    const onCategoryDelete = React.useCallback((category: ICategory) => {
        const categories = deleteFromList(result!.categories, 'id', category.id);
        setResult({ categories });
    }, [result?.categories]);

    if (!result || loading) return <>loading...</>;

    return (
        <div className="CategoriesPage">
            <div className="CategoriesPage-Header">
                <h1>Список категорий</h1>
                <Button
                    type="button"
                    text="Создать"
                    onClick={openNewCategoryModal}
                />
            </div>
            <div className="CategoriesPage-Items">
                {result.categories.items.map(category => (
                    <Category
                        key={category.id}
                        category={category}
                        onCategoryDelete={onCategoryDelete}
                    />
                ))}
            </div>
            <Modal visible={visibleNewCategoryModal} setVisible={setVisibleNewCategoryModal}>
                <NewCategoryModal onCategoryAdded={onCategoryAdded} />
            </Modal>
        </div>
    );
};

export default CategoriesPage;
