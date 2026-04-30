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
import { useInvoice } from 'src/features/invoice/useInvoices';

// ----------------------------------------------------------------------

export function InvoiceDetailsView({ id }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const { data: invoice, isLoading, error } = useInvoice(id);

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
        <Typography variant="h5">Invoice not found</Typography>
      </Box>
    );
  }

  const {
    invoiceNumber,
    createdAt,
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
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Invoice Details</Typography>
          <Breadcrumbs
            separator={<Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />}
          >
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.root)} sx={{ cursor: 'pointer' }}>
              Dashboard
            </Link>
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.invoice.root)} sx={{ cursor: 'pointer' }}>
              Invoices
            </Link>
            <Typography color="text.disabled">{invoiceNumber}</Typography>
          </Breadcrumbs>
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
          >
            Print
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ bgcolor: '#00334e' }}
            startIcon={<Iconify icon="solar:download-bold" />}
          >
            Download PDF
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {/* ─── Summary Cards ─── */}
        <Grid xs={12} md={4}>
          <SummaryCard
            title="Total Amount"
            value={fCurrency(amount)}
            icon="solar:bill-list-bold"
            color="primary"
          />
        </Grid>
        <Grid xs={12} md={4}>
          <SummaryCard
            title="Paid Amount"
            value={fCurrency(paidAmount)}
            icon="solar:check-circle-bold"
            color="success"
          />
        </Grid>
        <Grid xs={12} md={4}>
          <SummaryCard
            title="Remaining Balance"
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
                    Bill From
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
                    Bill To
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
                    label="Contract Number" 
                    value={contract?.contractNumber} 
                    icon="solar:document-bold"
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <DetailItem 
                    label="Billing Type" 
                    value={billingType} 
                    icon="solar:tag-bold"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Grid>

                <Grid xs={12} sm={6}>
                  <DetailItem 
                    label="Issue Date" 
                    value={fDate(createdAt)} 
                    icon="solar:calendar-bold"
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <DetailItem 
                    label="Due Date" 
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
                      <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
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
                  <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                  <Typography variant="subtitle2">{fCurrency(amount)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Discount</Typography>
                  <Typography variant="subtitle2" color="error.main">-</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6">Total</Typography>
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
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>Timeline</Typography>
              <Stack spacing={2}>
                <TimelineItem 
                  label="Invoice Created" 
                  time={fDateTime(createdAt)} 
                  active 
                />
                <TimelineItem 
                  label="Invoice Sent" 
                  time={invoice.sentAt ? fDateTime(invoice.sentAt) : 'Pending'} 
                  active={!!invoice.sentAt} 
                />
                <TimelineItem 
                  label="Payment Received" 
                  time={paidAmount > 0 ? 'Recorded' : 'Awaiting Payment'} 
                  active={paidAmount > 0} 
                />
              </Stack>
            </Card>

            <Card sx={{ p: 3, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), border: `1px dashed ${theme.palette.primary.main}` }}>
              <Stack spacing={2} alignItems="center" textAlign="center">
                <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: 'primary.main', color: 'white' }}>
                  <Iconify icon="solar:info-circle-bold" width={24} />
                </Box>
                <Typography variant="subtitle2">Note</Typography>
                <Typography variant="body2" color="text.secondary">
                  Please ensure payment is made by the due date to avoid any service interruptions. Thank you for your business!
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
