'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Category } from '@/lib/types/category.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, Search, Check, Plus, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedCategorySelectorProps {
  categories: Category[];
  selectedCategories: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  maxSelections?: number;
  singleSelect?: boolean;
  showDescriptions?: boolean;
}

const EnhancedCategorySelector: React.FC<EnhancedCategorySelectorProps> = ({
  categories,
  selectedCategories,
  onSelectionChange,
  label = 'Категориуд',
  placeholder = 'Категориуд сонгох',
  disabled = false,
  maxSelections = 5,
  singleSelect = false,
  showDescriptions = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter(
      category =>
        category.name.mn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.description &&
          category.description.mn.toLowerCase().includes(searchQuery.toLowerCase()))
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

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleCategory = (e: React.MouseEvent, categoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (singleSelect) {
      onSelectionChange([categoryId]);
      setIsExpanded(false);
      setSearchQuery('');
    } else {
      if (selectedCategories.includes(categoryId)) {
        onSelectionChange(selectedCategories.filter(id => id !== categoryId));
      } else {
        if (selectedCategories.length < maxSelections) {
          onSelectionChange([...selectedCategories, categoryId]);
        }
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

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const getDisplayText = () => {
    if (selectedCategories.length === 0) return placeholder;
    if (singleSelect) {
      const category = selectedCategoryObjects[0];
      return category?.name.mn || placeholder;
    }
    if (selectedCategories.length === 1) {
      const category = selectedCategoryObjects[0];
      return category?.name.mn || placeholder;
    }
    return `${selectedCategories.length} категори сонгосон`;
  };

  return (
    <div className="space-y-3" ref={containerRef}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {selectedCategories.length > 0 && !singleSelect && (
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

      {/* Main Selector Trigger */}
      <div className="relative">
        <Button
          variant="outline"
          type="button"
          onClick={handleToggleExpand}
          disabled={disabled}
          className={cn(
            'w-full justify-between h-10 px-3',
            isFocused && 'ring-2 ring-primary/20 border-primary',
            selectedCategories.length > 0 && 'bg-primary/5 border-primary/20'
          )}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {selectedCategories.length > 0 && (
              <Tag className="h-4 w-4 text-primary flex-shrink-0" />
            )}
            <span
              className={cn('truncate', selectedCategories.length === 0 && 'text-muted-foreground')}
            >
              {getDisplayText()}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
        </Button>

        {/* Dropdown Content */}
        {isExpanded && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg">
            {/* Search Input */}
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder="Категори хайх..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </div>
            </div>

            {/* Selected Categories */}
            {selectedCategories.length > 0 && (
              <div className="p-3 border-b bg-muted/30">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Check className="h-3 w-3" />
                  <span>
                    Сонгосон ({selectedCategories.length}/{maxSelections})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedCategoryObjects.map(category => (
                    <Badge
                      key={category._id}
                      variant="default"
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary border border-primary/20"
                    >
                      <span className="truncate max-w-20">{category.name.mn}</span>
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

            {/* Quick Actions */}
            {unselectedCategories.length > 0 && !singleSelect && (
              <div className="p-2 border-b bg-muted/20">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={handleSelectAll}
                  disabled={disabled || selectedCategories.length >= maxSelections}
                  className="h-7 px-2 text-xs w-full justify-start"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Бүгдийг сонгох ({unselectedCategories.length})
                </Button>
              </div>
            )}

            {/* Categories List */}
            <div className="max-h-48 overflow-y-auto">
              {unselectedCategories.length > 0 ? (
                <div className="p-1">
                  {unselectedCategories.map(category => (
                    <Button
                      key={category._id}
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={e => handleToggleCategory(e, category._id)}
                      disabled={
                        disabled || (!singleSelect && selectedCategories.length >= maxSelections)
                      }
                      className="w-full justify-start h-auto p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-1 min-w-0 text-left">
                          <div className="font-medium text-sm">{category.name.mn}</div>
                          {showDescriptions && category.description && (
                            <div className="text-xs text-muted-foreground truncate mt-0.5">
                              {category.description.mn}
                            </div>
                          )}
                        </div>
                        <Plus className="h-4 w-4 text-primary flex-shrink-0" />
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="text-muted-foreground">
                    {searchQuery ? (
                      <>
                        <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          &quot;{searchQuery}&quot; гэсэн категори олдсонгүй
                        </p>
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

            {/* Footer */}
            {unselectedCategories.length > 0 && (
              <div className="p-2 border-t bg-muted/30">
                <p className="text-xs text-muted-foreground text-center">
                  {unselectedCategories.length} категори боломжтой
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selection Limit Warning */}
      {selectedCategories.length >= maxSelections && !singleSelect && (
        <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-2">
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3" />
            Хамгийн их {maxSelections} категори сонгох боломжтой
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCategorySelector;
