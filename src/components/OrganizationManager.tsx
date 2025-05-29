
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Building, Plus, FolderOpen } from 'lucide-react';
import axios from 'axios';

interface OrganizationManagerProps {
  adminId: string;
  adminToken: any;
  onRefreshAdmin: () => void;
}

const OrganizationManager = ({ adminId, adminToken, onRefreshAdmin }: OrganizationManagerProps) => {
  const [newOrg, setNewOrg] = useState({
    name: '',
    organization_admin_email: '',
    logo_url: 'https://example.com/acme-logo.png'
  });
  const [newDept, setNewDept] = useState({
    organizationId: '',
    name: '',
    description: ''
  });
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const [isCreatingDept, setIsCreatingDept] = useState(false);
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [showDeptForm, setShowDeptForm] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  const handleCreateOrganization = async () => {
    setIsCreatingOrg(true);
    try {
      if (!adminToken || !adminToken.token) {
        toast({
          title: "Error",
          description: "Admin must be logged in to create organization",
          variant: "destructive",
        });
        return;
      }

      const response = await axios.post('http://localhost:4000/api/v1/organizations', newOrg, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken.token}`,
        },
      });

      if (response.data) {
        onRefreshAdmin();
        setNewOrg({
          name: '',
          organization_admin_email: '',
          logo_url: 'https://example.com/acme-logo.png'
        });
        setShowOrgForm(false);
        
        toast({
          title: "Organization Created",
          description: `Organization ${newOrg.name} has been created successfully.`,
        });
      }
    } catch (error) {
      console.error('Create organization error:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create organization. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingOrg(false);
    }
  };

  const handleCreateDepartment = async (orgId: string) => {
    setIsCreatingDept(true);
    try {
      if (!adminToken || !adminToken.token) {
        toast({
          title: "Error",
          description: "Admin must be logged in to create department",
          variant: "destructive",
        });
        return;
      }

      const deptData = {
        ...newDept,
        organizationId: orgId
      };

      const response = await axios.post('http://localhost:4000/api/v1/departments', deptData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken.token}`,
        },
      });

      if (response.data) {
        onRefreshAdmin();
        setNewDept({
          organizationId: '',
          name: '',
          description: ''
        });
        setShowDeptForm(prev => ({ ...prev, [orgId]: false }));
        
        toast({
          title: "Department Created",
          description: `Department ${newDept.name} has been created successfully.`,
        });
      }
    } catch (error) {
      console.error('Create department error:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create department. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingDept(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-lg border">
      <div className="flex justify-between items-center mb-3">
        <h5 className="font-semibold text-gray-900">Admin Details & Organizations</h5>
        <Button
          size="sm"
          onClick={() => setShowOrgForm(!showOrgForm)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Organization
        </Button>
      </div>
      
      {/* Create Organization Form */}
      {showOrgForm && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <h6 className="font-medium text-gray-900 mb-3">Create New Organization</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                value={newOrg.name}
                onChange={(e) => setNewOrg(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Organization name"
              />
            </div>
            <div>
              <Label htmlFor="orgEmail">Admin Email</Label>
              <Input
                id="orgEmail"
                value={newOrg.organization_admin_email}
                onChange={(e) => setNewOrg(prev => ({ ...prev, organization_admin_email: e.target.value }))}
                placeholder="admin@example.com"
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-3">
            <Button
              size="sm"
              onClick={handleCreateOrganization}
              disabled={isCreatingOrg}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCreatingOrg ? 'Creating...' : 'Create Organization'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowOrgForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Admin Info */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="font-medium">ID:</span> {adminToken._id}</div>
          <div><span className="font-medium">Account Type:</span> {adminToken.accountType}</div>
        </div>
      </div>

      {/* Organizations */}
      {adminToken.created_orgs && adminToken.created_orgs.length > 0 && (
        <div className="space-y-3">
          <h6 className="font-medium text-gray-900 flex items-center">
            <Building className="w-4 h-4 mr-1" />
            Organizations ({adminToken.created_orgs.length})
          </h6>
          {adminToken.created_orgs.map((org: any) => (
            <div key={org._id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h6 className="font-medium text-gray-900">{org.name}</h6>
                <div className="flex space-x-2 text-xs">
                  <Badge variant="outline">{org.numberOfEmployees} employees</Badge>
                  <Badge variant="outline">{org.numberOfDepartments} departments</Badge>
                  <Button
                    size="sm"
                    onClick={() => setShowDeptForm(prev => ({ ...prev, [org._id]: !prev[org._id] }))}
                    className="bg-purple-600 hover:bg-purple-700 text-xs px-2 py-1"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Dept
                  </Button>
                </div>
              </div>

              {/* Create Department Form */}
              {showDeptForm[org._id] && (
                <div className="mb-3 p-3 bg-purple-50 rounded-lg">
                  <h6 className="font-medium text-gray-900 mb-2">Create New Department</h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="deptName">Department Name</Label>
                      <Input
                        id="deptName"
                        value={newDept.name}
                        onChange={(e) => setNewDept(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Department name"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deptDesc">Description</Label>
                      <Input
                        id="deptDesc"
                        value={newDept.description}
                        onChange={(e) => setNewDept(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Department description"
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => handleCreateDepartment(org._id)}
                      disabled={isCreatingDept}
                      className="bg-purple-600 hover:bg-purple-700 text-xs"
                    >
                      {isCreatingDept ? 'Creating...' : 'Create Department'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDeptForm(prev => ({ ...prev, [org._id]: false }))}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Departments */}
              {org.departments && org.departments.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FolderOpen className="w-3 h-3 mr-1" />
                    Departments:
                  </p>
                  <div className="space-y-1">
                    {org.departments.map((dept: any) => (
                      <div key={dept._id} className="text-xs bg-white p-2 rounded border">
                        <div className="flex justify-between">
                          <span className="font-medium">{dept.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {dept.courses?.length || 0} courses
                          </Badge>
                        </div>
                        <p className="text-gray-500 mt-1">{dept.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationManager;
