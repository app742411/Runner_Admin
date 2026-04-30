import { useState, useCallback } from 'react';
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
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { SearchNotFound } from 'src/components/search-not-found';

import { useEmployees, useDeleteEmployee } from 'src/features/employee/useEmployees';
import toast from 'react-hot-toast';
import { EmployeeTableRow } from '../employee-table-row';
import { EmployeeTableToolbar } from '../employee-table-toolbar';

// ----------------------------------------------------------------------

export function EmployeeListView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const TABLE_HEAD = [
    { id: 'employeeName', label: t('employee.table.name') },
    { id: 'position', label: t('employee.table.position') },
    { id: 'email', label: t('employee.table.email') },
    { id: 'phone', label: t('employee.table.phone') },
    { id: 'gender', label: t('employee.table.gender') },
    { id: 'company', label: t('employee.table.company') },
    { id: 'experience', label: t('employee.table.experience') },
    { id: 'joinedDate', label: t('employee.table.joinedDate') },
    { id: 'createdAt', label: t('employee.table.registerDate') },
    { id: 'status', label: t('employee.table.status') },
    { id: '', label: t('employee.table.action'), align: 'right' },
  ];

  const TABS = [
    { value: 'all', label: t('employee.tabs.all'), color: 'default' },
    { value: 'active', label: t('employee.tabs.active'), color: 'success' },
    { value: 'pending', label: t('employee.tabs.pending'), color: 'warning' },
    { value: 'banned', label: t('employee.tabs.banned'), color: 'error' },
    { value: 'rejected', label: t('employee.tabs.rejected'), color: 'default' },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  const [filters, setFilters] = useState({
    name: '',
    status: '',
  });

  const { data, isLoading } = useEmployees({
    ...filters,
    page: page + 1,
    limit: rowsPerPage,
  });

  const tableData = data?.data || [];
  const totalRows = data?.pagination?.total || tableData.length;

  const { mutate: deleteEmployee } = useDeleteEmployee();

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await deleteEmployee(id);
        toast.success(t('employee.deleteSuccess'));
      } catch (error) {
        console.error(error);
        toast.error(t('employee.somethingWentWrong'));
      }
    },
    [deleteEmployee, t]
  );

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setPage(0);
  }, []);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      const statusValue = newValue === 'all' ? '' : newValue;
      handleFilters('status', statusValue);
      setCurrentTab(newValue);
    },
    [handleFilters]
  );

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
          <Typography variant="h4">{t('employee.list')}</Typography>
          <Breadcrumbs
            separator={
              <Box
                component="span"
                sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
              />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.root)} sx={{ cursor: 'pointer' }}>{t('employee.tabs.dashboard') || 'Dashboard'}</Link>
            <Link color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>{t('employee.title')}</Link>
            <Typography color="text.primary">{t('employee.list_of')}</Typography>
          </Breadcrumbs>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            onClick={() => router.push(paths.dashboard.employee.new)}
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ bgcolor: '#003b51', '&:hover': { bgcolor: '#002636' } }}
          >
            {t('employee.new')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:export-bold" />}
            sx={{ borderColor: 'divider' }}
          >
            {t('employee.export')}
          </Button>
        </Stack>
      </Stack>

      <Card>
        <Tabs
          value={currentTab}
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
                  <Box component="span" sx={{ typography: 'subtitle2', color: currentTab === tab.value ? 'text.primary' : 'text.secondary' }}>
                    {tab.label}
                  </Box>
                  <Label
                    variant="soft"
                    color={tab.color}
                    sx={{
                      borderRadius: 1,
                      height: 20,
                      bgcolor: tab.value === 'all' && currentTab === 'all' ? theme.palette.grey[800] : undefined,
                      color: tab.value === 'all' && currentTab === 'all' ? 'common.white' : undefined
                    }}
                  >
                    {/* Mock counts based on design */}
                    {tab.value === 'all' ? '80' :
                      tab.value === 'active' ? '18' :
                        tab.value === 'pending' ? '22' :
                          tab.value === 'banned' ? '11' : '32'}
                  </Label>
                </Stack>
              }
            />
          ))}
        </Tabs>

        <EmployeeTableToolbar
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
                    <TableCell colSpan={11} align="center" sx={{ py: 10 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  tableData.map((row) => (
                    <EmployeeTableRow
                      key={row._id}
                      row={row}
                      selected={selected.includes(row._id)}
                      onSelectRow={() => handleSelectRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                    />
                  ))
                )}

                {notFound && (
                  <TableRow>
                    <TableCell colSpan={11}>
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
          label={t('employee.dense')}
        />
      </Stack>
    </DashboardContent>
  );
}
