import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Pagination from '@mui/material/Pagination';
import { alpha } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/dashboard/main';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';
import { useTickets } from 'src/features/support/useTickets';

import SupportTicketCard from '../support-ticket-card';

// ----------------------------------------------------------------------

export default function SupportListView() {
  const { t } = useTranslation();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useTickets({
    page,
    limit: 10,
    search,
    status: status !== 'all' ? status : undefined,
  });

  const tickets = data?.data || [];
  const pagination = data?.pagination || { totalPages: 1 };

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
    setPage(1);
  }, []);

  const handleFilterStatus = useCallback((event, newValue) => {
    setStatus(newValue);
    setPage(1);
  }, []);

  const handleChangePage = useCallback((event, value) => {
    setPage(value);
  }, []);

  const { user } = useSelector((state) => state.auth);
  const isSuperAdmin = user?.role === 'superAdmin';

  const STATUS_OPTIONS_TRANSLATED = [
    { value: 'all', label: t('support.status.all') },
    { value: 'new', label: t('support.status.new') },
    { value: 'on-going', label: t('support.status.on_going') },
    { value: 'resolved', label: t('support.status.resolved') },
  ];

  return (
    <DashboardContent maxWidth={false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Stack spacing={1}>
          <Typography variant="h4">{t('support.list_title')}</Typography>
          <Breadcrumbs
            separator={
              <Box
                component="span"
                sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
              />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.root)} sx={{ cursor: 'pointer' }}>
              {t('common.dashboard')}
            </Link>
            <Typography color="text.primary">{t('nav.support')}</Typography>
          </Breadcrumbs>
        </Stack>

        {!isSuperAdmin && (
          <Button
            component={RouterLink}
            href={paths.dashboard.support.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ bgcolor: '#00334e' }}
          >
            {t('support.new_ticket')}
          </Button>
        )}
      </Stack>

      <Stack spacing={3}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            placeholder={t('support.search_placeholder')}
            value={search}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            label={t('support.select_status')}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            {STATUS_OPTIONS_TRANSLATED.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label={t('support.date_filter')}
            defaultValue="this_week"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="this_week">{t('support.this_week')}</MenuItem>
            <MenuItem value="last_week">{t('support.last_week')}</MenuItem>
            <MenuItem value="this_month">{t('support.this_month')}</MenuItem>
          </TextField>
        </Stack>

        {isLoading ? (
          <Box sx={{ py: 10, textAlign: 'center' }}>{t('support.loading')}</Box>
        ) : (
          <>
            {tickets.length > 0 ? (
              <Stack spacing={2}>
                {tickets.map((ticket) => (
                  <SupportTicketCard key={ticket._id} ticket={ticket} />
                ))}
              </Stack>
            ) : (
              <SearchNotFound query={search} />
            )}
          </>
        )}

        {pagination.totalPages > 1 && (
          <Stack alignItems="center" sx={{ mt: 5 }}>
            <Pagination
              count={pagination.totalPages}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Stack>
        )}
      </Stack>
    </DashboardContent>
  );
}
