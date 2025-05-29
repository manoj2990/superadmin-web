import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Plus, Mail, User, LogOut, Crown, LogIn, Building, FolderOpen } from 'lucide-react';
import axios from 'axios';

interface Admin {
  _id: string;
  name: string;
  email: string;
  accountType: string;
  accountStatus: string;
  created_orgs: string[] | any[];
  adminDetails?: any;
}

interface SuperAdminDashboardProps {
  userData: any;
  onLogout: () => void;
}

const SuperAdminDashboard = ({ userData, onLogout }: SuperAdminDashboardProps) => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '123',
    name: '',
    accountType: 'admin'
  });
  const [isCreating, setIsCreating] = useState(false);
  const [adminTokens, setAdminTokens] = useState<{[key: string]: any}>({});
  const { toast } = useToast();

  useEffect(() => {
    if (userData.adminsCreatedBySuperAdmin) {
      setAdmins(userData.adminsCreatedBySuperAdmin);
    }
  }, [userData]);

  const generateRandomEmail = () => {
    const randomName = Math.random().toString(36).substring(2, 10);
    return `admin${randomName}@example.com`;
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const token = localStorage.getItem('authToken');
      const adminData = {
        ...newAdmin,
        email: newAdmin.email || generateRandomEmail()
      };

      const response = await axios.post('http://localhost:4000/api/v1/superadmin/create-admin', adminData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        // Add new admin to the list
        setAdmins(prev => [...prev, response.data.data]);
        
        // Reset form
        setNewAdmin({
          email: '',
          password: '123',
          name: '',
          accountType: 'admin'
        });
        
        toast({
          title: "Admin Created Successfully",
          description: `New admin ${adminData.name} has been created.`,
        });
      }
    } catch (error) {
      console.error('Create admin error:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create new admin. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleAdminLogin = async (admin: Admin) => {
    try {
      const loginData = {
        email: admin.email,
        password: "123"
      };

      const response = await axios.post('http://localhost:4000/api/v1/auth/login', loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data && response.data.data) {
        // Store admin details with token and organizations
        setAdminTokens(prev => ({
          ...prev,
          [admin._id]: response.data.data
        }));
        
        toast({
          title: "Admin Login Successful",
          description: `Logged in as ${admin.name}`,
        });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "Login Failed",
        description: `Failed to login as ${admin.name}`,
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Super Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                <p className="text-xs text-gray-500">{userData.email}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Admins</p>
                  <p className="text-3xl font-bold">{userData.adminCount || 0}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Account Type</p>
                  <p className="text-xl font-bold capitalize">{userData.accountType}</p>
                </div>
                <Shield className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Status</p>
                  <p className="text-xl font-bold capitalize">{userData.accountStatus}</p>
                </div>
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="superadmin" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="superadmin" className="flex items-center space-x-2">
              <Crown className="w-4 h-4" />
              <span>Super Admin</span>
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Admins</span>
            </TabsTrigger>
          </TabsList>

          {/* Super Admin Tab */}
          <TabsContent value="superadmin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-purple-600" />
                  <span>Super Admin Information</span>
                </CardTitle>
                <CardDescription>
                  Your account details and system information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Name</Label>
                    <p className="text-lg font-semibold text-gray-900">{userData.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <p className="text-lg text-gray-900">{userData.email}</p>
                  </div>
                </div>
                
                {/* Create Admin Form */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-blue-600" />
                    Create New Admin
                  </h3>
                  <form onSubmit={handleCreateAdmin} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="adminName">Admin Name</Label>
                        <Input
                          id="adminName"
                          value={newAdmin.name}
                          onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Admin-John Doe"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="adminEmail">Email (optional)</Label>
                        <Input
                          id="adminEmail"
                          type="email"
                          value={newAdmin.email}
                          onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Will auto-generate if empty"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="adminPassword">Password</Label>
                        <Input
                          id="adminPassword"
                          type="password"
                          value={newAdmin.password}
                          onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Password"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="accountType">Account Type</Label>
                        <Input
                          id="accountType"
                          value={newAdmin.accountType}
                          readOnly
                          className="bg-gray-100"
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isCreating}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isCreating ? 'Creating...' : 'Create Admin'}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admins Tab */}
          <TabsContent value="admins" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Admin Management</span>
                </CardTitle>
                <CardDescription>
                  View and manage all admins created by you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {admins.length > 0 ? (
                    admins.map((admin) => (
                      <div key={admin._id} className="p-4 bg-gray-50 rounded-lg border space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{admin.name}</h4>
                              <p className="text-sm text-gray-600 flex items-center">
                                <Mail className="w-4 h-4 mr-1" />
                                {admin.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={admin.accountStatus === 'active' ? 'default' : 'secondary'}
                              className={admin.accountStatus === 'active' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {admin.accountStatus}
                            </Badge>
                            <Badge variant="outline">
                              {Array.isArray(admin.created_orgs) ? admin.created_orgs.length : 0} orgs
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => handleAdminLogin(admin)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <LogIn className="w-4 h-4 mr-1" />
                              Login
                            </Button>
                          </div>
                        </div>

                        {/* Show admin details if logged in */}
                        {adminTokens[admin._id] && (
                          <div className="mt-4 p-4 bg-white rounded-lg border">
                            <h5 className="font-semibold text-gray-900 mb-3">Admin Details & Organizations</h5>
                            
                            {/* Admin Info */}
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><span className="font-medium">ID:</span> {adminTokens[admin._id]._id}</div>
                                <div><span className="font-medium">Account Type:</span> {adminTokens[admin._id].accountType}</div>
                              </div>
                            </div>

                            {/* Organizations */}
                            {adminTokens[admin._id].created_orgs && adminTokens[admin._id].created_orgs.length > 0 && (
                              <div className="space-y-3">
                                <h6 className="font-medium text-gray-900 flex items-center">
                                  <Building className="w-4 h-4 mr-1" />
                                  Organizations ({adminTokens[admin._id].created_orgs.length})
                                </h6>
                                {adminTokens[admin._id].created_orgs.map((org: any) => (
                                  <div key={org._id} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                      <h6 className="font-medium text-gray-900">{org.name}</h6>
                                      <div className="flex space-x-2 text-xs">
                                        <Badge variant="outline">{org.numberOfEmployees} employees</Badge>
                                        <Badge variant="outline">{org.numberOfDepartments} departments</Badge>
                                      </div>
                                    </div>
                                    
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
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No admins created yet. Create your first admin above!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
