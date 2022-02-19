import * as React from 'react';
import type { IRestaurant } from '@typings/objects';
import withLabel from '@components/withLabel';
import Input from '@components/Input';
import Button from '@components/Button';
import { useFetch } from '@utils/useFetch';
import { fetchers } from '@frontend/pages@client';
import Spinner from '@components/Spinner';
import Select, { ISelectItem, SelectChanger } from '@components/Select';
import { useNavigate } from 'react-router';

type INewDishModalProps = {
    restaurant: IRestaurant;
};

const InputWithLabel = withLabel(Input);
const SelectWithLabel = withLabel(Select);

const NewDishModal: React.FC<INewDishModalProps> = ({ restaurant }) => {
    const { result: categories, loading } = useFetch(`categories`, fetchers.getCategories);
    const [busy, setBusy] = React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');
    const [categoryId, setCategoryId] = React.useState<number>(0);

    const navigate = useNavigate();

    const onSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setBusy(true);

        fetchers.addDish({
            restaurantId: restaurant.id,
            title,
            description,
            categoryId,
        }).then(dish => {
            navigate(`/restaurant/${restaurant.id}/dish/${dish.id}`);
        })
    }, [title, description, categoryId]);

    const categoryItems = React.useMemo<ISelectItem<number>[] | undefined>(() => {
        return categories?.items.map(category => ({ value: category.id, title: category.title }));
    }, [categories]);

    if (!categories || loading) return <Spinner />;

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

export default NewDishModal;
