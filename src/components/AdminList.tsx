
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus } from 'lucide-react';
import axios from 'axios';
import AdminCard from './AdminCard';
import {endpoints} from '@/api/api'
interface Admin {
  _id: string;
  name: string;
  email: string;
  accountType: string;
  accountStatus: string;
  created_orgs: string[] | any[];
  adminDetails?: any;
}

interface AdminListProps {
  admins: Admin[];
  setAdmins: React.Dispatch<React.SetStateAction<Admin[]>>;
  
}

const AdminList = ({ admins, setAdmins}: AdminListProps) => {
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    name: '',
    accountType: 'admin'
  });
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();


  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      
      const adminData = {
        ...newAdmin,
  
      };
       const token = localStorage.getItem('authToken');

      const response = await axios.post(endpoints.CREATE_ADMIN, adminData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        
        setAdmins(prev => [...prev, response.data.data]);
        setNewAdmin({
          email: '',
          password: '',
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

 
  return (
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
        {/* Create Admin Form */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
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
                <Label htmlFor="adminEmail">Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@gmail.com"
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

        {/* Admin List */}
        <div className="space-y-4">
        
          {admins.length > 0 ? (
            admins.map((admin,index) => (
              <AdminCard
                key={index}
                admin={admin}
               
              />
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
  );
};

export default AdminList;
