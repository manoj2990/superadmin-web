
const BASE_URL = 'https://workculture.onrender.com/api/v1'

// AUTH ENDPOINTS
export const endpoints = {
  LOGIN_API: BASE_URL + "/auth/login",
  GET_ALL_ADMINS: BASE_URL +"/superadmin/admins",
  CREATE_ADMIN: BASE_URL + "/superadmin/create-admin",
  CREATE_ORG: BASE_URL+"/admin/organizations/create",
  CREATE_DEPART: BASE_URL+"/admin/department/create"
}