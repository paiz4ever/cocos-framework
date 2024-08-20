type ExcludeKeys<T> = { [P in keyof T]: never };

/**
 * 将所有值转换为元组
 * @example
 * type Original = {
 *     name: string;
 *     age: number[];
 * };
 * // 表示 { name: [string]; age: [number[]]; }
 * type Filtered = ToTuple<Original>;
 */
type ToTuple<T> = {
  [K in keyof T]: [T[K]];
};

/**
 * 将目标属性设置为required
 * @example
 * type Original = {
 *     name?: string;
 *     age?: number;
 * };
 * // 表示 { name: string; age: number; }
 * type Filtered = MakeRequired<Original, "name" | "age">;
 */
type MakeRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * 剔除掉所有值类型为 U 的属性
 * @example
 * type Original = {
 *     name: string;
 *     age: number;
 *     isActive: boolean;
 *     id: string;
 * };
 * // 表示 { age: number; isActive: boolean; }
 * type Filtered = OmitByValueType<Original, string>;
 */
type OmitByValueType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

/**
 * 仅保留所有值类型为 U 的属性
 * @example
 * type Original = {
 *     name: string;
 *     age: number;
 *     isActive: boolean;
 *     id: string;
 * };
 * // 表示 { name: string; id: string; }
 * type Filtered = PickByValueType<Original, string>;
 */
type PickByValueType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

/**
 * 移除可选属性
 * @example
 * type Original = {
 *     name: string;
 *     age?: number;
 * };
 * // 表示 { name: string; }
 * type Filtered = RemoveOptional<Original>;
 */
type RemoveOptional<T> = {
  [K in keyof T as {} extends { [P in K]: T[K] } ? never : K]: T[K];
};

/**
 * 使用 U 覆盖 T 中的属性
 * @example
 * type Original = {
 *     name: string;
 *     age: number;
 * };
 * type Update = {
 *     name: number;
 * };
 * // 表示 { name: number; age: number; }
 * type Filtered = Overwrite<Original, Update>;
 */
type Write<T, U> = Omit<T, keyof U> & U;

/**
 * 共存属性，Keys 必须同时存在或者同时不存在
 * @example
 * type Original = {
 *   name: string;
 *   age?: number;
 *   address?: string;
 * }
 * // 表示age和address必须同时存在或者同时不存在
 * type Filtered = Coexist<Original, "age" | "address">;
 */
type Coexist<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  (Required<Pick<T, Keys>> | ExcludeKeys<Pick<T, Keys>>);

/**
 * 前提属性，PartialKeys 存在前提是 RequireKeys 必须存在（功能上包含Coexist）
 * @example
 * type Original = {
 *   name: string;
 *   age?: number;
 *   address?: string;
 * }
 * // 表示address存在必须age存在
 * type Filtered = Premise<Original, "age" , "address">;
 * // 同Coexist<Original, "age" | "address">
 * type Filtered = Premise<Original, "age" | "address">;
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
