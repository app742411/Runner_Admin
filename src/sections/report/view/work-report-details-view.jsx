import { useParams } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { alpha, useTheme } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { fDateTime, fSecondsToDuration } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { Iconify } from 'src/components/iconify';
import { CONFIG } from 'src/config-global';
import toast from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { useWorkReportDetails, useApproveWorkReport, useUpdateWorkReport, useReviewWorkReport } from 'src/features/report/useWorkReports';

// ----------------------------------------------------------------------

export function WorkReportDetailsView() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { id } = useParams();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const isGroupAdmin = user?.role === 'group_admin';

  const { data, isLoading, error } = useWorkReportDetails(id);
  const report = data?.data;

  const { mutate: approveWorkReport, isPending: isApproving } = useApproveWorkReport();
  const { mutate: reviewWorkReport, isPending: isReviewing } = useReviewWorkReport();
  const { mutateAsync: updateWorkReport, isPending: isUpdating } = useUpdateWorkReport();

  const [editDialog, setEditDialog] = useState({ open: false, subTaskId: '', description: '' });

  const handleApprove = async () => {
    try {
      await approveWorkReport(id);
      toast.success(t('report.details.approveSuccess') || 'Report approved successfully');
    } catch (err) {
      console.error(err);
      toast.error(t('report.details.approveError') || 'Failed to approve report');
    }
  };

  const handleReview = async () => {
    try {
      await reviewWorkReport(id);
      toast.success(t('report.details.reviewSuccess') || 'Report reviewed successfully');
    } catch (err) {
      console.error(err);
      toast.error(t('report.details.reviewError') || 'Failed to review report');
    }
  };

  const handleOpenEdit = (sub) => {
    setEditDialog({
      open: true,
      subTaskId: sub.subTaskId?._id,
      description: sub.subTaskId?.afterWorkImagesdescription || '',
    });
  };

  const handleCloseEdit = () => {
    setEditDialog({ open: false, subTaskId: '', description: '' });
  };

  const handleSaveDescription = async () => {
    try {
      await updateWorkReport({
        id,
        data: {
          subTaskId: editDialog.subTaskId,
          afterWorkImagesdescription: editDialog.description,
        },
      });
      toast.success(t('report.details.saveSuccess') || 'Description updated successfully');
      handleCloseEdit();
    } catch (err) {
      console.error(err);
      toast.error(t('report.details.saveError') || 'Failed to update description');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !report) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h5">{t('report.details.notFound') || 'Report not found'}</Typography>
      </Box>
    );
  }

  const { task, contract, employeeBreakdown, completedSubTasks, totalHours, totalTimeSeconds } = report;

  return (
    <DashboardContent maxWidth={false}>
      {/* ─── Header ─── */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: { xs: 3, md: 5 } }}>
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{t('report.details.title')}</Typography>
          <Breadcrumbs
            separator={<Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />}
          >
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.root)} sx={{ cursor: 'pointer' }}>
              {t('common.dashboard') || 'Dashboard'}
            </Link>
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.report.root)} sx={{ cursor: 'pointer' }}>
              {t('report.title')}
            </Link>
            <Typography color="text.disabled">{task?.taskName}</Typography>
          </Breadcrumbs>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {t('report.table.status')}:
            </Typography>
            <Label 
              variant="soft" 
              color={(report.status === 'approved' && 'success') || (report.status === 'rejected' && 'error') || 'info'} 
              sx={{ height: 28, textTransform: 'capitalize' }}
            >
              {t(`report.table.${report.status}`) || report.status}
            </Label>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {t('report.table.reviewStatus')}:
            </Typography>
            <Label 
              variant="soft" 
              color={(report.reviewStatus === 'approved' && 'success') || (report.reviewStatus === 'rejected' && 'error') || 'warning'} 
              sx={{ height: 28 }}
            >
              {t(`report.table.${report.reviewStatus}`) || report.reviewStatus.toUpperCase()}
            </Label>
          </Stack>

          <Label variant="soft" color={report.isBilled ? 'success' : 'info'} sx={{ height: 28 }}>
            {report.isBilled ? t('report.details.billed') : t('report.details.unbilled')}
          </Label>

          {(report.reviewStatus === 'pending' || report.status === 'pending' || report.status === 'draft') && (
            <Stack direction="row" spacing={1.5}>
              {isGroupAdmin && report.reviewStatus === 'pending' && (
                <LoadingButton
                  variant="outlined"
                  color="primary"
                  loading={isReviewing}
                  onClick={handleReview}
                  startIcon={<Iconify icon="solar:clipboard-check-bold" />}
                  sx={{ borderRadius: 1.5 }}
                >
                  {t('report.details.review')}
                </LoadingButton>
              )}
              {(report.status === 'pending' || report.status === 'draft') && !isGroupAdmin && (
                <LoadingButton
                  variant="contained"
                  color="success"
                  loading={isApproving}
                  onClick={handleApprove}
                  startIcon={<Iconify icon="solar:check-read-bold" />}
                  sx={{ borderRadius: 1.5, boxShadow: theme.customShadows.success }}
                >
                  {t('report.details.approve')}
                </LoadingButton>
              )}
            </Stack>
          )}
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {/* Statistics Section */}
        <Grid xs={12} md={4}>
          <StatCard
            icon="solar:clock-circle-bold"
            color="info"
            label={t('report.details.totalTime')}
            value={fSecondsToDuration(totalTimeSeconds)}
            caption={`(${totalTimeSeconds} ${t('common.units.seconds')})`}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <StatCard
            icon="solar:bill-list-bold"
            color="success"
            label={t('report.details.billingType')}
            value={contract?.billingType}
            caption={`${t('contract.form.hourlyRate')}: ${fCurrency(contract?.hourlyRate || 0)} / ${t('common.units.hr')}`}
            sx={{ textTransform: 'capitalize' }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <StatCard
            icon="solar:document-bold"
            color="warning"
            label={t('report.details.contractInfo')}
            value={contract?.contractNumber}
            caption={`${t('report.details.reference')}: ${contract?.referenceNumber}`}
          />
        </Grid>

        {/* General Information */}
        <Grid xs={12} md={8}>
          <Card sx={{ borderRadius: 2 }}>
            <CardHeader 
              title={t('report.details.generalInfo')} 
              avatar={
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex' }}>
                  <Iconify icon="solar:info-circle-bold" width={20} />
                </Box>
              }
            />
            <Divider />
            <Box sx={{ p: 3 }}>
              <Grid container spacing={4}>
                <Grid xs={12} sm={6}>
                  <DetailItem label={t('task.details.taskDescription')} value={task?.taskDescription} />
                </Grid>
                <Grid xs={12} sm={6}>
                  <DetailItem label={t('report.details.scheduledFor')} value={fDateTime(task?.scheduledDate)} />
                </Grid>

                {(report.approvedAt || report.reviewedAt) && (
                   <>
                    <Grid xs={12}><Divider sx={{ borderStyle: 'dashed' }} /></Grid>
                    {report.approvedAt && (
                      <Grid xs={12} sm={6}>
                        <DetailItem label={t('report.details.approvedAt')} value={fDateTime(report.approvedAt)} />
                      </Grid>
                    )}
                    {report.reviewedAt && (
                      <Grid xs={12} sm={6}>
                        <DetailItem label={t('report.details.reviewedAt')} value={fDateTime(report.reviewedAt)} />
                      </Grid>
                    )}
                   </>
                )}

                <Grid xs={12}><Divider sx={{ borderStyle: 'dashed' }} /></Grid>

                <Grid xs={12} sm={6}>
                  <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>{t('contract.form.clientDetails')}</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'secondary.main', fontWeight: 'bold' }}>{contract?.client?.name?.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{contract?.client?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{contract?.client?.email}</Typography>
                      <Typography variant="caption" color="text.disabled">{contract?.client?.phone}</Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid xs={12} sm={6}>
                  <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>{t('task.details.propertyInfo')}</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ p: 1, borderRadius: 1, bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main', display: 'flex' }}>
                      <Iconify icon="solar:home-bold" width={24} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{contract?.property?.propertyName}</Typography>
                      <Typography variant="body2" color="text.secondary">{contract?.property?.location?.address || contract?.property?.address}</Typography>
                      {contract?.property?.location?.coordinates && (
                        <Typography variant="caption" color="primary.main" sx={{ display: 'block', mt: 0.5, fontWeight: 'bold' }}>
                          <Iconify icon="solar:map-point-bold" width={12} sx={{ mr: 0.5 }} />
                          {contract.property.location.coordinates[1]}, {contract.property.location.coordinates[0]}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.disabled">{contract?.property?.sizeSqm} sqm • {contract?.property?.propertyType}</Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        {/* Employee Breakdown */}
        <Grid xs={12} md={4}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardHeader 
              title={t('report.details.employeeParticipation')}
              avatar={
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main', display: 'flex' }}>
                  <Iconify icon="solar:users-group-rounded-bold" width={20} />
                </Box>
              }
            />
            <Divider />
            <Scrollbar sx={{ maxHeight: 400 }}>
              <Stack spacing={2.5} sx={{ p: 3 }}>
                {employeeBreakdown?.map((item) => (
                  <Stack key={item._id} direction="row" alignItems="center" spacing={2}>
                    <Avatar src={item.employee?.employeeProfile?.profileImage?.fileUrl} sx={{ width: 44, height: 44, border: `2px solid ${theme.palette.background.neutral}` }}>
                      {item.employee?.firstName?.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>{item.employee?.firstName} {item.employee?.lastName}</Typography>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                        {item.employee?.employeeProfile?.jobPosition} • {item.totalTasks} {t('task.title')}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 'bold' }}>
                        {fSecondsToDuration(item.totalTimeSeconds)}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Scrollbar>
          </Card>
        </Grid>

        {/* Subtask Gallery */}
        <Grid xs={12}>
          <Card sx={{ borderRadius: 2 }}>
            <CardHeader 
              title={t('report.details.evidence')}
              avatar={
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', display: 'flex' }}>
                  <Iconify icon="solar:gallery-bold" width={20} />
                </Box>
              }
            />
            <Divider />
            <Box sx={{ p: 3 }}>
              <Stack spacing={3}>
                {completedSubTasks?.map((sub) => (
                  <Paper 
                    key={sub._id} 
                    variant="outlined" 
                    sx={{ 
                      p: 2.5, 
                      borderRadius: 2, 
                      bgcolor: alpha(theme.palette.grey[500], 0.02),
                      border: `1px solid ${alpha(theme.palette.divider, 0.8)}`
                    }}
                  >
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                          {sub.subTaskId?.subTaskName}
                        </Typography>
                        <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
                          <Label color="success" variant="soft" startIcon={<Iconify icon="solar:clock-circle-bold" />}>
                            {fSecondsToDuration(sub.timeSeconds)}
                          </Label>
                          {sub.subTaskId?.subtaskPrice > 0 && (
                             <Label color="info" variant="soft">
                               {fCurrency(sub.subTaskId.subtaskPrice)}
                             </Label>
                          )}
                        </Stack>
                      </Box>
                      <IconButton 
                        onClick={() => handleOpenEdit(sub)}
                        sx={{ bgcolor: 'background.paper', boxShadow: theme.customShadows.z8 }}
                      >
                        <Iconify icon="solar:pen-bold" width={18} />
                      </IconButton>
                    </Stack>

                    <Box sx={{ mb: 4, p: 2, borderRadius: 1.5, bgcolor: 'background.neutral', borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{t('report.details.comments')}</Typography>
                      <Typography variant="body2" sx={{ fontStyle: (sub.afterWorkImagesdescription || sub.subTaskId?.afterWorkImagesdescription) ? 'normal' : 'italic' }}>
                        {sub.afterWorkImagesdescription || sub.subTaskId?.afterWorkImagesdescription || t('report.details.noComments')}
                      </Typography>
                    </Box>

                    <Grid container spacing={4}>
                      <Grid xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Iconify icon="solar:camera-bold" width={18} color="warning.main" />
                          {t('report.details.beforeWork')}
                        </Typography>
                        <ImageList cols={3} gap={12}>
                          {sub.subTaskId?.beforeWorkImages?.map((img) => (
                            <ImageListItem key={img._id} sx={{ borderRadius: 1.5, overflow: 'hidden', boxShadow: theme.customShadows.z4 }}>
                              <img src={`${CONFIG.site.serverUrl}/${img.url}`} alt="Before" loading="lazy" style={{ height: 140, objectFit: 'cover' }} />
                            </ImageListItem>
                          ))}
                          {(!sub.subTaskId?.beforeWorkImages || sub.subTaskId.beforeWorkImages.length === 0) && (
                            <Typography variant="caption" color="text.disabled">{t('report.details.noImages')}</Typography>
                          )}
                        </ImageList>
                      </Grid>

                      <Grid xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Iconify icon="solar:camera-bold" width={18} color="success.main" />
                          {t('report.details.afterWork')}
                        </Typography>
                        <ImageList cols={3} gap={12}>
                          {sub.subTaskId?.afterWorkImages?.map((img) => (
                            <ImageListItem key={img._id} sx={{ borderRadius: 1.5, overflow: 'hidden', boxShadow: theme.customShadows.z4 }}>
                              <img src={`${CONFIG.site.serverUrl}/${img.url}`} alt="After" loading="lazy" style={{ height: 140, objectFit: 'cover' }} />
                            </ImageListItem>
                          ))}
                           {(!sub.subTaskId?.afterWorkImages || sub.subTaskId.afterWorkImages.length === 0) && (
                            <Typography variant="caption" color="text.disabled">{t('report.details.noImages')}</Typography>
                          )}
                        </ImageList>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Description Dialog */}
      <Dialog open={editDialog.open} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pb: 2 }}>{t('report.details.editDescription')}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={t('report.details.comments')}
            value={editDialog.description}
            onChange={(e) => setEditDialog({ ...editDialog, description: e.target.value })}
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseEdit} color="inherit" variant="outlined" sx={{ borderRadius: 1 }}>
            {t('common.cancel') || 'Cancel'}
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleSaveDescription}
            loading={isUpdating}
            sx={{ borderRadius: 1 }}
          >
            {t('common.save') || 'Save Changes'}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function StatCard({ icon, color, label, value, caption, sx }) {
  const theme = useTheme();
  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 3, 
        textAlign: 'center', 
        borderRadius: 2,
        bgcolor: alpha(theme.palette[color].main, 0.02),
        borderColor: alpha(theme.palette[color].main, 0.1),
        transition: 'all 0.3s',
        '&:hover': {
          bgcolor: alpha(theme.palette[color].main, 0.05),
          boxShadow: theme.customShadows[color],
          transform: 'translateY(-4px)'
        },
        ...sx
      }}
    >
      <Box 
        sx={{ 
          width: 48, 
          height: 48, 
          borderRadius: '50%', 
          bgcolor: alpha(theme.palette[color].main, 0.1), 
          color: `${color}.main`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2
        }}
      >
        <Iconify icon={icon} width={24} />
      </Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.65rem' }}>
        {label}
      </Typography>
      <Typography variant="h3" sx={{ fontWeight: 800 }}>{value}</Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
        {caption}
      </Typography>
    </Paper>
  );
}

function DetailItem({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
        {value || '-'}
      </Typography>
    </Box>
  );
}
