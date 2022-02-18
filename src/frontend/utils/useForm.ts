import * as React from 'react';

const typed = <T extends HTMLElement>(elem: Element): T => elem as T;

const set = <V, T extends object, K extends keyof T & string = keyof T & string>(obj: T, name: K, value: T[K] | V): void => {
    obj[name] = value as T[K];
};

const serializeForm = <T extends Record<string, string | number | boolean | undefined>>(form: HTMLFormElement) => {
    const elements = Array.from(form.elements);
    const result: T = {} as T;

    for (const item of elements) {
        switch (true) {
            case (item.tagName.toLowerCase() === 'textarea'): {
                const { name, value } = typed<HTMLTextAreaElement>(item);
                set(result, name, value);
                break;
            }

            case (item.tagName.toLowerCase() === 'select'): {
                const { name, options, selectedIndex } = typed<HTMLSelectElement>(item);

                const value = options[selectedIndex]?.value;

                set(result, name, value);

                if ((item as HTMLElement).dataset.as === 'number') {
                    set(result, name, Number(value));
                }
                break;
            }

            default: {
                const { type, name, value, checked } = typed<HTMLInputElement>(item);

                switch (type) {
                    case 'checkbox': {
                        set(result, name, checked);
                        break;
                    }

                    case 'radio': {
                        if (checked) {
                            set(result, name, value);
                        } else if (!(name in result)) {
                            set(result, name, undefined);
                        }
                        break;
                    }

                    case 'submit':
                    case 'button': {
                        break;
                    }

                    default: {
                        set(result, name, value);

                        if ((item as HTMLElement).dataset.as === 'number') {
                            set(result, name, Number(value));
                        }
                        break;
                    }
                }
            }
        }
    }

    return result;
};

export default function useForm<T extends Record<string, string | boolean | number | undefined>>(form: React.RefObject<HTMLFormElement>) {
    return React.useMemo(() => {
        console.log('useForm', form.current)
        return ({
            getValues: (): T => {
                return form.current
                    ? serializeForm<T>(form.current)
                    : {} as T;
            }
        });
    }, [form.current]);
}
