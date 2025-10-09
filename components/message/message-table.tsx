'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Eye } from 'lucide-react';
import { Message } from '@/lib/types/message.types';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogTitle, DialogContent, DialogDescription, DialogHeader } from '../ui/dialog';
import { dateFormatter } from '@/utils';
import { seenMessage } from '@/lib/actions/message';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

const MessageTable = ({
  messageList,
  search,
}: {
  search?: string;
  messageList: {
    data: Message[];
    total: number;
    totalPages: number;
    currentPage: number;
  };
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const handleChangePage = (page: number) => {
    router.push(`/messages?page=${page}${search ? `&search=${search}` : ''}`);
  };

  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">№</TableHead>
            <TableHead className="font-semibold">Гарчиг</TableHead>
            <TableHead className="font-semibold">Нэр</TableHead>
            <TableHead className="font-semibold">И-мэйл</TableHead>
            <TableHead className="font-semibold">Утас</TableHead>
            <TableHead className="font-semibold">Үүсгэсэн огноо</TableHead>
            <TableHead className="font-semibold">Төлөв</TableHead>
            <TableHead className="font-semibold text-right">Үйлдэл</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messageList.data.map((message, index) => (
            <TableRow key={message._id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <div className="text-sm font-medium max-w-20 truncate">
                  {(messageList.currentPage - 1) * 10 + (index + 1)}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm font-medium truncate">{message.subject}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm font-medium truncate">
                  {message?.firstName}
                  {message?.lastName ? ` - ${message?.lastName}` : ''}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm font-medium max-w-40 truncate">{message.email}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm font-medium max-w-40 truncate">{message.phone}</div>
              </TableCell>

              <TableCell>
                <div className="text-sm font-medium max-w-40 truncate">
                  {dateFormatter(message.createdAt)}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={'outline'}
                  className={cn(message.status === 'seen' ? 'bg-green-500 text-white' : '')}
                >
                  {message.status === 'seen' ? 'Уншсан' : 'Уншаагүй'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      if (message.status === 'unseen') {
                        seenMessage(message._id);
                      }
                      setMessage(message);
                      setOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Харах
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end items-center gap-2 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">
            Нийт: <b>{messageList.total}</b>
          </span>
        </div>
        <Button
          variant="outline"
          size="icon"
          disabled={messageList.currentPage <= 1}
          onClick={() => handleChangePage(messageList.currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {messageList.currentPage} / {messageList.totalPages}
          </span>
        </div>

        <Button
          variant="outline"
          size="icon"
          disabled={messageList.currentPage >= messageList.totalPages}
          onClick={() => handleChangePage(messageList.currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Dialog
        open={open}
        onOpenChange={e => {
          setOpen(e);
          if (!e) {
            setMessage(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Мессеж</DialogTitle>
            <DialogDescription>{message?.subject}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="">{message?.message}</div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">Нэр</div>
              <div className="text-sm font-medium">
                {message?.firstName} {message?.lastName}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-sm text-muted-foreground">И-мэйл</div>
                <div className="text-sm font-medium">{message?.email}</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm text-muted-foreground">Утасны дугаар</div>
                <div className="text-sm font-medium">{message?.phone}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">Огноо</div>
              <div className="text-sm font-medium">
                {message?.createdAt ? dateFormatter(message.createdAt) : ''}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageTable;
