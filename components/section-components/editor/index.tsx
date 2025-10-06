import { SectionData } from '@/lib/types/section.types';
import React from 'react';
import HomeHeroEditor from './home-hero-editor';
import HomeMissionEditor from './home-mission-editor';
import EditorLayout from './editor-layout';
import HomeHelpEditor from './home-help-editor';
import HomeGalleryEditor from './home-gallery-editor';
import HomeQuoteEditor from './home-quote-editor';
import HomeBlogEditor from './home-blog-editor';
import AboutHeroEditor from './about-hero-editor';
import AboutWelcomeEditor from './about-welcome-editor';
import AboutMissionEditor from './about-mission-editor';
import AboutStructureEditor from './about-structure-editor';
import AboutStoryEditor from './about-story-editor';
import AboutWhatWeBelieveEditor from './about-what-we-believe-editor';
import AboutCommunityEditor from './about-community-editor';
import AboutMapEditor from './about-map-editor';
import BranchHeroEditor from './branch-hero-editor';
import BranchCampusEditor from './branch-campus-editor';
import BlogHeroEditor from './blog-hero-editor';
import ContactHeroEditor from './contact-hero-editor';
import HeaderEditor from './header-editor';
import FooterEditor from './footer-editor';
import ContactInfoEditor from './contact-info-editor';
import DonateHeroEditor from './donate-hero-editor';
import DonateImpactEditor from './donate-impact-editor';
import DonatePaymentEditor from './donate-payment-editor';
import DonateTransparencyEditor from './donate-transparency-editor';
import DonateThankYouEditor from './donate-thank-you-editor';

interface SectionEditorProps {
  section: SectionData;
  onDataChange: (updatedData: any) => void;
  preview?: React.ReactNode;
}

const SectionEditor = ({ section, onDataChange, preview }: SectionEditorProps) => {
  const renderSectionEditor = () => {
    switch (section.key) {
      case 'header':
        return (
          <HeaderEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );

      case 'home-hero':
        return (
          <HomeHeroEditor data={section.data} onDataChange={onDataChange} sectionId={section._id} />
        );

      case 'home-stats':
        return (
          <HomeMissionEditor
            data={section.data}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );

      case 'home-contact':
        return (
          <HomeHelpEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );
      // return <AboutSection lang={lang} device={_selectedDevice} data={section.data} />

      case 'home-quotes':
        return (
          <HomeGalleryEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );
      // return <Ticker lang={lang} data={section.data} />

      case 'home-products':
        return (
          <HomeQuoteEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );
      // return <QuoteSection lang={lang} data={section.data} />

      case 'home-blog':
        return (
          <HomeBlogEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );
      // return <BlogSection lang={lang} data={section.data} />

      case 'about-hero':
        return (
          <AboutHeroEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );
      // return <HeroSection lang={lang} device={_selectedDevice} data={section.data} />

      case 'footer':
        return (
          <FooterEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );

      case 'about-welcome':
        return (
          <AboutWelcomeEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );
      // return <SectionOne lang={lang} device={_selectedDevice} data={section.data} />

      case 'about-mission':
        return (
          <AboutMissionEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );
      // return <SectionTwo lang={lang} device={_selectedDevice} data={section.data} />

      case 'about-church-structure':
        return (
          <AboutStructureEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );
      // return <SectionThree lang={lang} device={_selectedDevice} data={section.data} />

      case 'about-our-story':
        return (
          <AboutStoryEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );
      // return <>
      //     <SectionFour lang={lang} device={_selectedDevice} data={section.data} />
      //     <Timeline lang={lang} device={_selectedDevice} data={section.data} />
      // </>

      case 'about-what-we-believe':
        return (
          <AboutWhatWeBelieveEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );
      // return <SectionSix lang={lang} device={_selectedDevice} data={section.data} />

      case 'about-our-community':
        return (
          <AboutCommunityEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );
      // return <Community lang={lang} device={_selectedDevice} data={section.data} />

      case 'about-map':
        return (
          <AboutMapEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );
      // return <LocationSection lang={lang} device={_selectedDevice} data={section.data} />

      case 'branch-hero':
        return (
          <BranchHeroEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );

      case 'branch-campus':
        return (
          <BranchCampusEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );

      case 'blog-hero':
        return (
          <BlogHeroEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );

      case 'contact-hero':
        return (
          <ContactHeroEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );

      case 'contact-info':
        return (
          <ContactInfoEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );

      case 'donate-hero':
        return (
          <DonateHeroEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );

      case 'donate-impact':
        return (
          <DonateImpactEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );

      case 'donate-payment':
        return (
          <DonatePaymentEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );

      case 'donate-transparency':
        return (
          <DonateTransparencyEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );

      case 'donate-thank-you':
        return (
          <DonateThankYouEditor
            data={section.data as any}
            onDataChange={onDataChange}
            sectionId={section._id}
          />
        );

      default:
        return null;
    }
  };

  return <EditorLayout preview={preview}>{renderSectionEditor()}</EditorLayout>;
};

export default SectionEditor;
