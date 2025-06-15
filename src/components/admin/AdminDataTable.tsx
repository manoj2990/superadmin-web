import React, { useState } from 'react';
import { AdminResponse, AdminFilters, PaginationState } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  Download,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

interface AdminDataTableProps {
  admins: AdminResponse[];
  filters: AdminFilters;
  pagination: PaginationState;
  selectedAdmins: string[];
  isLoading: boolean;
  onFiltersChange: (filters: Partial<AdminFilters>) => void;
  onPaginationChange: (pagination: Partial<PaginationState>) => void;
  onAdminSelect: (adminId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onEditAdmin: (admin: AdminResponse) => void;
  onDeleteAdmin: (adminId: string) => void;
  onBulkDelete: () => void;
  onRefresh: () => void;
}

const AdminDataTable: React.FC<AdminDataTableProps> = ({
  admins,
  filters,
  pagination,
  selectedAdmins,
  isLoading,
  onFiltersChange,
  onPaginationChange,
  onAdminSelect,
  onSelectAll,
  onClearSelection,
  onEditAdmin,
  onDeleteAdmin,
  onBulkDelete,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onFiltersChange({ search: value });
  };

  const handleSort = (field: keyof AdminFilters['sortBy']) => {
    const newOrder = filters.sortBy === field && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    onFiltersChange({ sortBy: field, sortOrder: newOrder });
  };

  const getResourceUtilization = (admin: AdminResponse) => {
    const orgUtilization = (admin.resourceUsage.organizations / admin.resourceLimits.maxOrganizations) * 100;
    const courseUtilization = (admin.resourceUsage.courses / admin.resourceLimits.maxCourses) * 100;
    const employeeUtilization = (admin.resourceUsage.totalEmployees / admin.resourceLimits.maxTotalEmployees) * 100;
    
    return Math.max(orgUtilization, courseUtilization, employeeUtilization);
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600 bg-red-50';
    if (utilization >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Account Type', 'Status', 'Organizations', 'Courses', 'Employees', 'Created'];
    const csvData = admins.map(admin => [
      admin.fullName,
      admin.email,
      admin.accountType,
      admin.accountStatus,
      `${admin.resourceUsage.organizations}/${admin.resourceLimits.maxOrganizations}`,
      `${admin.resourceUsage.courses}/${admin.resourceLimits.maxCourses}`,
      `${admin.resourceUsage.totalEmployees}/${admin.resourceLimits.maxTotalEmployees}`,
      format(new Date(admin.createdAt), 'yyyy-MM-dd')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admins-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Admin Management</CardTitle>
            <CardDescription>
              Manage administrator accounts and their resource allocations
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filters.accountType} onValueChange={(value) => onFiltersChange({ accountType: value as any })}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Account Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(value) => onFiltersChange({ status: value as any })}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={`${filters.limit}`} onValueChange={(value) => onPaginationChange({ limit: parseInt(value), page: 1 })}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedAdmins.length > 0 && (
          <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
            <span className="text-sm font-medium">
              {selectedAdmins.length} admin{selectedAdmins.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={onClearSelection}>
                Clear Selection
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Selected Admins</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedAdmins.length} admin{selectedAdmins.length > 1 ? 's' : ''}? 
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onBulkDelete} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedAdmins.length === admins.length && admins.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onSelectAll();
                      } else {
                        onClearSelection();
                      }
                    }}
                  />
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('fullName')} className="h-auto p-0 font-semibold">
                    Admin
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resource Usage</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('createdAt')} className="h-auto p-0 font-semibold">
                    Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('lastLogin')} className="h-auto p-0 font-semibold">
                    Last Login
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                      Loading admins...
                    </div>
                  </TableCell>
                </TableRow>
              ) : admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    No admins found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => {
                  const utilization = getResourceUtilization(admin);
                  return (
                    <TableRow key={admin._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedAdmins.includes(admin._id)}
                          onCheckedChange={() => onAdminSelect(admin._id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{admin.fullName}</div>
                          <div className="text-sm text-gray-500">{admin.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={admin.accountType === 'Premium' ? 'default' : 'secondary'}>
                          {admin.accountType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={admin.accountStatus === 'active' ? 'default' : 'secondary'}>
                          {admin.accountStatus === 'active' ? (
                            <><UserCheck className="w-3 h-3 mr-1" /> Active</>
                          ) : (
                            <><UserX className="w-3 h-3 mr-1" /> Inactive</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div>Orgs: {admin.resourceUsage.organizations}/{admin.resourceLimits.maxOrganizations}</div>
                          <div>Courses: {admin.resourceUsage.courses}/{admin.resourceLimits.maxCourses}</div>
                          <div>Employees: {admin.resourceUsage.totalEmployees}/{admin.resourceLimits.maxTotalEmployees}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUtilizationColor(utilization)}`}>
                          {utilization.toFixed(1)}%
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(admin.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-sm">
                        {admin.lastLogin ? format(new Date(admin.lastLogin), 'MMM dd, yyyy') : 'Never'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEditAdmin(admin)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDeleteAdmin(admin._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPaginationChange({ page: pagination.page - 1 })}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPaginationChange({ page: pagination.page + 1 })}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDataTable;