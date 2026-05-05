import { cva } from 'class-variance-authority';

type StringToBoolean<T> = T extends 'true' | 'false' ? boolean : T;

type ClassDictionary = Record<string, any>;

type ClassArray = ClassValue[];

type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | bigint
  | null
  | boolean
  | undefined;
type ClassProp =
  | {
      class: ClassValue;
      className?: never;
    }
  | {
      class?: never;
      className: ClassValue;
    }
  | {
      class?: never;
      className?: never;
    };
type ConfigSchema = Record<string, Record<string, ClassValue>>;

type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null | undefined;
};

type ConfigVariantsMulti<T extends ConfigSchema> = {
  [Variant in keyof T]?:
    | StringToBoolean<keyof T[Variant]>
    | StringToBoolean<keyof T[Variant]>[]
    | undefined;
};

type MixedVariants<K extends string, T extends ConfigSchema> = Record<
  K,
  { [k in keyof T]?: keyof T[k] }
>;

type CvaProps<T> = T extends ConfigSchema
  ? ConfigVariants<T> & ClassProp
  : ClassProp;

type CvaXProps<T, K extends string> = CvaProps<T> & { mixed?: Array<K> };

type CvaXReturn<T, K extends string> = (props?: CvaXProps<T, K>) => string;

type Config<T = any, K extends string = any> = T extends ConfigSchema
  ? {
      variants?: T;
      mixed?: MixedVariants<K, T>;
      defaultVariants?: ConfigVariants<T>;
      compoundVariants?: (T extends ConfigSchema
        ? (ConfigVariants<T> | ConfigVariantsMulti<T>) & ClassProp
        : ClassProp)[];
    }
  : never;

const valid = (value?: Record<any, any>): boolean =>
  value !== undefined && Object.keys(value).length > 0;

const mapMixedValue = (value: string, config: Config): string =>
  Object.entries(value)
    .map(([key, value]) => config.variants[key][value])
    .join(' ');

const plainMixed = <T, K extends string>(
  config: Config<T, K>,
): { [k: string]: string } =>
  Object.fromEntries(
    Object.entries(config.mixed).map(([key, value]) => {
      return [key, mapMixedValue(value as string, config)];
    }),
  );

export const cvax = <T, K extends string>(
  base?: ClassValue,
  config?: Config<T, K>,
): CvaXReturn<T, K> => {
  const variants = cva(base, config);

  if (!valid(config.mixed) || !valid(config.variants)) {
    return variants;
  }

  const merged = plainMixed(config);

  return ({ mixed = [], ...props } = {} as CvaXProps<T, K>) =>
    [
      variants(props as CvaProps<T>),
      mixed.map((value: string) => merged[value]),
    ].join(' ');
};
