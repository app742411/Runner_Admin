import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { LoadingButton } from '@mui/lab';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import axiosInstance from 'src/utils/axios';
import { companyAdminApi } from 'src/store/api/company-admin.api';
import { toast } from 'react-hot-toast';
import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

export default function TaskDetailsSummaryCard({
  task,
  t
}) {
  const theme = useTheme();

  // Handle data mapping from root or nested taskDetails
  const taskDetail = task?.taskDetails || task || {};
  const {
    property,
    assignedBy,
    createdAt,
    updatedAt,
    taskName,
    taskCategory,
    taskSubCategory,
    description,
    company,
    contract,
    client,
    taskPrice
  } = { ...task, ...taskDetail };
  const status = task?.status || taskDetail?.status;

  const allSubTasks = task?.subTasks || [];
  const allExtraExpenses = allSubTasks.flatMap((st) => (st.extraExpenses || []).map((exp) => ({ ...exp, subTaskId: st._id, subTaskName: st.subTaskName })));

  const user = useSelector((state) => state.auth.user);

  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectingSubTaskId, setRejectingSubTaskId] = useState('');
  const [rejectingExpenseId, setRejectingExpenseId] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);

  const handleOpenReject = (subTaskId, expenseId) => {
    setRejectingSubTaskId(subTaskId);
    setRejectingExpenseId(expenseId);
    setRejectionReason('');
    setOpenRejectDialog(true);
  };

  const handleApproveExpense = async (subTaskId, expenseId) => {
    try {
      await companyAdminApi.updateExpenseStatus(subTaskId, expenseId, {
        status: 'approved'
      });
      toast.success('Expense approved successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Failed to approve expense';
      toast.error(errMsg);
    }
  };

  const handleRejectExpense = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }
    setIsSubmittingRejection(true);
    try {
      await companyAdminApi.updateExpenseStatus(rejectingSubTaskId, rejectingExpenseId, {
        status: 'rejected',
        rejectionReason: rejectionReason
      });
      toast.success('Expense rejected successfully!');
      setOpenRejectDialog(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Failed to reject expense';
      toast.error(errMsg);
    } finally {
      setIsSubmittingRejection(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          {/* ─── Property Details ─── */}
          <Card sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: `1px dashed ${theme.palette.divider}` }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    display: 'flex',
                    borderRadius: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                >
                  <Iconify icon="solar:home-bold" width={18} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t('task.details.propertyInfo') || 'Property Information'}</Typography>
              </Stack>
            </Box>

            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <DetailItem icon="solar:home-2-bold" label={t('task.details.propertyName')} value={property?.propertyName} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem icon="solar:map-point-bold" label={t('task.details.address')} value={property?.address} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem icon="solar:home-bold" label={t('contract.form.propertyType')} value={property?.propertyType} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem icon="solar:user-bold" label={t('task.details.assignBy')} value={assignedBy?.name} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem icon="solar:calendar-bold" label={t('task.details.createdAt')} value={fDateTime(createdAt)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem
                    icon="solar:calendar-bold"
                    label={status === 'completed' ? (t('task.details.completedAt') || 'Completed At') : (t('task.details.updatedAt') || 'Updated At')}
                    value={fDateTime(updatedAt)}
                  />
                </Grid>
              </Grid>
            </Box>
          </Card>

          {/* ─── Client Details ─── */}
          <Card sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.04), borderBottom: `1px dashed ${theme.palette.divider}` }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    display: 'flex',
                    borderRadius: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                  }}
                >
                  <Iconify icon="solar:user-speak-bold" width={18} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t('contract.form.clientDetails')}</Typography>
              </Stack>
            </Box>

            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <DetailItem icon="solar:user-bold" label={t('contract.form.name')} value={client?.name?.trim() || client?.email?.split('@')[0]} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem icon="solar:letter-bold" label={t('contract.form.email')} value={client?.email} />
                </Grid>
              </Grid>
            </Box>
          </Card>

          {/* ─── Job Description ─── */}
          <Card sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.secondary.main, 0.04), borderBottom: `1px dashed ${theme.palette.divider}` }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    display: 'flex',
                    borderRadius: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.main,
                  }}
                >
                  <Iconify icon="solar:document-text-bold" width={18} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t('task.details.jobDescription')}</Typography>
              </Stack>
            </Box>

            <Box sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{taskName}</Typography>
                <Label variant="soft" color="info">{taskCategory}</Label>
                <Label variant="soft" color="secondary">{taskSubCategory}</Label>
              </Stack>

              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                {description || taskDetail?.taskDescription || '-'}
              </Typography>
            </Box>
          </Card>
        </Stack>
      </Grid>

      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          {/* ─── Financial Summary ─── */}
          <Card sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.04), borderBottom: `1px dashed ${theme.palette.divider}` }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    display: 'flex',
                    borderRadius: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                  }}
                >
                  <Iconify icon="solar:bill-list-bold" width={18} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t('task.details.summary') || 'Task Summary'}</Typography>
              </Stack>
            </Box>

            <Stack spacing={2.5} sx={{ p: 3 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{t('task.table.company')}</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{company?.companyName || '-'}</Typography>
              </Box>

              {contract && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{t('task.details.contractNumber')}</Typography>
                  <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    {contract.contractNumber || '-'}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ borderStyle: 'dashed' }} />

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{t('task.details.workPrice')}</Typography>
                <Typography variant="h3" color="error.main" sx={{ fontWeight: 'bold' }}>
                  {fCurrency(taskPrice)}
                </Typography>
              </Box>

              <Divider sx={{ borderStyle: 'dashed' }} />

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>{t('task.details.assignBy')}</Typography>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'background.neutral' }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: theme.palette.info.main, fontWeight: 'bold' }}>
                    {assignedBy?.name?.charAt(0)}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>{assignedBy?.name}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>{assignedBy?.email}</Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Card>

          {/* ─── Extra Expenses Card ─── */}
          {allExtraExpenses.length > 0 && (
            <Card sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.04), borderBottom: `1px dashed ${theme.palette.divider}` }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      display: 'flex',
                      borderRadius: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main,
                    }}
                  >
                    <Iconify icon="solar:bill-list-bold" width={18} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Extra Expenses ({allExtraExpenses.length})</Typography>
                </Stack>
              </Box>

              <Stack spacing={2} sx={{ p: 3 }}>
                {allExtraExpenses.map((expense) => (
                  <Box key={expense._id} sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.neutral' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {expense.receiptImage && (
                        <Box
                          component="img"
                          src={expense.receiptImage.startsWith('http') ? expense.receiptImage : `${import.meta.env.VITE_SERVER_URL}/${expense.receiptImage}`}
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: 1,
                            objectFit: 'cover',
                            border: `1px solid ${theme.palette.divider}`,
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            const url = expense.receiptImage.startsWith('http') ? expense.receiptImage : `${import.meta.env.VITE_SERVER_URL}/${expense.receiptImage}`;
                            window.open(url, '_blank');
                          }}
                        />
                      )}
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>
                          {expense.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                          Subtask: {expense.subTaskName}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                          Status: <span style={{ textTransform: 'capitalize', fontWeight: 'bold', color: expense.status === 'approved' ? 'green' : expense.status === 'rejected' ? 'red' : 'orange' }}>{expense.status}</span>
                        </Typography>
                        {(user?.role === 'company_admin' || user?.role === 'superAdmin' || user?.role === 'group_admin') && expense.status === 'pending' && (
                          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleApproveExpense(expense.subTaskId, expense._id)}
                              sx={{ py: 0.2, px: 1, fontSize: '0.65rem', fontWeight: 'bold', minWidth: 0 }}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => handleOpenReject(expense.subTaskId, expense._id)}
                              sx={{ py: 0.2, px: 1, fontSize: '0.65rem', fontWeight: 'bold', minWidth: 0 }}
                            >
                              Reject
                            </Button>
                          </Stack>
                        )}
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                        {fCurrency(expense.amount)}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Card>
          )}
        </Stack>
      </Grid>

      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold' }}>Reject Expense</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason"
            placeholder="e.g., Receipt image is unclear"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" color="inherit" onClick={() => setOpenRejectDialog(false)}>
            Cancel
          </Button>
          <LoadingButton variant="contained" color="error" loading={isSubmittingRejection} onClick={handleRejectExpense}>
            Reject
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

// ----------------------------------------------------------------------

function DetailItem({ icon, label, value }) {
  const theme = useTheme();
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      {icon && (
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 0.5
          }}
        >
          <Iconify icon={icon} width={16} />
        </Box>
      )}
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mb: 0.5, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 0.5, fontSize: '0.65rem' }}
        >
          {label}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {value || '-'}
        </Typography>
      </Box>
    </Stack>
  );
}

TaskDetailsSummaryCard.propTypes = {
  task: PropTypes.object,
  t: PropTypes.func,
};
