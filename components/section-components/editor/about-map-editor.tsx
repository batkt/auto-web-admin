'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { updateSectionData } from '@/lib/actions/section';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import LanguageTabs from '../language-tabs';

// Dynamically import Leaflet to avoid SSR issues
const LeafletMap = dynamic(() => import('@/components/section-components/editor/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-500">Loading map...</p>
      </div>
    </div>
  ),
});

interface AboutMapData {
  title: {
    en: string;
    mn: string;
  };
  description: {
    en: string;
    mn: string;
  };
  latitude: number;
  longitude: number;
}

interface AboutMapEditorProps {
  data: AboutMapData;
  onDataChange: (data: AboutMapData) => void;
  sectionId?: string;
}

export default function AboutMapEditor({ data, onDataChange, sectionId }: AboutMapEditorProps) {
  const { register, handleSubmit, watch, setValue } = useForm<AboutMapData>({
    defaultValues: data,
  });

  const [lang, setLang] = useState<'en' | 'mn'>('en');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number }>({
    lat: Number(data.latitude),
    lng: Number(data.longitude),
  });
  const [errors, setErrors] = useState<{
    titleEn?: boolean;
    titleMn?: boolean;
    descEn?: boolean;
    descMn?: boolean;
    image?: boolean;
  }>({});

  const onSubmit = async (values: AboutMapData) => {
    const newErrors: typeof errors = {};
    if (!values.title.en?.trim()) newErrors.titleEn = true;
    if (!values.title.mn?.trim()) newErrors.titleMn = true;
    if (!values.description.en?.trim()) newErrors.descEn = true;
    if (!values.description.mn?.trim()) newErrors.descMn = true;
    // If there is an image or map field, add validation here, e.g.:
    // if (!values.image) newErrors.image = true;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error('Бүх талбарыг бүрэн бөглөнө үү');
      return;
    }

    if (!sectionId) {
      onDataChange(values);
      return;
    }

    setIsSaving(true);
    try {
      const response = await updateSectionData(sectionId, values);
      if (response.code === 200) {
        toast.success('Амжилттай хадгалагдлаа');
        onDataChange(values);
      } else {
        throw new Error(response.message || 'Хадгалахад алдаа гарлаа');
      }
    } catch (error) {
      console.error('Error saving section data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Хадгалахад алдаа гарлаа';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle real-time updates on field changes
  const handleFieldChange = (field: any, value: any) => {
    setValue(field, value);
    const currentValues = watch();
    onDataChange(currentValues);
  };

  const handleChangeLang = (v: string) => {
    setLang(v as 'en' | 'mn');
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const handleSaveLocation = () => {
    setValue('latitude', selectedLocation.lat);
    setValue('longitude', selectedLocation.lng);
    const currentValues = watch();
    onDataChange(currentValues);
    setIsMapModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sidebar Header - Fixed */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <LanguageTabs lang={lang} handleChangeLang={handleChangeLang} />
      </div>

      {/* Sidebar Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <form key={lang} onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
          <div className="p-6 space-y-6">
            {/* Main Content Section */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Гарчиг <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    {...register(`title.${lang}`)}
                    onChange={e => handleFieldChange(`title.${lang}`, e.target.value)}
                    className={cn('mt-1', errors.titleEn && 'border-red-500')}
                    placeholder={
                      lang === 'en'
                        ? 'Enter title in English'
                        : 'Гарчигийг монгол хэлээр оруулна уу'
                    }
                  />
                  {errors.titleEn && lang === 'en' && (
                    <p className="text-xs text-red-500 mt-1">Англи гарчиг шаардлагатай</p>
                  )}
                  {errors.titleMn && lang === 'mn' && (
                    <p className="text-xs text-red-500 mt-1">Монгол гарчиг шаардлагатай</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Тайлбар <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    {...register(`description.${lang}`)}
                    onChange={e => handleFieldChange(`description.${lang}`, e.target.value)}
                    className={cn('mt-1', errors.descEn && 'border-red-500')}
                    placeholder={
                      lang === 'en'
                        ? 'Enter description in English'
                        : 'Тайлбарыг монгол хэлээр оруулна уу'
                    }
                    rows={3}
                  />
                  {errors.descEn && lang === 'en' && (
                    <p className="text-xs text-red-500 mt-1">Англи тайлбар шаардлагатай</p>
                  )}
                  {errors.descMn && lang === 'mn' && (
                    <p className="text-xs text-red-500 mt-1">Монгол тайлбар шаардлагатай</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Location Section */}
            <div className="space-y-4">
              <div className="space-y-3">
                <Button
                  onClick={() => setIsMapModalOpen(true)}
                  variant="outline"
                  className="flex items-center gap-2 w-full"
                >
                  <MapPin className="h-4 w-4" />
                  Байршил сонгох
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude" className="text-sm font-medium text-gray-700">
                      Latitude
                    </Label>
                    <Input
                      id="latitude"
                      {...register('latitude')}
                      readOnly
                      className="mt-1 bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude" className="text-sm font-medium text-gray-700">
                      Longitude
                    </Label>
                    <Input
                      id="longitude"
                      {...register('longitude')}
                      readOnly
                      className="mt-1 bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Sidebar Footer - Fixed */}
      <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <Button
          type="submit"
          className="w-full"
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
        >
          {isSaving ? 'Хадгалж байна...' : 'Хадгалах'}
        </Button>
      </div>

      {/* Map Modal */}
      <Dialog open={isMapModalOpen} onOpenChange={setIsMapModalOpen}>
        <DialogContent className="max-w-4xl" style={{ zIndex: 9999 }} overlayClassName="z-1000">
          <DialogHeader>
            <DialogTitle>Байршил сонгох</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="h-96 rounded-lg border" style={{ zIndex: 1000 }}>
              <LeafletMap
                initialLat={selectedLocation.lat}
                initialLng={selectedLocation.lng}
                onLocationSelect={handleMapClick}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Сонгосон: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsMapModalOpen(false)}>
                  Болих
                </Button>
                <Button onClick={handleSaveLocation}>Хадгалах</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
