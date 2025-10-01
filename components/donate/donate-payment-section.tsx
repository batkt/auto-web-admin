'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaHeart, FaHouseMedical, FaShieldVirus } from 'react-icons/fa6';
import Image from 'next/image';

const DonatePaymentSection = ({ data, lang }: { data: any; lang: string }) => {
  const donateTranslation = (key: string) => {
    const translation = {
      en: {
        bank: 'Bank',
        accountName: 'Account Name',
        iban: 'IBAN',
        accountNumber: 'Account Number',
        copy: 'Copy',
      },
      mn: {
        bank: 'Банк',
        accountName: 'Дансны нэр',
        iban: 'IBAN',
        accountNumber: 'Дансны дугаар',
        copy: 'Хуулах',
      },
    };
    return translation?.[lang]?.[key as keyof typeof translation] || key;
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert('Дансны дугаар хуулагдлаа!');
      })
      .catch(() => {
        alert('Хуулах үед алдаа гарлаа');
      });
  };

  return (
    <section className="py-20">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Hero Line */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{data.title[lang]}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {data.description[lang]}
          </p>
        </div>

        {/* Donation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Bank Transfer */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FaHouseMedical className="size-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{data.bankAccount.title[lang]}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {donateTranslation('bank')}:
                  </p>
                  <p className="font-semibold">{data.bankAccount.accounts?.[0]?.bankName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {donateTranslation('accountName')}:
                  </p>
                  <p className="font-semibold">{data.bankAccount.accounts?.[0]?.accountName}</p>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {donateTranslation('iban')}:
                    </p>
                    <p className="font-semibold">{data.bankAccount.accounts?.[0]?.iban}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => copyToClipboard(data.bankAccount.accounts[0].iban)}
                  >
                    {donateTranslation('copy')}
                  </Button>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {donateTranslation('accountNumber')}:
                    </p>
                    <p className="font-semibold">{data.bankAccount.accounts?.[0]?.accountNumber}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => copyToClipboard(data.bankAccount.accounts?.[0]?.accountNumber)}
                  >
                    {donateTranslation('copy')}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {data.bankAccount.accounts?.[0]?.transferDescription[lang]}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Payment */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <FaShieldVirus className="size-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg">{data.qpay.title[lang]}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Утасны камераар QR код-ыг уншуулж, дүн оруулна уу.
                </p>
                <div className="bg-white p-2 rounded-lg border mx-auto aspect-square">
                  <Image
                    src={data.qpay.qrCode}
                    alt="QR Code"
                    width={400}
                    height={400}
                    className="w-full object-contain aspect-square"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* On-site Donation */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <FaHeart className="size-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">{data.giveInPerson.title[lang]}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* <div className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaHandsPraying className="size-8 text-muted-foreground" />
                  </div>
                </div> */}
                <p className="text-sm text-muted-foreground">
                  {data.giveInPerson.description[lang]}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DonatePaymentSection;
