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

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Scrollbar } from 'src/components/scrollbar';
import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';
import { DashboardContent } from 'src/layouts/dashboard/main';

import { toast } from 'react-hot-toast';
import { useGroups, useDeleteGroup } from 'src/features/group/useGroups';
import { GroupTableRow } from '../group-table-row';
import { GroupTableToolbar } from '../group-table-toolbar';
import { GroupNewForm } from '../group-new-form';

// ----------------------------------------------------------------------

export function GroupListView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const [openForm, setOpenForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const TABLE_HEAD = [
    { id: 'name', label: t('group.table.groupName') },
    { id: 'task', label: t('group.table.taskName') },
    { id: 'leader', label: t('group.table.groupAdminName') },
    { id: 'totalMembers', label: t('group.table.members') },
    { id: 'createdAt', label: t('group.table.registerDate') },
    { id: '', label: t('group.table.action'), align: 'right' },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
  });

  const { data, isLoading, refetch } = useGroups({
    search: filters.search,
    page: page + 1,
    limit: rowsPerPage,
  });

  const tableData = data?.data || [];
  const totalRows = data?.pagination?.total || tableData.length;

  const { mutateAsync: deleteGroup } = useDeleteGroup();

  const handleOpenForm = useCallback((group = null) => {
    setSelectedGroup(group);
    setOpenForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setSelectedGroup(null);
    setOpenForm(false);
  }, []);

  const handleSuccess = useCallback(() => {
    handleCloseForm();
    refetch();
  }, [handleCloseForm, refetch]);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setPage(0);
  }, []);

  const handleDeleteRow = useCallback(
    async (id) => {
      const confirmed = window.confirm(t('dashboard.deleteConfirm'));
      if (confirmed) {
        try {
          await deleteGroup(id);
          toast.success(t('dashboard.deleteSuccess'));
        } catch (error) {
          console.error(error);
          toast.error(t('dashboard.deleteError'));
        }
      }
    },
    [deleteGroup, t]
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
          <Typography variant="h4">{t('group.view.group')}</Typography>
          <Breadcrumbs
            separator={
              <Box
                component="span"
                sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
              />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.root)} sx={{ cursor: 'pointer' }}>
              {t('group.view.dashboard')}
            </Link>
            <Link color="inherit" underline="hover">
              {t('group.view.group')}
            </Link>
            <Typography color="text.primary">{t('group.view.list')}</Typography>
          </Breadcrumbs>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ bgcolor: '#003b51', '&:hover': { bgcolor: '#002636' } }}
            onClick={() => handleOpenForm()}
          >
            {t('group.list.addGroup')}
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="solar:export-bold" />}
            sx={{ borderColor: 'divider', borderRadius: 1.5 }}
          >
            {t('group.list.export')}
          </Button>
        </Stack>
      </Stack>

      <Card>
        <GroupTableToolbar
          filters={filters}
          onFilters={handleFilters}
        />

        <TableContainer sx={{ position: 'relative', overflow: 'unset', px: 2 }}>
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
                      <Typography variant="subtitle2" sx={{ color: 'text.disabled', fontWeight: '600' }}>
                        {headCell.label}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 10 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  tableData.map((row, index) => (
                    <GroupTableRow
                      key={row._id}
                      row={row}
                      selected={selected.includes(row._id)}
                      onSelectRow={() => handleSelectRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      onEditRow={() => handleOpenForm(row)}
                      onViewRow={() => router.push(paths.dashboard.group.details(row._id))}
                    />
                  ))
                )}

                {notFound && (
                  <TableRow>
                    <TableCell colSpan={10}>
                      <SearchNotFound query={filters.search} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <Box sx={{ position: 'relative' }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <FormControlLabel
            control={<Switch checked={dense} onChange={(e) => setDense(e.target.checked)} />}
            label={t('group.list.dense') || 'Dense'}
            sx={{ px: 3, py: 2, position: { md: 'absolute' }, left: { md: 0 }, bottom: { md: 0 } }}
          />
        </Box>
      </Card>

      <Dialog 
        open={openForm} 
        onClose={handleCloseForm}
        fullWidth
        maxWidth="md"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            bgcolor: 'background.neutral'
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          {selectedGroup ? t('group.form.editTitle') || 'Edit Group' : t('group.form.newTitle') || 'Create New Group'}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <GroupNewForm 
            currentGroup={selectedGroup} 
            onSuccess={handleSuccess} 
          />
        </DialogContent>
      </Dialog>
    </DashboardContent>
  );
}
