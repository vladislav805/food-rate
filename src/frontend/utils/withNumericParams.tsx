import * as React from 'react';
import { useParams } from 'react-router';
import Page404 from '@pages/404';

/**
 * Из-за очередных приколов разрабов react-router приходится писать костыли: в v5 была возможность прямо в роуте
 * прописывать формат параметра (например, /user/:id(\d+)), однако, в v6 они решили упростить это (кто просил?).
 * Мы лишились валидации формата параметров под капотом, и они сами предлагают в инструкции по миграции перенести
 * всю логику проверки параметров в свои компоненты. Поскольку в каждом компоненте делать проверку не совсем
 * красиво (я не больной ублюдок), был написан этот HOC: он принимает в себя компонент и названия параметров,
 * которые необходимо проверить на числовой формат.
 * @see https://reactrouter.com/docs/en/v6/upgrading/v5#note-on-route-path-patterns
 * @param Component Компонент, который предполагает, что в параметрах, описанных в names есть числовые значения
 * @param names Названия параметров, в которых ождаются числа
 */
export function withNumericParams<T>(Component: React.ComponentType<T>, names: string[]): React.ComponentType<T> {
    return (props: T) => {
        const params = useParams();

        if (names.some(name => !params[name] || !params[name]?.match(/^\d+$/))) {
            return <Page404 />;
        }

        return <Component {...props} />;
    };
}
