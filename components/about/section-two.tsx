import React from 'react'

const SectionTwo = ({ data, lang, device }: { data: any, lang: string, device: 'desktop' | 'mobile' }) => {
    return (
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 mb-16 border border-primary/20">
            <h3 className="text-3xl font-bold text-foreground mb-4 text-center">{data.title?.[lang]}</h3>
            <p className="text-xl text-center text-muted-foreground font-medium">
                {data.description?.[lang]}
            </p>
        </div>
    )
}

export default SectionTwo