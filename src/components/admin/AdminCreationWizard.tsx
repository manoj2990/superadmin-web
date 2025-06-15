import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, ArrowLeft, ArrowRight, User, Settings, FileCheck } from 'lucide-react';
import { AdminCreateRequest, AdminBasicInfo, AdminResourceLimits } from '@/types/admin';
import { useAdminManagement } from '@/hooks/useAdminManagement';

// Validation schemas
const basicInfoSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain uppercase, lowercase, number and special character'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  accountType: z.enum(['Standard', 'Premium'])
});

const resourceLimitsSchema = z.object({
  maxOrganizations: z.number().min(1, 'Must be at least 1').max(100, 'Cannot exceed 100'),
  maxCourses: z.number().min(1, 'Must be at least 1').max(1000, 'Cannot exceed 1000'),
  maxDepartments: z.number().min(1, 'Must be at least 1').max(500, 'Cannot exceed 500'),
  maxTotalEmployees: z.number().min(1, 'Must be at least 1').max(10000, 'Cannot exceed 10000'),
  perOrgEmployeeLimit: z.number().min(1, 'Must be at least 1').max(1000, 'Cannot exceed 1000'),
  perCourseEmployeeLimit: z.number().min(1, 'Must be at least 1').max(500, 'Cannot exceed 500'),
  defaultCourseEmployeeLimit: z.number().min(1, 'Must be at least 1').max(100, 'Cannot exceed 100')
});

const reviewSchema = z.object({
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms'),
  isActive: z.boolean()
});

interface AdminCreationWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AdminCreationWizard: React.FC<AdminCreationWizardProps> = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState<AdminBasicInfo | null>(null);
  const [resourceLimits, setResourceLimits] = useState<AdminResourceLimits | null>(null);
  
  const { createAdmin, isCreatingAdmin } = useAdminManagement();

  const steps = [
    { number: 1, title: 'Basic Information', icon: User },
    { number: 2, title: 'Resource Limits', icon: Settings },
    { number: 3, title: 'Review & Activate', icon: FileCheck }
  ];

  const getDefaultLimits = (accountType: 'Standard' | 'Premium'): AdminResourceLimits => {
    if (accountType === 'Premium') {
      return {
        maxOrganizations: 10,
        maxCourses: 100,
        maxDepartments: 50,
        maxTotalEmployees: 1000,
        perOrgEmployeeLimit: 200,
        perCourseEmployeeLimit: 50,
        defaultCourseEmployeeLimit: 25
      };
    }
    return {
      maxOrganizations: 3,
      maxCourses: 20,
      maxDepartments: 10,
      maxTotalEmployees: 100,
      perOrgEmployeeLimit: 50,
      perCourseEmployeeLimit: 20,
      defaultCourseEmployeeLimit: 10
    };
  };

  const handleStepComplete = (stepData: any) => {
    if (currentStep === 1) {
      setBasicInfo(stepData);
      setResourceLimits(getDefaultLimits(stepData.accountType));
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setResourceLimits(stepData);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      handleFinalSubmit(stepData);
    }
  };

  const handleFinalSubmit = async (reviewData: { termsAccepted: boolean; isActive: boolean }) => {
    if (!basicInfo || !resourceLimits) return;

    const adminData: AdminCreateRequest = {
      ...basicInfo,
      resourceLimits,
      isActive: reviewData.isActive,
      termsAccepted: reviewData.termsAccepted
    };

    try {
      await createAdmin(adminData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create admin:', error);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Create New Admin</CardTitle>
              <CardDescription>Set up a new administrator account with custom resource limits</CardDescription>
            </div>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-6">
            <Progress value={(currentStep / 3) * 100} className="mb-4" />
            <div className="flex justify-between">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isActive ? 'bg-blue-500 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {currentStep === 1 && (
            <BasicInfoStep onNext={handleStepComplete} initialData={basicInfo} />
          )}
          {currentStep === 2 && (
            <ResourceLimitsStep 
              onNext={handleStepComplete} 
              onBack={goBack}
              initialData={resourceLimits}
              accountType={basicInfo?.accountType || 'Standard'}
            />
          )}
          {currentStep === 3 && (
            <ReviewStep 
              onSubmit={handleStepComplete}
              onBack={goBack}
              basicInfo={basicInfo!}
              resourceLimits={resourceLimits!}
              isLoading={isCreatingAdmin}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Step 1: Basic Information
const BasicInfoStep: React.FC<{
  onNext: (data: AdminBasicInfo) => void;
  initialData: AdminBasicInfo | null;
}> = ({ onNext, initialData }) => {
  const form = useForm<AdminBasicInfo>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: initialData || {
      email: '',
      password: '',
      fullName: '',
      accountType: 'Standard'
    }
  });

  const onSubmit = (data: AdminBasicInfo) => {
    onNext(data);
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(form.watch('password') || '');

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            {...form.register('fullName')}
            placeholder="John Doe"
          />
          {form.formState.errors.fullName && (
            <p className="text-sm text-red-500 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {form.formState.errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            {...form.register('email')}
            placeholder="john@example.com"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            {...form.register('password')}
            placeholder="Enter secure password"
          />
          {form.watch('password') && (
            <div className="space-y-2">
              <Progress value={(passwordStrength / 5) * 100} className="h-2" />
              <p className="text-sm text-gray-600">
                Password strength: {
                  passwordStrength < 2 ? 'Weak' :
                  passwordStrength < 4 ? 'Medium' : 'Strong'
                }
              </p>
            </div>
          )}
          {form.formState.errors.password && (
            <p className="text-sm text-red-500 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountType">Account Type *</Label>
          <Select onValueChange={(value) => form.setValue('accountType', value as 'Standard' | 'Premium')}>
            <SelectTrigger>
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard">
                <div className="flex items-center">
                  <Badge variant="secondary" className="mr-2">Standard</Badge>
                  Basic features and limits
                </div>
              </SelectItem>
              <SelectItem value="Premium">
                <div className="flex items-center">
                  <Badge variant="default" className="mr-2">Premium</Badge>
                  Enhanced features and higher limits
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.accountType && (
            <p className="text-sm text-red-500 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {form.formState.errors.accountType.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="flex items-center">
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
};

// Step 2: Resource Limits
const ResourceLimitsStep: React.FC<{
  onNext: (data: AdminResourceLimits) => void;
  onBack: () => void;
  initialData: AdminResourceLimits | null;
  accountType: 'Standard' | 'Premium';
}> = ({ onNext, onBack, initialData, accountType }) => {
  const form = useForm<AdminResourceLimits>({
    resolver: zodResolver(resourceLimitsSchema),
    defaultValues: initialData || {
      maxOrganizations: 3,
      maxCourses: 20,
      maxDepartments: 10,
      maxTotalEmployees: 100,
      perOrgEmployeeLimit: 50,
      perCourseEmployeeLimit: 20,
      defaultCourseEmployeeLimit: 10
    }
  });

  const onSubmit = (data: AdminResourceLimits) => {
    onNext(data);
  };

  const limitFields = [
    { key: 'maxOrganizations', label: 'Maximum Organizations', description: 'Total number of organizations this admin can create' },
    { key: 'maxCourses', label: 'Maximum Courses', description: 'Total number of courses across all organizations' },
    { key: 'maxDepartments', label: 'Maximum Departments', description: 'Total number of departments across all organizations' },
    { key: 'maxTotalEmployees', label: 'Maximum Total Employees', description: 'Total number of employees across all organizations' },
    { key: 'perOrgEmployeeLimit', label: 'Per-Organization Employee Limit', description: 'Maximum employees per organization' },
    { key: 'perCourseEmployeeLimit', label: 'Per-Course Employee Limit', description: 'Maximum employees per course' },
    { key: 'defaultCourseEmployeeLimit', label: 'Default Course Employee Limit', description: 'Default limit when creating new courses' }
  ];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Resource Limits Configuration</h3>
          <Badge variant={accountType === 'Premium' ? 'default' : 'secondary'}>
            {accountType} Account
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          Configure the resource limits for this admin account. These limits control how many resources 
          the admin can create and manage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {limitFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label} *</Label>
            <Input
              id={field.key}
              type="number"
              min="1"
              {...form.register(field.key as keyof AdminResourceLimits, { valueAsNumber: true })}
            />
            <p className="text-xs text-gray-500">{field.description}</p>
            {form.formState.errors[field.key as keyof AdminResourceLimits] && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {form.formState.errors[field.key as keyof AdminResourceLimits]?.message}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous Step
        </Button>
        <Button type="submit" className="flex items-center">
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
};

// Step 3: Review & Activate
const ReviewStep: React.FC<{
  onSubmit: (data: { termsAccepted: boolean; isActive: boolean }) => void;
  onBack: () => void;
  basicInfo: AdminBasicInfo;
  resourceLimits: AdminResourceLimits;
  isLoading: boolean;
}> = ({ onSubmit, onBack, basicInfo, resourceLimits, isLoading }) => {
  const form = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      termsAccepted: false,
      isActive: true
    }
  });

  const handleSubmit = (data: { termsAccepted: boolean; isActive: boolean }) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Review Admin Details</h3>
        
        {/* Basic Information Summary */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Full Name:</span>
                <p className="font-medium">{basicInfo.fullName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <p className="font-medium">{basicInfo.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Account Type:</span>
                <Badge variant={basicInfo.accountType === 'Premium' ? 'default' : 'secondary'}>
                  {basicInfo.accountType}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resource Limits Summary */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Resource Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Organizations:</span>
                <p className="font-medium">{resourceLimits.maxOrganizations}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Courses:</span>
                <p className="font-medium">{resourceLimits.maxCourses}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Departments:</span>
                <p className="font-medium">{resourceLimits.maxDepartments}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Total Employees:</span>
                <p className="font-medium">{resourceLimits.maxTotalEmployees}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Per-Org Employees:</span>
                <p className="font-medium">{resourceLimits.perOrgEmployeeLimit}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Per-Course Employees:</span>
                <p className="font-medium">{resourceLimits.perCourseEmployeeLimit}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Activation and Terms */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            {...form.register('isActive')}
          />
          <Label htmlFor="isActive" className="text-sm font-medium">
            Activate account immediately
          </Label>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="termsAccepted"
            {...form.register('termsAccepted')}
          />
          <Label htmlFor="termsAccepted" className="text-sm">
            I confirm that the admin account details are correct and I accept the terms and conditions
            for creating this administrator account.
          </Label>
        </div>
        {form.formState.errors.termsAccepted && (
          <p className="text-sm text-red-500 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {form.formState.errors.termsAccepted.message}
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous Step
        </Button>
        <Button type="submit" disabled={isLoading} className="flex items-center">
          {isLoading ? 'Creating Admin...' : 'Create Admin'}
          <CheckCircle className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
};

export default AdminCreationWizard;