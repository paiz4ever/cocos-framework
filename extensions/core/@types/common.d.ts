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

type ExcludeKeys<T> = { [P in keyof T]: never };

/**
 * 移除可选属性
 */
type RemoveOptional<T> = {
  [K in keyof T as {} extends { [P in K]: T[K] } ? never : K]: T[K];
};
/**
 * 覆盖属性
 */
type Write<T, U> = Omit<T, keyof U> & U;

/**
 * 共存属性
 * @example
 * type Person = {
 *   name: string;
 *   age?: number;
 *   address?: string;
 * }
 * // 表示age和address必须同时存在或者同时不存在
 * type CoexistPerson = Coexist<Person, "age" | "address">;
 */
type Coexist<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  (Required<Pick<T, Keys>> | ExcludeKeys<Pick<T, Keys>>);

/**
 * 前提属性（功能上包含Coexist）
 * @example
 * type Person = {
 *   name: string;
 *   age?: number;
 *   address?: string;
 * }
 * // 表示address存在必须age存在
 * type PremisePerson = Premise<Person, "age" , "address">;
 * // 同Coexist<Person, "age" | "address">
 * type PremisePerson = Premise<Person, "age" | "address">;
 */
type Premise<
  T,
  RequireKeys extends keyof T = keyof T,
  PartialKeys extends keyof T = keyof T
> = Pick<T, Exclude<keyof T, RequireKeys>> &
  (
    | (Required<Pick<T, RequireKeys>> & Partial<Pick<T, PartialKeys>>)
    | ExcludeKeys<Pick<T, RequireKeys | PartialKeys>>
  );
