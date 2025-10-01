# Section Editor System

This document explains how to display and edit the structured data from `initData.ts` in the church-admin using shadcn components.

## Overview

The section editor system provides a user-friendly interface for managing complex nested data structures that match your backend schema. It supports:

- **Multilingual content** (English and Mongolian)
- **Complex nested objects** (like the hero section stats)
- **Array management** (like the help section items)
- **Type-safe editing** with TypeScript
- **Real-time preview** of changes

## File Structure

```
church-admin/
├── lib/types/section.types.ts          # Type definitions
├── components/ui/multilingual-input.tsx # Multilingual input component
├── components/section-editor/           # Section editor components
│   ├── hero-section-editor.tsx
│   ├── mission-section-editor.tsx
│   ├── help-section-editor.tsx
│   └── section-editor.tsx
├── components/page-editor/
│   └── page-editor.tsx                  # Main page editor
└── app/dashboard/pages/page.tsx         # Demo page
```

## How It Works

### 1. Type Definitions (`section.types.ts`)

The types match your backend schema and `initData.ts` structure:

```typescript
export interface MultilingualText {
  en: string;
  mn: string;
}

export interface HeroSectionData {
  welcomeText: MultilingualText;
  mainTitle: MultilingualText;
  ctaText: MultilingualText;
  ctaUrl: string;
  backgroundImage: string;
  stats: {
    servedOver: { value: number; label: MultilingualText };
    donate: { title: MultilingualText; desc: MultilingualText };
    volunteer: { title: MultilingualText; desc: MultilingualText };
  };
}
```

### 2. Multilingual Input Component

Handles editing text in both languages:

```tsx
<MultilingualInput
  label="Welcome Text"
  value={data.welcomeText}
  onChange={value => updateField('welcomeText', value)}
  placeholder={{ en: 'WELCOME', mn: 'Тавтай морил' }}
/>
```

### 3. Section Editors

Each section type has its own editor:

- **HeroSectionEditor**: Handles complex nested stats data
- **MissionSectionEditor**: Simple title/description structure
- **HelpSectionEditor**: Manages array of items with add/remove functionality

### 4. Page Editor

The main component that:

- Manages multiple sections
- Allows adding/removing sections
- Provides section type selection
- Handles save operations

## Usage Example

### Basic Usage

```tsx
import { PageEditor } from '@/components/page-editor/page-editor';
import { PageData } from '@/lib/types/section.types';

const [pageData, setPageData] = useState<PageData>(initialData);

<PageEditor page={pageData} onChange={setPageData} onSave={handleSave} />;
```

### Data Structure

The data structure matches your `initData.ts`:

```typescript
const pageData: PageData = {
  slug: 'home',
  name: { en: 'Home', mn: 'Нүүр хуудас' },
  description: { en: 'Main church page', mn: 'Церковын үндсэн хуудас' },
  sections: [
    {
      pageId: 'home',
      key: 'home-hero',
      sortOrder: 0,
      data: {
        welcomeText: { en: 'WELCOME', mn: 'Тавтай морил' },
        mainTitle: { en: 'Doing Nothing is Not An Option...', mn: '...' },
        // ... rest of hero data
      },
    },
    // ... more sections
  ],
};
```

## Features

### 1. Multilingual Support

- All text fields support both English and Mongolian
- Clean tabbed interface for language switching
- Validation for both languages

### 2. Complex Data Handling

- Nested objects (like hero stats)
- Arrays with add/remove functionality (like help items)
- Type-safe field updates

### 3. Section Management

- Add new sections with default data
- Remove sections with confirmation
- Reorder sections by sort order
- Collapsible section editing

### 4. Real-time Updates

- All changes are reflected immediately
- Debug panel shows current data structure
- Form validation in real-time

## Backend Integration

### Saving Data

The system prepares data in the format expected by your backend:

```typescript
const handleSave = () => {
  const sectionsForBackend = pageData.sections.map(section => ({
    pageId: section.pageId,
    key: section.key,
    sortOrder: section.sortOrder,
    data: section.data,
    fieldDefinitions: getFieldDefinitionsForSection(section.key),
  }));

  // Send to your API
  await fetch('/api/pages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page: {
        slug: pageData.slug,
        name: pageData.name,
        description: pageData.description,
      },
      sections: sectionsForBackend,
    }),
  });
};
```

### Field Definitions

The system generates field definitions that match your `initData.ts`:

```typescript
const getFieldDefinitionsForSection = (sectionKey: string) => {
  if (sectionKey.includes('hero')) {
    return [
      { name: 'welcomeText', type: 'object', required: true },
      { name: 'mainTitle', type: 'object', required: true },
      { name: 'ctaText', type: 'object', required: true },
      { name: 'ctaUrl', type: 'string', required: true },
      { name: 'backgroundImage', type: 'image', required: true },
      { name: 'stats', type: 'object', required: true },
    ];
  }
  // ... other section types
};
```

## Customization

### Adding New Section Types

1. **Define the type** in `section.types.ts`:

```typescript
export interface NewSectionData {
  title: MultilingualText;
  items: Array<{ name: MultilingualText; value: number }>;
}
```

2. **Create the editor component**:

```tsx
export function NewSectionEditor({ data, onChange }: NewSectionEditorProps) {
  // Implementation
}
```

3. **Add to the main section editor**:

```tsx
case 'new':
  return <NewSectionEditor data={section.data} onChange={updateSectionData} />;
```

### Styling

All components use shadcn/ui components and can be customized with Tailwind CSS classes.

## Demo

Visit `/dashboard/pages` to see the system in action with sample data that matches your `initData.ts` structure.

## Benefits

1. **Type Safety**: Full TypeScript support prevents errors
2. **User Friendly**: Intuitive interface for complex data
3. **Multilingual**: Native support for English and Mongolian
4. **Extensible**: Easy to add new section types
5. **Consistent**: Uses shadcn/ui design system
6. **Backend Ready**: Data format matches your MongoDB schema

This system provides a complete solution for managing the structured data from your `initData.ts` file in a user-friendly way while maintaining type safety and consistency with your backend schema.
