import { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers';

import { useTranslation } from 'react-i18next';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ContractTableToolbar({
  filters,
  onFilters,
  companyOptions,
  hideCompany,
}) {
  const { t } = useTranslation();

  const handleFilterSearch = useCallback(
    (event) => {
      onFilters('search', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      onFilters('startDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onFilters('endDate', newValue);
    },
    [onFilters]
  );

  const handleFilterCompany = useCallback(
    (event) => {
      onFilters('company', event.target.value);
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
      {!hideCompany && (
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
            {t('contract.table.company')}
          </Typography>
          <Select
            value={filters.company}
            onChange={handleFilterCompany}
            displayEmpty
            sx={{ textTransform: 'capitalize' }}
          >
            <MenuItem value="all">{t('company.list.all') || 'All'}</MenuItem>
            {companyOptions.map((option) => (
              <MenuItem key={option.companyId} value={option.companyId}>
                {option.companyName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <DatePicker
        label={t('contract.form.startDate')}
        value={filters.startDate}
        onChange={handleFilterStartDate}
        slotProps={{ textField: { fullWidth: true, sx: { maxWidth: { md: 180 } } } }}
      />

      <DatePicker
        label={t('contract.form.endDate')}
        value={filters.endDate}
        onChange={handleFilterEndDate}
        slotProps={{ textField: { fullWidth: true, sx: { maxWidth: { md: 180 } } } }}
      />

      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.search || ''}
          onChange={handleFilterSearch}
          placeholder={t('contract.searchIdOrCompany')}
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
