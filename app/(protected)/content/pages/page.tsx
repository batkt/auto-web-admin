import PageListTable from '@/components/page-components/page-list-table';
import { getPages } from '@/lib/services/page.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default async function PagesPage() {
  const pages = await getPages();

  return (
    <div className="p-6">
      <div className="space-y-8">
        {/* Pages List */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="size-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-md flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Хуудаснуудын жагсаалт</CardTitle>
                <CardDescription>Бүх хуудаснуудыг харах, засах</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            {pages.data.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="size-10" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Хуудас байхгүй байна</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Одоогоор үүсгэгдсэн хуудас байхгүй байна.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <PageListTable pages={pages.data} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
