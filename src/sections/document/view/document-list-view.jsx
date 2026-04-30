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

import { useTranslation } from 'react-i18next';
import { Scrollbar } from 'src/components/scrollbar';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { SearchNotFound } from 'src/components/search-not-found';

import { DocumentTableRow } from '../document-table-row';
import { DocumentTableToolbar } from '../document-table-toolbar';

// ----------------------------------------------------------------------

const STATIC_DATA = Array.from({ length: 14 }, (_, index) => ({
  id: `USR00${index + 1}`,
  name: 'John Doe',
  userId: `USR00${index + 1}`,
  age: 28,
  gender: 'Male',
  email: 'john@example.com',
  mobileNo: '9876543210',
  role: 'Cleaner',
  joiningDate: '2023-06-15',
  department: 'Engineering',
  documentStatus: 'ID Card',
}));

export function DocumentListView() {
  const { t } = useTranslation();

  const TABLE_HEAD = useMemo(() => [
    { id: 'name', label: t('document.table.name') },
    { id: 'userId', label: t('document.table.userId') },
    { id: 'age', label: t('document.table.age') },
    { id: 'gender', label: t('document.table.gender') },
    { id: 'email', label: t('document.table.email') },
    { id: 'mobileNo', label: t('document.table.mobileNo') },
    { id: 'role', label: t('document.table.role') },
    { id: 'joiningDate', label: t('document.table.joiningDate') },
    { id: 'department', label: t('document.table.department') },
    { id: 'documentStatus', label: t('document.table.document'), align: 'left' },
    { id: '', label: t('document.table.action'), align: 'right' },
  ], [t]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(false);
  const [filters, setFilters] = useState({ name: '' });

  const tableData = STATIC_DATA.filter((item) =>
    item.name.toLowerCase().includes(filters.name.toLowerCase())
  );

  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setPage(0);
  }, []);

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

  const notFound = !tableData.length;

  return (
    <DashboardContent maxWidth={false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {t('document.list')}
        </Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="solar:download-bold" />}
          sx={{ bgcolor: '#001b2e', color: 'white', '&:hover': { bgcolor: '#002642' } }}
        >
          {t('document.download')}
        </Button>
      </Stack>

      <DocumentTableToolbar filters={filters} onFilters={handleFilters} />

      <Card sx={{ borderRadius: 2 }}>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 1200 }}>
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
                {paginatedData.map((row) => (
                  <DocumentTableRow
                    key={row.userId}
                    row={row}
                    selected={selected.includes(row.userId)}
                    onSelectRow={() => handleSelectRow(row.userId)}
                  />
                ))}

                {notFound && (
                  <TableRow>
                    <TableCell colSpan={11}>
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
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Stack sx={{ p: 2 }}>
        <FormControlLabel
          control={<Switch checked={dense} onChange={(e) => setDense(e.target.checked)} />}
          label={t('common.dense') || 'Dense'}
        />
      </Stack>
    </DashboardContent>
  );
}
