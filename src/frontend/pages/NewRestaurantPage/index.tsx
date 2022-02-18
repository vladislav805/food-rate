import * as React from 'react';
import withLabel from '@components/withLabel';
import Input from '@components/Input';
import Button from '@components/Button';
import { fetchers } from '@frontend/pages@client';
import { useNavigate } from 'react-router';
import Select, { ISelectItem, SelectChanger } from '@components/Select';
import type { RestaurantType } from '@database/models/restaurant';
import { newRestaurantPageCn, newRestaurantPageSubmitCn } from '@pages/NewRestaurantPage/const';

import './NewRestaurantPage.scss';

const InputWithLabel = withLabel(Input);
const SelectWithLabel = withLabel(Select);

const types: ISelectItem<RestaurantType>[] = [
    { value: 'place', title: 'только места' },
    { value: 'delivery', title: 'только доставка' },
    { value: 'mixed', title: 'места и доставка' },
];

/**
 * TODO: Добавить обработку ошибок
 */
const NewRestaurantPage: React.FC = () => {
    const [busy, setBusy] = React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');
    const [type, setType] = React.useState<RestaurantType>('place');
    const [vk, setVk] = React.useState<string>('');
    const [instagram, setInstagram] = React.useState<string>('');

    const navigate = useNavigate();

    const onSubmit = React.useCallback((event: React.FormEvent) => {
        event.preventDefault();

        setBusy(true);

        fetchers.addRestaurant({ title, description, type, vk, instagram }).then(restaurant => {
            navigate(`/restaurant/${restaurant.id}`);
        });
    }, [title, description, type, vk, instagram]);

    return (
        <form
            onSubmit={onSubmit}
            className={newRestaurantPageCn}
        >
            <InputWithLabel
                type="text"
                label="Название заведения"
                name="title"
                id="title"
                value={title}
                setValue={setTitle}
                readOnly={busy}
            />
            <InputWithLabel
                type="textarea"
                label="Описание"
                name="description"
                id="description"
                value={description}
                setValue={setDescription}
                readOnly={busy}
            />
            <SelectWithLabel
                items={types}
                value={type}
                setValue={setType as SelectChanger}
                id="type"
                label="Тип заведения"
            />
            <InputWithLabel
                type="url"
                label="Сообщество в ВКонтакте (необязательно)"
                name="vk"
                id="vk"
                value={vk}
                setValue={setVk}
                readOnly={busy}
                placeholder="https://vk.com/..."
            />
            <InputWithLabel
                type="url"
                label="Аккаунт в Instagram (необязательно)"
                name="instagram"
                id="instagram"
                value={instagram}
                setValue={setInstagram}
                readOnly={busy}
                placeholder="https://instagram.com/..."
            />
            <Button
                className={newRestaurantPageSubmitCn}
                type="submit"
                text="Добавить"
                disabled={busy || !title}
            />
        </form>
    );
};

export default NewRestaurantPage;
