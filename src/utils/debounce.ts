import _ from 'lodash';

type AnyFunction = (...args: any[]) => any;
type Params<T extends AnyFunction> = [...Parameters<T>];

export function debounce<F extends AnyFunction>(
    fn: F,
    ms: number = 1000
): (...args: Params<F>) => ReturnType<F> {
    return _.debounce(fn, ms);
}
