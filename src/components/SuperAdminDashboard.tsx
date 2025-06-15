
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Crown, LogOut } from 'lucide-react';
import AdminList from './AdminList';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import {endpoints} from '@/api/api'
import AvatarList from './AvatarList';

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

const SuperAdminDashboard = ({ userData, onLogout}: SuperAdminDashboardProps) => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const { toast } = useToast();
  

useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get<{ data: Admin[] }>(
          endpoints.GET_ALL_ADMINS,
         
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );

      
        if (response.data && Array.isArray(response.data.data)) {
          
          setAdmins(response.data.data);
          toast({
            title: 'Admins Fetched Successfully',
            description: `Loaded ${response.data.data.length} admins.`,
          });
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        const axiosError = error;
        console.error('Fetch admins error:', axiosError);
        toast({
          title: 'Fetch Failed',
          description:
            axiosError.response?.data?.message || 'Failed to fetch admins. Please try again.',
          variant: 'destructive',
        });
      }
    };

    fetchAdmins();
  }, [userData, toast]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('superAdminData');
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
        <Tabs defaultValue="admins" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="superadmin" className="flex items-center space-x-2">
              <Crown className="w-4 h-4" />
              <span>Super Admin</span>
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Admins</span>
            </TabsTrigger>

              <TabsTrigger value="avatars" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Avatars</span>
            </TabsTrigger>
          </TabsList>

          {/* Super Admin Tab */}
          <TabsContent value="superadmin" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Crown className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Super Admin Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Name</p>
                      <p className="text-lg font-semibold text-gray-900">{userData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-lg text-gray-900">{userData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Account Type</p>
                      <p className="text-lg text-gray-900 capitalize">{userData.accountType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Status</p>
                      <p className="text-lg text-gray-900 capitalize">{userData.accountStatus}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admins Tab */}
          <TabsContent value="admins" className="space-y-6">
            <AdminList 
              admins={admins}
              setAdmins={setAdmins}
            />
          </TabsContent>

          {/* {Avatar Tab} */}
         <TabsContent value="avatars" className="space-y-6">
            <AvatarList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
