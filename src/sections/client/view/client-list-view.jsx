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
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { SearchNotFound } from 'src/components/search-not-found';

import { useClients } from 'src/features/client/useClients';
import { ClientTableRow } from '../client-table-row';
import { ClientTableToolbar } from '../client-table-toolbar';

// ----------------------------------------------------------------------

export function ClientListView() {
  const { t } = useTranslation();
  const router = useRouter();

  const TABLE_HEAD = [
    { id: 'name', label: t('client.table.name') },
    { id: 'phone', label: t('client.table.phone') || 'Phone' },
    { id: 'address', label: t('client.table.address') || 'Address' },
    { id: 'propertyName', label: t('client.table.propertyName') },
    { id: 'totalTasks', label: t('client.table.tasksNo') },
    { id: 'totalAmount', label: t('client.table.totalAmount') },
    { id: 'status', label: t('client.table.status') },
    { id: '', label: t('client.table.action'), align: 'right' },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
  });

  const { data, isLoading } = useClients({
    name: filters.name,
    page: page + 1,
    limit: rowsPerPage,
  });

  const tableData = data?.data || [];
  const totalRows = data?.pagination?.total || data?.totalClients || tableData.length;

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setPage(0);
  }, []);

  const handleSelectAllRows = (checked) => {
    if (checked) {
      setSelected(tableData.map((n) => n.clientId));
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
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{t('client.title')}</Typography>
          <Breadcrumbs
            separator={
              <Box
                component="span"
                sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
              />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push('/dashboard')} sx={{ cursor: 'pointer' }}>{t('client.dashboard')}</Link>
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.client.list)} sx={{ cursor: 'pointer' }}>{t('client.clients')}</Link>
            <Typography color="text.disabled">{t('client.list_of_clients')}</Typography>
          </Breadcrumbs>
        </Stack>

        <Stack direction="row" spacing={1.5}>
          {/* <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ bgcolor: '#003b51', '&:hover': { bgcolor: '#002636' }, color: 'white', borderRadius: 1.5, px: 2, height: 44 }}
          >
            {t('client.newClient')}
          </Button> */}
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:export-bold" />}
            sx={{ color: 'text.primary', borderColor: 'divider', bgcolor: 'background.paper', borderRadius: 1.5, px: 2, height: 44 }}
          >
            {t('client.export')}
          </Button>
        </Stack>
      </Stack>

      <Card sx={{ borderRadius: 2 }}>
        <ClientTableToolbar filters={filters} onFilters={handleFilters} />

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
                    <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  tableData.map((row) => (
                    <ClientTableRow
                      key={row.clientId}
                      row={row}
                      selected={selected.includes(row.clientId)}
                      onSelectRow={() => handleSelectRow(row.clientId)}
                    />
                  ))
                )}

                {notFound && !filters.name && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <SearchNotFound query={filters.name} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2, pr: 2 }}>
          <FormControlLabel
            control={<Switch checked={dense} onChange={(e) => setDense(e.target.checked)} />}
            label={t('client.dense')}
            sx={{ pl: 3 }}
          />
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
            sx={{ borderTop: 'none' }}
          />
        </Stack>
      </Card>
    </DashboardContent>
  );
}

