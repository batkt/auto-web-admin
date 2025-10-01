'use client';

import { useState, useEffect, useRef } from 'react';

interface TimelineItem {
    year: string;
    title: {
        en: string;
        mn: string;
    };
    description: {
        en: string;
        mn: string;
    };
}

export default function Timeline({ data, lang, device }: { data: any, lang: string, device: 'desktop' | 'mobile' }) {
    const [visibleItems, setVisibleItems] = useState<number[]>([]);
    const [lineHeight, setLineHeight] = useState(0);
    const timelineRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const timeline: TimelineItem[] = data.items;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute('data-index') || '0');
                        setVisibleItems(prev => [...new Set([...prev, index])]);
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: '50px'
            }
        );

        itemRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // Animate timeline line based on visible items
        const timer = setTimeout(() => {
            if (visibleItems.length > 0) {
                const maxVisibleIndex = Math.max(...visibleItems);
                const progress = ((maxVisibleIndex + 1) / timeline.length) * 100;
                setLineHeight(Math.min(progress, 100));
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [visibleItems, timeline.length]);

    const getItemColor = (index: number, totalItems: number) => {
        // Last 3 items: primary colors
        if (index >= totalItems - 1) {
            return 'primary';
        }
        // 3 items before last 3: gradient colors
        else if (index >= totalItems - 3) {
            return 'gradient';
        }
        // All others: slate
        else {
            return 'slate';
        }
    };

    const getItemPosition = (index: number) => {
        return index % 2 === 0 ? 'left' : 'right';
    };

    const isLastItem = (index: number, totalItems: number) => {
        return index === totalItems - 1;
    };

    const getColorClasses = (color: string, isVisible: boolean) => {
        const baseClasses = "w-5 h-5 rounded-full border-4 border-background shadow-lg ring-2 transition-all duration-700";

        if (!isVisible) {
            return `${baseClasses} bg-gray-300 ring-gray-200 scale-0`;
        }

        switch (color) {
            case 'slate':
                return `${baseClasses} bg-gradient-to-br from-slate-500 to-slate-700 ring-slate-300 scale-100`;
            case 'primary':
                return `${baseClasses} bg-gradient-to-br from-primary/70 to-primary ring-primary/30 scale-100`;
            case 'gradient':
                return `${baseClasses} bg-gradient-to-br from-primary/70 to-primary ring-primary/50 scale-100`;
            default:
                return `${baseClasses} bg-slate-400 ring-slate-200 scale-100`;
        }
    };

    const getCardClasses = (color: string, isVisible: boolean, isPresent?: boolean) => {
        const baseClasses = "bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-700";

        if (!isVisible) {
            return `${baseClasses} border border-border opacity-0 transform translate-y-8`;
        }

        if (isPresent) {
            return `${baseClasses} bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/40 opacity-100 transform translate-y-0`;
        }

        switch (color) {
            case 'slate':
                return `${baseClasses} border border-slate-200/60 opacity-100 transform translate-y-0`;
            case 'primary':
                return `${baseClasses} border border-primary/20 opacity-100 transform translate-y-0`;
            case 'gradient':
                return `${baseClasses} bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/40 opacity-100 transform translate-y-0`;
            default:
                return `${baseClasses} border border-border opacity-100 transform translate-y-0`;
        }
    };

    const getTitleClasses = (color: string) => {
        switch (color) {
            case 'slate':
                return 'text-slate-700';
            case 'primary':
                return 'text-primary';
            case 'gradient':
                return 'text-primary/80';
            default:
                return 'text-slate-600';
        }
    };

    return (
        <div className="mb-16">
            {/* <h3 className="text-3xl font-bold text-foreground mb-10 text-center">Our Journey</h3> */}
            <div className="relative" ref={timelineRef}>
                {/* Animated Timeline line */}
                <div
                    className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-1 rounded-full shadow-sm z-0"
                    style={{
                        top: '2.5rem',
                        bottom: '2.5rem',
                        height: 'calc(100% - 5rem)'
                    }}
                >
                    <div
                        className="w-full bg-gradient-to-b from-gray-300 via-gray-400 to-primary transition-all duration-2000 ease-out rounded-full"
                        style={{
                            height: `${lineHeight}%`,
                            transformOrigin: 'top'
                        }}
                    />
                </div>

                {/* Timeline items */}
                <div className="space-y-12">
                    {timeline.map((item, index) => {
                        const isVisible = visibleItems.includes(index);
                        const color = getItemColor(index, timeline.length);
                        const position = getItemPosition(index);
                        const isPresent = isLastItem(index, timeline.length);
                        const isLeft = position === 'left';

                        return (
                            <div
                                key={`${item.year}-${index}`}
                                ref={(el) => {
                                    itemRefs.current[index] = el;
                                }}
                                data-index={index}
                                className="relative flex items-center"
                                style={{
                                    animationDelay: `${index * 200}ms`
                                }}
                            >
                                {/* Mobile Layout - All cards on right */}
                                <div className="block md:hidden w-full">
                                    <div className="flex items-center relative">
                                        {/* Timeline dot */}
                                        <div className={`absolute left-8 transform -translate-x-1/2 z-10 ${getColorClasses(color, isVisible)}`}></div>

                                        {/* Card content */}
                                        <div className="flex-1 ml-16">
                                            <div className={getCardClasses(color, isVisible, isPresent)}>
                                                <h4 className="text-xl font-bold text-foreground mb-2">{item.year}</h4>
                                                <h5 className={`text-lg font-semibold mb-2 ${getTitleClasses(color)}`}>
                                                    {item.title?.[lang as keyof typeof item.title]}
                                                </h5>
                                                <p className="text-muted-foreground">{item.description?.[lang as keyof typeof item.description]}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Layout - Alternating sides */}
                                <div className="hidden md:flex items-center w-full">
                                    {/* Left side content */}
                                    <div className={`flex-1 ${isLeft ? 'text-right pr-8' : 'pr-8'}`}>
                                        {isLeft && (
                                            <div className={getCardClasses(color, isVisible, isPresent)}>
                                                <h4 className="text-xl font-bold text-foreground mb-2">{item.year}</h4>
                                                <h5 className={`text-lg font-semibold mb-2 ${getTitleClasses(color)}`}>
                                                    {item.title?.[lang as keyof typeof item.title]}
                                                </h5>
                                                <p className="text-muted-foreground">{item.description?.[lang as keyof typeof item.description]}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Center dot */}
                                    <div className={`absolute left-1/2 transform -translate-x-1/2 ${getColorClasses(color, isVisible)}`}></div>

                                    {/* Right side content */}
                                    <div className={`flex-1 ${!isLeft ? 'pl-8' : 'pl-8'}`}>
                                        {!isLeft && (
                                            <div className={getCardClasses(color, isVisible, isPresent)}>
                                                <h4 className="text-xl font-bold text-foreground mb-2">{item.year}</h4>
                                                <h5 className={`text-lg font-semibold mb-2 ${getTitleClasses(color)}`}>
                                                    {item.title?.[lang as keyof typeof item.title]}
                                                </h5>
                                                <p className="text-muted-foreground">{item.description?.[lang as keyof typeof item.description]}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
} 