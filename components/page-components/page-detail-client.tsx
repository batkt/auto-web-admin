'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Layers } from 'lucide-react';
import { PageEditDialog } from '@/components/page-edit-dialog';
import { Page } from '@/lib/types/page.types';
import { SectionData } from '@/lib/types/section.types';
import { Label } from '../ui/label';
import { SectionListTable } from '@/components/section-components/section-list-table';
import { Badge } from '../ui/badge';
import { useAuth } from '@/contexts/auth-context';

interface PageDetailClientProps {
  initialPage: Page;
  initialSections: SectionData[];
  slug: string;
}

export function PageDetailClient({ initialPage, initialSections, slug }: PageDetailClientProps) {
  const [page, setPage] = useState<Page>(initialPage);
  const [sections, setSections] = useState<SectionData[]>(initialSections);
  const { currentUser } = useAuth();
  const isAdmin = ['super-admin', 'admin'].includes(currentUser?.role);

  const handlePageUpdated = (updatedPage: Page) => {
    setPage(updatedPage);
  };

  return (
    <div className="p-6">
      <div className="space-y-8">
        {/* Page Header */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight">/{page.slug}</h1>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {isAdmin && <PageEditDialog page={page} onPageUpdated={handlePageUpdated} />}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(page.description).map(key => (
              <div key={key} className="border rounded-md p-4 pt-10 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 pl-4 py-1 bg-black/10 font-mono text-sm font-medium text-foreground">
                  {key}
                </div>
                <div>
                  <Label className="mb-2">Гарчиг</Label>
                  <p className="text-muted-foreground">
                    {page.name[key as keyof typeof page.name]}
                  </p>
                </div>
                <div>
                  <Label className="mb-2 mt-4">Тайлбар</Label>
                  <p key={key} className="text-muted-foreground">
                    {page.description[key as keyof typeof page.description]}
                  </p>
                </div>
                <div>
                  <Label className="mb-2 mt-4">Түлхүүр үгс</Label>
                  <div className="flex flex-wrap gap-2">
                    {page.keywords.map(keyword => (
                      <Badge key={keyword} variant="outline" className="rounded-full uppercase">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sections List */}
        <Card className="shadow-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Бүлгүүд</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Хуудасны бүлгүүдийг засах
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <SectionListTable sections={sections} pageSlug={slug} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
