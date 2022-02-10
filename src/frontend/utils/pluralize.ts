export type IPluralizeCases = {
    none?: string; // 0
    one: string; // 1
    some: string; // 2-4
    many: string; // 5-9
};

const dc: (keyof IPluralizeCases)[] = ['many', 'one', 'some', 'some', 'some', 'many'];

export default function pluralize(n: number, cases: IPluralizeCases): string {
    if (!n && cases.none) {
        return cases.none;
    }

    n = Math.abs(n);

    let str: string;

    if (n % 100 > 4 && n % 100 < 20) {
        str = cases.many;
    } else {
        str = cases[dc[n % 10 < 5 ? n % 10 : 5]] as string;
    }

    return str.replace('{}', String(n));
}
