import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
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
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { SearchNotFound } from 'src/components/search-not-found';

import { useTasks } from 'src/features/task/useTasks';
import { TaskTableRow } from '../task-table-row';
import { TaskTableToolbar } from '../task-table-toolbar';

// ----------------------------------------------------------------------

export function TaskListView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const user = useSelector((state) => state.auth.user);
  const isEmployee = user?.role === 'employee';

  const TABLE_HEAD = [
    { id: 'taskName', label: t('task.table.taskName') },
    ...(isEmployee ? [{ id: 'subTaskName', label: t('task.table.subTaskName') || 'Sub Task' }] : []),
    { id: 'taskCategory', label: t('task.table.category') },
    { id: 'taskSubCategory', label: t('task.table.subCategory') },
    { id: 'subTasks', label: t('task.table.subTasksCount') || 'Sub Tasks' },
    { id: 'taskPrice', label: t('task.table.workPrice') || 'Price' },
    { id: 'status', label: t('task.table.status') },
    { id: 'company', label: t('task.table.company') },
    { id: 'assignedBy', label: t('task.details.assignBy') || 'Assigned By' },
    { id: 'createdAt', label: t('task.details.createdAt') || 'Created At' },
    { id: '', label: t('task.table.action'), align: 'right' },
  ];

  const TABS = [
    { value: 'all', label: t('task.list.all') || 'All', color: 'default' },
    { value: 'pending', label: t('task.list.pending') || 'Pending', color: 'warning' },
    { value: 'in_progress', label: t('task.list.active') || 'In Progress', color: 'info' },
    { value: 'completed', label: t('task.list.completed') || 'Completed', color: 'success' },
    { value: 'cancelled', label: t('task.list.rejected') || 'Cancelled', color: 'error' },
    { value: 'hold', label: t('task.list.hold') || 'Hold', color: 'default' },
  ];

  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status') || 'all';

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
  });

  const { data, isLoading } = useTasks({
    ...filters,
    status: statusParam === 'all' ? '' : statusParam,
    page: page + 1,
    limit: rowsPerPage,
  });

  const tableData = data?.data || [];
  const totalRows = data?.pagination?.total || data?.total || tableData.length || 0;

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setPage(0);
  }, []);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      router.push(`${paths.dashboard.task.list}?status=${newValue}`);
    },
    [router]
  );

  const handleSelectAllRows = (checked) => {
    if (checked) {
      setSelected(tableData.map((n) => n._id || n.taskId));
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
          <Typography variant="h4">{t('task.title')}</Typography>
          <Breadcrumbs
            separator={
              <Box
                component="span"
                sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
              />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push('/dashboard')} sx={{ cursor: 'pointer' }}>{t('task.dashboard')}</Link>
            <Link color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>{t('task.title')}</Link>
            <Typography color="text.primary">{t('task.title')}</Typography>
          </Breadcrumbs>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:export-bold" />}
            sx={{ borderColor: 'divider' }}
          >
            {t('task.exportTask')}
          </Button>
        </Stack>
      </Stack>

      <Card>
        <Tabs
          value={statusParam}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            '& .MuiTabs-indicator': {
              bgcolor: theme.palette.success.main,
            }
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              disabled={isLoading}
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box component="span" sx={{ typography: 'subtitle2', color: statusParam === tab.value ? 'text.primary' : 'text.secondary' }}>
                    {tab.label}
                  </Box>
                  <Label
                    variant="soft"
                    color={tab.color}
                    sx={{
                      borderRadius: 1,
                      height: 20,
                      bgcolor: tab.value === 'all' && statusParam === 'all' ? theme.palette.grey[800] : undefined,
                      color: tab.value === 'all' && statusParam === 'all' ? 'common.white' : undefined
                    }}
                  >
                    {/* Mock counts based on design */}
                    {tab.value === 'all' ? '80' :
                      tab.value === 'pending' ? '22' :
                        tab.value === 'in_progress' ? '18' :
                          tab.value === 'completed' ? '25' :
                            tab.value === 'cancelled' ? '11' : '4'}
                  </Label>
                </Stack>
              }
            />
          ))}
        </Tabs>

        <TaskTableToolbar
          filters={filters}
          onFilters={handleFilters}
        />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHead sx={{ bgcolor: theme.palette.background.neutral }}>
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
                    <TableCell colSpan={TABLE_HEAD.length + 1} align="center" sx={{ py: 10 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  tableData.map((row) => (
                    <TaskTableRow
                      key={row._id || row.taskId}
                      row={row}
                      selected={selected.includes(row._id || row.taskId)}
                      onSelectRow={() => handleSelectRow(row._id || row.taskId)}
                    />
                  ))
                )}

                {notFound && (
                  <TableRow>
                    <TableCell colSpan={TABLE_HEAD.length + 1}>
                      <SearchNotFound query={filters.name || filters.search} />
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
          label={t('task.dense')}
        />
      </Stack>
    </DashboardContent>
  );
}
