
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, User, LogIn } from 'lucide-react';
import OrganizationManager from './OrganizationManager';

interface Admin {
  _id: string;
  name: string;
  email: string;
  accountType: string;
  accountStatus: string;
  created_orgs: string[] | any[];
  adminDetails?: any;
}

interface AdminCardProps {
  admin: Admin;
  adminToken: any;
  onAdminLogin: (admin: Admin) => void;
}

const AdminCard = ({ admin, adminToken, onAdminLogin }: AdminCardProps) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border space-y-4">
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
            onClick={() => onAdminLogin(admin)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <LogIn className="w-4 h-4 mr-1" />
            Login
          </Button>
        </div>
      </div>

      {/* Show admin details if logged in */}
      {adminToken && (
        <OrganizationManager 
          adminId={admin._id}
          adminToken={adminToken}
          onRefreshAdmin={() => onAdminLogin(admin)}
        />
      )}
    </div>
  );
};

export default AdminCard;
