import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import { Iconify } from 'src/components/iconify';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function CompanyRecentActivity({ list = [] }) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Card sx={{ p: 3, borderRadius: 2, height: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 3 }}>
        {t('dashboard.recentActivity.title')}
      </Typography>

      <Stack spacing={2.5} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
        {list.map((activity) => (
          <Stack key={activity._id} direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(activity.status === 'completed' ? '#36B37E' : '#FFAB00', 0.12),
                flexShrink: 0,
              }}
            >
              <Iconify 
                icon={activity.status === 'completed' ? 'solar:check-circle-bold' : 'solar:clock-circle-bold'} 
                width={20} 
                sx={{ color: activity.status === 'completed' ? '#36B37E' : '#FFAB00' }} 
              />
            </Box>

            <Stack spacing={0.25} flexGrow={1}>
              <Typography variant="subtitle2" noWrap>{activity.subTaskName}</Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {dayjs(activity.updatedAt).fromNow()}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        sx={{ mt: 3, pt: 2, borderTop: `dashed 1px ${theme.palette.divider}`, cursor: 'pointer', color: 'text.primary' }}
      >
        <Typography variant="subtitle2">{t('dashboard.recentActivity.viewAll')}</Typography>
        <Iconify icon="solar:arrow-right-up-bold" width={18} sx={{ ml: 0.5 }} />
      </Stack>
    </Card>
  );
}
