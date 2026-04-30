import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ReportForm() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Card sx={{ p: 4, borderRadius: 2, boxShadow: theme.customShadows.z1 }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
          <TextField
              select
              fullWidth
              defaultValue=""
              placeholder={t('report.select')}
              label={t('report.select')}
              sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                }
              }}
          >
              <MenuItem value="users">{t('report.types.user')}</MenuItem>
              <MenuItem value="companies">{t('report.types.company')}</MenuItem>
              <MenuItem value="tasks">{t('report.types.task')}</MenuItem>
              <MenuItem value="financial">{t('report.types.financial')}</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label={t('report.startDate')}
            placeholder="24/05/2026"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Iconify icon="solar:calendar-bold" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
              }
            }}
          />

          <TextField
            fullWidth
            label={t('report.endDate')}
            placeholder="24/05/2026"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Iconify icon="solar:calendar-bold" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
              }
            }}
          />
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            sx={{
              bgcolor: '#001b2e',
              color: 'white',
              px: 4,
              py: 1.25,
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#002642' },
              borderRadius: 1.5,
            }}
          >
            {t('report.generate')}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
