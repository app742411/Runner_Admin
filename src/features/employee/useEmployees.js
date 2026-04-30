import { useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { ROLES } from 'src/config/roles';
import { employeeApi } from 'src/store/api/employee.api';

export function useEmployees(params) {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;

  return useQuery({
    queryKey: ['employees', params, role],
    queryFn: () => {
      console.log(`[useEmployees] Fetching for role: ${role}`);
      if (role === ROLES.SUPER_ADMIN) {
        console.log('[useEmployees] Target: Admin API');
        return employeeApi.getAllEmployeesAdmin(params).then((res) => res.data);
      }
      console.log('[useEmployees] Target: Company API');
      return employeeApi.getAllEmployeesCompany(params).then((res) => res.data);
    },
  });
}

export function useEmployee(id) {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;

  return useQuery({
    queryKey: ['employee', id, role],
    queryFn: () => {
      if (role === ROLES.SUPER_ADMIN) {
        return employeeApi.getEmployeeByIdAdmin(id).then((res) => res.data);
      }
      return employeeApi.getEmployeeByIdCompany(id).then((res) => res.data);
    },
    enabled: !!id,
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;

  return useMutation({
    mutationFn: (id) => {
      if (role === ROLES.SUPER_ADMIN) {
        return employeeApi.deleteEmployeeAdmin(id);
      }
      return employeeApi.deleteEmployeeCompany(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useEmployeeDashboard() {
  return useQuery({
    queryKey: ['employeeDashboard'],
    queryFn: () => employeeApi.getEmployeeDashboard().then((res) => res.data),
  });
}

export function useEmployeeFinancial() {
  return useQuery({
    queryKey: ['employeeFinancial'],
    queryFn: () => employeeApi.getEmployeeFinancial().then((res) => res.data),
  });
}

export function useEmployeeProfile() {
  return useQuery({
    queryKey: ['employeeProfile'],
    queryFn: () => employeeApi.getProfile().then((res) => res.data),
  });
}

export function useUpdateEmployeeProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => employeeApi.updateProfile(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeProfile'] });
    },
  });
}

