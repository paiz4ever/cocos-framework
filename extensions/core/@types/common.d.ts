type ExtractType<O, T> = { [K in keyof O]: O[K] extends T ? O[K] : unknown };
type Diff<T extends string, U, F> = ({ [P in T]: P } & {
  [P in keyof U]: U[P] extends F ? string : never;
} & {
  [x: string]: never;
})[T];
type ExtractTargetKey<T, O> = Diff<
  Extract<keyof O, string>,
  ExtractType<O, T>,
  T
>;

type ExpandArgFuntion<T, R> = T extends any[]
  ? (...arg: T) => R
  : (arg: T) => R;
type ArgArray<T> = T extends any[] ? T : [T];

/**
 * 移除可选属性
 */
type RemoveOptional<T> = {
  [K in keyof T as {} extends { [P in K]: T[K] } ? never : K]: T[K];
};
