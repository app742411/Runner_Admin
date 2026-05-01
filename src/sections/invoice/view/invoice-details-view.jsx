import { useState, useCallback } from 'react';
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
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { alpha, useTheme } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { fDateTime, fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-hot-toast';
import { useInvoice, useSendInvoice } from 'src/features/invoice/useInvoices';

// ----------------------------------------------------------------------

export function InvoiceDetailsView({ id }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const { data: invoice, isLoading, error } = useInvoice(id);
  const sendInvoice = useSendInvoice();

  const handleSendInvoice = useCallback(async () => {
    try {
      await sendInvoice.mutateAsync(id);
      toast.success(t('invoice.send_success'));
    } catch (error) {
      toast.error(t('invoice.send_error'));
    }
  }, [id, sendInvoice, t]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !invoice) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h5">{t('invoice.not_found')}</Typography>
      </Box>
    );
  }

  const {
    invoiceNumber,
    createdAt,
    updatedAt,
    sentAt,
    dueDate,
    status,
    amount,
    paidAmount,
    remainingAmount,
    billingType,
    client,
    contract,
    company,
  } = invoice;

  return (
    <DashboardContent maxWidth={false}>
      {/* ─── Header ─── */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: { xs: 3, md: 5 } }}>
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{t('invoice.details.title')}</Typography>
          <Breadcrumbs
            separator={<Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />}
          >
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.root)} sx={{ cursor: 'pointer' }}>
              {t('common.dashboard')}
            </Link>
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.invoice.root)} sx={{ cursor: 'pointer' }}>
              {t('nav.invoice')}
            </Link>
            <Typography color="text.disabled">{invoiceNumber}</Typography>
          </Breadcrumbs>
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <LoadingButton
            variant="contained"
            color="success"
            loading={sendInvoice.isPending}
            onClick={handleSendInvoice}
            startIcon={<Iconify icon="solar:paper-plane-bold" />}
            sx={{ borderRadius: 1.5 }}
          >
            {t('invoice.send_invoice')}
          </LoadingButton>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
            sx={{ borderRadius: 1.5 }}
          >
            {t('common.print')}
          </Button>

          <Button
            variant="contained"
            color="primary"
            sx={{ bgcolor: '#00334e', borderRadius: 1.5 }}
            startIcon={<Iconify icon="solar:download-bold" />}
          >
            {t('common.download_pdf')}
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {/* ─── Summary Cards ─── */}
        <Grid xs={12} md={4}>
          <SummaryCard
            title={t('invoice.total_amount')}
            value={fCurrency(amount)}
            icon="solar:bill-list-bold"
            color="primary"
          />
        </Grid>
        <Grid xs={12} md={4}>
          <SummaryCard
            title={t('invoice.paid_amount')}
            value={fCurrency(paidAmount)}
            icon="solar:check-circle-bold"
            color="success"
          />
        </Grid>
        <Grid xs={12} md={4}>
          <SummaryCard
            title={t('invoice.remaining_balance')}
            value={fCurrency(remainingAmount)}
            icon="solar:clock-circle-bold"
            color="warning"
          />
        </Grid>

        {/* ─── Main Content ─── */}
        <Grid xs={12} md={8}>
          <Card sx={{ borderRadius: 2 }}>
            <CardHeader
              title={`Invoice ${invoiceNumber}`}
              action={
                <Label
                  variant="soft"
                  color={
                    (status === 'paid' && 'success') ||
                    (status === 'sent' && 'info') ||
                    (status === 'overdue' && 'error') ||
                    'default'
                  }
                >
                  {status?.toUpperCase()}
                </Label>
              }
            />
            <Divider />
            
            <Box sx={{ p: 3 }}>
              <Grid container spacing={4}>
                {/* Billing Info */}
                <Grid xs={12} sm={6}>
                  <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                    {t('invoice.bill_from')}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                      <Iconify icon="solar:buildings-bold" width={24} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Company Admin</Typography>
                      <Typography variant="caption" color="text.secondary">ID: {company?._id}</Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid xs={12} sm={6}>
                  <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                    {t('invoice.bill_to')}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48 }}>
                      {client?.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{client?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{client?.email}</Typography>
                      <Typography variant="caption" color="text.disabled">{client?.phone}</Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid xs={12}><Divider sx={{ borderStyle: 'dashed' }} /></Grid>

                {/* Contract Info */}
                <Grid xs={12} sm={6}>
                  <DetailItem 
                    label={t('invoice.contract_number')} 
                    value={contract?.contractNumber} 
                    icon="solar:document-bold"
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <DetailItem 
                    label={t('invoice.billing_type')} 
                    value={billingType?.replace(/_/g, ' ')} 
                    icon="solar:tag-bold"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Grid>

                <Grid xs={12} sm={6}>
                  <DetailItem 
                    label={t('invoice.issue_date')} 
                    value={fDate(createdAt)} 
                    icon="solar:calendar-bold"
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <DetailItem 
                    label={t('invoice.due_date')} 
                    value={fDate(dueDate)} 
                    icon="solar:calendar-bold"
                    color="error.main"
                  />
                </Grid>
              </Grid>
            </Box>

            <TableContainer sx={{ overflow: 'unset', mt: 3 }}>
              <Scrollbar>
                <Table sx={{ minWidth: 640 }}>
                  <TableBody>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.grey[500], 0.04) }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>{t('common.description')}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('common.total')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2">Services for Contract {contract?.contractNumber}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Billing Period: {fDate(contract?.startDate)} - {fDate(contract?.endDate)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{fCurrency(amount)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <Divider />

            <Box sx={{ p: 3, textAlign: 'right', ml: 'auto', width: { xs: 1, sm: 0.5 } }}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">{t('invoice.subtotal')}</Typography>
                  <Typography variant="subtitle2">{fCurrency(amount)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">{t('invoice.discount')}</Typography>
                  <Typography variant="subtitle2" color="error.main">-</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6">{t('common.total')}</Typography>
                  <Typography variant="h6">{fCurrency(amount)}</Typography>
                </Stack>
              </Stack>
            </Box>
          </Card>
        </Grid>

        {/* ─── Side Info ─── */}
        <Grid xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>{t('invoice.timeline')}</Typography>
              <Stack spacing={2}>
                <TimelineItem 
                  label={t('invoice.created')} 
                  time={fDateTime(createdAt)} 
                  active 
                />
                <TimelineItem 
                  label={t('invoice.sent')} 
                  time={sentAt ? fDateTime(sentAt) : t('invoice.pending')} 
                  active={!!sentAt} 
                />
                {updatedAt && updatedAt !== createdAt && (
                  <TimelineItem 
                    label={t('report.details.updatedAt')} 
                    time={fDateTime(updatedAt)} 
                    active 
                  />
                )}
                <TimelineItem 
                  label={t('invoice.payment_received')} 
                  time={paidAmount > 0 ? t('invoice.recorded') : t('invoice.awaiting_payment')} 
                  active={paidAmount > 0} 
                />
              </Stack>
            </Card>

            <Card sx={{ p: 3, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), border: `1px dashed ${theme.palette.primary.main}` }}>
              <Stack spacing={2} alignItems="center" textAlign="center">
                <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: 'primary.main', color: 'white' }}>
                  <Iconify icon="solar:info-circle-bold" width={24} />
                </Box>
                <Typography variant="subtitle2">{t('common.note')}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('invoice.note_text')}
                </Typography>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function SummaryCard({ title, value, icon, color }) {
  const theme = useTheme();
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        bgcolor: alpha(theme.palette[color].main, 0.02),
        borderColor: alpha(theme.palette[color].main, 0.1),
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 1.5,
          bgcolor: alpha(theme.palette[color].main, 0.1),
          color: `${color}.main`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2,
        }}
      >
        <Iconify icon={icon} width={24} />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>{value}</Typography>
      </Box>
    </Paper>
  );
}

function DetailItem({ label, value, icon, color, sx }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Iconify icon={icon} width={20} sx={{ color: 'text.disabled' }} />
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {label}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: color || 'text.primary', ...sx }}>
          {value || '-'}
        </Typography>
      </Box>
    </Stack>
  );
}

function TimelineItem({ label, time, active }) {
  return (
    <Stack direction="row" spacing={2}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ 
          width: 12, 
          height: 12, 
          borderRadius: '50%', 
          bgcolor: active ? 'primary.main' : 'text.disabled',
          border: (theme) => `2px solid ${theme.palette.background.paper}`,
          boxShadow: (theme) => `0 0 0 2px ${active ? alpha(theme.palette.primary.main, 0.2) : 'transparent'}`,
          zIndex: 1
        }} />
        <Box sx={{ flexGrow: 1, width: 2, bgcolor: 'divider', my: 0.5 }} />
      </Box>
      <Box sx={{ pb: 2 }}>
        <Typography variant="subtitle2" sx={{ color: active ? 'text.primary' : 'text.disabled' }}>{label}</Typography>
        <Typography variant="caption" color="text.disabled">{time}</Typography>
      </Box>
    </Stack>
  );
}
