import { getMessagesList } from '@/lib/services/message.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import React from 'react';
import MessageTable from '@/components/message/message-table';
import SearchInput from '@/components/ui/search-input';

const MessagesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    search: string;
    page: string;
  }>;
}) => {
  const { search, page } = await searchParams;
  const messagesList = await getMessagesList(Number(page), 10, search);
  return (
    <div className="p-6">
      <div className="space-y-8">
        {/* Pages List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-md flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">Мессеж жагсаалт</CardTitle>
                  <CardDescription>Бүх мессежнуудыг харах</CardDescription>
                </div>
              </div>
              <SearchInput
                route="/messages"
                paramName="search"
                value={search}
                inputClassName="max-w-lg"
              />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            {!messagesList.data?.data?.length ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="size-10" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Мессеж байхгүй байна</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Одоогоор ирсэн мессеж байхгүй байна.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <MessageTable messageList={messagesList.data} search={search} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
