'use client';

import React from 'react';
import { motion, easeOut } from 'framer-motion';
import { FaHandHoldingHeart, FaHandshake, FaHeart } from 'react-icons/fa6';

const FeaturesSection = ({
  device,
  data,
  lang,
}: {
  device: 'desktop' | 'mobile';
  data: any;
  lang: string;
}) => {
  const features = [
    {
      key: 1,
      icon: FaHandHoldingHeart,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      key: 3,
      icon: FaHandshake,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      key: 6,
      icon: FaHeart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
  ].map((item, index) => {
    return {
      ...item,
      title: data.items[index].title,
      description: data.items[index].description,
    };
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  const headerVariants = {
    hidden: {
      opacity: 0,
      y: -30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: easeOut,
      },
    },
  };

  return (
    <section className="w-full py-20">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headerVariants}
        >
          <h2 className="text-3xl sm:text-4xl text-center font-medium mb-6 text-white">
            {data?.title?.[lang]}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {data?.subtitle?.[lang]}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map(item => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.key}
                variants={itemVariants}
                className="group relative p-8 bg-black/40 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Icon */}
                <motion.div
                  className={`inline-flex p-4 rounded-2xl ${item.bgColor} ${item.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.5 },
                  }}
                >
                  <IconComponent className="size-8" />
                </motion.div>

                {/* Content */}
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-primary transition-colors duration-300">
                    {item.title?.[lang]}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{item.description?.[lang]}</p>
                </div>

                {/* Hover Effect Overlay */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
