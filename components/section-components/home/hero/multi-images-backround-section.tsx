"use client";

import React from 'react'
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from 'next/image';
import { getImageUrl } from '@/utils';

export default function MultiImagesBackgroundSection({
    images,
    children,
}: {
    images: string[];
    children: React.ReactNode;
}) {
    const [index, setIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPrevIndex(index); // хуучин index-г хадгална
            setIndex((prev) => (prev + 1) % images.length);
        }, 7000);

        return () => clearInterval(interval);
    }, [index, images.length]);

    return (
        <div className="w-full relative flex items-center justify-center overflow-hidden">

            <Image
                key={`old_${index}`}
                src={getImageUrl(images[prevIndex])}
                alt={`old_background-image-${prevIndex}`}
                fill
                priority={index === 0}
                className="object-cover absolute inset-0 transition-opacity duration-500 scale-110"
            />

            {/* Шинэ зураг + motion scale */}
            <motion.div
                key={`current_${index}`}
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{ scale: { duration: 7, ease: "linear" } }}
                className="absolute inset-0"
            >
                <Image
                    src={getImageUrl(images[index])}
                    alt={`background-image-${index}`}
                    fill
                    priority={index === 0}
                    className="object-cover"
                />
            </motion.div>

            <div className="w-full relative z-[1] text-center">{children}</div>
        </div>
    );
}