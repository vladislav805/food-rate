import type { IList } from '@typings';

/**
 * Добавление элемента в список
 * @param list Список
 * @param item Элемент
 */
export function addToList<Type>(list: IList<Type>, item: Type): IList<Type> {
    return {
        count: list.count + 1,
        items: list.items.concat(item),
        offset: list.offset,
    };
}

/**
 * Удаление элемента из списка
 * @param list Список
 * @param key Ключ, по которому производится поиск
 * @param value Значение ключа объекта, который нужно удалить
 */
export function deleteFromList<
    Type,
    Key extends keyof Type & string = keyof Type & string,
    Value extends Type[Key] = Type[Key],
>(list: IList<Type>, key: Key, value: Value): IList<Type> {
    let found = false;

    const items = list.items.filter(item => {
        if (item[key] !== value) return true;

        found = true;
        return false;
    });

    return {
        count: list.count - +found,
        items,
        offset: list.offset,
    };
}

export function findInList<
    Type,
    Key extends keyof Type & string = keyof Type & string,
    Value extends Type[Key] = Type[Key],
>(list: IList<Type>, key: Key, value: Value) {
    return list.items.find(item => item[key] === value);
}

export function buildMapByList<
    Type,
    Key extends keyof Type & string = keyof Type & string,
    Value extends Type[Key] = Type[Key],
>(list: IList<Type>, key: Key): Map<Value, Type> {
    const map = new Map<Value, Type>();

    for (let i = 0, l = list.items.length; i < l; ++i) {
        map.set(list.items[i][key] as Value, list.items[i]);
    }

    return map;
}
