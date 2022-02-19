import * as React from 'react';

type IUseInteractionObserverOptions<T extends HTMLElement> = {
    target: React.RefObject<T | undefined>;
    onIntersect: IntersectionObserverCallback;
    threshold?: number;
    margins?: string;
};

/**
 * Хук использования Intersection Observer API (отлавливает попадание элемента DOM в область видимости/viewport)
 * @param target Целевой элемент (React.Ref на HTMLElement)
 * @param onIntersect Обработчик события
 * @param threshold Минимальная цель срабатывания события: 0 - хотя бы один пиксель во viewport, 1 - элемент полностью
 * @param margins Отсутпы от границ элемента, когда может сработать событие (указывается как CSS)
 */
export default function useIntersectionObserver<T extends HTMLElement>({
    target,
    onIntersect,
    threshold,
    margins,
}: IUseInteractionObserverOptions<T>) {
    React.useEffect(() => {
        const root = target.current;

        if (!root) return;

        const observer = new IntersectionObserver(onIntersect, { threshold, rootMargin: margins });

        observer.observe(root);

        return () => observer.unobserve(root);
    }, [target.current]);
}
