// components/FeaturesSection.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaPaperPlane,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaPinterest,
} from 'react-icons/fa';
import { getClientImageUrl, getImageUrl } from '@/utils';

const FeaturesSection = ({
  device,
  data,
  lang,
}: {
  device: 'desktop' | 'mobile';
  data: any;
  lang: string;
}) => {
  return (
    <section
      style={{
        backgroundImage: `url(${getClientImageUrl(data?.backgroundImage)})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={cn('mx-auto max-w-7xl px-6 pt-16 md:px-10')}>
        <div className="mb-10">
          <h2
            className={cn(
              'text-white font-semibold',
              device === 'desktop' ? 'text-5xl text-left' : 'text-4xl'
            )}
          >
            {data?.title?.[lang] || 'Get in touch'}
          </h2>
          <p
            className={cn(
              'font-extrabold text-[#0888A3] mt-2',
              device === 'desktop' ? 'text-5xl' : 'text-4xl'
            )}
          >
            {data?.secondaryTitle?.[lang]}
          </p>
        </div>

        <div
          className={cn(
            'grid gap-12 pb-10',
            device === 'desktop'
              ? 'grid-cols-1 lg:grid-cols-2 items-start'
              : 'grid-cols-1 text-center'
          )}
        >
          {/* LEFT: Contact Form */}
          <div className={cn(device === 'mobile' && 'flex flex-col items-center', 'w-full')}>
            <form
              className={cn('w-full space-y-6', device === 'desktop' ? 'max-w-none' : 'max-w-lg')}
              onSubmit={e => {
                e.preventDefault();
                // TODO: connect saveMessage here
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="sr-only">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    required
                    placeholder={lang === 'mn' ? 'Нэр' : 'First Name'}
                    className="bg-transparent border-b border-white/30 rounded-none px-0 text-white placeholder:text-gray-300 focus:ring-0 focus:border-cyan-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="sr-only">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    required
                    placeholder={lang === 'mn' ? 'Овог' : 'Last Name'}
                    className="bg-transparent border-b border-white/30 rounded-none px-0 text-white placeholder:text-gray-300 focus:ring-0 focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="sr-only">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="Email"
                  className="bg-transparent border-b border-white/30 rounded-none px-0 text-white placeholder:text-gray-300 focus:ring-0 focus:border-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="sr-only">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  required
                  placeholder={lang === 'mn' ? 'Утас' : 'Contact No'}
                  className="bg-transparent border-b border-white/30 rounded-none px-0 text-white placeholder:text-gray-300 focus:ring-0 focus:border-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="sr-only">
                  Subject
                </Label>
                <Input
                  id="subject"
                  required
                  placeholder={lang === 'mn' ? 'Гарчиг' : 'Subject'}
                  className="bg-transparent border-b border-white/30 rounded-none px-0 text-white placeholder:text-gray-300 focus:ring-0 focus:border-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="sr-only">
                  Message
                </Label>
                <Textarea
                  id="message"
                  required
                  rows={4}
                  placeholder={lang === 'mn' ? 'Мессежээ бичнэ үү' : 'Type Your Message Here'}
                  className="bg-transparent border-b border-white/30 rounded-none px-0 text-white placeholder:text-gray-300 focus:ring-0 focus:border-cyan-400 resize-none"
                />
              </div>

              <Button
                type="submit"
                className={cn(
                  'rounded-full font-semibold bg-[#e63946]  hover:hover:bg-[#0888A3]',
                  device === 'desktop' ? 'w-full py-6' : 'w-full py-5'
                )}
              >
                {lang === 'mn' ? 'ИЛГЭЭХ' : 'SUBMIT INFORMATION'}
              </Button>
            </form>
          </div>

          {/* RIGHT: Contact Info */}
          <div className={cn(device === 'mobile' && 'text-center')}>
            <h3 className="text-xl text-white font-bold">
              {data?.location?.[lang] || 'Our Location'}
            </h3>
            <p className="text-white mt-3">
              {data?.description?.[lang] ||
                'Feel free to reach us through any of the channels below.'}
            </p>

            <div
              className={cn(
                'mt-6 space-y-4 text-white',
                device === 'desktop' ? '' : 'max-w-lg mx-auto'
              )}
            >
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 shrink-0" />
                <p>{data?.address?.[lang] || '—'}</p>
              </div>
              <div className="flex items-start gap-3">
                <FaPhone className="mt-1  shrink-0" />
                <p>{data?.phone || '—'}</p>
              </div>
              <div className="flex items-start gap-3">
                <FaPaperPlane className="mt-1 shrink-0" />
                <p>{data?.email || '—'}</p>
              </div>
            </div>

            <div
              className={cn(
                'flex gap-4 text-xl mt-6 text-white',
                device === 'mobile' && 'justify-center'
              )}
            >
              <a
                href={data?.facebookUrl || '#'}
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebook className="hover:text-[#0888A3] cursor-pointer" />
              </a>
              <a
                href={data?.linkedinUrl || '#'}
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedin className="hover:text-[#0888A3] cursor-pointer" />
              </a>
              <a
                href={data?.instagramUrl || '#'}
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram className="hover:text-[#0888A3] cursor-pointer" />
              </a>
              <a
                href={data?.pinterestUrl || '#'}
                aria-label="Pinterest"
                target="_blank"
                rel="noreferrer"
              >
                <FaPinterest className="hover:text-[#0888A3] cursor-pointer" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
