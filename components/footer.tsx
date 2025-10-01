'use client';

import { getImageUrl } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {
  FaInstagram,
  FaFacebookF,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaArrowRight,
  FaHeart,
  FaYoutube,
} from 'react-icons/fa6';

const Footer = ({
  data,
  lang,
  device,
  additionalData,
}: {
  data: any;
  lang: string;
  device: 'desktop' | 'mobile';
  additionalData: any;
}) => {
  const nowDate = new Date();
  const { header, contractForm } = additionalData;
  return (
    <footer className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="container px-6 max-w-7xl mx-auto pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Church Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                <Image
                  src={getImageUrl(header?.data?.logoImage)}
                  alt="logo"
                  width={100}
                  height={100}
                  className="h-10 w-auto"
                />
              </h3>
              <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6">{data?.description?.[lang]}</p>

            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">Follow Us</h4>
              <div className="flex items-center gap-4">
                {data?.socialMedia.map((item, index) => (
                  <a
                    key={`socialMediaIndex=${index}`}
                    target="_blank"
                    href={item.url}
                    className="p-3 rounded-full bg-primary/20 hover:bg-primary/30 text-primary transition-all duration-300 transform hover:scale-110 border border-primary/30"
                  >
                    {item.name === 'Facebook' && <FaFacebookF className="size-5" />}
                    {item.name === 'Instagram' && <FaInstagram className="size-5" />}
                    {item.name === 'Youtube' && <FaYoutube className="size-5" />}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2">Quick Links</h4>
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>
            <ul className="space-y-3">
              {header?.data?.menuList?.map((menu, index) => (
                <li key={`menuIndex=${index}`}>
                  <Link
                    href={menu.path}
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-300 group"
                  >
                    <FaArrowRight className="size-3 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {menu.name?.[lang]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2">Contact Info</h4>
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="p-2 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-all duration-300">
                  <FaLocationDot className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {contractForm.data.address?.[lang]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-all duration-300">
                  <FaPhone className="size-4 text-primary" />
                </div>
                <a
                  href="tel:+97677007700"
                  className="text-slate-300 hover:text-white transition-colors duration-300"
                >
                  {contractForm.data.phone}
                </a>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-all duration-300">
                  <FaEnvelope className="size-4 text-primary" />
                </div>
                <a
                  href="mailto:info@yourdomain.mn"
                  className="text-slate-300 hover:text-white transition-colors duration-300"
                >
                  {contractForm.data.email}
                </a>
              </div>
            </div>
          </div>

          {/* Service Hours */}
          <div>
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2">
                {contractForm.data?.services?.name?.[lang]}
              </h4>
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>
            <div className="space-y-3">
              {contractForm.data.services?.data?.map((service, index) => (
                <React.Fragment key={`serviceIndex=${index}`}>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-all duration-300">
                      <FaClock className="size-4 text-primary" />
                    </div>
                    <div className="text-slate-300 text-sm">
                      <p className="font-medium text-white">{service.name?.[lang]}</p>
                      <p>{service.description?.[lang]}</p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-700/50">
        <div className="container px-6 max-w-7xl mx-auto py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              © {nowDate.getFullYear()} Welcome Church. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>Made with</span>
              <FaHeart className="size-4 text-red-500 animate-pulse" />
              <span>for our community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
