"use client"
import React from 'react'
import ParallaxSection from './parallax-section'
import FeaturesSection from './features-section'

const HelpSection = ({ device, data, lang }: { device: 'desktop' | 'mobile', data: any, lang: string }) => {
    return (
        <ParallaxSection imageUrl={data.backgroundImage}>
            <FeaturesSection device={device} data={data} lang={lang} />
        </ParallaxSection>
    )
}

export default HelpSection