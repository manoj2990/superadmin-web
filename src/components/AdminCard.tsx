import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, User, LogIn, Copy } from 'lucide-react';
import OrganizationManager from './OrganizationManager';
import { useToast } from '@/hooks/use-toast';

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
}

const AdminCard = ({ admin }: AdminCardProps) => {
  const [showOrg, setShowOrg] = useState(false);
  const { toast } = useToast();

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(admin.email);
      toast({
        title: 'Email Copied',
        description: 'Admin email copied to clipboard.',
        className: 'bg-green-100 text-green-800 border-green-300',
        duration: 2000,
      });
    } catch (error) {
      console.error('Copy email error:', error);
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy email. Please try again.',
        variant: 'destructive',
        duration: 2000,
      });
    }
  };

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
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCopyEmail}
                className="ml-2 text-gray-500 hover:text-gray-700"
                aria-label="Copy admin email to clipboard"
              >
                <Copy className="w-4 h-4" />
              </Button>
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
            onClick={() => setShowOrg((prev) => !prev)}
            className="bg-blue-600 hover:bg-blue-700"
            aria-label={showOrg ? 'Hide organization details' : 'Show organization details'}
          >
            {showOrg ? 'Close' : 'View'}
          </Button>
        </div>
      </div>

      {showOrg && (
        <OrganizationManager admin={admin} />
      )}
    </div>
  );
};

export default AdminCard;