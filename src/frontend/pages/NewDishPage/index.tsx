import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import type { IList } from '@typings';
import type { ICategory, IRestaurant } from '@typings/objects';
import { useDataProvider } from '@frontend/provider';
import withLabel from '@components/withLabel';
import Input from '@components/Input';
import Button from '@components/Button';
import { useFetch } from '@utils/useFetch';
import Spinner from '@components/Spinner';
import Select, { ISelectItem, SelectChanger } from '@components/Select';

export interface IDishCreatePageData {
    restaurant: IRestaurant;
    categories: IList<ICategory>;
}

const InputWithLabel = withLabel(Input);
const SelectWithLabel = withLabel(Select);

const NewDishPage: React.FC = () => {
    const params = useParams<'restaurantId'>();
    const provider = useDataProvider();

    const { result, loading } = useFetch(`r${params.restaurantId}/new`, provider.preCreateDishData, Number(params.restaurantId));

    const [busy, setBusy] = React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');
    const [categoryId, setCategoryId] = React.useState<number>(0);

    const navigate = useNavigate();

    const onSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setBusy(true);

        provider.createDish(result!.restaurant.id, title, description, categoryId).then(dish => {
            navigate(`/restaurant/${result!.restaurant.id}/dish/${dish.id}`);
        });
    }, [provider, title, description, categoryId]);

    const categoryItems = React.useMemo<ISelectItem<number>[] | undefined>(() => {
        return result ? result.categories?.items.map(category => ({ value: category.id, title: category.title })) : [];
    }, [result?.categories]);

    if (!result || loading) return <Spinner />;

    return (
        <form onSubmit={onSubmit}>
            <InputWithLabel
                type="text"
                label="Название блюда"
                name="title"
                id="title"
                value={title}
                setValue={setTitle}
                readOnly={busy}
            />
            <InputWithLabel
                type="textarea"
                label="Описание, состав (необязательно)"
                name="description"
                id="description"
                value={description}
                setValue={setDescription}
                readOnly={busy}
            />
            <SelectWithLabel
                id="categoryId"
                label="Категория блюда"
                items={categoryItems as ISelectItem[]}
                value={categoryId}
                setValue={setCategoryId as SelectChanger}
            />
            <Button
                type="submit"
                text="Создать"
                disabled={!title || !categoryId}
            />
        </form>
    );
};

export default NewDishPage;
