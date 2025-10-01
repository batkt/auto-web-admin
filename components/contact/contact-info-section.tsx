'use client';

import React from 'react';
import { FaClock, FaEnvelope, FaLocationDot, FaPhone } from 'react-icons/fa6';

const ContactInfoSection = ({ data, lang }: { data: any; lang: string }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-6">{data?.title?.[lang]}</h2>
        <p className="text-lg text-muted-foreground mb-8">{data?.description?.[lang]}</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <FaLocationDot className="size-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Address</h3>
            <p className="text-muted-foreground">{data?.address?.[lang]}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-accent/10 rounded-full">
            <FaPhone className="size-6 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Phone</h3>
            <p className="text-muted-foreground">{data?.phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary/10 rounded-full">
            <FaEnvelope className="size-6 text-secondary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Email</h3>
            <p className="text-muted-foreground">{data?.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-muted rounded-full">
            <FaClock className="size-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">{data?.services?.name?.[lang]}</h3>
            {data?.services?.data?.map((service, index) => (
              <React.Fragment key={`serviceIndex=${index}`}>
                <p>{service?.name?.[lang]}</p>
                <p className="text-muted-foreground mb-2">{service?.description?.[lang]}</p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;
