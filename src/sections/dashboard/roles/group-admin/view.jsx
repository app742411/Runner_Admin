import { useState, useCallback, useMemo } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-hot-toast';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useTranslation } from 'react-i18next';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { Scrollbar } from 'src/components/scrollbar';
import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';

import { StatCard } from 'src/components/analytics/StatCard';
import { GroupTableRow } from 'src/sections/group/group-table-row';
import { GroupTableToolbar } from 'src/sections/group/group-table-toolbar';
import { useMyGroups, useDeleteGroup, useGroupAdminDashboard } from 'src/features/group/useGroups';

// ----------------------------------------------------------------------

const SPARK_DATA = [{ v: 10 }, { v: 25 }, { v: 15 }, { v: 40 }, { v: 30 }, { v: 50 }];

// ----------------------------------------------------------------------

export default function GroupAdminView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dense, setDense] = useState(false);
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({ search: '' });

  const TABLE_HEAD = useMemo(() => [
    { id: 'name', label: t('group.table.groupName') },
    { id: 'company', label: t('group.table.company') || 'Company' },
    { id: 'description', label: t('group.table.description') },
    { id: 'totalMembers', label: t('group.table.members'), align: 'center' },
    { id: 'contractNumber', label: t('group.table.contractNumber') },
    { id: 'totalCost', label: t('group.table.totalCost') },
    { id: 'contractStatus', label: t('group.table.contractStatus') },
    { id: '', label: t('group.table.actions'), align: 'right' },
  ], [t]);

  const { data, isLoading } = useMyGroups({
    search: filters.search,
    page: page + 1,
    limit: rowsPerPage,
  });

  const tableData = data?.data || [];
  const totalRows = data?.pagination?.total || tableData.length;

  const { mutateAsync: deleteGroup } = useDeleteGroup();

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({ ...prevState, [name]: value }));
    setPage(0);
  }, []);

  const handleDeleteRow = useCallback(async (id) => {
    if (window.confirm(t('dashboard.deleteConfirm'))) {
      try {
        await deleteGroup(id);
        toast.success(t('dashboard.deleteSuccess'));
      } catch (error) {
        toast.error(t('dashboard.deleteError'));
      }
    }
  }, [deleteGroup, t]);

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
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const { data: dashboardData, isLoading: isStatsLoading } = useGroupAdminDashboard();
  const stats = dashboardData?.stats || {};

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={4}>
        <Typography variant="h4" sx={{ fontWeight: '800' }}>
          {t('dashboard.title')}
        </Typography>

        <Grid container spacing={3}>
          <Grid xs={12} md={4} lg={2}>
            <StatCard
              title={t('dashboard.totalTask')}
              total={stats.totalTasks || 0}
              color={theme.palette.success.main}
              icon="solar:bag-bold"
              sparkData={SPARK_DATA}
            />
          </Grid>
          <Grid xs={12} md={4} lg={2}>
            <StatCard
              title={t('dashboard.totalGroups') || 'Total Groups'}
              total={stats.totalGroups || 0}
              color={theme.palette.primary.main}
              icon="solar:users-group-rounded-bold"
              sparkData={[{ v: 50 }, { v: 40 }, { v: 60 }, { v: 35 }, { v: 55 }, { v: 45 }]}
            />
          </Grid>
          <Grid xs={12} md={4} lg={2}>
            <StatCard
              title={t('dashboard.totalProperties') || 'Total Properties'}
              total={stats.totalProperties || 0}
              color={theme.palette.warning.main}
              icon="solar:home-bold"
              sparkData={[{ v: 20 }, { v: 35 }, { v: 25 }, { v: 45 }, { v: 38 }, { v: 50 }]}
            />
          </Grid>
          <Grid xs={12} md={4} lg={2}>
            <StatCard
              title={t('dashboard.pendingTasks') || 'Pending Tasks'}
              total={stats.pendingTasks || 0}
              color={theme.palette.error.main}
              icon="solar:clipboard-check-bold"
              sparkData={[{ v: 30 }, { v: 25 }, { v: 40 }, { v: 28 }, { v: 38 }, { v: 25 }]}
            />
          </Grid>
          <Grid xs={12} md={4} lg={2}>
            <StatCard
              title={t('dashboard.inProgressTasks') || 'In Progress'}
              total={stats.inProgressTasks || 0}
              color={theme.palette.info.main}
              icon="solar:play-circle-bold"
              sparkData={[{ v: 10 }, { v: 20 }, { v: 15 }, { v: 30 }, { v: 25 }, { v: 35 }]}
            />
          </Grid>
          <Grid xs={12} md={4} lg={2}>
            <StatCard
              title={t('dashboard.completedTasks') || 'Completed'}
              total={stats.completedTasks || 0}
              color={theme.palette.success.light}
              icon="solar:check-circle-bold"
              sparkData={[{ v: 40 }, { v: 50 }, { v: 45 }, { v: 60 }, { v: 55 }, { v: 70 }]}
            />
          </Grid>
        </Grid>

        <Card sx={{ p: 0, borderRadius: 3, boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)' }}>
          <Stack sx={{ px: 3, pt: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: '800', mb: 2 }}>
              {t('dashboard.group')}
            </Typography>
            <GroupTableToolbar filters={filters} onFilters={handleFilters} />
          </Stack>

          <TableContainer sx={{ position: 'relative', overflow: 'unset', px: 2, pb: 2 }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHead sx={{ bgcolor: 'background.neutral' }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selected.length > 0 && selected.length < tableData.length}
                        checked={tableData.length > 0 && selected.length === tableData.length}
                        onChange={(e) => handleSelectAllRows(e.target.checked)}
                      />
                    </TableCell>
                    {TABLE_HEAD.map((headCell) => (
                      <TableCell key={headCell.id} align={headCell.align || 'left'}>
                        <Typography variant="subtitle2" sx={{ color: 'text.disabled', fontWeight: '700' }}>
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
                    tableData.map((row) => (
                      <GroupTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => handleSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => router.push(paths.dashboard.group.edit(row._id), { state: { group: row } })}
                        onViewRow={() => router.push(paths.dashboard.group.details(row._id))}
                        isGroupAdminView
                      />
                    ))
                  )}

                  {tableData.length === 0 && !isLoading && (
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

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
            <FormControlLabel
              control={<Switch checked={dense} onChange={(e) => setDense(e.target.checked)} />}
              label={t('group.list.dense')}
              sx={{ ml: 1 }}
            />
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalRows}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, p) => setPage(p)}
              onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            />
          </Stack>
        </Card>
      </Stack>
    </DashboardContent>
  );
}
