export const RegisterKeys = ['username', 'password', 'email', 'form'] as const;
export const SubKeys = ['name', 'title', 'description'] as const;
export type APIError<T> = {
  fieldErrors: Partial<Record<T[number], string>>;
};
// type for extracting element type from an array type
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
