import * as React from 'react';

import useForm from '@utils/useForm';
import withLabel from '@components/withLabel';
import Input from '@components/Input';
import Button from '@components/Button';
import { fetchers } from '@frontend/pages@client';
import { useNavigate } from 'react-router';

const InputWithLabel = withLabel(Input);

type IFormParams = {
    title: string;
    description: string;
};

/**
 * TODO: Добавить обработку ошибок
 */
const NewRestaurantPage: React.FC = () => {
    const ref = React.createRef<HTMLFormElement>();
    const form = useForm<IFormParams>(ref);

    const [busy, setBusy] = React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');

    const navigate = useNavigate();

    const onSubmit = React.useCallback((event: React.FormEvent) => {
        event.preventDefault();

        const params = form.getValues();

        setBusy(true);

        fetchers.addRestaurant(params).then(restaurant => {
            navigate(`/restaurant/${restaurant.id}`);
        });
    }, [form]);

    return (
        <form ref={ref} onSubmit={onSubmit}>
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
            <Button
                type="submit"
                text="Добавить"
                disabled={busy}
            />
        </form>
    );
};

export default NewRestaurantPage;
