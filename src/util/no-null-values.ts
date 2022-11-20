type NoNullValues<T> = {
    [Key in keyof T]: NonNullable<T[Key]>;
};

export type { NoNullValues };