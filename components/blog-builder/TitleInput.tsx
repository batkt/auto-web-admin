import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';
import { FieldError } from 'react-hook-form';

const TitleInput = ({
  value = '',
  onChange = () => {},
  placeholder = 'Гарчиг...',
  error,
}: {
  value?: string;
  placeholder?: string;
  onChange?: (val: string) => void;
  error?: FieldError;
}) => {
  const editableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editableRef.current && editableRef.current.textContent !== value) {
      editableRef.current.textContent = value || '';
    }
  }, [value]);

  return (
    <>
      <div className="relative w-full min-h-[52px] h-fit mb-0">
        <div
          ref={editableRef}
          contentEditable={true}
          className={cn(
            'relative text-3xl font-bold p-2 text-foreground z-[1]',
            error ? 'focus:outline-destructive' : 'focus:outline-primary'
          )}
          onInput={e => {
            const text = e.currentTarget.textContent || '';
            onChange(text);
          }}
          onPaste={e => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
            onChange(text);
          }}
          suppressContentEditableWarning
        />
        <div
          className={cn(
            'absolute inset-0 h-fit text-3xl font-bold p-2 text-muted-foreground',
            value ? 'opacity-0' : 'opacity-100 z-0'
          )}
        >
          {placeholder}
        </div>
      </div>
      {error && <span className="text-destructive text-sm">{error.message}</span>}
    </>
  );
};

export default TitleInput;
