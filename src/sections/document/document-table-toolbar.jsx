import { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';

import { useTranslation } from 'react-i18next';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function DocumentTableToolbar({ filters, onFilters, isSuperAdmin, companies }) {
  const { t } = useTranslation();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterCompany = useCallback(
    (event) => {
      onFilters('companyId', event.target.value);
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
      {isSuperAdmin && (
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
            {t('nav.company')}
          </Typography>
          <Select
            value={filters.companyId}
            onChange={handleFilterCompany}
            displayEmpty
          >
            <MenuItem value="">{t('company.list.all') || 'All Companies'}</MenuItem>
            {companies.map((company) => (
              <MenuItem key={company._id} value={company._id}>
                {company.companyName}
              </MenuItem>
            ))}
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
          {t('common.type') || 'Type'}
        </Typography>
        <Select
          value={filters.type}
          onChange={(e) => onFilters('type', e.target.value)}
        >
          <MenuItem value="employee">{t('nav.employee')}</MenuItem>
          <MenuItem value="contract">{t('nav.contract')}</MenuItem>
        </Select>
      </FormControl>

      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.name || ''}
          onChange={handleFilterName}
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
  );
}
