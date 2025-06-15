import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, BarChart3, Settings } from 'lucide-react';
import { useAdminManagement } from '@/hooks/useAdminManagement';
import { AdminResponse } from '@/types/admin';
import AdminCreationWizard from './AdminCreationWizard';
import AdminDataTable from './AdminDataTable';
import AdminAnalyticsDashboard from './AdminAnalyticsDashboard';
import AdminEditDialog from './AdminEditDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const ComprehensiveAdminDashboard: React.FC = () => {
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminResponse | null>(null);
  const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);

  const {
    admins,
    analytics,
    filters,
    pagination,
    selectedAdmins,
    isLoadingAdmins,
    isLoadingAnalytics,
    isUpdatingAdmin,
    isDeletingAdmin,
    updateFilters,
    updatePagination,
    updateAdmin,
    deleteAdmin,
    bulkDeleteAdmins,
    toggleAdminSelection,
    selectAllAdmins,
    clearSelection,
    refetchAdmins,
  } = useAdminManagement();

  const handleCreateSuccess = () => {
    setShowCreateWizard(false);
    refetchAdmins();
  };

  const handleEditAdmin = (admin: AdminResponse) => {
    setEditingAdmin(admin);
  };

  const handleSaveAdmin = async (adminId: string, data: Partial<AdminResponse>) => {
    await updateAdmin(adminId, data);
    setEditingAdmin(null);
  };

  const handleDeleteAdmin = (adminId: string) => {
    setDeletingAdminId(adminId);
  };

  const confirmDeleteAdmin = async () => {
    if (deletingAdminId) {
      await deleteAdmin(deletingAdminId);
      setDeletingAdminId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
              <p className="text-gray-600 mt-2">
                Comprehensive dashboard for managing administrator accounts and resources
              </p>
            </div>
            <Button onClick={() => setShowCreateWizard(true)} className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Create New Admin
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Admins
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminAnalyticsDashboard 
              analytics={analytics} 
              isLoading={isLoadingAnalytics} 
            />
          </TabsContent>

          <TabsContent value="admins" className="space-y-6">
            <AdminDataTable
              admins={admins}
              filters={filters}
              pagination={pagination}
              selectedAdmins={selectedAdmins}
              isLoading={isLoadingAdmins}
              onFiltersChange={updateFilters}
              onPaginationChange={updatePagination}
              onAdminSelect={toggleAdminSelection}
              onSelectAll={selectAllAdmins}
              onClearSelection={clearSelection}
              onEditAdmin={handleEditAdmin}
              onDeleteAdmin={handleDeleteAdmin}
              onBulkDelete={bulkDeleteAdmins}
              onRefresh={refetchAdmins}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Panel</h3>
              <p className="text-gray-500">
                System settings and configuration options will be available here.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modals and Dialogs */}
        {showCreateWizard && (
          <AdminCreationWizard
            onClose={() => setShowCreateWizard(false)}
            onSuccess={handleCreateSuccess}
          />
        )}

        <AdminEditDialog
          admin={editingAdmin}
          isOpen={!!editingAdmin}
          isLoading={isUpdatingAdmin}
          onClose={() => setEditingAdmin(null)}
          onSave={handleSaveAdmin}
        />

        <AlertDialog open={!!deletingAdminId} onOpenChange={() => setDeletingAdminId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Admin</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this admin? This action cannot be undone and will
                remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteAdmin}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeletingAdmin}
              >
                {isDeletingAdmin ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ComprehensiveAdminDashboard;