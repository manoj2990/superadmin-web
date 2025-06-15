import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AdminResponse, AdminResourceLimits } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, User, Settings, BarChart3 } from 'lucide-react';

const editAdminSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  accountType: z.enum(['Standard', 'Premium']),
  accountStatus: z.enum(['active', 'inactive']),
  resourceLimits: z.object({
    maxOrganizations: z.number().min(1).max(100),
    maxCourses: z.number().min(1).max(1000),
    maxDepartments: z.number().min(1).max(500),
    maxTotalEmployees: z.number().min(1).max(10000),
    perOrgEmployeeLimit: z.number().min(1).max(1000),
    perCourseEmployeeLimit: z.number().min(1).max(500),
    defaultCourseEmployeeLimit: z.number().min(1).max(100)
  })
});

type EditAdminFormData = z.infer<typeof editAdminSchema>;

interface AdminEditDialogProps {
  admin: AdminResponse | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSave: (adminId: string, data: Partial<AdminResponse>) => Promise<void>;
}

const AdminEditDialog: React.FC<AdminEditDialogProps> = ({
  admin,
  isOpen,
  isLoading,
  onClose,
  onSave
}) => {
  const form = useForm<EditAdminFormData>({
    resolver: zodResolver(editAdminSchema),
    defaultValues: admin ? {
      fullName: admin.fullName,
      accountType: admin.accountType,
      accountStatus: admin.accountStatus,
      resourceLimits: admin.resourceLimits
    } : undefined
  });

  React.useEffect(() => {
    if (admin) {
      form.reset({
        fullName: admin.fullName,
        accountType: admin.accountType,
        accountStatus: admin.accountStatus,
        resourceLimits: admin.resourceLimits
      });
    }
  }, [admin, form]);

  const onSubmit = async (data: EditAdminFormData) => {
    if (!admin) return;
    
    try {
      await onSave(admin._id, data);
      onClose();
    } catch (error) {
      console.error('Failed to update admin:', error);
    }
  };

  const getResourceUtilization = (usage: number, limit: number) => {
    return limit > 0 ? (usage / limit) * 100 : 0;
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (!admin) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Edit Admin: {admin.fullName}
          </DialogTitle>
          <DialogDescription>
            Update admin information and resource limits
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="limits" className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Resource Limits
              </TabsTrigger>
              <TabsTrigger value="usage" className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Current Usage
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                  <CardDescription>
                    Update the admin's basic account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        {...form.register('fullName')}
                      />
                      {form.formState.errors.fullName && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {form.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input value={admin.email} disabled className="bg-gray-50" />
                      <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountType">Account Type</Label>
                      <Select 
                        value={form.watch('accountType')} 
                        onValueChange={(value) => form.setValue('accountType', value as 'Standard' | 'Premium')}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Standard">
                            <div className="flex items-center">
                              <Badge variant="secondary" className="mr-2">Standard</Badge>
                              Basic features
                            </div>
                          </SelectItem>
                          <SelectItem value="Premium">
                            <div className="flex items-center">
                              <Badge variant="default" className="mr-2">Premium</Badge>
                              Enhanced features
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountStatus">Account Status</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={form.watch('accountStatus') === 'active'}
                          onCheckedChange={(checked) => 
                            form.setValue('accountStatus', checked ? 'active' : 'inactive')
                          }
                        />
                        <Label>
                          {form.watch('accountStatus') === 'active' ? 'Active' : 'Inactive'}
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="limits" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resource Limits</CardTitle>
                  <CardDescription>
                    Configure maximum resource allocations for this admin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { key: 'maxOrganizations', label: 'Maximum Organizations', description: 'Total organizations this admin can create' },
                      { key: 'maxCourses', label: 'Maximum Courses', description: 'Total courses across all organizations' },
                      { key: 'maxDepartments', label: 'Maximum Departments', description: 'Total departments across all organizations' },
                      { key: 'maxTotalEmployees', label: 'Maximum Total Employees', description: 'Total employees across all organizations' },
                      { key: 'perOrgEmployeeLimit', label: 'Per-Organization Employee Limit', description: 'Maximum employees per organization' },
                      { key: 'perCourseEmployeeLimit', label: 'Per-Course Employee Limit', description: 'Maximum employees per course' },
                      { key: 'defaultCourseEmployeeLimit', label: 'Default Course Employee Limit', description: 'Default limit for new courses' }
                    ].map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key}>{field.label}</Label>
                        <Input
                          id={field.key}
                          type="number"
                          min="1"
                          {...form.register(`resourceLimits.${field.key as keyof AdminResourceLimits}`, { valueAsNumber: true })}
                        />
                        <p className="text-xs text-gray-500">{field.description}</p>
                        {form.formState.errors.resourceLimits?.[field.key as keyof AdminResourceLimits] && (
                          <p className="text-sm text-red-500 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {form.formState.errors.resourceLimits[field.key as keyof AdminResourceLimits]?.message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Resource Usage</CardTitle>
                  <CardDescription>
                    View how this admin is currently utilizing their allocated resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Organizations</Label>
                        <span className={`text-sm font-medium ${getUtilizationColor(getResourceUtilization(admin.resourceUsage.organizations, admin.resourceLimits.maxOrganizations))}`}>
                          {getResourceUtilization(admin.resourceUsage.organizations, admin.resourceLimits.maxOrganizations).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {admin.resourceUsage.organizations} / {admin.resourceLimits.maxOrganizations}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(getResourceUtilization(admin.resourceUsage.organizations, admin.resourceLimits.maxOrganizations), 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Courses</Label>
                        <span className={`text-sm font-medium ${getUtilizationColor(getResourceUtilization(admin.resourceUsage.courses, admin.resourceLimits.maxCourses))}`}>
                          {getResourceUtilization(admin.resourceUsage.courses, admin.resourceLimits.maxCourses).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {admin.resourceUsage.courses} / {admin.resourceLimits.maxCourses}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(getResourceUtilization(admin.resourceUsage.courses, admin.resourceLimits.maxCourses), 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Departments</Label>
                        <span className={`text-sm font-medium ${getUtilizationColor(getResourceUtilization(admin.resourceUsage.departments, admin.resourceLimits.maxDepartments))}`}>
                          {getResourceUtilization(admin.resourceUsage.departments, admin.resourceLimits.maxDepartments).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {admin.resourceUsage.departments} / {admin.resourceLimits.maxDepartments}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(getResourceUtilization(admin.resourceUsage.departments, admin.resourceLimits.maxDepartments), 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Total Employees</Label>
                        <span className={`text-sm font-medium ${getUtilizationColor(getResourceUtilization(admin.resourceUsage.totalEmployees, admin.resourceLimits.maxTotalEmployees))}`}>
                          {getResourceUtilization(admin.resourceUsage.totalEmployees, admin.resourceLimits.maxTotalEmployees).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {admin.resourceUsage.totalEmployees} / {admin.resourceLimits.maxTotalEmployees}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(getResourceUtilization(admin.resourceUsage.totalEmployees, admin.resourceLimits.maxTotalEmployees), 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Account Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Created:</span>
                        <p className="font-medium">{new Date(admin.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-blue-700">Last Login:</span>
                        <p className="font-medium">
                          {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminEditDialog;