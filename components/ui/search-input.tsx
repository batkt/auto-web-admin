'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const SearchInput = ({
  route,
  paramName,
  value,
  placeholder = 'Хайх',
  inputClassName,
}: {
  route: string;
  paramName: string;
  value?: string;
  placeholder?: string;
  inputClassName?: string;
}) => {
  const router = useRouter();
  const [search, setSearch] = useState(value);

  const handleSearch = () => {
    router.push(`${route}?${paramName}=${search}`);
  };

  const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex items-center gap-2 w-full md:w-fit">
      <Input
        value={search}
        onChange={onChangeSearchInput}
        placeholder={placeholder}
        className={cn('w-full md:max-w-lg', inputClassName)}
      />
      <Button type="button" variant="outline" size="icon" onClick={handleSearch}>
        <Search className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SearchInput;
