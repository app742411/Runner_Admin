import { useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { fDate } from 'src/utils/format-time';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { SearchNotFound } from 'src/components/search-not-found';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { useWorkReports } from 'src/features/report/useWorkReports';

// ----------------------------------------------------------------------

export function WorkReportListView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const TABLE_HEAD = [
    { id: 'taskName', label: t('report.table.taskName') || 'Task Name' },
    { id: 'contractNo', label: t('report.table.contractNo') || 'Contract No' },
    { id: 'employees', label: t('report.table.employees') || 'Employees' },
    { id: 'totalHours', label: t('report.table.totalHours') || 'Total Hours' },
    { id: 'createdAt', label: t('report.table.createdAt') || 'Created At' },
    { id: 'status', label: t('report.table.status') || 'Status' },
    { id: 'reviewStatus', label: t('report.table.reviewStatus') || 'Review Status' },
    { id: '', label: t('report.table.action'), align: 'right' },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [dense, setDense] = useState(false);

  const { data, isLoading } = useWorkReports({
    page: page + 1,
    limit: rowsPerPage,
    search: searchQuery || undefined,
  });

  const tableData = data?.data || [];
  const totalRows = data?.pagination?.total || 0;

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const renderLoading = (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <DashboardContent maxWidth={false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {t('report.workReports.title') || 'Work Reports'}
          </Typography>
          <Breadcrumbs
            separator={
              <Box
                component="span"
                sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
              />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.root)} sx={{ cursor: 'pointer' }}>
              {t('nav.dashboard') || 'Dashboard'}
            </Link>
            <Typography color="text.primary">{t('report.workReports.title') || 'Work Reports'}</Typography>
          </Breadcrumbs>
        </Stack>
      </Stack>

      <Card>
        <Stack
          spacing={2}
          alignItems={{ xs: 'flex-end', md: 'center' }}
          direction={{ xs: 'column', md: 'row' }}
          sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
        >
          <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.disabled',
                position: 'absolute',
                top: -8,
                left: 14,
                zIndex: 1,
                px: 1,
                bgcolor: 'background.paper',
              }}
            >
              {t('report.table.status') || 'Status'}
            </Typography>
            <Select
              value="all"
              displayEmpty
              onChange={() => { }}
            >
              <MenuItem value="all">{t('common.all') || 'All'}</MenuItem>
            </Select>
          </FormControl>

          <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
            <TextField
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('common.search')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />

            <IconButton>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </Stack>

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHead sx={{ bgcolor: 'background.neutral' }}>
                <TableRow>
                  {TABLE_HEAD.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align={headCell.align || 'left'}
                    >
                      {headCell.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={TABLE_HEAD.length}>{renderLoading}</TableCell>
                  </TableRow>
                ) : (
                  <>
                    {tableData.map((row) => (
                      <WorkReportTableRow key={row._id} row={row} />
                    ))}

                    {!isLoading && tableData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ py: 10 }}>
                          <SearchNotFound query={searchQuery} />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControlLabel
            control={<Switch checked={dense} onChange={(e) => setDense(e.target.checked)} />}
            label={t('common.dense')}
            sx={{ px: 3, py: 1.5 }}
          />
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function WorkReportTableRow({ row }) {
  const { t } = useTranslation();
  const router = useRouter();
  const popover = usePopover();

  return (
    <>
      <TableRow
        hover
        onClick={() => router.push(paths.dashboard.report.details(row._id))}
        sx={{ cursor: 'pointer' }}
      >
        <TableCell>
          <Typography variant="body2" sx={{ fontWeight: '600' }}>
            {row.task?.taskName || '-'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            {row.task?.status}
          </Typography>
        </TableCell>

        <TableCell>{row.contract?.contractNumber || '-'}</TableCell>

        <TableCell>
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {row.employees?.map((emp) => (
              <Label key={emp._id} variant="soft" color="info">
                {emp.firstName} {emp.lastName}
              </Label>
            ))}
          </Stack>
        </TableCell>

        <TableCell>{row.totalHours || 0} hrs</TableCell>

        <TableCell>{fDate(row.createdAt)}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'completed' && 'success') ||
              (row.status === 'draft' && 'warning') ||
              'default'
            }
          >
            {row.status}
          </Label>
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.reviewStatus === 'approved' && 'success') ||
              (row.reviewStatus === 'pending' && 'warning') ||
              (row.reviewStatus === 'rejected' && 'error') ||
              'default'
            }
          >
            {row.reviewStatus}
          </Label>
        </TableCell>

        <TableCell align="right" onClick={(e) => e.stopPropagation()}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >

        <MenuItem onClick={popover.onClose}>
          <Iconify icon="solar:pen-bold" />
          Quick Edit
        </MenuItem>

        <MenuItem onClick={popover.onClose} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
