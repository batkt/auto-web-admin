# Category Management System

This document describes the category management system implemented for the blog functionality.

## Features

### 1. Category Management Page

- **Location**: `/blogs/categories`
- **Features**:
  - View all categories in a card layout
  - Create new categories
  - Edit existing categories
  - Delete categories (with validation to prevent deletion if used by blogs)
  - Mongolian language support

### 2. Category Creation

- **Location**: `/blogs/categories/create`
- **Features**:
  - Standalone form for creating new categories
  - Form validation
  - Automatic slug generation
  - Description field (optional)

### 3. Category Components

#### CategoryListContent

- Displays categories in a responsive grid layout
- Edit and delete actions for each category
- Empty state with call-to-action

#### CategoryFormDialog

- Modal dialog for creating/editing categories
- Reusable component for both create and edit operations
- Form validation and error handling

#### CategorySelector

- Single category selection dropdown
- Used in forms where only one category is needed

#### MultiCategorySelector

- Multiple category selection with toggle buttons
- Visual display of selected categories with remove functionality
- Used in blog forms where multiple categories are allowed

## API Endpoints

### Backend Routes

- `POST /categories` - Create new category
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID

- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Frontend Actions (CRUD operations only)

- `createCategory(data)` - Create new category
- `updateCategory(id, data)` - Update category
- `deleteCategory(id)` - Delete category

### Frontend Services (Read operations)

- `getCategoryList()` - Get all categories
- `getCategoryById(id)` - Get category by ID

## Data Structure

### Category Type

```typescript
interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Category Data (for forms)

```typescript
interface CategoryData {
  name: string;
  description?: string;
}
```

## Usage Examples

### Using CategorySelector in a form

```tsx
import { CategorySelector } from '@/components/category';

<CategorySelector
  categories={categories}
  value={selectedCategory}
  onValueChange={setSelectedCategory}
  label="Категори"
  placeholder="Категори сонгох"
/>;
```

### Using MultiCategorySelector in a blog form

```tsx
import { MultiCategorySelector } from '@/components/category';

<MultiCategorySelector
  categories={categories}
  selectedCategories={selectedCategories}
  onSelectionChange={setSelectedCategories}
  label="Категориуд"
  placeholder="Категориуд сонгох"
/>;
```

### Using Category Actions (CRUD operations)

```tsx
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions/category';

// Create category
const response = await createCategory({ name: 'Новости', description: 'Новости церкви' });

// Update category
const response = await updateCategory(id, { name: 'Обновленные новости' });

// Delete category
const response = await deleteCategory(id);
```

### Using Category Services (Read operations)

```tsx
import { getCategoryList, getCategoryById } from '@/lib/services/category.service';

// Get all categories
const categories = await getCategoryList();

// Get category by ID
const category = await getCategoryById(id);
```

## Navigation

The category management is accessible through:

1. **Sidebar Navigation**: Blogs → Категориуд
2. **Blog List Page**: "Категориуд" button in the header
3. **Direct URL**: `/blogs/categories`

## Validation

- Category name is required
- Cannot delete categories that are being used by blogs

## Mongolian Language Support

All user-facing text is in Mongolian:

- Page titles and descriptions
- Form labels and placeholders
- Success/error messages
- Button text
- Navigation items
