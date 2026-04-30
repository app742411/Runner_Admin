import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function StatCard({ title, total, percent, color, icon, sparkData, sx, ...other }) {
  const isPositive = percent >= 0;

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundImage: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.25)} 100%)`,
        boxShadow: 'none',
        position: 'relative',
        overflow: 'hidden',
        height: 1,
        border: `1px solid ${alpha(color, 0.05)}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        ...sx,
      }}
      {...other}
    >
      {/* Background Dotted Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '8px 8px',
          color: color,
        }}
      />

      <Stack spacing={3}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box
            sx={{
              width: 48,
              height: 48,
              display: 'flex',
              borderRadius: 2,
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: color,
              color: 'common.white',
              boxShadow: `0 8px 16px 0 ${alpha(color, 0.4)}`,
            }}
          >
            <Iconify icon={icon} width={28} />
          </Box>

          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: isPositive ? 'success.dark' : 'error.dark' }}>
            <Iconify
              icon={isPositive ? 'solar:double-alt-arrow-up-bold-duotone' : 'solar:double-alt-arrow-down-bold-duotone'}
              width={20}
            />
            <Typography variant="subtitle2" sx={{ fontWeight: '800' }}>
              {isPositive ? '+' : ''}{percent}%
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={0.5}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'capitalize' }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: '900', letterSpacing: -0.5 }}>
            {total}
          </Typography>
        </Stack>
      </Stack>

      {sparkData && sparkData.length > 0 && (
        <Box sx={{ height: 60, width: '100%', mt: 2, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={3}
                dot={false}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Card>
  );
}
