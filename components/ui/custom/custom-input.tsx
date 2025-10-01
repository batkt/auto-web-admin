import React, { ReactNode } from 'react';
import { Input } from '../input';
import { FieldError } from 'react-hook-form';
import { Label } from '../label';
import { cn } from '@/lib/utils';

interface IProps {
  error?: FieldError;
  label?: string;
  labelNode?: ReactNode;
}

const CustomInput = ({
  labelNode,
  label,
  error,
  name,
  className,
  ...other
}: React.ComponentProps<'input'> & IProps) => {
  return (
    <div>
      {labelNode
        ? labelNode
        : label && (
            <Label htmlFor={name} className="mb-2">
              {label}
            </Label>
          )}
      <Input
        name={name}
        id={name}
        className={cn(
          error && 'focus-visible:ring-destructive/50 focus-visible:border-destructive',
          className
        )}
        {...other}
      />
      {error && <span className="text-sm text-destructive">{error.message}</span>}
    </div>
  );
};

export default CustomInput;
