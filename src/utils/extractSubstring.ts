/**
 * Вычленить подстроку из строки по регулярке
 * @param str Исходная строка
 * @param regexp регулярка
 * @param index Номер группы из регулярки
 * @returns Подстроку из группы index по регулярке regexp, применённой к строке str. Если не удалось выполнить - null
 */
export function extractSubstring(str: string | undefined, regexp: RegExp, index: number): string | null {
    if (!str) return null;

    const matches = str.match(regexp);

    return matches ? matches[index] : null;
}
