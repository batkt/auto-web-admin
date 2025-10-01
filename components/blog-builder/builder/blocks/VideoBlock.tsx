'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type Props = {
  url?: string;
  isDragging?: boolean;
  onChange?: (url: string) => void;
};

const getEmbedUrl = (url: string): string | null => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('v=') ? new URL(url).searchParams.get('v') : url.split('/').pop();
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }
  return null;
};

export default function VideoBlock({ url = '', onChange, isDragging = false }: Props) {
  // const inputRef = useRef<HTMLInputElement>(null);
  const [inputText, setInputText] = useState(url);
  const [videoUrl, setVideoUrl] = useState<string | null>(getEmbedUrl(url));
  const [error, setError] = useState('');

  return (
    <div className={cn('border p-4 rounded space-y-4 bg-background focus:ountline-none')}>
      <div className="flex gap-4 items-center">
        <Input
          placeholder="YouTube линк оруулна уу."
          value={inputText}
          onChange={e => {
            setInputText(e.target.value);
          }}
          className="flex"
        />

        <Button
          type="button"
          onClick={() => {
            onChange?.(inputText);
            const link = getEmbedUrl(inputText);
            if (!link) {
              setError('Таны оруулсан холбоос хандах боломжгүй эсвэл буруу байна.');
            }
            setVideoUrl(link);
          }}
        >
          Холбоос шалгах
        </Button>
      </div>

      {/* Preview */}
      {videoUrl ? (
        <iframe src={videoUrl} width="100%" className="rounded aspect-video" allowFullScreen />
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
