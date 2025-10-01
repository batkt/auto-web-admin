"use client";
import { getImageUrl } from '@/utils';
import Image from 'next/image'
import React from 'react'

const SectionThree = ({ data, lang, device }: { data: any, lang: string, device: 'desktop' | 'mobile' }) => {
    return (
        <div className="mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-6 text-center">{data.title?.[lang]}</h3>
            <p className="text-lg text-muted-foreground text-center mb-8 max-w-3xl mx-auto">
                {data.description?.[lang]}
            </p>

            <Image
                src={getImageUrl(data.image)}
                alt="structure"
                height={500}
                width={1000}
                className='rounded-lg object-contain mt-8'
            />
        </div>
    )
}

export default SectionThree