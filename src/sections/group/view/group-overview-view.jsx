import { useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTheme, alpha } from '@mui/material/styles';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useGroups } from 'src/features/group/useGroups';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { DashboardContent } from 'src/layouts/dashboard/main';

// ----------------------------------------------------------------------

export function GroupOverviewView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  // Fetch groups
  const { data, isLoading } = useGroups({ limit: 100 });
  const groups = data?.data || [];

  // Calculate stats
  const totalGroups = groups.length;
  const activeGroups = groups.filter((g) => g.status !== 'inactive').length;
  const totalMembersCount = groups.reduce((acc, g) => acc + (g.members?.length || 0), 0);
  const groupsWithAdmin = groups.filter((g) => !!g.groupAdmin).length;

  // Mock engagement/trends data
  const trendsData = [
    { name: 'Jan', members: 12, groups: 2 },
    { name: 'Feb', members: 28, groups: 4 },
    { name: 'Mar', members: 45, groups: 6 },
    { name: 'Apr', members: totalMembersCount || 60, groups: totalGroups || 8 },
  ];

  const pieData = groups.slice(0, 4).map((g, index) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.info.main,
    ];
    return {
      name: g.groupName || `Group ${index + 1}`,
      value: g.members?.length || 2,
      color: colors[index % colors.length],
    };
  });

  // If pieData is empty, add mock default data
  if (pieData.length === 0) {
    pieData.push(
      { name: 'Default Group', value: 4, color: theme.palette.primary.main }
    );
  }

  const recentGroups = groups.slice(0, 5);

  if (isLoading) {
    return (
      <DashboardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth={false}>
      {/* HEADER SECTION */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Stack spacing={1}>
          <Typography variant="h4">{t('group_overview') || 'Group Overview'}</Typography>
          <Breadcrumbs
            separator={
              <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push('/dashboard')} sx={{ cursor: 'pointer' }}>
              {t('nav.dashboard') || 'Dashboard'}
            </Link>
            <Typography color="text.primary">{t('group_overview') || 'Group Overview'}</Typography>
          </Breadcrumbs>
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push(paths.dashboard.group.new)}
            sx={{ boxShadow: theme.customShadows?.z8 }}
          >
            {t('nav.group_create') || 'Create Group'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:list-bold" />}
            onClick={() => router.push(paths.dashboard.group.list)}
          >
            {t('nav.group_all') || 'View All Groups'}
          </Button>
        </Stack>
      </Stack>

      {/* STATS WIDGETS SECTION */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: t('group.stats.totalGroups') || 'Total Groups',
            count: totalGroups,
            icon: 'solar:users-group-two-rounded-bold',
            color: 'primary',
            bg: theme.palette.primary.light,
            text: theme.palette.primary.dark,
          },
          {
            title: t('group.stats.activeGroups') || 'Active Groups',
            count: activeGroups,
            icon: 'solar:play-circle-bold',
            color: 'success',
            bg: theme.palette.success.light,
            text: theme.palette.success.dark,
          },
          {
            title: t('group.stats.totalMembers') || 'Total Members',
            count: totalMembersCount,
            icon: 'solar:user-bold',
            color: 'warning',
            bg: theme.palette.warning.light,
            text: theme.palette.warning.dark,
          },
          {
            title: t('group.stats.groupsWithAdmin') || 'Admin Assigned',
            count: groupsWithAdmin,
            icon: 'solar:shield-check-bold',
            color: 'info',
            bg: theme.palette.info.light,
            text: theme.palette.info.dark,
          },
        ].map((stat, i) => (
          <Grid key={i} xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: theme.customShadows?.z4,
                bgcolor: 'background.paper',
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <CardContent sx={{ p: 3 }}>
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
                      width: 54,
                      height: 54,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(stat.bg, 0.15),
                      color: stat.text,
                    }}
                  >
                    <Iconify icon={stat.icon} width={28} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CHARTS SECTION */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Monthly Group Trends Chart */}
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
              {t('group.analytics.trends') || 'Group Member Trends'}
            </Typography>
            <Box sx={{ height: 320, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                    dataKey="members"
                    stroke={theme.palette.primary.main}
                    fillOpacity={1}
                    fill="url(#colorMembers)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Status Distribution Pie Chart */}
        <Grid xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              borderRadius: 2,
              height: '100%',
              boxShadow: theme.customShadows?.z4,
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              {t('group.analytics.distribution') || 'Member Distribution'}
            </Typography>
            <Box sx={{ height: 260, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: 8,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              {pieData.map((item, index) => (
                <Stack key={index} direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography variant="body2" color="text.secondary">
                      {item.name}
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle2">{item.value}</Typography>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* RECENT GROUPS TABLE SECTION */}
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: theme.customShadows?.z4,
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6">{t('group.table.recentGroups') || 'Recent Groups'}</Typography>
          <Button
            size="small"
            color="primary"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
            onClick={() => router.push(paths.dashboard.group.list)}
          >
            {t('common.viewAll') || 'View All'}
          </Button>
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 720 }}>
            <TableHead sx={{ bgcolor: theme.palette.background.neutral }}>
              <TableRow>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{t('group.table.groupName') || 'Group Name'}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{t('group.table.admin') || 'Group Admin'}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{t('group.table.membersCount') || 'Members Count'}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{t('group.table.contractsCount') || 'Contracts Count'}</TableCell>
                <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{t('group.table.action') || 'Action'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('group.table.noData') || 'No groups found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                recentGroups.map((row) => (
                  <TableRow key={row._id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {row.groupName || 'Unnamed Group'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {row.groupAdmin ? `${row.groupAdmin.firstName || ''} ${row.groupAdmin.lastName || ''}` : 'No Admin'}
                    </TableCell>
                    <TableCell>{row.members?.length || 0}</TableCell>
                    <TableCell>{row.contracts?.length || 0}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => router.push(paths.dashboard.group.details(row._id))}
                      >
                        {t('common.view') || 'View'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </DashboardContent>
  );
}
