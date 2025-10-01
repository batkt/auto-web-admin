import React from 'react'

const SectionOne = ({ data, lang, device }: { data: any, lang: string, device: 'desktop' | 'mobile' }) => {
    return (
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
                {data.title?.[lang]}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
                {data.description?.[lang]}
            </p>
        </div>
    )
}

export default SectionOne