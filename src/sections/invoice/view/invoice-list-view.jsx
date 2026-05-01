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
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { fDate, fDateTime } from 'src/utils/format-time';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { SearchNotFound } from 'src/components/search-not-found';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { useInvoices, useSendInvoice } from 'src/features/invoice/useInvoices';

// ----------------------------------------------------------------------

export function InvoiceListView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const TABLE_HEAD = [
    { id: 'checkbox', label: '', width: 48 },
    { id: 'invoiceNumber', label: t('invoice.table.invoiceName') },
    { id: 'clientName', label: t('invoice.table.clientName') },
    { id: 'amount', label: t('invoice.table.amount') },
    { id: 'dueDate', label: t('invoice.table.dueDate') },
    { id: 'status', label: t('invoice.table.status') },
    { id: 'action', label: t('invoice.table.action'), align: 'right', width: 48 },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [dense, setDense] = useState(false);
  const [selected, setSelected] = useState([]);

  const { data, isLoading } = useInvoices({
    page: page + 1,
    limit: rowsPerPage,
    search: searchQuery || undefined,
  });

  const tableData = data?.data || [];
  const totalRows = data?.pagination?.total || data?.total || tableData.length || 0;

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.invoice.details(id));
    },
    [router]
  );

  const handleSelectAllRows = useCallback(
    (checked) => {
      if (checked) {
        setSelected(tableData.map((row) => row._id));
        return;
      }
      setSelected([]);
    },
    [tableData]
  );

  const handleSelectRow = useCallback(
    (id) => {
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
    },
    [selected]
  );

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
            {t('invoice.title')}
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
              {t('nav.dashboard')}
            </Link>
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.invoice?.root || '#')} sx={{ cursor: 'pointer' }}>
              {t('nav.invoice')}
            </Link>
            <Typography color="text.primary">{t('invoice.list')}</Typography>
          </Breadcrumbs>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:cloud-download-fill" />}
            color="inherit"
          >
            {t('invoice.export')}
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('invoice.newInvoice')}
          </Button>
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
              {t('invoice.filters')}
            </Typography>
            <Select
              value="featured"
              displayEmpty
              onChange={() => { }}
            >
              <MenuItem value="featured">{t('invoice.sortBy')}</MenuItem>
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
                      sx={{ width: headCell.width, minWidth: headCell.minWidth }}
                    >
                      {headCell.id === 'checkbox' ? (
                        <Checkbox
                          indeterminate={selected.length > 0 && selected.length < tableData.length}
                          checked={tableData.length > 0 && selected.length === tableData.length}
                          onChange={(event) => handleSelectAllRows(event.target.checked)}
                        />
                      ) : (
                        headCell.label
                      )}
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
                      <InvoiceTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => handleSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                      />
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
          <Box sx={{ flexGrow: 1 }} />
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

function InvoiceTableRow({ row, selected, onSelectRow, onViewRow }) {
  const { t } = useTranslation();
  const popover = usePopover();
  const sendInvoice = useSendInvoice();

  const handleSendInvoice = useCallback(
    async () => {
      try {
        popover.onClose();
        await sendInvoice.mutateAsync(row._id);
        toast.success(t('invoice.send_success'));
      } catch (error) {
        toast.error(t('invoice.send_error'));
      }
    },
    [sendInvoice, row._id, popover]
  );

  return (
    <>
      <TableRow
        hover
        selected={selected}
        onClick={onViewRow}
        sx={{ cursor: 'pointer' }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={(e) => {
              e.stopPropagation();
              onSelectRow();
            }}
          />
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" sx={{ fontWeight: '600' }}>
            {row.invoiceNumber}
          </Typography>
        </TableCell>

        <TableCell>{row.client?.name || '-'}</TableCell>

        <TableCell>
          CHF{row.amount?.toFixed(2)}
        </TableCell>

        <TableCell>{fDateTime(row.dueDate)}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'paid' && 'success') ||
              (row.status === 'unpaid' && 'error') ||
              (row.status === 'draft' && 'warning') ||
              (row.status === 'pending' && 'warning') ||
              'default'
            }
          >
            {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
          </Label>
        </TableCell>

        <TableCell align="right">
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
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          {t('invoice.popover.view')}
        </MenuItem>

        <MenuItem
          onClick={handleSendInvoice}
          disabled={sendInvoice.isPending}
        >
          <Iconify icon="solar:paper-plane-bold" />
          {t('invoice.send_invoice')}
        </MenuItem>

        <MenuItem onClick={popover.onClose}>
          <Iconify icon="solar:pen-bold" />
          {t('common.edit')}
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={popover.onClose} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('common.delete')}
        </MenuItem>
      </CustomPopover>
    </>
  );
}
