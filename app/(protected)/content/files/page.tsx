'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Search, Filter, File, Folder, Download, Trash2 } from 'lucide-react';

export default function FilesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Файл удирдлага</h1>
        <p className="text-muted-foreground">Файлын сангийн удирдлага, оруулах, засах, устгах</p>
      </div>

      <div className="grid gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Файл оруулах
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Файл сонгох</Label>
                <Input type="file" multiple />
              </div>
              <div className="space-y-2">
                <Label>Хавтас</Label>
                <Input placeholder="Хавтас сонгох" />
              </div>
            </div>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Файл оруулах
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
                <Input placeholder="Файлын нэр..." />
              </div>
              <div className="space-y-2">
                <Label>Хавтас</Label>
                <Input placeholder="Хавтас сонгох..." />
              </div>
              <div className="space-y-2">
                <Label>Файлын төрөл</Label>
                <Input placeholder="Төрөл сонгох..." />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Шүүх
            </Button>
          </CardContent>
        </Card>

        {/* Files List */}
        <Card>
          <CardHeader>
            <CardTitle>Файлын жагсаалт</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded">
                      <File className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Файл {i + 1}.pdf</h3>
                      <p className="text-sm text-muted-foreground">{(i % 5) + 2} MB • 2024.01.15</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Folders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Хавтас
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 border rounded-lg text-center hover:bg-muted cursor-pointer"
                >
                  <Folder className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Хавтас {i + 1}</p>
                  <p className="text-xs text-muted-foreground">{(i % 8) + 3} файл</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
