'use client';

import { SectionData } from '@/lib/types/section.types';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Layers } from "lucide-react";
import Link from 'next/link';

interface SectionListTableProps {
    sections: SectionData[];
    pageSlug: string;
}

export function SectionListTable({ sections, pageSlug }: SectionListTableProps) {

    if (sections.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Layers className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Бүлэг байхгүй байна
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Энэ хуудас дээр одоогоор бүлэг нэмэгдээгүй байна.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-semibold w-32">ID</TableHead>
                        <TableHead className="font-semibold w-24">Дараалал</TableHead>
                        <TableHead className="font-semibold">Бүлгийн нэр</TableHead>
                        <TableHead className="font-semibold text-right">Үйлдэл</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sections.map((section, index) => (
                        <TableRow key={section._id || index}>
                            <TableCell>
                                <Badge variant="secondary" className="font-mono text-xs">
                                    {section._id?.slice(-8) || 'N/A'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="font-mono">
                                    {section.sortOrder || index + 1}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                <div>
                                    <h4 className="font-semibold text-slate-900">
                                        {section.key}
                                    </h4>
                                </div>
                            </TableCell>

                            <TableCell className="text-right">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                >
                                    <Link href={`/content/pages/${pageSlug}/sections/${section.key}`}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Засах
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
} 