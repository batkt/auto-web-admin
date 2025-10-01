'use client';

import { Input } from './input';
import { Label } from './label';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { MultilingualText } from '@/lib/types/section.types';

interface MultilingualInputProps {
    value: MultilingualText;
    onChange: (value: MultilingualText) => void;
    label?: string;
    placeholder?: {
        en?: string;
        mn?: string;
    };
    error?: {
        en?: string;
        mn?: string;
    };
}

export function MultilingualInput({
    value,
    onChange,
    label,
    placeholder = { en: 'Enter text in English', mn: 'Монгол хэл дээр текст оруулна уу' },
    error
}: MultilingualInputProps) {
    const handleChange = (lang: 'en' | 'mn', text: string) => {
        onChange({
            ...value,
            [lang]: text
        });
    };

    return (
        <div className="space-y-4">
            {label && <Label className="text-base font-medium">{label}</Label>}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">Multilingual Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">English</Label>
                        <Input
                            value={value.en}
                            onChange={(e) => handleChange('en', e.target.value)}
                            placeholder={placeholder.en}
                            className={error?.en ? 'border-red-500' : ''}
                        />
                        {error?.en && <p className="text-sm text-red-500">{error.en}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Монгол</Label>
                        <Input
                            value={value.mn}
                            onChange={(e) => handleChange('mn', e.target.value)}
                            placeholder={placeholder.mn}
                            className={error?.mn ? 'border-red-500' : ''}
                        />
                        {error?.mn && <p className="text-sm text-red-500">{error.mn}</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 