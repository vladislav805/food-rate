import * as React from 'react';
import type { IReview } from '@typings/objects';
import StarRating from '@components/StarRating';
import Input from '@components/Input';
import Button from '@components/Button';
import withLabel from '@components/withLabel';
import { fetchers } from '@frontend/pages@client';

import {
    reviewFormCn,
    reviewFormContentCn,
    reviewFormErrorCn,
    reviewFormFooterCn,
    reviewFormRatingCn,
    reviewFormTextCn
} from './const';

import './ReviewForm.scss';

type IReviewFormProps = {
    dishId: number;
    onReviewPublished: (review: IReview) => void;
};

type IFormError = {
    text: string;
};

const TextareaWithLabel = withLabel(Input);
const StarRatingWithLabel = withLabel(StarRating);

const ReviewForm: React.FC<IReviewFormProps> = props => {
    const { dishId, onReviewPublished } = props;

    const [error, setError] = React.useState<IFormError | undefined>();
    const [busy, setBusy] = React.useState<boolean>(false);
    const [rate, setRate] = React.useState<number | null>(null);
    const [text, setText] = React.useState<string>('');

    const onSubmit = React.useCallback((event: React.FormEvent) => {
        event.preventDefault();

        if (!rate) {
            setError({ text: 'Вы не поставили оцнеку!' });
            return;
        }

        setBusy(true);

        fetchers.addReview({ dishId, rate, text })
            .then(review => {
                onReviewPublished(review);
                setRate(null);
                setText('');
            })
            .catch(error => setError(error))
            .then(() => setBusy(false));
    }, [rate, text]);

    return (
        <form
            onSubmit={onSubmit}
            className={reviewFormCn}
        >
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
                {error && (
                    <div className={reviewFormErrorCn}>
                        {error.text}
                    </div>
                )}
                <Button
                    type="submit"
                    text="Отправить"
                    disabled={busy}
                />
            </div>
        </form>
    );
};

export default ReviewForm;
