import * as React from 'react';

type AnimationParameter<K extends string, T> =
    & { [key in K]?: T }
    & { [key in `${'in' | 'out'}${Capitalize<K>}`]?: T };

type AnimationParameters =
    & AnimationParameter<'duration', number>
    & AnimationParameter<'name', string>;

type IAnimateVisibilityProps = {
    /** Если вместо скрытия элемента (display: none) нужно, чтобы он не рендерился */
    hard?: boolean;
} & AnimationParameters;

export type IAnimateVisibilityStyleObject = {
    /** Сгенерированный объект стилей для анимации */
    animateStyles: React.CSSProperties;
};

export type IAnimatedComponentProps = {
    visible: boolean;
    setVisible: (visible: boolean) => void;
};

export default function withAnimateVisibility<T>(Component: React.ComponentType<T & IAnimateVisibilityStyleObject>, {
    /** Флаг "жёсткого" скрытия - не рендерить компонент, если он скрыт */
    hard = false,
    /** Длительность (появления и исчезновения, если не указаны конкретные или нужно одна и то же) */
    duration: __duration = 500,
    /** Длительность появления */
    inDuration = __duration,
    /** Длительность исчезновения */
    outDuration = __duration,
    /** Название анимации (появления и исчезновения, если не указаны конкретные или нужно одно и то же) */
    name: __name,
    /** Название анимации появления */
    inName = __name,
    /** Название анимации исчезновения */
    outName = __name,
}: IAnimateVisibilityProps): React.ComponentType<T & IAnimatedComponentProps> {
    // Если не указано ни одно название, тогда неясно, что анимировать
    if (!__name && !inName && !outName) throw new Error('Not specified name of animation');

    return (props) => {
        const { visible } = props;

        /**
         * Фактический флаг показа элемента (visible обозначает намерение родительского элемента,
         * в то время как show - вычисленное со всеми анимациями и прочими параметрами)
         */
        const [show, setShow] = React.useState(visible);

        // Для хранения идентификатора таймера скрытия элемента
        const timer = React.useRef<number>();

        React.useEffect(() => {
            // Если сейчас visible === true, то показываем содержимое
            if (visible) {
                // Если есть таймер на скрытие, сбрасываем его, чтобы не произошла ситуация:
                // *показали*, отработал таймер, *скрыл*, хотя должно быть показано
                if (timer.current) window.clearTimeout(timer.current);

                setShow(true);
                return;
            }

            // Иначе мы должны скрыть содержимое, но анимировано
            timer.current = window.setTimeout(() => setShow(false), outDuration);
        }, [visible, timer.current]);

        // Сгенерированный объект CSS-свойств для анимации в зависимости от состояния объекта
        const styles = React.useMemo(() => ({
            animationName: visible ? inName : outName,
            animationDuration: `${visible ? inDuration : outDuration}ms`,
            pointerEvents: visible ? 'auto' : 'none',
        } as React.CSSProperties), [visible, inDuration, outDuration, inName, outName]);

        // Если элемент скрыт и скрыт "жёстко" (hard), то не рендерим ничего
        if (!show && hard) return null;

        return (
            <Component
                {...props}
                animateStyles={styles}
            />
        );
    };
};
