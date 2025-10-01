'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Search, Filter, Play } from 'lucide-react';

export default function VideosPage() {
    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Видео удирдлага</h1>
                <p className="text-muted-foreground">
                    Видео файлын удирдлага, оруулах, засах, устгах
                </p>
            </div>

            <div className="grid gap-6">
                {/* Upload Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Видео оруулах
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Видео файл сонгох</Label>
                                <Input type="file" accept="video/*" />
                            </div>
                            <div className="space-y-2">
                                <Label>Категори</Label>
                                <Input placeholder="Категори сонгох" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Гарчиг</Label>
                                <Input placeholder="Видеоны гарчиг" />
                            </div>
                            <div className="space-y-2">
                                <Label>Тайлбар</Label>
                                <Input placeholder="Тайлбар" />
                            </div>
                        </div>
                        <Button>
                            <Upload className="h-4 w-4 mr-2" />
                            Видео оруулах
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
                                <Input placeholder="Видеоны нэр..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Категори</Label>
                                <Input placeholder="Категори сонгох..." />
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

                {/* Videos Grid */}
                <Card>
                    <CardHeader>
                        <CardTitle>Видеоны жагсаалт</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative">
                                        <Play className="h-8 w-8 text-muted-foreground" />
                                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            3:45
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-medium">Видео {i + 1}</h3>
                                        <p className="text-sm text-muted-foreground">Категори • 2024.01.15</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 