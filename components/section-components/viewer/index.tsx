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

import { Blog } from '@/lib/types/blog.types';
import Header from '@/components/header';
import { useSidebar } from '@/components/ui/sidebar';

type DeviceType = 'desktop' | 'mobile';

const SectionViewer = ({ section, blogList }: { section: SectionData; blogList: Blog[] }) => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop');
  const [viewerWidth, setViewerWidth] = useState<number>(0);
  const [userLocked, setUserLocked] = useState(false); // 👈 хэрэглэгчийн сонголтыг түгжих эсэх
  const viewerRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<string>('en');
  const { setOpen } = useSidebar();

  useEffect(() => {
    const viewerElement = viewerRef.current;
    if (!viewerElement) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setViewerWidth(width);

        if (!userLocked) {
          setSelectedDevice(width < 768 ? 'mobile' : 'desktop');
        }
      }
    });

    resizeObserver.observe(viewerElement);

    // initial
    const initialWidth = viewerElement.offsetWidth;
    setViewerWidth(initialWidth);
    if (!userLocked) {
      setSelectedDevice(initialWidth < 768 ? 'mobile' : 'desktop');
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [userLocked]);

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

      default:
        return null;
    }
  };

  // 👇 Сонгосон төхөөрөмжид тохирсон preview frame
  const getPreviewStyles = () => {
    if (viewerWidth === 0) return { width: '100%' };

    const isMobile = selectedDevice === 'mobile';
    if (isMobile) {
      const frameWidth = 375;
      return {
        width: '100%',
        maxWidth: `${frameWidth}px`,
        minWidth: `${frameWidth}px`,
        margin: '0 auto',
        padding: '1rem',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
      } as React.CSSProperties;
    }
    return {
      width: '100%',
      maxWidth: `${viewerWidth}px`,
      margin: '0 auto',
      transition: 'all 0.3s ease',
    } as React.CSSProperties;
  };

  const handleDeviceToggle = (device: DeviceType) => {
    if (device === 'desktop') {
      setOpen(false);
    }

    setUserLocked(true);

    setSelectedDevice(device);
  };

  const handleAuto = () => {
    setUserLocked(false);
  };

  return (
    <div id="viewer" ref={viewerRef} className="flex-1 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        {/* device selector */}
        <div className="flex gap-x-2">
          <Button
            variant={selectedDevice === 'desktop' ? 'default' : 'outline'}
            size="icon"
            onClick={() => handleDeviceToggle('desktop')}
            aria-label="Desktop preview"
            title="Desktop preview"
          >
            <Monitor />
          </Button>
          <Button
            variant={selectedDevice === 'mobile' ? 'default' : 'outline'}
            size="icon"
            onClick={() => handleDeviceToggle('mobile')}
            aria-label="Mobile preview"
            title="Mobile preview"
          >
            <Phone />
          </Button>
          {/* Сонголтыг автоматаар болгох товч (сонголттой) */}
        </div>

        {/* language selector */}
        <div className="flex gap-x-2">
          <Button
            variant={lang === 'en' ? 'default' : 'outline'}
            type="button"
            size="icon"
            className="cursor-pointer"
            onClick={() => setLang('en')}
          >
            EN
          </Button>
          <Button
            variant={lang === 'mn' ? 'default' : 'outline'}
            type="button"
            size="icon"
            className="cursor-pointer"
            onClick={() => setLang('mn')}
          >
            MN
          </Button>
        </div>
      </div>

      <div className="w-full">
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
