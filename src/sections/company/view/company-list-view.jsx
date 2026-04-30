import { useTranslation } from 'react-i18next';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
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
import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useCompanies } from 'src/features/company/useCompanies';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';

import { DashboardContent } from 'src/layouts/dashboard/main';

import { CompanyTableRow } from '../company-table-row';
import { CompanyTableToolbar } from '../company-table-toolbar';

// ----------------------------------------------------------------------

export function CompanyListView() {
  const { t } = useTranslation();
  const router = useRouter();

  const TABLE_HEAD = [
    { id: 'companyName', label: t('company.table.companyName') },
    { id: 'adminFullName', label: t('company.table.adminName') },
    { id: 'phoneNumber', label: t('company.table.phone') },
    { id: 'address', label: t('company.table.address') },
    { id: 'licenseNo', label: t('company.table.licenseNo') },
    { id: 'licenseExpiryDate', label: t('company.table.licenseExpiry') },
    { id: 'createdAt', label: t('company.table.registerDate') },
    { id: 'subscriptionAmount', label: t('company.table.monthlyFees') },
    { id: 'subscriptionStatus', label: t('company.table.subscription') },
    { id: 'isApproved', label: t('company.table.statusHeader') },
    { id: '', label: t('company.table.action'), align: 'right' },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    subscriptionStatus: 'all',
    city: 'all',
  });

  // Data fetching
  const { data, isLoading } = useCompanies({
    search: filters.name,
    page: page + 1,
    limit: rowsPerPage,
    subscriptionStatus: filters.subscriptionStatus !== 'all' ? filters.subscriptionStatus : undefined,
    city: filters.city !== 'all' ? filters.city : undefined,
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

  const handleSelectAllRows = (checked) => {
    if (checked) {
      setSelected(tableData.map((n) => n.companyId));
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

  const handleNewCompany = useCallback(() => {
    router.push(paths.dashboard.company.new);
  }, [router]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.company.edit(id));
    },
    [router]
  );

  const notFound = !tableData.length && !isLoading;

  return (
    <DashboardContent maxWidth={false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Stack spacing={1}>
          <Typography variant="h4">{t('company.title')}</Typography>
          <MuiBreadcrumbs
            separator={
              <Box
                sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
              />
            }
          >
            <Link href="/dashboard" color="inherit" underline="hover">
              {t('company.view.dashboard')}
            </Link>
            <Link href="/dashboard/company" color="inherit" underline="hover">
              {t('company.view.company')}
            </Link>
            <Typography color="text.primary">{t('company.view.list')}</Typography>
          </MuiBreadcrumbs>
        </Stack>

        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          sx={{ bgcolor: '#003b51', '&:hover': { bgcolor: '#002636' } }}
          onClick={handleNewCompany}
        >
          {t('company.list.newCompany')}
        </Button>
      </Stack>

      <Card>
        <CompanyTableToolbar
          filters={filters}
          onFilters={handleFilters}
          cityOptions={['New York', 'London', 'Zurich']}
        />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={selected.length}
                onSelectAllRows={handleSelectAllRows}
              />
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ py: 10 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  tableData.map((row) => (
                      <CompanyTableRow
                        key={row.companyId}
                        row={row}
                        selected={selected.includes(row.companyId)}
                        onSelectRow={() => handleSelectRow(row.companyId)}
                        onEditRow={() => handleEditRow(row.companyId)}
                        showStatus
                      />
                  ))
                )}

                {notFound && (
                  <TableRow>
                    <TableCell colSpan={12}>
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
        label={t('company.list.dense')}
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
