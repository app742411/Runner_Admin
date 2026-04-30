import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { useTranslation } from 'react-i18next';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function UserTableToolbar({
  filters,
  onFilters,
  //
  roleOptions,
  companyOptions,
  cityOptions,
}) {
  const { t } = useTranslation();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('search', event.target.value);
    },
    [onFilters]
  );

  const handleFilterRole = useCallback(
    (event) => {
      onFilters('role', event.target.value);
    },
    [onFilters]
  );

  const handleFilterCompany = useCallback(
    (event) => {
      onFilters('company', event.target.value);
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
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel>{t('user.filter.role')}</InputLabel>
        <Select
          value={filters.role}
          onChange={handleFilterRole}
          input={<OutlinedInput label={t('user.filter.role')} />}
          sx={{ textTransform: 'capitalize' }}
        >
          <MenuItem value="all">{t('user.filter.all') || 'All'}</MenuItem>
          {roleOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel>{t('user.filter.companyName')}</InputLabel>
        <Select
          value={filters.company}
          onChange={handleFilterCompany}
          input={<OutlinedInput label={t('user.filter.companyName')} />}
          sx={{ textTransform: 'capitalize' }}
        >
          <MenuItem value="all">{t('user.filter.all')}</MenuItem>
          {companyOptions.map((option) => (
            <MenuItem key={option.companyId} value={option.companyId}>
              {option.companyName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel>{t('user.filter.city')}</InputLabel>
        <Select
          value={filters.city}
          onChange={handleFilterCity}
          input={<OutlinedInput label={t('user.filter.city')} />}
          sx={{ textTransform: 'capitalize' }}
        >
          <MenuItem value="all">{t('user.filter.all')}</MenuItem>
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
          value={filters.search}
          onChange={handleFilterName}
          placeholder={t('user.filter.search')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Stack>
  );
}
