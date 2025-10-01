'use client';

import React, { useState, useMemo } from 'react';
import { Category } from '@/lib/types/category.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search, Tag, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  categories: Category[];
  value?: string;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  showSearch?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  value,
  onValueChange,
  label = 'Категори',
  placeholder = 'Категори сонгох',
  disabled = false,
  showSearch = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter(category =>
      category.name?.mn?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  // Get selected category
  const selectedCategory = useMemo(() => {
    return categories.find(cat => cat._id === value);
  }, [categories, value]);

  const handleSelect = (categoryId: string) => {
    onValueChange(categoryId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onValueChange('');
    setSearchQuery('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Цуцлах
          </button>
        )}
      </div>

      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger className="h-10">
          <SelectValue placeholder={placeholder}>
            {selectedCategory && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="font-medium">{selectedCategory.name?.mn}</span>
                {selectedCategory.description && (
                  <span className="text-muted-foreground text-sm">
                    - {selectedCategory.description?.mn}
                  </span>
                )}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="w-full min-w-[300px] p-0">
          {/* Search Input */}
          {showSearch && (
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Категори хайх..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Categories List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredCategories.length > 0 ? (
              filteredCategories.map(category => (
                <SelectItem
                  key={category._id}
                  value={category._id}
                  className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSelect(category._id)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{category.name?.mn}</div>
                      {category.description && (
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {category.description?.mn}
                        </div>
                      )}
                    </div>
                    {value === category._id && (
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className="p-6 text-center">
                <div className="text-muted-foreground">
                  {searchQuery ? (
                    <>
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">&quot;{searchQuery}&quot; гэсэн категори олдсонгүй</p>
                    </>
                  ) : (
                    <>
                      <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Боломжтой категори байхгүй</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer with count */}
          {filteredCategories.length > 0 && (
            <div className="p-2 border-t bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                {filteredCategories.length} категори олдлоо
              </p>
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector;
