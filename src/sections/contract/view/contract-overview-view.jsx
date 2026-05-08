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
  Cell,
  Legend
} from 'recharts';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useContracts } from 'src/features/contract/useContracts';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { DashboardContent } from 'src/layouts/dashboard/main';

// ----------------------------------------------------------------------

export function ContractOverviewView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const user = useSelector((state) => state.auth.user);
  const isSuperAdmin = user?.role === 'super_admin';

  // Fetch contracts
  const { data, isLoading } = useContracts({ limit: 100 });
  const contracts = data?.data || [];

  // Calculate status counts
  const totalContracts = contracts.length;
  const activeContracts = contracts.filter((c) => c.status === 'active').length;
  const draftContracts = contracts.filter((c) => c.status === 'draft' || c.status === 'pending').length;
  const completedContracts = contracts.filter((c) => c.status === 'completed').length;
  const cancelledContracts = contracts.filter((c) => c.status === 'cancelled').length;

  // Mock monthly trends based on actual status
  const monthlyData = [
    { name: 'Jan', active: 4, pending: 2, completed: 5 },
    { name: 'Feb', active: 6, pending: 4, completed: 7 },
    { name: 'Mar', active: 9, pending: 5, completed: 10 },
    { name: 'Apr', active: activeContracts || 12, pending: draftContracts || 4, completed: completedContracts || 12 },
  ];

  const pieData = [
    { name: t('contract.table.active') || 'Active', value: activeContracts || 1, color: theme.palette.success.main },
    { name: t('contract.table.pending') || 'Draft', value: draftContracts || 1, color: theme.palette.warning.main },
    { name: t('contract.table.completed') || 'Completed', value: completedContracts || 1, color: theme.palette.info.main },
    { name: t('contract.table.cancelled') || 'Cancelled', value: cancelledContracts || 1, color: theme.palette.error.main },
  ];

  const recentContracts = contracts.slice(0, 5);

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
          <Typography variant="h4">{t('contract_overview') || 'Contract Overview'}</Typography>
          <Breadcrumbs
            separator={
              <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push('/dashboard')} sx={{ cursor: 'pointer' }}>
              {t('nav.dashboard') || 'Dashboard'}
            </Link>
            <Typography color="text.primary">{t('contract_overview') || 'Contract Overview'}</Typography>
          </Breadcrumbs>
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push(paths.dashboard.contract.new)}
            sx={{ boxShadow: theme.customShadows?.z8 }}
          >
            {t('nav.contract_create') || 'Create Contract'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:list-bold" />}
            onClick={() => router.push(paths.dashboard.contract.all)}
          >
            {t('nav.contract_all') || 'View All Contracts'}
          </Button>
        </Stack>
      </Stack>

      {/* STATS WIDGETS SECTION */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: t('contract.table.totalContracts') || 'Total Contracts',
            count: totalContracts,
            icon: 'solar:document-bold',
            color: 'primary',
            bg: theme.palette.primary.light,
            text: theme.palette.primary.dark,
          },
          {
            title: t('contract.table.active') || 'Active Contracts',
            count: activeContracts,
            icon: 'solar:play-circle-bold',
            color: 'success',
            bg: theme.palette.success.light,
            text: theme.palette.success.dark,
          },
          {
            title: t('contract.table.pending') || 'Draft / Pending',
            count: draftContracts,
            icon: 'solar:clock-circle-bold',
            color: 'warning',
            bg: theme.palette.warning.light,
            text: theme.palette.warning.dark,
          },
          {
            title: t('contract.table.completed') || 'Completed',
            count: completedContracts,
            icon: 'solar:check-circle-bold',
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
        {/* Monthly Contract Trend Chart */}
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
              {t('contract.analytics.trends') || 'Contract Trends'}
            </Typography>
            <Box sx={{ height: 320, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.info.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.palette.info.main} stopOpacity={0} />
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
                    dataKey="active"
                    stroke={theme.palette.success.main}
                    fillOpacity={1}
                    fill="url(#colorActive)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke={theme.palette.info.main}
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
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
              {t('contract.analytics.distribution') || 'Contract Distribution'}
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

      {/* RECENT CONTRACTS TABLE SECTION */}
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: theme.customShadows?.z4,
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6">{t('contract.table.recentContracts') || 'Recent Contracts'}</Typography>
          <Button
            size="small"
            color="primary"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
            onClick={() => router.push(paths.dashboard.contract.all)}
          >
            {t('common.viewAll') || 'View All'}
          </Button>
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 720 }}>
            <TableHead sx={{ bgcolor: theme.palette.background.neutral }}>
              <TableRow>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{t('contract.table.contractName') || 'Contract Name'}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{t('contract.table.category') || 'Category'}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{t('contract.table.company') || 'Company'}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{t('contract.table.status') || 'Status'}</TableCell>
                <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{t('contract.table.action') || 'Action'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentContracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('contract.table.noData') || 'No contracts found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                recentContracts.map((row) => (
                  <TableRow key={row._id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {row.contractName || 'Unnamed Contract'}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.contractCategory || 'General'}</TableCell>
                    <TableCell>{row.companyId?.companyName || 'N/A'}</TableCell>
                    <TableCell>
                      <Label
                        variant="soft"
                        color={
                          row.status === 'active'
                            ? 'success'
                            : row.status === 'draft' || row.status === 'pending'
                            ? 'warning'
                            : row.status === 'completed'
                            ? 'info'
                            : 'error'
                        }
                      >
                        {row.status}
                      </Label>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => router.push(paths.dashboard.contract.details(row._id))}
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
