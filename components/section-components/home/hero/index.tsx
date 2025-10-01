"use client"
import React from 'react'
import StatsSection from './stats-section'
import HeroSection from './hero-section'
import MultiImagesBackgroundSection from './multi-images-backround-section'

const Hero = ({ data, device, lang }: { data: any, device: 'desktop' | 'mobile', lang: string }) => {
    return (
        <div className="w-full relative">
            <MultiImagesBackgroundSection images={data.backgroundImages}>
                <HeroSection device={device} data={data} lang={lang} />
            </MultiImagesBackgroundSection>
            <StatsSection device={device} data={data} lang={lang} />
        </div>
    )
}

export default Hero