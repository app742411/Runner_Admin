import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import LinearProgress from '@mui/material/LinearProgress';
import { useTheme, alpha } from '@mui/material/styles';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { DashboardContent } from 'src/layouts/dashboard/main';

// ----------------------------------------------------------------------

const performanceData = [
  { time: '09:00', cpu: 22, memory: 45, latency: 120 },
  { time: '10:00', cpu: 45, memory: 52, latency: 150 },
  { time: '11:00', cpu: 65, memory: 58, latency: 210 },
  { time: '12:00', cpu: 35, memory: 50, latency: 130 },
  { time: '13:00', cpu: 28, memory: 48, latency: 110 },
  { time: '14:00', cpu: 55, memory: 60, latency: 180 },
  { time: '15:00', cpu: 78, memory: 65, latency: 250 },
  { time: '16:00', cpu: 40, memory: 55, latency: 140 },
];

export function SystemReportsView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  return (
    <DashboardContent maxWidth={false}>
      {/* HEADER */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Stack spacing={1}>
          <Typography variant="h4">{t('system.reports.title') || 'System Reports'}</Typography>
          <Breadcrumbs
            separator={
              <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push('/dashboard')} sx={{ cursor: 'pointer' }}>
              {t('nav.dashboard') || 'Dashboard'}
            </Link>
            <Typography color="text.primary">{t('system.reports.title') || 'System Reports'}</Typography>
          </Breadcrumbs>
        </Stack>
      </Stack>

      {/* METRICS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Server Status', value: 'Healthy', icon: 'solar:bolt-bold', color: 'success', progress: 100 },
          { title: 'CPU Usage', value: '42%', icon: 'solar:cpu-bold', color: 'primary', progress: 42 },
          { title: 'Memory Allocated', value: '58%', icon: 'solar:database-bold', color: 'info', progress: 58 },
          { title: 'API Response Time', value: '145 ms', icon: 'solar:clock-circle-bold', color: 'warning', progress: 85 },
        ].map((item, index) => (
          <Grid key={index} xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: theme.customShadows?.z4,
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  {item.title}
                </Typography>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette[item.color].main, 0.15),
                    color: theme.palette[item.color].main,
                  }}
                >
                  <Iconify icon={item.icon} width={22} />
                </Box>
              </Stack>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                {item.value}
              </Typography>
              <LinearProgress variant="determinate" value={item.progress} color={item.color} sx={{ height: 6, borderRadius: 3 }} />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CHARTS */}
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z4,
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              CPU & Memory Allocation Trends
            </Typography>
            <Box sx={{ height: 320, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <XAxis dataKey="time" stroke={theme.palette.text.disabled} fontSize={12} tickLine={false} />
                  <YAxis stroke={theme.palette.text.disabled} fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: 8,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cpu"
                    stroke={theme.palette.primary.main}
                    fill={alpha(theme.palette.primary.main, 0.15)}
                    strokeWidth={2}
                    name="CPU Usage (%)"
                  />
                  <Area
                    type="monotone"
                    dataKey="memory"
                    stroke={theme.palette.info.main}
                    fill={alpha(theme.palette.info.main, 0.1)}
                    strokeWidth={2}
                    name="Memory (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z4,
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              Response Latency (ms)
            </Typography>
            <Box sx={{ height: 320, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <XAxis dataKey="time" stroke={theme.palette.text.disabled} fontSize={12} tickLine={false} />
                  <YAxis stroke={theme.palette.text.disabled} fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: 8,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  />
                  <Bar dataKey="latency" fill={theme.palette.warning.main} radius={[4, 4, 0, 0]} name="Latency (ms)" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
