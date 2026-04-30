import { useState, useCallback, useMemo } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Scrollbar } from 'src/components/scrollbar';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { SearchNotFound } from 'src/components/search-not-found';

import { usePlans, useDeletePlan, useTogglePlanStatus } from 'src/features/plan/usePlans';
import toast from 'react-hot-toast';
import { SubscriptionTableRow } from '../subscription-table-row';
import { SubscriptionTableToolbar } from '../subscription-table-toolbar';

// ----------------------------------------------------------------------

export function SubscriptionListView() {
  const { t } = useTranslation();
  const router = useRouter();

  const TABLE_HEAD = useMemo(() => [
    { id: 'planName', label: t('subscription.table.planName') },
    { id: 'sequence', label: t('subscription.table.sequence') },
    { id: 'employeeLimit', label: t('subscription.table.employeeLimit') },
    { id: 'monthlyPrice', label: t('subscription.table.monthlyPrice') },
    { id: 'annualPrice', label: t('subscription.table.annualPrice') },
    { id: 'status', label: t('subscription.table.status') },
    { id: 'features', label: t('subscription.table.features') },
    { id: '', label: t('subscription.table.action'), align: 'right' },
  ], [t]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    status: 'all',
  });

  const { data, isLoading } = usePlans({
    search: filters.name,
    status: filters.status !== 'all' ? filters.status : undefined,
    page: page + 1,
    limit: rowsPerPage,
  });

  const tableData = data?.data || [];
  const totalRows = data?.pagination?.total || tableData.length;

  const { mutate: deletePlan } = useDeletePlan();
  const { mutate: togglePlanStatus } = useTogglePlanStatus();

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.subscription.edit(id));
    },
    [router]
  );

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await deletePlan(id);
        toast.success(t('common.deleteSuccess') || 'Delete success!');
      } catch (error) {
        console.error(error);
        toast.error(t('common.error') || 'Something went wrong!');
      }
    },
    [deletePlan, t]
  );

  const handleToggleStatus = useCallback(
    async (id) => {
      try {
        await togglePlanStatus(id);
        toast.success(t('common.updateSuccess') || 'Status updated!');
      } catch (error) {
        console.error(error);
        toast.error(t('common.error') || 'Failed to update status!');
      }
    },
    [togglePlanStatus, t]
  );

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setPage(0);
  }, []);

  const handleSelectAllRows = (checked) => {
    if (checked) {
      setSelected(tableData.map((n) => n._id));
      return;
    }
    setSelected([]);
  };

  const handleSelectRow = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const notFound = !tableData.length && !isLoading;

  return (
    <DashboardContent maxWidth={false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Stack spacing={1}>
          <Typography variant="h4">{t('subscription.list')}</Typography>
          <Breadcrumbs
            separator={
              <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.root)} sx={{ cursor: 'pointer' }}>{t('common.dashboard')}</Link>
            <Link color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>{t('nav.subscription')}</Link>
            <Typography color="text.primary">{t('common.list') || 'List'}</Typography>
          </Breadcrumbs>
        </Stack>

        <Button
          variant="contained"
          onClick={() => router.push(paths.dashboard.subscription.new)}
          startIcon={<Iconify icon="mingcute:add-line" />}
          sx={{ bgcolor: '#003b51', '&:hover': { bgcolor: '#002636' } }}
        >
          {t('subscription.addPlan')}
        </Button>
      </Stack>

      <Card>
        <SubscriptionTableToolbar filters={filters} onFilters={handleFilters} />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHead sx={{ bgcolor: (theme) => theme.palette.background.neutral }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < tableData.length}
                      checked={tableData.length > 0 && selected.length === tableData.length}
                      onChange={(e) => handleSelectAllRows(e.target.checked)}
                    />
                  </TableCell>
                  {TABLE_HEAD.map((headCell) => (
                    <TableCell key={headCell.id} align={headCell.align || 'left'} sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                      {headCell.label}
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
                  tableData.map((row) => (
                    <SubscriptionTableRow
                      key={row._id}
                      row={row}
                      selected={selected.includes(row._id)}
                      onSelectRow={() => handleSelectRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      onToggleStatus={() => handleToggleStatus(row._id)}
                    />
                  ))
                )}

                {notFound && (
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

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
        <FormControlLabel
          control={<Switch checked={dense} onChange={(e) => setDense(e.target.checked)} />}
          label={t('common.dense') || 'Dense'}
        />
      </Stack>
    </DashboardContent>
  );
}
