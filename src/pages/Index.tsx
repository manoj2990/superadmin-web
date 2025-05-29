
import React from 'react';
import SuperAdminDashboard from '@/components/SuperAdminDashboard';

const Index = () => {
  // Mock super admin data for testing
  const mockUserData = {
    _id: "6820791fa678239f60574c4a",
    name: "Super Admin",
    email: "kecif37629@linxues.com",
    accountType: "superadmin",
    adminCount: 2,
    adminsCreatedBySuperAdmin: [
      {
        adminLimits: {
          maxOrganizations: 100,
          maxCourses: 500,
          maxDepartments: 100,
          maxEmployees: 5,
          maxEmployeesPerOrg: [],
          maxEmployeesPerCourseDefault: 3,
          maxEmployeesPerCourse: []
        },
        _id: "682079efa678239f60574c53",
        name: "Admin updated",
        email: "adminNels_Baumbach86@example.com",
        accountType: "admin",
        created_orgs: [
          "68208700f2b634ae4425598e",
          "6820873ef2b634ae44255995"
        ],
        accountStatus: "active"
      },
      {
        adminLimits: {
          maxOrganizations: 100,
          maxCourses: 100,
          maxDepartments: 100,
          maxEmployees: 0,
          maxEmployeesPerOrg: [],
          maxEmployeesPerCourseDefault: 5,
          maxEmployeesPerCourse: []
        },
        _id: "683834b51414bc04b18996c9",
        name: "Admin-Manoj meena",
        email: "adminLuz70@example.com",
        accountType: "admin",
        created_orgs: [
          "683835a21414bc04b18996db"
        ],
        accountStatus: "inactive"
      }
    ],
    accountStatus: "active",
    token: "mock-token"
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return <SuperAdminDashboard userData={mockUserData} onLogout={handleLogout} />;
};

export default Index;
