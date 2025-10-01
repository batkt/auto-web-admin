'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Search, Filter } from 'lucide-react';

export default function ImagesPage() {
    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Зураг удирдлага</h1>
                <p className="text-muted-foreground">
                    Зургийн сангийн удирдлага, оруулах, засах, устгах
                </p>
            </div>

            <div className="grid gap-6">
                {/* Upload Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Зураг оруулах
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Зураг сонгох</Label>
                                <Input type="file" accept="image/*" multiple />
                            </div>
                            <div className="space-y-2">
                                <Label>Албом</Label>
                                <Input placeholder="Албомын нэр" />
                            </div>
                        </div>
                        <Button>
                            <Upload className="h-4 w-4 mr-2" />
                            Зураг оруулах
                        </Button>
                    </CardContent>
                </Card>

                {/* Search and Filter */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Хайх, шүүх
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Хайх</Label>
                                <Input placeholder="Зургийн нэр..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Албом</Label>
                                <Input placeholder="Албом сонгох..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Огноо</Label>
                                <Input type="date" />
                            </div>
                        </div>
                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Шүүх
                        </Button>
                    </CardContent>
                </Card>

                {/* Images Grid */}
                <Card>
                    <CardHeader>
                        <CardTitle>Зургийн жагсаалт</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                    <span className="text-muted-foreground text-sm">Зураг {i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 