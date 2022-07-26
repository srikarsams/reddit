import classNames from 'classnames';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  theme: 'primary' | 'outline';
  children: React.ReactNode;
  customClass?: string;
  onClick?: () => void;
  disabled?: boolean;
  actionType?: 'submit';
}

function getButtonClassNames({ theme }: Pick<ButtonProps, 'theme'>) {
  return classNames(
    'inline-block text-xs font-bold text-center uppercase border rounded px-2 py-1 cursor-pointer border-blue-500',
    {
      'text-white bg-blue-500 disabled:bg-blue-300 disabled:border-blue-300 hover:bg-blue-300 hover:border-blue-300':
        theme === 'primary',
      'text-blue-500 bg-transparent hover:text-blue-300 hover:bg-transparent hover:border-blue-300':
        theme === 'outline',
    }
  );
}

const LinkButton = React.forwardRef<
  HTMLAnchorElement,
  ButtonProps & { href?: string }
>(({ theme, customClass = '', children, href, onClick }, ref) => {
  const buttonClassName = getButtonClassNames({ theme });
  return (
    <a
      className={twMerge(buttonClassName, customClass)}
      ref={ref}
      href={href}
      onClick={onClick}
    >
      {children}
    </a>
  );
});

LinkButton.displayName = 'LinkButton';

const Button = ({
  theme,
  children,
  onClick,
  customClass = '',
  disabled = false,
  actionType,
}: ButtonProps) => {
  const buttonClassName = getButtonClassNames({ theme });

  return (
    <button
      className={twMerge(buttonClassName, customClass)}
      onClick={onClick}
      disabled={disabled}
      type={actionType}
    >
      {children}
    </button>
  );
};

export { Button, LinkButton };
