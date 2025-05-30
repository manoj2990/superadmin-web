
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Building, Plus, FolderOpen, X } from 'lucide-react';
import axios from 'axios';
import {endpoints} from '@/api/api'
interface Admin {
  _id: string;
  accountType: string;
  created_orgs: Array<{
    _id: string;
    name: string;
    departments: Array<{
      _id: string;
      name: string;
      description: string;
      courses?: any[];
    }>;
  }>;
}

interface OrganizationManagerProps {
  admin:any;
}

const OrganizationManager = ({ admin }: OrganizationManagerProps) => {
  const [newOrg, setNewOrg] = useState({
    name: '',
    organization_admin_email: '',
    logo_url: 'https://example.com/acme-logo.png',
    adminId: admin._id,
  });
  const [newDept, setNewDept] = useState({
    organizationId: '',
    name: '',
    description: '',
    adminId: admin._id,
  });
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const [isCreatingDept, setIsCreatingDept] = useState(false);
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [showDeptForm, setShowDeptForm] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const handleCreateOrganization = async () => {
    
    if (!newOrg.name || !newOrg.organization_admin_email) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsCreatingOrg(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      console.log("newOrg--->",newOrg)
      const response = await axios.post(endpoints.CREATE_ORG, newOrg, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data) {
       
        setNewOrg({
          name: '',
          organization_admin_email: '',
          logo_url: 'https://example.com/acme-logo.png',
          adminId: '',
        });
        setShowOrgForm(false);
        toast({
          title: 'Organization Created',
          description: `Organization ${newOrg.name} has been created successfully.`,
          className: 'bg-green-100 text-green-800 border-green-300',
        });
      }
    } catch (error) {
      console.error('Create organization error:', error);
      toast({
        title: 'Creation Failed',
        description: 'Failed to create organization. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingOrg(false);
      location.reload();
    }
  };

  const handleCreateDepartment = async (orgId: string) => {
    if (!newDept.name || !newDept.description) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsCreatingDept(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const deptData = { ...newDept, organizationId: orgId };
      const response = await axios.post(endpoints.CREATE_DEPART, deptData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data) {
        setNewDept({
          organizationId: '',
          name: '',
          description: '',
          adminId: '',
        });
        setShowDeptForm(prev => ({ ...prev, [orgId]: false }));
        toast({
          title: 'Department Created',
          description: `Department ${newDept.name} has been created successfully.`,
          className: 'bg-purple-100 text-purple-800 border-purple-300',
        });
      }
    } catch (error) {
      console.error('Create department error:', error);
      toast({
        title: 'Creation Failed',
        description: 'Failed to create department. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingDept(false);
      location.reload();
    }
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-lg font-semibold text-gray-800 flex items-center">
          <Building className="w-5 h-5 mr-2 text-indigo-600" />
          Admin & Organizations
        </h5>
        <Button
          size="sm"
          onClick={() => setShowOrgForm(!showOrgForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center transition-colors duration-200"
          aria-label={showOrgForm ? 'Hide organization form' : 'Show organization form'}
        >
          <Plus className="w-4 h-4 mr-2" />
          {showOrgForm ? 'Hide Form' : 'Add Organization'}
        </Button>
      </div>

      {/* Create Organization Form */}
      {showOrgForm && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-3">
            <h6 className="text-md font-medium text-gray-800">Create New Organization</h6>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowOrgForm(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close organization form"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="orgName" className="text-sm font-medium text-gray-700">
                Organization Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="orgName"
                value={newOrg.name}
                onChange={(e) => setNewOrg(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter organization name"
                className="mt-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                aria-required="true"
              />
            </div>
            <div>
              <Label htmlFor="orgEmail" className="text-sm font-medium text-gray-700">
                Admin Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="orgEmail"
                type="email"
                value={newOrg.organization_admin_email}
                onChange={(e) => setNewOrg(prev => ({ ...prev, organization_admin_email: e.target.value }))}
                placeholder="admin@example.com"
                className="mt-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                aria-required="true"
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <Button
              size="sm"
              onClick={handleCreateOrganization}
              disabled={isCreatingOrg}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              aria-label="Create organization"
            >
              {isCreatingOrg ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Organization'
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowOrgForm(false)}
              className="text-gray-600 hover:text-gray-800 border-gray-300"
              aria-label="Cancel organization creation"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Admin Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h6 className="text-md font-medium text-gray-800 mb-2">Admin Information</h6>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium text-gray-700">Admin ID:</span> {admin._id}
          </div>
          <div>
            <span className="font-medium text-gray-700">Admin Name:</span> {admin.name}
          </div>
          {/* <div>
            <span className="font-medium text-gray-700">Account Type:</span>{' '}
            <Badge variant="secondary" className="capitalize">
              {admin?.accountType}
            </Badge>
          </div> */}
        </div>
      </div>

      {/* Organizations */}
      {admin.created_orgs && admin.created_orgs.length > 0 ? (
        <div className="space-y-4">
          <h6 className="text-md font-medium text-gray-800 flex items-center">
            <Building className="w-5 h-5 mr-2 text-indigo-600" />
            Organizations ({admin.created_orgs.length})
          </h6>
          {admin.created_orgs.map((org:any,index) => (
            <div
              key={org._id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h6 className="text-md font-semibold text-gray-800">{`(${index+1})`}{"  "}{org.name}</h6>
                  <p className="text-xs text-gray-500">ID: {org._id}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowDeptForm(prev => ({ ...prev, [org._id]: !prev[org._id] }))}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1"
                  aria-label={showDeptForm[org._id] ? 'Hide department form' : 'Show department form'}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {showDeptForm[org._id] ? 'Hide Form' : 'Add Department'}
                </Button>
              </div>

              {/* Create Department Form */}
              {showDeptForm[org._id] && (
                <div className="mb-4 p-4 bg-purple-50 rounded-lg transition-all duration-300 ease-in-out">
                  <div className="flex justify-between items-center mb-3">
                    <h6 className="text-md font-medium text-gray-800">Create New Department</h6>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowDeptForm(prev => ({ ...prev, [org._id]: false }))}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="Close department form"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deptName" className="text-sm font-medium text-gray-700">
                        Department Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="deptName"
                        value={newDept.name}
                        onChange={(e) => setNewDept(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter department name"
                        className="mt-1 text-sm focus:ring-purple-500 focus:border-purple-500"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deptDesc" className="text-sm font-medium text-gray-700">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="deptDesc"
                        value={newDept.description}
                        onChange={(e) => setNewDept(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter department description"
                        className="mt-1 text-sm focus:ring-purple-500 focus:border-purple-500"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <Button
                      size="sm"
                      onClick={() => handleCreateDepartment(org._id)}
                      disabled={isCreatingDept}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      aria-label="Create department"
                    >
                      {isCreatingDept ? (
                        <span className="flex items-center">
                          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Creating...
                        </span>
                      ) : (
                        'Create Department'
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDeptForm(prev => ({ ...prev, [org._id]: false }))}
                      className="text-gray-600 hover:text-gray-800 border-gray-300"
                      aria-label="Cancel department creation"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Departments */}
              {org.departments && org.departments.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FolderOpen className="w-4 h-4 mr-2 text-purple-600" />
                    Departments ({org.departments.length})
                  </p>
                  <div className="space-y-2">
                    {org.departments.map((dept) => (
                      <div
                        key={dept._id}
                        className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow duration-200"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-gray-800">{dept.name}</span>
                            <span className="text-xs text-gray-500"> (ID: {dept._id})</span>
                          </div>
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                            {dept.courses?.length || 0} courses
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{dept.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No organizations found. Create one to get started.</p>
      )}
    </div>
  );
};

export default OrganizationManager;