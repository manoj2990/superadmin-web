export interface AdminResourceLimits {
  maxOrganizations: number;
  maxCourses: number;
  maxDepartments: number;
  maxTotalEmployees: number;
  perOrgEmployeeLimit: number;
  perCourseEmployeeLimit: number;
  defaultCourseEmployeeLimit: number;
}

export interface AdminBasicInfo {
  email: string;
  password: string;
  fullName: string;
  accountType: 'Standard' | 'Premium';
}

export interface AdminCreateRequest extends AdminBasicInfo {
  resourceLimits: AdminResourceLimits;
  isActive: boolean;
  termsAccepted: boolean;
}

export interface AdminResponse {
  _id: string;
  email: string;
  fullName: string;
  accountType: 'Standard' | 'Premium';
  accountStatus: 'active' | 'inactive';
  resourceLimits: AdminResourceLimits;
  resourceUsage: {
    organizations: number;
    courses: number;
    departments: number;
    totalEmployees: number;
  };
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface AdminFilters {
  search: string;
  accountType: 'all' | 'Standard' | 'Premium';
  status: 'all' | 'active' | 'inactive';
  sortBy: 'fullName' | 'email' | 'createdAt' | 'lastLogin';
  sortOrder: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export interface AdminAnalytics {
  totalAdmins: number;
  activeAdmins: number;
  inactiveAdmins: number;
  standardAdmins: number;
  premiumAdmins: number;
  avgResourceUtilization: {
    organizations: number;
    courses: number;
    departments: number;
    employees: number;
  };
  recentActivity: Array<{
    id: string;
    adminId: string;
    adminName: string;
    action: string;
    timestamp: string;
  }>;
}