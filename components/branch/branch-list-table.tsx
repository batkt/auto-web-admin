'use client';

import { Branch } from '@/lib/types/branch.types';
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MapPin, Phone, Mail, FileText, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { BranchCreateDialog } from './branch-create-dialog';
import { BranchEditDialog } from './branch-edit-dialog';
import { deleteBranch } from '@/lib/actions/branch';
import { useAuth } from '@/contexts/auth-context';

interface BranchListTableProps {
  data: Branch[];
}

const BranchListTable = ({ data }: BranchListTableProps) => {
  const [branches, setBranches] = useState<Branch[]>(data);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const isAdmin = ['super-admin', 'admin'].includes(currentUser?.role);

  const handleBranchUpdated = (updatedBranch: Branch) => {
    setBranches(prev =>
      prev.map(branch => (branch._id === updatedBranch._id ? updatedBranch : branch))
    );
  };

  const handleBranchCreated = (newBranch: Branch) => {
    setBranches(prev => [newBranch, ...prev]);
  };

  const handleDeleteBranch = async (id: string) => {
    if (!confirm('Энэ салбарыг устгахдаа итгэлтэй байна уу?')) {
      return;
    }

    try {
      const response = await deleteBranch(id);
      if (response.code === 200) {
        setBranches(prev => prev.filter(branch => branch._id !== id));
        toast.success('Салбар амжилттай устгагдлаа');
      } else {
        throw new Error(response.message || 'Устгахад алдаа гарлаа');
      }
    } catch (error) {
      console.error('Error deleting branch:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Алдаа гарлаа. Дахин оролдоно уу.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Салбарууд ({branches.length})</h3>
        {isAdmin && <BranchCreateDialog onBranchCreated={handleBranchCreated} />}
      </div>
      {branches?.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="size-10" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Хуудас байхгүй байна</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Одоогоор үүсгэгдсэн хуудас байхгүй байна.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Салбарын нэр</TableHead>
              <TableHead className="font-semibold">Хаяг</TableHead>
              <TableHead className="font-semibold">Холбоо барих</TableHead>
              <TableHead className="font-semibold">Үйлчилгээ</TableHead>
              <TableHead className="font-semibold text-right">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map(branch => (
              <TableRow key={branch._id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div>
                    <div className="text-sm font-medium">{branch.name}</div>
                    {branch.pastor && (
                      <div className="text-xs text-muted-foreground">Захирал: {branch.pastor}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {branch.fullAddress}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {branch.phone}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3" />
                      {branch.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {branch.services.slice(0, 2).map((service, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {branch.services.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{branch.services.length - 2} илүү
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {isAdmin ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingBranchId(branch._id)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Засах
                      </Button>
                      {editingBranchId === branch._id && (
                        <BranchEditDialog
                          open={editingBranchId === branch._id}
                          setOpen={open => !open && setEditingBranchId(null)}
                          branch={branch}
                          onBranchUpdated={handleBranchUpdated}
                        />
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBranch(branch._id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingBranchId(branch._id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Харах
                      </Button>
                      {editingBranchId === branch._id && (
                        <BranchEditDialog
                          open={editingBranchId === branch._id}
                          onlyRead={true}
                          setOpen={open => !open && setEditingBranchId(null)}
                          branch={branch}
                          onBranchUpdated={handleBranchUpdated}
                        />
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default BranchListTable;
