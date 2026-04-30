import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
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

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';
import { DashboardContent } from 'src/layouts/dashboard/main';

import { useTranslation } from 'react-i18next';
import { useUsers } from 'src/features/user/useUsers';
import { useAllCompanies } from 'src/features/company/useCompanies';
import { UserTableRow } from '../user-table-row';
import { UserTableToolbar } from '../user-table-toolbar';

// ----------------------------------------------------------------------

export function UserListView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const STATUS_OPTIONS = [
    { value: 'all', label: t('user.list.all') },
    { value: 'active', label: t('user.list.active') },
    { value: 'pending', label: t('user.list.pending') },
    { value: 'banned', label: t('user.list.banned') },
    { value: 'rejected', label: t('user.list.rejected') },
  ];

  const TABLE_HEAD = [
    { id: 'firstName', label: t('user.table.name') },
    { id: 'company', label: t('user.table.company') },
    { id: 'role', label: t('user.table.role') },
    { id: 'createdAt', label: t('user.table.registerDate') },
    { id: 'isApproved', label: t('user.table.status') },
    { id: '', label: '' },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    company: 'all',
    city: 'all',
    status: 'all',
  });

  const { data: companiesResponse } = useAllCompanies();
  const companyOptions = companiesResponse?.data || [];

  // Fetch users with data query params
  const { data, isLoading } = useUsers({
    search: filters.search,
    page: page + 1,
    limit: rowsPerPage,
    role: filters.role !== 'all' ? filters.role : undefined,
    company: filters.company !== 'all' ? filters.company : undefined,
    city: filters.city !== 'all' ? filters.city : undefined,
    isApproved: filters.status !== 'all' ? filters.status : undefined,
  });

  const tableData = data?.data || [];
  const totalRows = data?.pagination?.total || 0;

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setPage(0);
  }, []);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleSelectAllRows = (checked) => {
    if (checked) {
      setSelected(tableData.map((n) => n.userId));
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

  const handleNewUser = () => {
    // router.push(paths.dashboard.user.new);
  };

  const notFound = !tableData.length && !isLoading;

  return (
    <DashboardContent maxWidth={false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Stack spacing={1}>
          <Typography variant="h4">{t('user.title')}</Typography>
          <Breadcrumbs
            separator={
              <Box
                component="span"
                sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
              />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push('/dashboard')} sx={{ cursor: 'pointer' }}>
              {t('user.dashboard')}
            </Link>
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.user.list)} sx={{ cursor: 'pointer' }}>
              {t('user.title')}
            </Link>
            <Typography color="text.primary">{t('user.newUser')}</Typography>
          </Breadcrumbs>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ bgcolor: '#003b51', '&:hover': { bgcolor: '#002636' } }}
            onClick={handleNewUser}
          >
            {t('user.newUser')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:export-bold" />}
            sx={{ borderColor: 'divider', color: 'text.primary', '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) } }}
          >
            {t('user.exportUser')}
          </Button>
        </Stack>
      </Stack>

      <Card>
        <Tabs
          value={filters.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'}
                  color={
                    (tab.value === 'active' && 'success') ||
                    (tab.value === 'pending' && 'warning') ||
                    (tab.value === 'banned' && 'error') ||
                    (tab.value === 'rejected' && 'default') ||
                    'default'
                  }
                >
                  {tab.value === 'all' ? (totalRows || 0) : ''}
                  {tab.value === 'active' ? 18 : ''}
                  {tab.value === 'pending' ? 22 : ''}
                  {tab.value === 'banned' ? 11 : ''}
                  {tab.value === 'rejected' ? 32 : ''}
                </Label>
              }
            />
          ))}
        </Tabs>

        <UserTableToolbar
          filters={filters}
          onFilters={handleFilters}
          roleOptions={['employee', 'runner employee', 'company admin', 'superAdmin']}
          companyOptions={companyOptions}
          cityOptions={['New York', 'London', 'Zurich', 'Palo Alto']}
        />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={selected.length}
                onSelectAllRows={handleSelectAllRows}
              />
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  tableData.map((row) => (
                    <UserTableRow
                      key={row.userId}
                      row={row}
                      selected={selected.includes(row.userId)}
                      onSelectRow={() => handleSelectRow(row.userId)}
                    />
                  ))
                )}

                {notFound && (
                  <TableRow>
                     <TableCell colSpan={7}>
                        <SearchNotFound query={filters.search} />
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
        label={t('user.dense')}
        sx={{ px: 3, py: 2 }}
      />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function TableHeadCustom({ headLabel, rowCount, numSelected, onSelectAllRows }) {
  return (
    <TableHead sx={{ bgcolor: (theme) => theme.palette.background.neutral }}>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={(event) => onSelectAllRows(event.target.checked)}
          />
        </TableCell>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
