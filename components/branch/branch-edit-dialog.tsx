'use client';

import { useState, useEffect } from 'react';
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
import { Edit, MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';
import { updateBranch } from '@/lib/actions/branch';
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

interface BranchEditDialogProps {
  branch: Branch;
  onBranchUpdated: (updatedBranch: Branch) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  onlyRead?: boolean;
}

export function BranchEditDialog({
  open,
  setOpen,
  onlyRead,
  branch,
  onBranchUpdated,
}: BranchEditDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { register, handleSubmit, watch, setValue, reset } = useForm<BranchFormData>({
    defaultValues: {
      name: branch.name,
      fullAddress: branch.fullAddress,
      phone: branch.phone,
      email: branch.email,
      services: branch.services || [],
      image: branch.image,
      coordinates: branch.coordinates,
      pastor: branch.pastor || '',
      description: branch.description || '',
    },
  });

  const watchedServices = watch('services');
  const watchedCoordinates = watch('coordinates');
  const watchedImage = watch('image');

  // Reset form when modal opens/closes or branch changes
  useEffect(() => {
    if (open) {
      reset({
        name: branch.name,
        fullAddress: branch.fullAddress,
        phone: branch.phone,
        email: branch.email,
        services: branch.services || [],
        image: branch.image,
        coordinates: branch.coordinates,
        pastor: branch.pastor || '',
        description: branch.description || '',
      });
    }
  }, [open, branch, reset]);

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
      const response = await updateBranch(branch._id, values);

      if (response.code === 200) {
        const updatedBranch = {
          ...branch,
          ...values,
        };

        onBranchUpdated(updatedBranch);
        toast.success('Салбарын мэдээлэл амжилттай шинэчлэгдлээ');
        setOpen(false);
      } else {
        throw new Error(response.message || 'Хадгалахад алдаа гарлаа');
      }
    } catch (error) {
      console.error('Error updating branch:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Алдаа гарлаа. Дахин оролдоно уу.';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset({
      name: branch.name,
      fullAddress: branch.fullAddress,
      phone: branch.phone,
      email: branch.email,
      services: branch.services || [],
      image: branch.image,
      coordinates: branch.coordinates,
      pastor: branch.pastor || '',
      description: branch.description || '',
    });
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset({
        name: branch.name,
        fullAddress: branch.fullAddress,
        phone: branch.phone,
        email: branch.email,
        services: branch.services || [],
        image: branch.image,
        coordinates: branch.coordinates,
        pastor: branch.pastor || '',
        description: branch.description || '',
      });
    }
    setOpen(newOpen);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setValue('coordinates', [lat, lng]);
    // You can integrate with a geocoding service here to get the address
    // For now, we'll use the coordinates as a placeholder
    setValue('fullAddress', `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
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
      <DialogContent className="max-w-4xl p-0 max-h-[80vh] flex flex-col gap-0">
        <DialogHeader className="p-6 border-b border-gray-200">
          <DialogTitle>{onlyRead ? 'Салбарын мэдээлэл' : 'Салбарын мэдээлэл засах'}</DialogTitle>
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
                        disabled={onlyRead}
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
                        disabled={onlyRead}
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
                      disabled={onlyRead}
                      className="mt-1"
                      placeholder="Салбарын тайлбарыг оруулна уу"
                      rows={3}
                    />
                  </div>
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
                        disabled={onlyRead}
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
                        disabled={onlyRead}
                        className="mt-1"
                        placeholder="Имэйл хаягийг оруулна уу"
                      />
                    </div>
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
                      disabled={onlyRead}
                      className="mt-1"
                      placeholder="Бүтэн хаягийг оруулна уу"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Байршил *</Label>

                    {/* Map Section */}
                    <div className="mt-2 space-y-2">
                      <Label className="text-xs text-gray-500">
                        Газрын зураг дээр дарж байршлыг сонгоно уу
                      </Label>
                      <div className="h-64 rounded-lg overflow-hidden border">
                        <MapComponent
                          position={watchedCoordinates}
                          onMapClick={!onlyRead ? handleMapClick : undefined}
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
                          disabled={onlyRead}
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
                          disabled={onlyRead}
                          type="number"
                          step="any"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services Section */}
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
                      disabled={onlyRead}
                    />
                  </div>
                </div>

                {/* Image Section */}
                <div className="space-y-4">
                  <ImageUpload
                    mode="single"
                    disabled={onlyRead}
                    value={watchedImage}
                    onChange={value => setValue('image', typeof value === 'string' ? value : '')}
                    onUpload={handleImageUpload}
                    maxSize={5}
                    className="w-full"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-gray-200">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving} className="flex-1">
            {onlyRead ? 'Хаах' : 'Цуцлах'}
          </Button>
          {!onlyRead && (
            <Button onClick={handleSubmit(onSubmit)} disabled={isSaving} className="flex-1">
              {isSaving ? 'Хадгалж байна...' : 'Хадгалах'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
