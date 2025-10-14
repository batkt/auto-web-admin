// components/FeaturesSection.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { BiSolidPhoneCall } from 'react-icons/bi';
import { FaLocationDot, FaXTwitter } from 'react-icons/fa6';
import {
  FaTelegramPlane,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaPinterestP,
  FaGooglePlusG,
} from 'react-icons/fa';
import { getClientImageUrl, getImageUrl } from '@/utils';
import { saveMessage, ContactFormData } from '@/lib/actions/message';

const underlineBase =
  'w-full bg-transparent border-0 border-b border-white/25 rounded-none px-0 text-white placeholder:text-gray-400 focus:ring-0 focus:border-white/60 focus:border-b-2';

const FeaturesSection = ({
  device,
  data,
  lang,
}: {
  device: 'desktop' | 'mobile';
  data: any;
  lang: string;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>();

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full"
      style={{
        backgroundImage: `url(${getClientImageUrl(data?.backgroundImage)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={cn('mx-auto max-w-7xl px-6 pt-20 md:px-10')}>
        <div className="mb-4">
          <p
            className={cn(
              'text-white font-extrabold font-title',
              device === 'desktop' ? 'text-5xl text-left' : 'text-3xl text-center'
            )}
          >
            {data?.title?.[lang] || 'Get in touch'}
          </p>
          <p
            className={cn(
              'text-[#0888A3] font-extrabold mt-2 font-title',
              device === 'desktop' ? 'text-5xl text-left mb-20' : 'text-3xl text-center mb-20'
            )}
          >
            {data?.secondaryTitle?.[lang]}
          </p>
        </div>

        <div
          className={cn(
            'grid gap-20 pb-24',
            device === 'desktop' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
          )}
        >
          {/* LEFT: Contact Form */}
          <div className={cn(device === 'desktop' ? 'max-w-[460px]' : 'max-w-[460px] mx-auto')}>
            <form className="space-y-8">
              {/* Name */}
              <div className="space-y-3">
                <Input
                  id="firstName"
                  placeholder={lang === 'mn' ? 'Нэр' : 'Name'}
                  className={underlineBase}
                  {...register('firstName', { required: 'Name is required' })}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              {/* Contact No */}
              <div className="space-y-3">
                <Input
                  id="phone"
                  type="tel"
                  placeholder={lang === 'mn' ? 'Утас' : 'Contact No'}
                  className={underlineBase}
                  {...register('phone', {
                    required: 'Phone number is required',
                  })}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-3">
                <Input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  className={underlineBase}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              {/* Message */}
              <div className="space-y-3">
                <Textarea
                  id="message"
                  rows={3}
                  placeholder={lang === 'mn' ? 'Мессежээ бичнэ үү' : 'Type Your Message Here'}
                  className={`${underlineBase} resize-none`}
                  {...register('message', {
                    required: 'Message is required',
                    minLength: { value: 10, message: 'Message must be at least 10 characters' },
                  })}
                />
                {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={true}
                className="mt-5 w-full inline-flex items-center justify-center rounded-full bg-red-700 text-white font-semibold shadow-lg transition-colors duration-300 ease-in-out hover:bg-[#0888A3] px-8 py-4 text-base"
              >
                {isSubmitting
                  ? lang === 'mn'
                    ? 'Илгээж байна...'
                    : 'Sending...'
                  : lang === 'mn'
                  ? 'ИЛГЭЭХ'
                  : 'SUBMIT INFORMATION'}
              </button>
            </form>
          </div>

          {/* RIGHT: Contact Info */}
          <div
            className={cn(
              'text-white',
              device === 'desktop' ? 'max-w-[560px]' : 'max-w-[560px] mx-auto text-center'
            )}
          >
            <h3
              className={cn(
                'text-3xl mb-12 font-title',
                device === 'desktop' ? 'text-left' : 'text-center'
              )}
            >
              {data?.location?.[lang] || 'Our Location'}
            </h3>
            <p
              className={cn(
                'text-white/50 mb-12 font-description',
                device === 'desktop' ? 'text-left' : 'text-center'
              )}
            >
              {data?.description?.[lang] ||
                'Feel free to reach us through any of the channels below.'}
            </p>

            <ul className="space-y-8 mb-12">
              <li
                className={cn(
                  'flex gap-4',
                  device === 'desktop' ? 'flex-row items-start' : 'flex-col items-center'
                )}
              >
                <FaLocationDot className="text-white text-4xl md:text-3xl" />
                <div className={cn(device === 'desktop' ? 'text-left' : 'text-center')}>
                  <p>{data?.address?.[lang] || '—'}</p>
                </div>
              </li>
              <li
                className={cn(
                  'flex gap-4',
                  device === 'desktop' ? 'flex-row items-start' : 'flex-col items-center'
                )}
              >
                <BiSolidPhoneCall className="text-white text-4xl md:text-3xl" />
                <div
                  className={cn(
                    'flex gap-4 md:gap-8',
                    device === 'desktop' ? 'flex-row text-left' : 'flex-col text-center'
                  )}
                >
                  {data?.phone || '—'}
                </div>
              </li>
              <li
                className={cn(
                  'flex gap-4',
                  device === 'desktop' ? 'flex-row items-start' : 'flex-col items-center'
                )}
              >
                <FaTelegramPlane className="text-white text-4xl md:text-3xl" />
                <span className={cn(device === 'desktop' ? 'text-left' : 'text-center')}>
                  {data?.email || '—'}
                </span>
              </li>
            </ul>

            <div
              className={cn(
                'flex items-center gap-5 text-white/80 text-lg',
                device === 'desktop' ? 'justify-start' : 'justify-center'
              )}
            >
              <a
                href={data?.facebookUrl || '#'}
                className="hover:text-[#0888A3]"
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href={data?.twitterUrl || '#'}
                className="hover:text-[#0888A3]"
                aria-label="X"
                target="_blank"
                rel="noreferrer"
              >
                <FaXTwitter />
              </a>
              <a
                href={data?.linkedinUrl || '#'}
                className="hover:text-[#0888A3]"
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedinIn />
              </a>
              <a
                href={data?.instagramUrl || '#'}
                className="hover:text-[#0888A3]"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href={data?.pinterestUrl || '#'}
                className="hover:text-[#0888A3]"
                aria-label="Pinterest"
                target="_blank"
                rel="noreferrer"
              >
                <FaPinterestP />
              </a>
              <a
                href={data?.googlePlusUrl || '#'}
                className="hover:text-[#0888A3]"
                aria-label="Google Plus"
                target="_blank"
                rel="noreferrer"
              >
                <FaGooglePlusG />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
