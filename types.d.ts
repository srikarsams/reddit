export const RegisterKeys = ['username', 'password', 'email', 'form'] as const;
export type APIError = {
  errors: Partial<Record<typeof RegisterKeys[number], string>>;
};
