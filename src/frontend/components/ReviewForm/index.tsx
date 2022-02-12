import * as React from 'react';
import type { IReview } from '@typings/objects';
import StarRating from '@components/StarRating';
import Input from '@components/Input';
import Button from '@components/Button';
import withLabel from '@components/withLabel';
import useForm from '@utils/useForm';
import { fetchers } from '@frontend/pages@client';

import { reviewFormCn, reviewFormContentCn, reviewFormFooterCn, reviewFormRatingCn, reviewFormTextCn } from './const';

import './ReviewForm.scss';

type IReviewFormProps = {
    dishId: number;
    onReviewPublished: (review: IReview) => void;
};

type IFormFields = {
    text: string;
    rate: number;
};

type IFormError = {
    text: string;
};

const TextareaWithLabel = withLabel(Input);
const StarRatingWithLabel = withLabel(StarRating);

const ReviewForm: React.FC<IReviewFormProps> = props => {
    const { dishId, onReviewPublished } = props;

    const refForm = React.createRef<HTMLFormElement>();
    const form = useForm<IFormFields>(refForm);

    const [error, setError] = React.useState<IFormError | undefined>();
    const [busy, setBusy] = React.useState<boolean>(false);
    const [rate, setRate] = React.useState<number | null>(null);
    const [text, setText] = React.useState<string>('');

    const onSubmit  = (event: React.FormEvent) => {
        event.preventDefault();
        const params = form.getValues();

        if (!params.rate) {
            setError({ text: 'Вы не поставили оцнеку!' });
            return;
        }

        setBusy(true);

        fetchers.addReview({ dishId, ...params })
            .then(review => {
                onReviewPublished(review);
                setRate(null);
                setText('');
            })
            .catch(error => setError(error))
            .then(() => setBusy(false));
    };

    return (
        <form
            ref={refForm}
            onSubmit={onSubmit}
            className={reviewFormCn}>
            <div className={reviewFormContentCn}>
                <StarRatingWithLabel
                    className={reviewFormRatingCn}
                    label="Оцените блюдо"
                    name="rate"
                    id="rate"
                    selected={rate}
                    setSelected={setRate}
                />
                <TextareaWithLabel
                    className={reviewFormTextCn}
                    label="Есть что сказать?"
                    type="textarea"
                    name="text"
                    id="text"
                    value={text}
                    disabled={busy}
                    setValue={setText}
                />
            </div>
            <div className={reviewFormFooterCn}>
                <Button
                    type="submit"
                    text="Отправить"
                    disabled={busy}
                />
                {error && (
                    <div>{error.text}</div>
                )}
            </div>
        </form>
    );
};

export default ReviewForm;
