'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChipInput } from '@/components/ui/chip-input';
import { Branch } from '@/lib/types/branch.types';
import { Plus, MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';
import { createBranch } from '@/lib/actions/branch';
import { ImageUpload } from '@/components/ui/image-upload';
import { uploadFile } from '@/lib/actions/file';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/map'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      Loading map...
    </div>
  ),
});

type BranchFormData = {
  name: string;
  fullAddress: string;
  phone: string;
  email: string;
  services: string[];
  image: string;
  coordinates: [number, number];
  pastor?: string;
  description?: string;
};

interface BranchCreateDialogProps {
  onBranchCreated: (newBranch: Branch) => void;
}

export function BranchCreateDialog({ onBranchCreated }: BranchCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { register, handleSubmit, watch, setValue, reset } = useForm<BranchFormData>({
    defaultValues: {
      name: '',
      fullAddress: '',
      phone: '',
      email: '',
      services: [],
      image: '',
      coordinates: [47.907195, 106.929912], // Default to Ulaanbaatar
      pastor: '',
      description: '',
    },
  });

  const watchedServices = watch('services');
  const watchedCoordinates = watch('coordinates');
  const watchedImage = watch('image');

  const onSubmit = async (values: BranchFormData) => {
    if (!values.name.trim()) {
      toast.error('Салбарын нэрийг оруулна уу');
      return;
    }

    if (!values.fullAddress.trim()) {
      toast.error('Бүтэн хаягийг оруулна уу');
      return;
    }

    if (!values.phone.trim()) {
      toast.error('Утасны дугаарыг оруулна уу');
      return;
    }

    if (!values.email.trim()) {
      toast.error('Имэйл хаягийг оруулна уу');
      return;
    }

    if (!values.image.trim()) {
      toast.error('Зургийн хаягийг оруулна уу');
      return;
    }

    setIsSaving(true);
    try {
      const response = await createBranch(values);

      if (response.code === 201) {
        const newBranch = response.data;
        onBranchCreated(newBranch);
        toast.success('Салбар амжилттай үүслээ');
        setOpen(false);
        reset();
      } else {
        throw new Error(response.message || 'Үүсгэхэд алдаа гарлаа');
      }
    } catch (error) {
      console.error('Error creating branch:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Алдаа гарлаа. Дахин оролдоно уу.';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset();
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    setOpen(newOpen);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setValue('coordinates', [lat, lng]);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      // You can integrate with a geocoding service here
      // For now, we'll use a simple placeholder
      // In a real implementation, you'd call a geocoding API
      console.log('Searching for:', searchQuery);

      // Placeholder: You would replace this with actual geocoding
      // const response = await fetch(`/api/geocode?q=${encodeURIComponent(searchQuery)}`);
      // const data = await response.json();
      // setValue('coordinates', [data.lat, data.lng]);
      // setValue('fullAddress', data.address);
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const response = await uploadFile(file);
      return response.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Файл байршуулахад алдаа гарлаа';
      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Шинэ салбар
      </Button>

      <DialogContent className="max-w-4xl p-0 max-h-[80vh] flex flex-col gap-0">
        <DialogHeader className="p-6 border-b border-gray-200">
          <DialogTitle>Шинэ салбар үүсгэх</DialogTitle>
        </DialogHeader>

        <div className="w-full flex flex-col flex-1 overflow-y-auto">
          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
              <div className="p-6 space-y-6">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Салбарын нэр *
                      </Label>
                      <Input
                        id="name"
                        {...register('name')}
                        className="mt-1"
                        placeholder="Салбарын нэрийг оруулна уу"
                      />
                    </div>

                    <div>
                      <Label htmlFor="pastor" className="text-sm font-medium text-gray-700">
                        Захирал
                      </Label>
                      <Input
                        id="pastor"
                        {...register('pastor')}
                        className="mt-1"
                        placeholder="Захирлын нэрийг оруулна уу"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Тайлбар
                    </Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      className="mt-1"
                      placeholder="Салбарын тайлбарыг оруулна уу"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <ImageUpload
                    mode="single"
                    value={watchedImage}
                    onChange={value => setValue('image', typeof value === 'string' ? value : '')}
                    onUpload={handleImageUpload}
                    maxSize={5}
                    className="w-full"
                  />
                </div>
                {/* Contact Information Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Утасны дугаар *
                      </Label>
                      <Input
                        id="phone"
                        {...register('phone')}
                        className="mt-1"
                        placeholder="Утасны дугаарыг оруулна уу"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Имэйл хаяг *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        className="mt-1"
                        placeholder="Имэйл хаягийг оруулна уу"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="services" className="text-sm font-medium text-gray-700">
                      Үйлчилгээнүүд
                    </Label>
                    <ChipInput
                      value={watchedServices || []}
                      onChange={services => setValue('services', services)}
                      placeholder="Үйлчилгээ нэмэх (Enter эсвэл таслал дарж нэмнэ)"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullAddress" className="text-sm font-medium text-gray-700">
                      Бүтэн хаяг *
                    </Label>
                    <Textarea
                      id="fullAddress"
                      {...register('fullAddress')}
                      className="mt-1"
                      placeholder="Бүтэн хаягийг оруулна уу"
                      rows={2}
                    />
                  </div>

                  <div>
                    <div className="mt-2 space-y-2">
                      <Label className="text-xs text-gray-500">
                        Газрын зураг дээр дарж байршлыг сонгоно уу
                      </Label>
                      <div className="h-64 rounded-lg overflow-hidden border">
                        <MapComponent
                          position={watchedCoordinates}
                          onMapClick={handleMapClick}
                          interactive={true}
                        />
                      </div>
                    </div>

                    {/* Coordinates Display */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">Өргөрөг (Latitude)</Label>
                        <Input
                          value={watchedCoordinates[0].toFixed(6)}
                          onChange={e => {
                            const lat = parseFloat(e.target.value);
                            if (!isNaN(lat)) {
                              setValue('coordinates', [lat, watchedCoordinates[1]]);
                            }
                          }}
                          type="number"
                          step="any"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Уртраг (Longitude)</Label>
                        <Input
                          value={watchedCoordinates[1].toFixed(6)}
                          onChange={e => {
                            const lng = parseFloat(e.target.value);
                            if (!isNaN(lng)) {
                              setValue('coordinates', [watchedCoordinates[0], lng]);
                            }
                          }}
                          type="number"
                          step="any"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-gray-200">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving} className="flex-1">
            Цуцлах
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSaving} className="flex-1">
            {isSaving ? 'Үүсгэж байна...' : 'Үүсгэх'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
