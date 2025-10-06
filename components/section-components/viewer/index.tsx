'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Hero from '../home/hero-section';
import { SectionData } from '@/lib/types/section.types';
import AboutSection from '../home/about-section';
import HelpSection from '../home/features-section';
import Ticker from '../home/ticker';
import QuoteSection from '../home/product-section';
import BlogSection from '../home/blog-section';
import HeroSection from '@/components/about/cover-section';
import SectionOne from '@/components/about/section-one';
import SectionTwo from '@/components/about/section-two';
import SectionThree from '@/components/about/section-three';
import SectionFour from '@/components/about/section-four';
import Timeline from '@/components/about/timeline';
import SectionSix from '@/components/about/section-six';
import Community from '@/components/about/community-section';
import LocationSection from '@/components/about/location-section';
import BranchHeroSection from '@/components/branch/branch-hero-section';
import { LanguageKey } from '@/lib/types/branch.types';
import BranchCampus from '@/components/branch/branch-campus';
import BlogHeroSection from '@/components/blog/blog-hero-section';
import ContactHeroSection from '@/components/contact/contact-hero-section';
import { Blog } from '@/lib/types/blog.types';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ContactInfoSection from '@/components/contact/contact-info-section';
import DonateHeroSection from '@/components/donate/donate-hero-section';
import DonateImpactSection from '@/components/donate/donate-impact-section';
import DonatePaymentSection from '@/components/donate/donate-payment-section';
import DonateThankYouSection from '@/components/donate/donate-thank-you-section';
import DonateTransparency from '@/components/donate/donate-transparency';
import { Product } from '@/lib/types/product.types';

type DeviceType = 'desktop' | 'mobile';

const SectionViewer = ({ section, blogList }: { section: SectionData; blogList: Blog[] }) => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop');
  const [viewerWidth, setViewerWidth] = useState<number>(0);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<string>('en');

  useEffect(() => {
    const viewerElement = viewerRef.current;
    if (!viewerElement) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setViewerWidth(width);
        if (width < 768) {
          setSelectedDevice('mobile');
        } else {
          setSelectedDevice('desktop');
        }
      }
    });

    resizeObserver.observe(viewerElement);

    // Set initial width and device mode
    const initialWidth = viewerElement.offsetWidth;
    setViewerWidth(initialWidth);
    setSelectedDevice(initialWidth < 768 ? 'mobile' : 'desktop');

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const renderSection = (_selectedDevice: DeviceType) => {
    switch (section.key) {
      case 'header':
        return <Header lang={lang} device={_selectedDevice} data={section.data} />;

      case 'home-hero':
        return <Hero lang={lang} device={_selectedDevice} data={section.data} />;

      case 'home-stats':
        return <AboutSection lang={lang} device={_selectedDevice} data={section.data} />;

      case 'home-contact':
        return <HelpSection lang={lang} device={_selectedDevice} data={section.data} />;

      case 'home-quotes':
        return <Ticker lang={lang} device={_selectedDevice} data={section.data} />;

      case 'home-products':
        return <QuoteSection lang={lang} device={_selectedDevice} data={section.data} />;

      case 'home-blog':
        return (
          <BlogSection
            lang={lang}
            device={_selectedDevice}
            data={section.data}
            blogList={blogList}
          />
        );

      case 'about-hero':
        return <HeroSection lang={lang} device={_selectedDevice} data={section.data} />;

      case 'about-welcome':
        return <SectionOne lang={lang} device={_selectedDevice} data={section.data} />;

      case 'about-mission':
        return <SectionTwo lang={lang} device={_selectedDevice} data={section.data} />;

      case 'about-church-structure':
        return <SectionThree lang={lang} device={_selectedDevice} data={section.data} />;

      case 'about-our-story':
        return (
          <>
            <SectionFour lang={lang} device={_selectedDevice} data={section.data} />
            <Timeline lang={lang} device={_selectedDevice} data={section.data} />
          </>
        );

      case 'about-what-we-believe':
        return <SectionSix lang={lang} device={_selectedDevice} data={section.data} />;

      case 'about-our-community':
        return <Community lang={lang} device={_selectedDevice} data={section.data} />;

      case 'about-map':
        return <LocationSection lang={lang} device={_selectedDevice} data={section.data} />;

      case 'branch-hero':
        return <BranchHeroSection lang={lang as LanguageKey} data={section.data as any} />;

      case 'branch-campus':
        return <BranchCampus lang={lang} data={section.data} />;

      case 'blog-hero':
        return <BlogHeroSection lang={lang} data={section.data} />;

      case 'contact-hero':
        return <ContactHeroSection lang={lang} data={section.data as any} />;

      case 'contact-info':
        return <ContactInfoSection lang={lang} data={section.data as any} />;

      case 'donate-hero':
        return <DonateHeroSection lang={lang} data={section.data as any} />;

      case 'donate-impact':
        return <DonateImpactSection lang={lang} data={section.data as any} />;

      case 'donate-payment':
        return <DonatePaymentSection lang={lang} data={section.data as any} />;

      case 'donate-thank-you':
        return <DonateThankYouSection lang={lang} data={section.data as any} />;

      case 'donate-transparency':
        return <DonateTransparency lang={lang} data={section.data as any} />;

      default:
        return null;
    }
  };

  const getPreviewStyles = () => {
    const isMobile = selectedDevice === 'mobile';
    const mobileWidth = Math.min(375, viewerWidth * 0.9); // Mobile width with max constraint
    if (viewerWidth === 0) {
      return {
        width: '100%',
      };
    }
    if (isMobile) {
      return {
        maxWidth: `${mobileWidth}px`,
        minWidth: `375px`,
        width: '100%',
        margin: '0 auto',
        padding: '1rem',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
      };
    } else {
      return {
        maxWidth: `${viewerWidth}px`,
        width: '100%',
        margin: '0 auto',
        transition: 'all 0.3s ease',
      };
    }
  };

  const handleDeviceToggle = (device: DeviceType) => {
    setSelectedDevice(device);
  };

  return (
    <div id="viewer" ref={viewerRef} className="flex-1 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        {/* device selector*/}
        <div className="flex gap-x-2">
          <Button
            variant={selectedDevice === 'desktop' ? 'default' : 'outline'}
            size="icon"
            onClick={() => handleDeviceToggle('desktop')}
            disabled={viewerWidth < 768}
          >
            <Monitor />
          </Button>
          <Button
            variant={selectedDevice === 'mobile' ? 'default' : 'outline'}
            size="icon"
            onClick={() => handleDeviceToggle('mobile')}
            disabled={viewerWidth > 768}
          >
            <Phone />
          </Button>
        </div>
        {/* language selector*/}
        <div className="flex gap-x-2">
          <Button
            variant={lang === 'en' ? 'default' : 'outline'}
            type="button"
            size="icon"
            className="cursor-pointer"
            onClick={() => {
              setLang('en');
            }}
          >
            EN
          </Button>
          <Button
            variant={lang === 'mn' ? 'default' : 'outline'}
            type="button"
            size="icon"
            className="cursor-pointer"
            onClick={() => {
              setLang('mn');
            }}
          >
            MN
          </Button>
        </div>
      </div>
      <div className="w-full">
        {/* Preview container with responsive sizing */}
        <div className="flex justify-center">
          <div style={getPreviewStyles()} className="w-full">
            {renderSection(selectedDevice)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionViewer;
