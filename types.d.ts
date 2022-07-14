export const RegisterKeys = ['username', 'password', 'email', 'form'] as const;
export type APIError = {
  errors: Partial<Record<typeof RegisterKeys[number], string>>;
};
// type for extracting element type from an array type
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
