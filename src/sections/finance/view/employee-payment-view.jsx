import { useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { Stack, Container, Typography, Switch, FormControlLabel, TableRow, TableCell, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { Breadcrumbs, Link, Box } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Grid, Dialog, DialogTitle, DialogContent, Divider } from '@mui/material';
import {
  TableHead,
  TablePagination,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SearchNotFound } from 'src/components/search-not-found';

import { useEmployeePayments } from 'src/features/employee/useEmployees';
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'employee', label: 'employee_payment.table.employee' },
  { id: 'contract', label: 'employee_payment.table.contract' },
  { id: 'paymentType', label: 'employee_payment.table.type' },
  { id: 'totalTasks', label: 'employee_payment.table.tasks' },
  { id: 'totalTime', label: 'employee_payment.table.time' },
  { id: 'amount', label: 'employee_payment.table.amount' },
  { id: 'status', label: 'employee_payment.table.status' },
  { id: 'date', label: 'employee_payment.table.date' },
  { id: '' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'employee_payment.status.all' },
  { value: 'pending', label: 'employee_payment.status.pending' },
  { value: 'paid', label: 'employee_payment.status.paid' },
  { value: 'cancelled', label: 'employee_payment.status.cancelled' },
];

// ----------------------------------------------------------------------

import { EmployeePaymentToolbar } from '../employee-payment-toolbar';

// ----------------------------------------------------------------------

export default function EmployeePaymentView() {
  const { t } = useTranslation();
  const router = useRouter();
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dense, setDense] = useState(false);

  const [filters, setFilters] = useState({
    name: '',
    startDate: '',
    endDate: '',
    status: 'all',
    groupByEmployee: true,
  });

  const { data, isLoading } = useEmployeePayments({
    ...filters,
    status: filters.status === 'all' ? undefined : filters.status,
    page: page + 1,
    limit: rowsPerPage,
  });

  const payments = data?.data || [];
  const summary = data?.summary || { totalAmount: 0, totalPaid: 0, totalPending: 0 };
  const employeeSummary = data?.employeeSummary || [];
  const totalRows = data?.pagination?.total || payments.length;

  const [selectedRow, setSelectedRow] = useState(null);
  const detailsOpen = useBoolean();

  const handleFilters = useCallback(
    (name, value) => {
      setPage(0);
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    []
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <DashboardContent maxWidth={false}>
      <Container maxWidth={false}>
        <Stack spacing={1} sx={{ mb: { xs: 3, md: 5 } }}>
          <Typography variant="h4">{t('employee_payment.title')}</Typography>
          <Breadcrumbs
            separator={
              <Box
                component="span"
                sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
              />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.root)} sx={{ cursor: 'pointer' }}>
              {t('common.dashboard')}
            </Link>
            <Link color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
              {t('nav.finance_group')}
            </Link>
            <Typography color="text.primary">{t('employee_payment.title')}</Typography>
          </Breadcrumbs>
        </Stack>

        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} md={4}>
            <SummaryCard title={t('employee_payment.totalAmount')} value={summary.totalAmount} color="info" />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard title={t('employee_payment.totalPaid')} value={summary.totalPaid} color="success" />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard title={t('employee_payment.totalPending')} value={summary.totalPending} color="warning" />
          </Grid>
        </Grid>

        {employeeSummary.length > 0 && (
          <Card sx={{ mb: 5, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>{t('employee_payment.summaryByEmployee')}</Typography>
            <Scrollbar>
              <Stack direction="row" spacing={3}>
                {employeeSummary.map((emp) => (
                  <Stack 
                    key={emp._id} 
                    spacing={1} 
                    sx={{ 
                      p: 2, 
                      minWidth: 200, 
                      borderRadius: 1.5, 
                      bgcolor: 'background.neutral',
                      border: (theme) => `dashed 1px ${theme.palette.divider}`
                    }}
                  >
                    <Typography variant="subtitle2" noWrap>{emp.name}</Typography>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t('employee_payment.table.amount')}</Typography>
                      <Typography variant="subtitle2">{fCurrency(emp.totalAmount)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t('employee_payment.table.tasks')}</Typography>
                      <Typography variant="subtitle2">{emp.totalTasks}</Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Scrollbar>
          </Card>
        )}

        <Card>
          <EmployeePaymentToolbar
            filters={filters}
            onFilters={handleFilters}
            statusOptions={STATUS_OPTIONS}
          />

          <Stack sx={{ px: 2.5, pb: 2.5 }}>
            {/* <FormControlLabel
              control={
                <Switch
                  checked={filters.groupByEmployee}
                  onChange={(e) => handleFilters('groupByEmployee', e.target.checked)}
                />
              }
              label="Group by Employee"
            /> */}
          </Stack>

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHead sx={{ bgcolor: 'background.neutral' }}>
                  <TableRow>
                    {TABLE_HEAD.map((headCell) => (
                      <TableCell key={headCell.id} align={headCell.align || 'left'} sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                        {headCell.label ? t(headCell.label) : ''}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 10 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((row) => (
                      <PaymentTableRow 
                        key={row._id} 
                        row={row} 
                        onView={() => {
                          setSelectedRow(row);
                          detailsOpen.onTrue();
                        }}
                      />
                    ))
                  )}

                  {!isLoading && !payments.length && (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <SearchNotFound query={filters.name} />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        
        <FormControlLabel
          control={<Switch checked={dense} onChange={(e) => setDense(e.target.checked)} />}
          label={t('common.dense')}
          sx={{ px: 3, py: 2 }}
        />

        <PaymentDetailsDialog 
          open={detailsOpen.value} 
          onClose={detailsOpen.onFalse} 
          row={selectedRow} 
        />
      </Container>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function SummaryCard({ title, value, color }) {
  return (
    <Card sx={{ p: 3, textAlign: 'center', bgcolor: `${color}.lighter`, color: `${color}.darker` }}>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {title}
      </Typography>
      <Typography variant="h3">{fCurrency(value)}</Typography>
    </Card>
  );
}

// ----------------------------------------------------------------------

function PaymentTableRow({ row, onView }) {
  const { t } = useTranslation();
  const { employee, contract, paymentType, totalTasks, totalTimeSeconds, status, createdAt, amount } = row;

  return (
    <TableRow hover onClick={onView} sx={{ cursor: 'pointer' }}>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'background.neutral',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon="solar:user-bold" />
          </Box>
          <Box>
            <Typography variant="subtitle2" noWrap>
              {employee ? `${employee.firstName} ${employee.lastName}` : t('group.details.na')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {employee?.email}
            </Typography>
          </Box>
        </Stack>
      </TableCell>

      <TableCell>{contract?.contractNumber || t('group.details.na')}</TableCell>
      
      <TableCell>
        <Label variant="soft" color="default">
          {paymentType?.replace('_', ' ')}
        </Label>
      </TableCell>

      <TableCell>{totalTasks || 0}</TableCell>

      <TableCell>{Math.floor((totalTimeSeconds || 0) / 60)}{t('employee_payment.details.minutes').charAt(0)}</TableCell>

      <TableCell>{fCurrency(amount)}</TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'paid' && 'success') ||
            (status === 'pending' && 'warning') ||
            (status === 'cancelled' && 'error') ||
            'default'
          }
        >
          {t(`employee_payment.status.${status}`)}
        </Label>
      </TableCell>

      <TableCell>{fDate(createdAt)}</TableCell>

      <TableCell align="right">
        <IconButton onClick={onView}>
          <Iconify icon="eva:eye-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

// ----------------------------------------------------------------------

function PaymentDetailsDialog({ open, onClose, row }) {
  const { t } = useTranslation();
  if (!row) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('employee_payment.paymentDetails')}</DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2">{t('employee_payment.details.employee')}</Typography>
            <Typography variant="body2">{`${row.employee.firstName} ${row.employee.lastName}`}</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2">{t('employee_payment.details.contract')}</Typography>
            <Typography variant="body2">{row.contract?.contractNumber}</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2">{t('employee_payment.details.paymentType')}</Typography>
            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{row.paymentType?.replace('_', ' ')}</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2">{t('employee_payment.details.totalTasks')}</Typography>
            <Typography variant="body2">{row.totalTasks}</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2">{t('employee_payment.details.totalTime')}</Typography>
            <Typography variant="body2">{Math.floor(row.totalTimeSeconds / 60)} {t('employee_payment.details.minutes')}</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2">{t('employee_payment.details.amount')}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{fCurrency(row.amount)}</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2">{t('employee_payment.details.status')}</Typography>
            <Label
              variant="soft"
              color={
                (row.status === 'paid' && 'success') ||
                (row.status === 'pending' && 'warning') ||
                (row.status === 'cancelled' && 'error') ||
                'default'
              }
            >
              {t(`employee_payment.status.${row.status}`)}
            </Label>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2">{t('employee_payment.details.createdAt')}</Typography>
            <Typography variant="body2">{fDate(row.createdAt)}</Typography>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

