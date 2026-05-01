import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { alpha, useTheme } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { toast } from 'react-hot-toast';

import {
  useTask,
  useAssignUsers,
  useRemoveUsers,
  useEmployeeForAssign,
  useStartTimer,
  useStopTimer,
  useUploadBeforeImage,
  useUploadAfterImage
} from 'src/features/task/useTasks';

// Local Components
import TaskDetailsToolbar from '../task-details-toolbar';
import TaskDetailsSidebar from '../task-details-sidebar';
import TaskDetailsItemContent from '../task-details-item-content';
import TaskDetailsSummaryCard from '../task-details-summary-card';

// ----------------------------------------------------------------------

export function TaskDetailsView({ id }) {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const isEmployeeRole = user?.role === 'employee';

  const { data: response, isLoading: isTaskLoading } = useTask(id);
  const task = response?.data;

  const {
    company,
    subTasks = [],
  } = task || {};

  const taskDetail = task?.taskDetails || task || {};
  const status = task?.status || taskDetail?.status;

  const companyId = company?.companyId;

  const { data: employees = [], isLoading: isEmployeesLoading } = useEmployeeForAssign(companyId);
  const assignUser = useAssignUsers();
  const removeUser = useRemoveUsers();
  const startTimer = useStartTimer();
  const stopTimer = useStopTimer();
  const uploadBefore = useUploadBeforeImage();
  const uploadAfter = useUploadAfterImage();

  const [selectedSubTask, setSelectedSubTask] = useState(null);
  const [activeSubTaskId, setActiveSubTaskId] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const popover = usePopover();

  // Handlers
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map((v) => (v < 10 ? `0${v}` : v)).join(':');
  };

  const formatDecimalTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  useEffect(() => {
    if (status === 'completed') {
      setElapsedTime(subTasks.reduce((acc, st) => acc + (st.totalTimeSeconds || 0), 0));
      return;
    }

    let interval;
    const activeST = subTasks.find((st) => st.timerStartedAt && !st.timerCompletedAt && st.status === 'in_progress');

    if (activeST?.timerStartedAt) {
      const startTime = new Date(activeST.timerStartedAt).getTime();
      const baseSeconds = activeST.totalTimeSeconds || 0;

      interval = setInterval(() => {
        setElapsedTime(baseSeconds + Math.floor((new Date().getTime() - startTime) / 1000));
      }, 1000);
    } else {
      setElapsedTime(activeST?.totalTimeSeconds || 0);
    }
    return () => clearInterval(interval);
  }, [subTasks, status]);

  useEffect(() => {
    if (subTasks.length > 0 && !activeSubTaskId) {
      setActiveSubTaskId(subTasks[0]._id);
    }
  }, [subTasks, activeSubTaskId]);

  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      }
    });
  }, []);

  const handleUploadImage = async (event, subTaskId, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('workImage', file);

    try {
      // Get dynamic location
      try {
        const coords = await getCurrentLocation();
        formData.append('lat', String(coords.lat));
        formData.append('lng', String(coords.lng));
      } catch (geoError) {
        console.warn('Geolocation failed, proceeding without coordinates:', geoError.message);
        // You can append default values here if required by backend
        // formData.append('lat', '0');
        // formData.append('lng', '0');
      }

      if (type === 'before') {
        await uploadBefore.mutateAsync({ subTaskId, formData });
      } else {
        await uploadAfter.mutateAsync({ subTaskId, formData });
      }
      toast.success(t('task.details.successUpload'));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
      toast.error(errorMessage);
    }
  };

  const handleOpenAssign = useCallback((event, subTaskId) => {
    setSelectedSubTask(subTaskId);
    popover.onOpen(event);
  }, [popover]);

  const handleAssign = useCallback(async (employeeId) => {
    try {
      await assignUser.mutateAsync({
        taskId: id,
        subTaskId: selectedSubTask,
        data: { userIds: [employeeId], removeUserIds: [] }
      });
      toast.success(t('task.details.successAssign'));
      popover.onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  }, [assignUser, id, selectedSubTask, popover, t]);

  const handleSaveAfterDescription = async (subTaskId, description) => {
    const formData = new FormData();
    formData.append('description', description);

    try {
      // Get dynamic location
      try {
        const coords = await getCurrentLocation();
        formData.append('lat', String(coords.lat));
        formData.append('lng', String(coords.lng));
      } catch (geoError) {
        console.warn('Geolocation failed, proceeding without coordinates:', geoError.message);
      }

      await uploadAfter.mutateAsync({ subTaskId, formData });
      toast.success(t('task.details.successSaveDescription') || 'Description saved successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Save failed';
      toast.error(errorMessage);
    }
  };

  const handleRemove = useCallback(async (subTaskId, employeeId) => {
    try {
      await removeUser.mutateAsync({ taskId: id, subTaskId, userIds: [employeeId] });
      toast.success(t('task.details.successRemove'));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  }, [removeUser, id, t]);

  if (isTaskLoading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  if (!task) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><Typography variant="h5">{t('task.details.notFound')}</Typography></Box>;

  return (
    <Container maxWidth={false} sx={{ py: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: { xs: 3, md: 5 } }}>
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{t('task.details.title')}</Typography>
          <Breadcrumbs
            separator={
              <Box
                component="span"
                sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
              />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.root)} sx={{ cursor: 'pointer' }}>
              {t('common.dashboard') || 'Dashboard'}
            </Link>
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.task.list)} sx={{ cursor: 'pointer' }}>
              {t('task.title')}
            </Link>
            <Typography color="text.disabled">{task?.taskName}</Typography>
          </Breadcrumbs>
        </Stack>

        <TaskDetailsToolbar
          status={status}
          elapsedTime={elapsedTime}
          totalEstimated={subTasks.reduce((acc, st) => acc + (st.estimatedDurationSeconds || 0), 0)}
          formatTime={formatTime}
          formatDecimalTime={formatDecimalTime}
        />
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{
          paper: {
            sx: { width: 220 },
          },
        }}
      >
        <Box sx={{ p: 1.5, typography: 'subtitle2', borderBottom: (t) => `dashed 1px ${t.palette.divider}` }}>{t('task.details.assignTo')}</Box>
        <Scrollbar sx={{ maxHeight: 300 }}>
          {isEmployeesLoading ? <Box sx={{ p: 2, textAlign: 'center' }}><CircularProgress size={24} /></Box> :
            employees.length === 0 ? <Box sx={{ p: 2, textAlign: 'center' }}>{t('task.details.noEmployees')}</Box> :
              employees.map((emp) => (
                <MenuItem key={emp.employeeId} onClick={() => handleAssign(emp.employeeId)}>
                  <Avatar src={emp.avatarUrl} sx={{ width: 24, height: 24, mr: 1 }} />
                  <Typography variant="body2">{emp.name}</Typography>
                </MenuItem>
              ))}
        </Scrollbar>
      </CustomPopover>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack spacing={3}>
            <TaskDetailsSummaryCard task={task} t={t} />

            <Card sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: (theme) => theme.customShadows.z16 }}>
              <Grid container sx={{ minHeight: 600 }}>
                <Grid item xs={12} md={4}>
                  <TaskDetailsSidebar
                    subTasks={subTasks}
                    activeSubTaskId={activeSubTaskId}
                    onSelectSubTask={setActiveSubTaskId}
                    t={t}
                    formatDecimalTime={formatDecimalTime}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <TaskDetailsItemContent
                    currentSubTask={subTasks.find(st => st._id === (activeSubTaskId || subTasks[0]?._id))}
                    isEmployeeRole={isEmployeeRole}
                    onStartTimer={(sid) => startTimer.mutateAsync(sid)}
                    onStopTimer={(sid) => stopTimer.mutateAsync(sid)}
                    onOpenAssign={handleOpenAssign}
                    onUploadImage={handleUploadImage}
                    onSaveAfterDescription={handleSaveAfterDescription}
                    uploadBefore={uploadBefore}
                    uploadAfter={uploadAfter}
                    t={t}
                    formatDecimalTime={formatDecimalTime}
                  />
                </Grid>
              </Grid>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
