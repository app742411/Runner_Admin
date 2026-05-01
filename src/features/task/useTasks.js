import { useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../../store/api/task.api';
import { ROLES } from '../../config/roles';

export function useTasks(params) {
  const user = useSelector((state) => state.auth.user);

  const isAdmin = user?.role === ROLES.SUPER_ADMIN;
  const isEmployee = user?.role === ROLES.EMPLOYEE;
  const isGroupAdmin = user?.role === ROLES.GROUP_ADMIN;

  return useQuery({
    queryKey: ['tasks', params, user?.role],
    queryFn: () => {
      let apiCall = taskApi.getAllTasksCompany;

      if (isAdmin) {
        apiCall = taskApi.getAllTasksAdmin;
      } else if (isEmployee) {
        apiCall = taskApi.getMySubTasks;
      }

      return apiCall(params).then((res) => res.data);
    },
  });
}

export function useTask(id) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskApi.getTaskById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useEmployeeForAssign(id) {
  const user = useSelector((state) => state.auth.user);
  const isGroupAdmin = user?.role === ROLES.GROUP_ADMIN;

  return useQuery({
    queryKey: ['employee-assign', id, user?.role],
    queryFn: async () => {
      const res = isGroupAdmin
        ? await taskApi.getGroupMembersForAssign(id)
        : await taskApi.getEmployeeForAssign(id);

      const rawData = res.data.data || res.data || [];
      const employeesArray = Array.isArray(rawData) ? rawData : (rawData.members || rawData.employees || []);

      return employeesArray.map(emp => ({
        employeeId: emp.employeeId || emp._id,
        name: emp.name || (emp.firstName && emp.lastName ? `${emp.firstName} ${emp.lastName}` : emp.firstName || emp.lastName || 'Unknown'),
        avatarUrl: emp.avatarUrl || emp.profilePicture || emp.employeeProfile?.profileImage?.fileUrl
      }));
    },
    enabled: !!id,
  });
}

export function useAssignUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subTaskId, data }) => taskApi.assignUsers(subTaskId, data),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['contract'] });
    },
  });
}

export function useRemoveUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subTaskId, userIds }) => taskApi.removeUsers(subTaskId, userIds),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['contract'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => taskApi.deleteTaskAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useStartTimer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subTaskId) => taskApi.startTimer(subTaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useStopTimer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subTaskId) => taskApi.stopTimer(subTaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUploadBeforeImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subTaskId, formData }) => taskApi.uploadBeforeImage(subTaskId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task'] });
    },
  });
}

export function useUploadAfterImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subTaskId, formData }) => taskApi.uploadAfterImage(subTaskId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task'] });
    },
  });
}
