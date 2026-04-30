import { useState, useCallback, useMemo } from 'react';
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
import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useTranslation } from 'react-i18next';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';
import { DashboardContent } from 'src/layouts/dashboard/main';

import { useProperties } from 'src/features/property/useProperties';
import { useAllCompanies } from 'src/features/company/useCompanies';
import { PropertyTableRow } from '../property-table-row';
import { PropertyTableToolbar } from '../property-table-toolbar';

// ----------------------------------------------------------------------

export function PropertyListView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const TABLE_HEAD = useMemo(() => [
    { id: 'propertyName', label: t('property.table.propertyName') },
    { id: 'propertyType', label: t('property.table.propertyType') },
    { id: 'company', label: t('property.table.company') },
    { id: 'client', label: t('property.table.client') },
    { id: 'address', label: t('property.table.address') },
    { id: 'sizeSqm', label: t('property.table.size') },
    { id: 'noOfResidents', label: t('property.table.residents') },
    { id: 'totalTasks', label: t('property.table.totalTasks') },
    { id: 'createdAt', label: t('property.table.registerDate') },
    { id: 'contractStatus', label: t('property.table.contractStatus') },
    { id: '', label: t('property.table.action'), align: 'right' },
  ], [t]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    company: 'all',
    status: 'all',
  });

  const { data: companiesResponse } = useAllCompanies();
  const companyOptions = companiesResponse?.data || [];

  const { data, isLoading } = useProperties({
    search: filters.name,
    company: filters.company !== 'all' ? filters.company : undefined,
    status: filters.status !== 'all' ? filters.status : undefined,
    page: page + 1,
    limit: rowsPerPage,
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
      setSelected(tableData.map((n) => n.propertyId));
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

  const handleNewProperty = useCallback(() => {
    // router.push(paths.dashboard.property.new);
  }, []);

  const notFound = !tableData.length && !isLoading;

  return (
    <DashboardContent maxWidth={false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Stack spacing={1}>
          <Typography variant="h4">{t('property.listTitle')}</Typography>
          <MuiBreadcrumbs
            separator={
              <Box
                sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
              />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push('/dashboard')} sx={{ cursor: 'pointer' }}>
              {t('property.view.dashboard') || 'Dashboard'}
            </Link>
            <Typography color="text.primary">{t('property.listTitle')}</Typography>
          </MuiBreadcrumbs>
        </Stack>

        {/* <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          sx={{ bgcolor: '#003b51', '&:hover': { bgcolor: '#002636' } }}
          onClick={handleNewProperty}
        >
          {t('property.list.newProperty') || 'New Property'}
        </Button> */}
      </Stack>

      <Card>
        <PropertyTableToolbar
          filters={filters}
          onFilters={handleFilters}
          companyOptions={companyOptions}
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
                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  tableData.map((row) => (
                    <PropertyTableRow
                      key={row.propertyId}
                      row={row}
                      selected={selected.includes(row.propertyId)}
                      onSelectRow={() => handleSelectRow(row.propertyId)}
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
          labelRowsPerPage={t('pagination.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} ${t('pagination.of')} ${count !== -1 ? count : `more than ${to}`}`
          }
        />
      </Card>

      <FormControlLabel
        control={<Switch checked={dense} onChange={(e) => setDense(e.target.checked)} />}
        label={t('property.list.dense') || 'Dense'}
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
