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
import { useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { Scrollbar } from 'src/components/scrollbar';
import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { useSelector } from 'react-redux';
import { ROLES } from 'src/config/roles';

import { useContracts } from 'src/features/contract/useContracts';
import { useCompanies, useAllCompanies } from 'src/features/company/useCompanies';
import { ContractTableRow } from '../contract-table-row';
import { ContractTableToolbar } from '../contract-table-toolbar';

import { ContractNewView } from './contract-new-view';

// ----------------------------------------------------------------------

export function ContractListView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status') || '';

  const user = useSelector((state) => state.auth.user);
  const isCompanyAdmin = user?.role === ROLES.COMPANY_ADMIN;

  if (isCompanyAdmin) {
    return <ContractNewView />;
  }

  const TABLE_HEAD = [
    { id: 'client', label: t('contract.table.client') },
    { id: 'contractNumber', label: t('contract.table.contractNumber') },
    { id: 'invoiceNumber', label: t('contract.table.invoiceNumber') },
    { id: 'referenceNumber', label: t('contract.table.referenceNumber') },
    { id: 'property', label: t('contract.table.property') },
    !isCompanyAdmin && { id: 'company', label: t('contract.table.company') },
    { id: 'contractType', label: t('contract.table.contractType') },
    { id: 'date', label: t('contract.table.date') },
    { id: 'amount', label: t('contract.table.amount') },
    { id: 'status', label: t('contract.table.status') },
    { id: 'clientStatus', label: t('contract.table.clientStatus') },
    { id: 'emailStatus', label: t('contract.table.emailStatus') },
    { id: '', label: t('contract.table.action'), align: 'right' },
  ].filter(Boolean);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    startDate: null,
    endDate: null,
    company: 'all',
  });

  const { data, isLoading } = useContracts({
    search: filters.search,
    page: page + 1,
    limit: rowsPerPage,
    startDate: filters.startDate,
    endDate: filters.endDate,
    company: filters.company === 'all' ? '' : filters.company,
    status: statusParam,
  });

  const { data: companiesData } = useAllCompanies();
  const companyOptions = companiesData?.data || [];

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
          <Typography variant="h4">{t('contract.title')}</Typography>
          <Breadcrumbs
            separator={
              <Box
                component="span"
                sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
              />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.root)} sx={{ cursor: 'pointer' }}>{t('common.dashboard') || 'Dashboard'}</Link>
            <Typography color="text.primary">{t('contract.list')}</Typography>
          </Breadcrumbs>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ bgcolor: '#003b51', '&:hover': { bgcolor: '#002636' } }}
            onClick={() => router.push(paths.dashboard.contract.new)}
          >
            {t('contract.new')}
          </Button>
        </Stack>
      </Stack>

      <Card>
        <ContractTableToolbar
          filters={filters}
          onFilters={handleFilters}
          companyOptions={companyOptions}
          hideCompany={isCompanyAdmin}
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
                    <TableCell key={headCell.id} align={headCell.align || 'left'} sx={{ width: headCell.width, minWidth: headCell.minWidth }}>
                      {headCell.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={14} align="center" sx={{ py: 10 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  tableData.map((row, index) => (
                    <ContractTableRow
                      key={row._id}
                      row={row}
                      index={page * rowsPerPage + index}
                      selected={selected.includes(row._id)}
                      onSelectRow={() => handleSelectRow(row._id)}
                      hideCompany={isCompanyAdmin}
                    />
                  ))
                )}

                {notFound && (
                  <TableRow>
                    <TableCell colSpan={14}>
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
        label={t('contract.dense')}
        sx={{ px: 3, py: 2 }}
      />
    </DashboardContent>
  );
}
