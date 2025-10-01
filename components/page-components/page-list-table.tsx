'use client';

import { Page } from '@/lib/types/page.types';
import Link from 'next/link';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

const PageListTable = ({ pages }: { pages: Page[] }) => {
  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Хуудасны нэр</TableHead>
            <TableHead className="font-semibold">Түлхүүр үг</TableHead>
            <TableHead className="font-semibold">Бүлэгүүд</TableHead>
            <TableHead className="font-semibold text-right">Үйлдэл</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map(page => (
            <TableRow key={page._id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <div>
                  <div className="text-sm font-medium">{page.name.mn}</div>
                  <div className="text-xs text-muted-foreground">{page.name.en}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-mono text-xs">
                  {page.slug}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{page.sections.length} бүлэг</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/content/pages/${page.slug}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Засах
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PageListTable;
