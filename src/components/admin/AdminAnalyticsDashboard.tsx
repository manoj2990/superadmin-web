import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Crown, 
  Shield, 
  TrendingUp, 
  Activity,
  Building,
  GraduationCap,
  UsersIcon
} from 'lucide-react';
import { AdminAnalytics } from '@/types/admin';
import { format, formatDistanceToNow } from 'date-fns';

interface AdminAnalyticsDashboardProps {
  analytics: AdminAnalytics | undefined;
  isLoading: boolean;
}

const AdminAnalyticsDashboard: React.FC<AdminAnalyticsDashboardProps> = ({ 
  analytics, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  const activePercentage = analytics.totalAdmins > 0 
    ? (analytics.activeAdmins / analytics.totalAdmins) * 100 
    : 0;

  const premiumPercentage = analytics.totalAdmins > 0 
    ? (analytics.premiumAdmins / analytics.totalAdmins) * 100 
    : 0;

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Admins</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalAdmins}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">Active growth</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Admins</p>
                <p className="text-3xl font-bold text-green-600">{analytics.activeAdmins}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={activePercentage} className="h-2" />
              <p className="text-sm text-gray-500 mt-1">{activePercentage.toFixed(1)}% of total</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Admins</p>
                <p className="text-3xl font-bold text-red-600">{analytics.inactiveAdmins}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={100 - activePercentage} className="h-2" />
              <p className="text-sm text-gray-500 mt-1">{(100 - activePercentage).toFixed(1)}% of total</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Premium Accounts</p>
                <p className="text-3xl font-bold text-purple-600">{analytics.premiumAdmins}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={premiumPercentage} className="h-2" />
              <p className="text-sm text-gray-500 mt-1">{premiumPercentage.toFixed(1)}% premium</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Account Type Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of Standard vs Premium accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Badge variant="secondary" className="mr-2">Standard</Badge>
                  <span className="text-sm text-gray-600">Basic features</span>
                </div>
                <span className="font-semibold">{analytics.standardAdmins}</span>
              </div>
              <Progress value={analytics.totalAdmins > 0 ? (analytics.standardAdmins / analytics.totalAdmins) * 100 : 0} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Badge variant="default" className="mr-2">Premium</Badge>
                  <span className="text-sm text-gray-600">Enhanced features</span>
                </div>
                <span className="font-semibold">{analytics.premiumAdmins}</span>
              </div>
              <Progress value={premiumPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Average Resource Utilization
            </CardTitle>
            <CardDescription>
              How efficiently admins are using their allocated resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-sm">Organizations</span>
                </div>
                <span className="font-semibold">{analytics.avgResourceUtilization.organizations.toFixed(1)}%</span>
              </div>
              <Progress 
                value={analytics.avgResourceUtilization.organizations} 
                className={`h-2 ${getUtilizationColor(analytics.avgResourceUtilization.organizations)}`}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2 text-purple-500" />
                  <span className="text-sm">Courses</span>
                </div>
                <span className="font-semibold">{analytics.avgResourceUtilization.courses.toFixed(1)}%</span>
              </div>
              <Progress 
                value={analytics.avgResourceUtilization.courses} 
                className={`h-2 ${getUtilizationColor(analytics.avgResourceUtilization.courses)}`}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UsersIcon className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-sm">Employees</span>
                </div>
                <span className="font-semibold">{analytics.avgResourceUtilization.employees.toFixed(1)}%</span>
              </div>
              <Progress 
                value={analytics.avgResourceUtilization.employees} 
                className={`h-2 ${getUtilizationColor(analytics.avgResourceUtilization.employees)}`}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-orange-600" />
            Recent Admin Activity
          </CardTitle>
          <CardDescription>
            Latest actions performed by administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.recentActivity.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {analytics.recentActivity.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.adminName}</p>
                      <p className="text-xs text-gray-500">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(activity.timestamp), 'MMM dd, HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsDashboard;