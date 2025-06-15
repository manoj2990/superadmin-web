import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AdminResponse, AdminCreateRequest, AdminFilters, PaginationState, AdminAnalytics } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = 'http://localhost:4000/api/v1';

const adminApi = {
  createAdmin: async (data: AdminCreateRequest): Promise<AdminResponse> => {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(`${API_BASE_URL}/superadmin/create-admin`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  getAdmins: async (filters: AdminFilters, pagination: PaginationState): Promise<{ admins: AdminResponse[], total: number }> => {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      search: filters.search,
      accountType: filters.accountType,
      status: filters.status,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });

    const response = await axios.get(`${API_BASE_URL}/superadmin/admins?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  updateAdminLimits: async (adminId: string, limits: Partial<AdminResponse>): Promise<AdminResponse> => {
    const token = localStorage.getItem('authToken');
    const response = await axios.put(`${API_BASE_URL}/superadmin/update-admin-limits`, 
      { adminId, ...limits }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  },

  deleteAdmin: async (adminId: string): Promise<void> => {
    const token = localStorage.getItem('authToken');
    await axios.delete(`${API_BASE_URL}/superadmin/admins/${adminId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  getAnalytics: async (): Promise<AdminAnalytics> => {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_BASE_URL}/superadmin/analytics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  }
};

export const useAdminManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<AdminFilters>({
    search: '',
    accountType: 'all',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0
  });

  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);

  // Queries
  const {
    data: adminsData,
    isLoading: isLoadingAdmins,
    error: adminsError,
    refetch: refetchAdmins
  } = useQuery({
    queryKey: ['admins', filters, pagination.page, pagination.limit],
    queryFn: () => adminApi.getAdmins(filters, pagination),
    onSuccess: (data) => {
      setPagination(prev => ({ ...prev, total: data.total }));
    }
  });

  const {
    data: analytics,
    isLoading: isLoadingAnalytics
  } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: adminApi.getAnalytics,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Mutations
  const createAdminMutation = useMutation({
    mutationFn: adminApi.createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
      toast({
        title: 'Success',
        description: 'Admin created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create admin',
        variant: 'destructive',
      });
    }
  });

  const updateAdminMutation = useMutation({
    mutationFn: ({ adminId, data }: { adminId: string; data: Partial<AdminResponse> }) =>
      adminApi.updateAdminLimits(adminId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
      toast({
        title: 'Success',
        description: 'Admin updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update admin',
        variant: 'destructive',
      });
    }
  });

  const deleteAdminMutation = useMutation({
    mutationFn: adminApi.deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
      toast({
        title: 'Success',
        description: 'Admin deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete admin',
        variant: 'destructive',
      });
    }
  });

  // Actions
  const updateFilters = useCallback((newFilters: Partial<AdminFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  const updatePagination = useCallback((newPagination: Partial<PaginationState>) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  const createAdmin = useCallback((data: AdminCreateRequest) => {
    return createAdminMutation.mutateAsync(data);
  }, [createAdminMutation]);

  const updateAdmin = useCallback((adminId: string, data: Partial<AdminResponse>) => {
    return updateAdminMutation.mutateAsync({ adminId, data });
  }, [updateAdminMutation]);

  const deleteAdmin = useCallback((adminId: string) => {
    return deleteAdminMutation.mutateAsync(adminId);
  }, [deleteAdminMutation]);

  const bulkDeleteAdmins = useCallback(async () => {
    try {
      await Promise.all(selectedAdmins.map(id => deleteAdminMutation.mutateAsync(id)));
      setSelectedAdmins([]);
    } catch (error) {
      console.error('Bulk delete failed:', error);
    }
  }, [selectedAdmins, deleteAdminMutation]);

  const toggleAdminSelection = useCallback((adminId: string) => {
    setSelectedAdmins(prev => 
      prev.includes(adminId) 
        ? prev.filter(id => id !== adminId)
        : [...prev, adminId]
    );
  }, []);

  const selectAllAdmins = useCallback(() => {
    if (adminsData?.admins) {
      setSelectedAdmins(adminsData.admins.map(admin => admin._id));
    }
  }, [adminsData]);

  const clearSelection = useCallback(() => {
    setSelectedAdmins([]);
  }, []);

  return {
    // Data
    admins: adminsData?.admins || [],
    analytics,
    filters,
    pagination,
    selectedAdmins,

    // Loading states
    isLoadingAdmins,
    isLoadingAnalytics,
    isCreatingAdmin: createAdminMutation.isPending,
    isUpdatingAdmin: updateAdminMutation.isPending,
    isDeletingAdmin: deleteAdminMutation.isPending,

    // Errors
    adminsError,

    // Actions
    updateFilters,
    updatePagination,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    bulkDeleteAdmins,
    toggleAdminSelection,
    selectAllAdmins,
    clearSelection,
    refetchAdmins,
  };
};