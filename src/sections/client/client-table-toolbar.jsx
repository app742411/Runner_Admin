import { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';

import { useTranslation } from 'react-i18next';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ClientTableToolbar({ filters, onFilters }) {
  const { t } = useTranslation();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
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
          {t('client.filters')}
        </Typography>
        <Select
          value="featured"
          displayEmpty
          onChange={() => {}}
        >
          <MenuItem value="featured">{t('client.featured')}</MenuItem>
          <MenuItem value="newest">{t('client.newest')}</MenuItem>
          <MenuItem value="oldest">{t('client.oldest')}</MenuItem>
        </Select>
      </FormControl>

      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.name || ''}
          onChange={handleFilterName}
          placeholder={t('client.search')}
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

