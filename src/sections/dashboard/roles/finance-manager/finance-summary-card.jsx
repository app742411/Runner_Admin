import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

export function FinanceSummaryCard({ title, amount, subtitle, color = 'primary', percent, trend }) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Card sx={{ p: 3, borderRadius: 2, boxShadow: 'none', border: (theme) => `1px solid ${theme.palette.divider}` }}>
      <Stack spacing={0.5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            {title}
          </Typography>
          <Box sx={{ px: 0.75, py: 0.25, borderRadius: 0.5, bgcolor: 'background.neutral' }}>
             <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{t('finance_dashboard.thisMonth')}</Typography>
          </Box>
        </Stack>

        <Typography variant="h3">{amount}</Typography>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          {percent && (
            <Typography
              variant="caption"
              sx={{
                color: percent > 0 ? 'success.main' : 'error.main',
                fontWeight: 'bold',
              }}
            >
              {percent > 0 ? '+' : ''}{percent}%
            </Typography>
          )}
          <Typography variant="caption" sx={{ color: trend === 'down' ? 'error.main' : 'text.secondary' }}>
            {subtitle}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
