import { ChangeEvent } from 'react';

interface InputProps {
  name: string;
  type: string;
  placeholder: string;
  value: string;
  handleOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error: string | undefined;
}

const Input = ({
  name,
  type,
  placeholder,
  value,
  handleOnChange,
  error,
}: InputProps) => {
  return (
    <div className="relative mb-2">
      <input
        id={name}
        type={type}
        className={`w-full rounded border border-gray-300 bg-input p-3 py-2 transition duration-200 hover:bg-white focus:bg-white ${
          error ? 'border-red-400' : ''
        }`}
        placeholder={placeholder}
        value={value}
        onChange={handleOnChange}
      />
      <p className="text-xs text-red-400">{error || ''}</p>
    </div>
  );
};
export { Input };
