import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { useContract } from 'src/features/contract/useContracts';
import {
  useAssignUsers,
  useRemoveUsers,
  useEmployeeForAssign
} from 'src/features/task/useTasks';
import { fDate, fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { toast } from 'react-hot-toast';
import MenuItem from '@mui/material/MenuItem';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export function ContractDetailsView({ id }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const popover = usePopover();
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedSubTask, setSelectedSubTask] = useState(null);

  const { data: response, isLoading } = useContract(id);
  const contract = response?.data;

  const companyId = contract?.company?._id || contract?.company;

  const { data: employees = [], isLoading: isEmployeesLoading } = useEmployeeForAssign(companyId);
  const assignUsers = useAssignUsers();
  const removeUsers = useRemoveUsers();

  const handleOpenAssign = useCallback((event, subTaskId) => {
    setSelectedSubTask(subTaskId);
    popover.onOpen(event);
  }, [popover]);

  const handleAssign = useCallback(async (employeeId) => {
    try {
      await assignUsers.mutateAsync({
        taskId: id, // Parent contract/task ID check needed? 
        // Actually the API takes subTaskId in URL. 
        // But invalidateQueries needs taskId.
        subTaskId: selectedSubTask,
        data: { userIds: [employeeId], removeUserIds: [] }
      });
      toast.success(t('task.details.successAssign'));
      popover.onClose();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || t('task.details.errorAssign'));
    }
  }, [assignUsers, id, selectedSubTask, popover, t]);

  const handleRemove = useCallback(async (subTaskId, employeeId) => {
    try {
      await removeUsers.mutateAsync({ taskId: id, subTaskId, userIds: [employeeId] });
      toast.success(t('task.details.successRemove'));
    } catch (error) {
      console.error(error);
      toast.error(error?.message || t('task.details.errorRemove'));
    }
  }, [removeUsers, id, t]);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!contract) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h5">{t('contract.notFound')}</Typography>
      </Box>
    );
  }

  const {
    contractNumber,
    contractType,
    startDate,
    endDate,
    client,
    property,
    tasks = [],
    totalTasks,
    totalCost,
    status,
    invoiceNumber,
    referenceNumber,
    additionalDocuments = [],
    createdAt,
    clinetStatus,
    emailStatus,
    billingType,
    hourlyRate,
    emailRespondedAt,
    createdBy,
  } = contract;

  return (
    <Container maxWidth={false}>
      <Stack spacing={1} sx={{ mb: { xs: 3, md: 5 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{t('contract.details.title')}</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Label
              variant="soft"
              color={
                (status === 'active' && 'success') ||
                (status === 'draft' && 'warning') ||
                (status === 'in_progress' && 'info') ||
                'default'
              }
              startIcon={<Iconify icon="solar:clock-circle-bold" />}
              sx={{ textTransform: 'capitalize' }}
            >
              {t(`contract.status.${status}`) || status.replace('_', ' ')}
            </Label>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="solar:export-bold" />}
              sx={{ borderColor: 'divider', borderRadius: 1.5 }}
            >
              {t('contract.export')}
            </Button>
          </Stack>
        </Stack>

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
          <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.contract.list)} sx={{ cursor: 'pointer' }}>
            {t('contract.title')}
          </Link>
          <Typography color="text.disabled">#{contractNumber}</Typography>
        </Breadcrumbs>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* ─── Client Details ─── */}
            <Card sx={{ p: 3, borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    borderRadius: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.main,
                  }}
                >
                  <Iconify icon="solar:user-bold" width={20} />
                </Box>
                <Typography variant="h6">{t('contract.form.clientDetails')}</Typography>
                {clinetStatus && (
                  <Label
                    color={
                      (clinetStatus === 'accepted' && 'success') ||
                      (clinetStatus === 'pending' && 'warning') ||
                      (clinetStatus === 'rejected' && 'error') ||
                      'default'
                    }
                    variant="soft"
                    sx={{ ml: 'auto', textTransform: 'capitalize' }}
                  >
                    {t(`contract.status.${clinetStatus}`) || clinetStatus}
                  </Label>
                )}
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <DetailItem label={t('contract.form.name')} value={client?.name} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label={t('contract.form.email')} value={client?.email} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label={t('contract.form.phone')} value={client?.phone} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label={t('contract.form.startDate')} value={fDate(startDate)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label={t('contract.form.endDate')} value={fDate(endDate)} />
                </Grid>
              </Grid>
            </Card>

            {/* ─── Price Breakdown ─── */}
            <Card sx={{ p: 3, borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    borderRadius: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.success.main, 0.08),
                    color: theme.palette.success.main,
                  }}
                >
                  <Iconify icon="solar:bill-list-bold" width={20} />
                </Box>
                <Typography variant="h6">{t('contract.details.priceBreakdown') || 'Price Breakdown'}</Typography>
              </Stack>

              <Stack spacing={2}>
                {tasks.map((task, index) => (
                  <Stack key={task._id} direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2">{task.taskName}</Typography>
                      <Typography variant="caption" color="text.secondary">{task.taskCategory} • {task.taskSubCategory}</Typography>
                    </Box>
                    <Typography variant="subtitle2">{fCurrency(task.taskPrice)}</Typography>
                  </Stack>
                ))}
                <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t('contract.form.totalCost')}</Typography>
                  <Typography variant="subtitle1" color="error.main" sx={{ fontWeight: 'bold' }}>{fCurrency(totalCost)}</Typography>
                </Stack>
              </Stack>
            </Card>

            {/* ─── Property Details ─── */}
            <Card sx={{ p: 3, borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    borderRadius: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.warning.main, 0.08),
                    color: theme.palette.warning.main,
                  }}
                >
                  <Iconify icon="solar:home-bold" width={20} />
                </Box>
                <Typography variant="h6">{t('contract.form.propertyDetails')}</Typography>
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <DetailItem
                    label={t('contract.form.propertyName')}
                    value={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.08), borderRadius: 1 }}>
                          <Iconify icon="solar:home-2-bold" width={16} />
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{property?.propertyName}</Typography>
                      </Stack>
                    }
                    isComponent
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label={t('contract.form.propertyType')} value={property?.propertyType} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label={t('contract.details.size')} value={`${property?.sizeSqm} ${t('contract.details.sqFeet')}`} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label={t('contract.details.propertyLocation')} value={`${client?.city}, ${client?.country}`} />
                </Grid>
              </Grid>
            </Card>

            {/* ─── Task List ─── */}
            <Card sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>{t('contract.form.taskManagement')} ({tasks.length})</Typography>

              <Tabs
                value={currentTab}
                onChange={handleChangeTab}
                sx={{
                  mb: 3,
                  '& .MuiTabs-flexContainer': {
                    gap: 1,
                    bgcolor: 'background.neutral',
                    p: 0.5,
                    borderRadius: 1,
                  },
                }}
              >
                <Tab label={t('contract.status.all')} value="all" />
                <Tab label={t('contract.status.in_progress')} value="in_progress" />
                <Tab label={t('contract.status.completed')} value="completed" />
              </Tabs>

              <Stack spacing={2}>
                {tasks
                  .filter(t => currentTab === 'all' || t.status === currentTab)
                  .map((task) => (
                    <Card
                      key={task._id}
                      onClick={() => router.push(paths.dashboard.task.details(task._id))}
                      sx={{
                        p: 2.5,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.1),
                        cursor: 'pointer',
                        transition: (theme) => theme.transitions.create(['background-color', 'box-shadow']),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                          boxShadow: (theme) => theme.customShadows.z8,
                        }
                      }}
                    >
                      <Stack direction="row" alignItems="flex-start" spacing={2} sx={{ mb: task.subTasks?.length > 0 ? 2 : 0 }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{task.taskName}</Typography>
                            <Label variant="soft" size="small" color="info">{task.taskCategory}</Label>
                          </Stack>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {t('contract.details.sub')}: {task.taskSubCategory} • {t('contract.details.price')}: {fCurrency(task.taskPrice)}
                          </Typography>
                        </Box>
                        <Label
                          variant="soft"
                          color={task.status === 'completed' ? 'success' : task.status === 'pending' ? 'warning' : 'info'}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          {t(`contract.status.${task.status}`) || task.status}
                        </Label>
                      </Stack>

                      {task.subTasks?.length > 0 && (
                        <Stack spacing={1.5} sx={{ pl: 2, borderLeft: `2px solid ${theme.palette.divider}` }}>
                          {task.subTasks.map((subTask) => (
                            <Box key={subTask._id}>
                              <Stack direction="row" alignItems="center" spacing={1} sx={{ justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ fontWeight: '500' }}>{subTask.subTaskName}</Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Label variant="outlined" size="small" color={subTask.status === 'completed' ? 'success' : 'warning'}>
                                    {t(`contract.status.${subTask.status}`) || subTask.status}
                                  </Label>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    sx={{ height: 24, fontSize: '0.65rem', px: 1 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenAssign(e, subTask._id);
                                    }}
                                  >
                                    {t('task.details.assignTo')}
                                  </Button>
                                </Stack>
                              </Stack>
                              {subTask.assignedTo?.length > 0 && (
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                  {subTask.assignedTo.map((staff) => (
                                    <Stack key={staff._id} direction="row" alignItems="center" spacing={1} sx={{ bgcolor: 'background.neutral', pr: 1.5, py: 0.5, pl: 0.5, borderRadius: 10 }}>
                                      <Avatar src={staff.avatarUrl} sx={{ width: 20, height: 20 }} />
                                      <Typography variant="caption" sx={{ fontWeight: '600' }}>
                                        {staff.firstName} {staff.lastName}
                                      </Typography>
                                      <IconButton size="small" color="error" sx={{ p: 0.2 }} onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(subTask._id, staff._id);
                                      }}>
                                        <Iconify icon="solar:close-circle-bold" width={12} />
                                      </IconButton>
                                    </Stack>
                                  ))}
                                </Stack>
                              )}
                            </Box>
                          ))}
                        </Stack>
                      )}
                    </Card>
                  ))}
                {tasks.length === 0 && <Typography variant="body2" color="text.secondary">{t('contract.details.noTasks')}</Typography>}
              </Stack>
            </Card>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* ─── Summary Sidebar ─── */}
            <Card sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>{t('contract.details.summary')}</Typography>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{t('contract.details.invoiceNumber')}</Typography>
                  <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 'bold' }}>{invoiceNumber}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{t('contract.details.reference')}</Typography>
                  <Typography variant="subtitle2">{referenceNumber}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{t('contract.form.contractType')}</Typography>
                  <Label variant="soft" color="secondary" sx={{ textTransform: 'capitalize' }}>{contractType}</Label>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{t('contract.form.billingType')}</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                    {billingType} {billingType === 'hourly' && `(${fCurrency(hourlyRate)}/hr)`}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{t('contract.details.createdAt')}</Typography>
                  <Typography variant="subtitle2">{fDateTime(createdAt)}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{t('contract.table.emailStatus')}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Label
                      variant="soft"
                      color={
                        (['sent', 'accepted'].includes(emailStatus) ? 'success' : '') ||
                        (emailStatus === 'pending' ? 'warning' : 'default')
                      }
                    >
                      {t(`contract.status.${emailStatus}`) || emailStatus}
                    </Label>
                    {emailRespondedAt && (
                      <Typography variant="caption" color="text.disabled">
                        {fDateTime(emailRespondedAt)}
                      </Typography>
                    )}
                  </Stack>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{t('contract.form.totalCost')}</Typography>
                  <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
                    {fCurrency(totalCost)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>{t('contract.details.createdBy')}</Typography>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      {createdBy?.firstName?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{createdBy?.firstName} {createdBy?.lastName}</Typography>
                      <Typography variant="caption" color="text.secondary">{createdBy?.email}</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Card>

            {/* ─── File Attachment ─── */}
            <Card sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>{t('contract.form.additionalDocuments')} ({additionalDocuments.length})</Typography>
              <Stack spacing={2}>
                {additionalDocuments.map((file, index) => (
                  <Stack key={index} direction="row" alignItems="center" spacing={2} sx={{ p: 1.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(theme.palette.success.main, 0.08), color: 'success.main', borderRadius: 1 }}>
                      <Iconify icon="solar:file-bold" width={24} />
                    </Box>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" noWrap>{file.fileName}</Typography>
                      <Typography variant="caption" color="text.secondary">{fDate(file.uploadedAt)}</Typography>
                    </Box>
                    <IconButton href={file.fileUrl} target="_blank">
                      <Iconify icon="solar:download-bold" />
                    </IconButton>
                  </Stack>
                ))}
                {additionalDocuments.length === 0 && (
                  <Typography variant="body2" color="text.secondary">{t('contract.details.noFiles')}</Typography>
                )}
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{
          arrow: { placement: 'top-right' },
          paper: {
            sx: { width: 360, minWidth: 320 }
          }
        }}
      >
        <Box sx={{ p: 1.5, typography: 'subtitle2', borderBottom: (t) => `dashed 1px ${t.palette.divider}` }}>
          {t('task.details.assignTo')}
        </Box>
        <Scrollbar sx={{ maxHeight: 300 }}>
          {isEmployeesLoading ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : employees.length === 0 ? (
            <Box sx={{ p: 2, typography: 'body2', color: 'text.secondary', textAlign: 'center' }}>
              {t('task.details.noEmployees')}
            </Box>
          ) : (
            employees.map((employee) => (
              <MenuItem key={employee.employeeId} onClick={() => handleAssign(employee.employeeId)}>
                <Avatar alt={employee.name} src={employee.avatarUrl} sx={{ width: 24, height: 24, mr: 1 }} />
                <Typography variant="body2" noWrap>{employee.name}</Typography>
              </MenuItem>
            ))
          )}
        </Scrollbar>
      </CustomPopover>
    </Container>
  );
}

// ----------------------------------------------------------------------

function DetailItem({ label, value, isComponent }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 0.5 }}>
        {label}
      </Typography>
      {isComponent ? (
        value
      ) : (
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {value || '-'}
        </Typography>
      )}
    </Box>
  );
}

