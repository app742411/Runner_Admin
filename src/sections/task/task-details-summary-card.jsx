import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
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
        </Stack>
      </Grid>
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
