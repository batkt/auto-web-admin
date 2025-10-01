"use client"

import dynamic from 'next/dynamic';
import React from 'react'
const MapComponent = dynamic(() => import('@/components/map'), {
    ssr: false,
});

const LocationSection = ({ data, lang, device }: { data: any, lang: string, device: 'desktop' | 'mobile' }) => {
    const position: [number, number] = [47.907195, 106.929912];

    return (
        <section className="pt-20 bg-background">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-foreground mb-4">
                    {data.title?.[lang]}
                </h2>
                <p className="text-xl text-muted-foreground">
                    {data.description?.[lang]}
                </p>
            </div>

            <div className="bg-muted rounded-2xl h-96 flex items-center justify-center border border-border">
                <MapComponent position={[data.latitude, data.longitude]} />
            </div>
        </section>
    )
}

export default LocationSection