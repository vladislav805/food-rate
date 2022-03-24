export function bind<T extends Function>(target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void {
    if (!descriptor || !(typeof descriptor.value === 'function' || typeof descriptor.get === 'function')) {
        throw new TypeError(`Only methods can be decorated with @bind. <${propertyKey}> is not a method!`);
    }

    const value = descriptor.value ?? descriptor.get?.();

    if (!value) {
        throw new TypeError('Value is undefined');
    }

    return {
        configurable: true,
        get(this: T): T {
            const bound: T = value!.bind(this);

            // Credits to https://github.com/andreypopp/autobind-decorator for memoizing the result of bind against a symbol on the instance.
            Object.defineProperty(this, propertyKey, {
                value: bound,
                configurable: true,
                writable: true,
            });
            return bound;
        }
    };
}
