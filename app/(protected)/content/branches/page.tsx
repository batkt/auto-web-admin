import BranchListTable from '@/components/branch/branch-list-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getBranches } from '@/lib/services/branch.service';
import { FileText } from 'lucide-react';

export default async function BranchesPage() {
  const branchResponse = await getBranches();
  const branches = branchResponse.data || [];

  return (
    <div className="p-6">
      <div className="space-y-8">
        {/* Pages List */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="size-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-md flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Салбарын жагсаалт</CardTitle>
                <CardDescription>Салбаруудын мэдээллийг удирдах</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <BranchListTable data={branches} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
