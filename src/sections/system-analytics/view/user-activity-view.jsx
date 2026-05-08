import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { useTheme, alpha } from '@mui/material/styles';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { DashboardContent } from 'src/layouts/dashboard/main';

// ----------------------------------------------------------------------

const engagementData = [
  { name: 'Mon', logins: 120, actions: 340 },
  { name: 'Tue', logins: 150, actions: 410 },
  { name: 'Wed', logins: 220, actions: 580 },
  { name: 'Thu', logins: 190, actions: 490 },
  { name: 'Fri', logins: 250, actions: 640 },
  { name: 'Sat', logins: 80, actions: 190 },
  { name: 'Sun', logins: 95, actions: 220 },
];

const ACTIVITIES = [
  { id: 1, type: 'login', user: 'Anand (Super Admin)', time: '5 mins ago', description: 'Logged into Super Admin panel' },
  { id: 2, type: 'group', user: 'John Doe (Company Admin)', time: '12 mins ago', description: 'Created new Group: Alpha Team' },
  { id: 3, type: 'contract', user: 'Maria (Client)', time: '45 mins ago', description: 'Approved Contract #CON-9831' },
  { id: 4, type: 'settings', user: 'Developer', time: '1 hour ago', description: 'Updated general localization settings' },
];

export function UserActivityView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  return (
    <DashboardContent maxWidth={false}>
      {/* HEADER */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Stack spacing={1}>
          <Typography variant="h4">{t('system.activity.title') || 'User Activity Reports'}</Typography>
          <Breadcrumbs
            separator={
              <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push('/dashboard')} sx={{ cursor: 'pointer' }}>
              {t('nav.dashboard') || 'Dashboard'}
            </Link>
            <Typography color="text.primary">{t('system.activity.title') || 'User Activity'}</Typography>
          </Breadcrumbs>
        </Stack>
      </Stack>

      {/* OVERVIEW STATS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Active Sessions', count: '1,240', icon: 'solar:users-group-rounded-bold', color: 'primary' },
          { title: 'New Registrations', count: '48', icon: 'solar:user-plus-bold', color: 'success' },
          { title: 'Page Views / Min', count: '380', icon: 'solar:eye-bold', color: 'info' },
          { title: 'Active Clients', count: '412', icon: 'solar:shop-bold', color: 'warning' },
        ].map((stat, i) => (
          <Grid key={i} xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: theme.customShadows?.z4,
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    {stat.count}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette[stat.color].main, 0.15),
                    color: theme.palette[stat.color].main,
                  }}
                >
                  <Iconify icon={stat.icon} width={24} />
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CHARTS & TIMELINE */}
      <Grid container spacing={3}>
        {/* Engagement Chart */}
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
              User Engagement Trends
            </Typography>
            <Box sx={{ height: 350, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData}>
                  <XAxis dataKey="name" stroke={theme.palette.text.disabled} fontSize={12} tickLine={false} />
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
                    dataKey="logins"
                    stroke={theme.palette.primary.main}
                    fill={alpha(theme.palette.primary.main, 0.15)}
                    strokeWidth={2}
                    name="Daily Logins"
                  />
                  <Area
                    type="monotone"
                    dataKey="actions"
                    stroke={theme.palette.success.main}
                    fill={alpha(theme.palette.success.main, 0.1)}
                    strokeWidth={2}
                    name="User Actions"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Activity Timeline */}
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
              Live Activity Stream
            </Typography>
            <Timeline position="right">
              {ACTIVITIES.map((act, index) => (
                <TimelineItem key={act.id}>
                  <TimelineSeparator>
                    <TimelineDot
                      color={
                        act.type === 'login'
                          ? 'primary'
                          : act.type === 'group'
                          ? 'success'
                          : act.type === 'contract'
                          ? 'info'
                          : 'warning'
                      }
                    >
                      <Iconify
                        icon={
                          act.type === 'login'
                            ? 'solar:key-bold'
                            : act.type === 'group'
                            ? 'solar:users-group-rounded-bold'
                            : act.type === 'contract'
                            ? 'solar:document-bold'
                            : 'solar:settings-bold'
                        }
                        width={14}
                      />
                    </TimelineDot>
                    {index < ACTIVITIES.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {act.user}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {act.time}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {act.description}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
