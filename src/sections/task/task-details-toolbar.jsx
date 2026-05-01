import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { alpha, useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import { useTranslation } from 'react-i18next';
import { Iconify } from 'src/components/iconify';

export default function TaskDetailsToolbar({
  onBack,
  status,
  elapsedTime,
  totalEstimated,
  formatTime,
  formatDecimalTime
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Stack direction="row" alignItems="center" spacing={3}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            width: 44,
            height: 44,
            display: 'flex',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha('#00a8e8', 0.1),
            color: '#00a8e8',
          }}
        >
          <Iconify icon="solar:clock-circle-bold" width={24} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ color: '#00a8e8', fontWeight: 800, lineHeight: 1 }}>
            {formatTime(elapsedTime)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            {status === 'completed' ? (t('task.details.totalTimeSpent') || 'Total Time Spent') : t('task.details.timeElapsed')}
          </Typography>
        </Box>
      </Stack>

      <Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />

      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            width: 44,
            height: 44,
            display: 'flex',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.secondary.main, 0.1),
            color: theme.palette.secondary.main,
          }}
        >
          <Iconify icon="solar:history-bold" width={24} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
            {formatDecimalTime(totalEstimated)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{t('task.details.totalEstimated')}</Typography>
        </Box>
      </Stack>

      <Button
        variant="contained"
        size="large"
        color={status === 'completed' ? 'success' : status === 'pending' ? 'warning' : 'info'}
        startIcon={<Iconify icon={status === 'completed' ? "solar:check-circle-bold" : "solar:clock-circle-bold"} />}
        sx={{ ml: 2, height: 48, px: 3, fontWeight: 'bold' }}
      >
        {status ? (t(`task.status.${status}`) || status) : 'N/A'}
      </Button>
    </Stack>
  );
}

TaskDetailsToolbar.propTypes = {
  onBack: PropTypes.func,
  status: PropTypes.string,
  elapsedTime: PropTypes.number,
  totalEstimated: PropTypes.number,
  formatTime: PropTypes.func,
  formatDecimalTime: PropTypes.func,
};
