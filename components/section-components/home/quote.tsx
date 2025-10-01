"use client";

import React from 'react'
import ParallaxSection from './parallax-section';
import QuoteSwiper from './quote-swiper';

const QuoteSection = ({ data, lang }: { data: any, lang: string }) => {

    return (
        <ParallaxSection imageUrl={data.backgroundImage}>
            <QuoteSwiper data={data} lang={lang} />
        </ParallaxSection>
    )
}

export default QuoteSection