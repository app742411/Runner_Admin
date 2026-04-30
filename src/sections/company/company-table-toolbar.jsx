import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CompanyTableToolbar({
  filters,
  onFilters,
  //
  cityOptions,
  hideSubscription = false,
}) {
  const { t } = useTranslation();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStatus = useCallback(
    (event) => {
      onFilters('subscriptionStatus', event.target.value);
    },
    [onFilters]
  );

  const handleFilterCity = useCallback(
    (event) => {
      onFilters('city', event.target.value);
    },
    [onFilters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      {!hideSubscription && (
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
            {t('company.table.subscription')}
          </Typography>
          <Select
            value={filters.subscriptionStatus}
            onChange={handleFilterStatus}
            displayEmpty
            sx={{ textTransform: 'capitalize' }}
          >
            <MenuItem value="all">{t('company.list.all')}</MenuItem>
            <MenuItem value="active">{t('company.table.status.active')}</MenuItem>
            <MenuItem value="inactive">{t('company.table.status.inactive')}</MenuItem>
          </Select>
        </FormControl>
      )}

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
          {t('company.list.city')}
        </Typography>
        <Select
          value={filters.city}
          onChange={handleFilterCity}
          displayEmpty
          sx={{ textTransform: 'capitalize' }}
        >
          <MenuItem value="all">{t('company.list.all')}</MenuItem>
          {cityOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.name || ''}
          onChange={handleFilterName}
          placeholder={t('company.list.search')}
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
  );
}
