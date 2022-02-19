import * as React from 'react';
import withLabel from '@components/withLabel';
import Input from '@components/Input';
import Button from '@components/Button';
import { fetchers } from '@frontend/pages@client';
import stringifyError from '@utils/stringifyError';
import type { ICategory } from '@typings/objects';

const InputWithLabel = withLabel(Input);

type INewCategoryModalProps = {
    onCategoryAdded: (category: ICategory) => void;
};

const NewCategoryModal: React.FC<INewCategoryModalProps> = ({ onCategoryAdded }) => {
    const [title, setTitle] = React.useState<string>('');

    const onSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        fetchers.addCategory({ title }).then(category => {
            setTitle('');
            alert(`Категория "${category.title}" (#${category.id}) создана`);
            onCategoryAdded(category);
        }).catch(error => {
            alert(stringifyError(error));
        });
    }, [title]);
    
    return (
        <form onSubmit={onSubmit}>
            <InputWithLabel
                type="text"
                label="Название категории"
                value={title}
                setValue={setTitle}
                id="title"
                name="title"
            />
            <Button
                type="submit"
                text="Создать"
            />
        </form>
    );
};

export default NewCategoryModal;
