'use client';

import React, { useState, useMemo } from 'react';
import { Category } from '@/lib/types/category.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, Search, Check, Plus, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiCategorySelectorProps {
  categories: Category[];
  selectedCategories: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  maxSelections?: number;
}

const MultiCategorySelector: React.FC<MultiCategorySelectorProps> = ({
  categories,
  selectedCategories,
  onSelectionChange,
  label = 'Категориуд',
  placeholder = 'Категориуд сонгох',
  disabled = false,
  maxSelections = 5,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter(category =>
      category.name?.mn?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  // Get selected category objects
  const selectedCategoryObjects = useMemo(() => {
    return categories.filter(cat => selectedCategories.includes(cat._id));
  }, [categories, selectedCategories]);

  // Get unselected categories
  const unselectedCategories = useMemo(() => {
    return filteredCategories.filter(cat => !selectedCategories.includes(cat._id));
  }, [filteredCategories, selectedCategories]);

  const handleToggleCategory = (e: React.MouseEvent, categoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedCategories.includes(categoryId)) {
      onSelectionChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      if (selectedCategories.length < maxSelections) {
        onSelectionChange([...selectedCategories, categoryId]);
      }
    }
  };

  const handleRemoveCategory = (e: React.MouseEvent, categoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectionChange(selectedCategories.filter(id => id !== categoryId));
  };

  const handleSelectAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const availableSlots = maxSelections - selectedCategories.length;
    const newCategories = unselectedCategories.slice(0, availableSlots);
    const newSelectedIds = newCategories.map(cat => cat._id);
    onSelectionChange([...selectedCategories, ...newSelectedIds]);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectionChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {selectedCategories.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={handleClearAll}
            disabled={disabled}
            className="h-auto p-1 text-xs text-muted-foreground hover:text-destructive"
          >
            Бүгдийг цуцлах
          </Button>
        )}
      </div>

      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Tag className="h-3 w-3" />
            <span>
              Сонгосон категориуд ({selectedCategories.length}/{maxSelections})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategoryObjects.map(category => (
              <Badge
                key={category._id}
                variant="default"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors"
              >
                <span className="text-sm font-medium">{category.name?.mn}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  className="h-auto p-0 hover:bg-transparent hover:text-destructive"
                  onClick={e => handleRemoveCategory(e, category._id)}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Category Selection Area */}
      <div className="space-y-3">
        {/* Search and Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Категори хайх..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              disabled={disabled}
              className="pl-9 h-9"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={disabled}
            className="h-9 px-3"
          >
            {isExpanded ? 'Хаах' : 'Дэлгэрэнгүй'}
          </Button>
        </div>

        {/* Quick Actions */}
        {unselectedCategories.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={handleSelectAll}
              disabled={disabled || selectedCategories.length >= maxSelections}
              className="h-7 px-2 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Бүгдийг сонгох
            </Button>
            <span className="text-xs text-muted-foreground">
              {unselectedCategories.length} категори боломжтой
            </span>
          </div>
        )}

        {/* Category List */}
        <div
          className={cn(
            'space-y-2 transition-all duration-200',
            isExpanded ? 'max-h-64 overflow-y-auto' : 'max-h-32 overflow-hidden'
          )}
        >
          {unselectedCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {unselectedCategories.map(category => (
                <Button
                  key={category._id}
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={e => handleToggleCategory(e, category._id)}
                  disabled={disabled || selectedCategories.length >= maxSelections}
                  className={cn(
                    'h-auto p-3 justify-start text-left hover:bg-primary/5 hover:border-primary/30 transition-all duration-200',
                    'group relative overflow-hidden'
                  )}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{category.name?.mn}</div>
                      {category.description && (
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {category.description?.mn}
                        </div>
                      )}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
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

        {/* Selection Limit Warning */}
        {selectedCategories.length >= maxSelections && (
          <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-2">
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              Хамгийн их {maxSelections} категори сонгох боломжтой
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiCategorySelector;
