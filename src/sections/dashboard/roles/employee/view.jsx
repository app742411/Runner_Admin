import { useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  Stack,
  Tabs,
  Tab,
  Button,
  Avatar,
  LinearProgress,
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
import { useTranslation } from 'react-i18next';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { fCurrency } from 'src/utils/format-number';
import { useEmployeeDashboard } from 'src/features/employee/useEmployees';

// ----------------------------------------------------------------------

export default function EmployeeView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState('today');

  const { data: dashboardData, isLoading, error } = useEmployeeDashboard();
  const data = dashboardData?.data;

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (isLoading) return <Box sx={{ p: 5 }}><LinearProgress /></Box>;
  if (error) return <Box sx={{ p: 5 }}><Typography color="error">Error loading dashboard</Typography></Box>;

  const cards = data?.cards || {};
  const todayTasks = data?.todayTasks || [];
  const financial = data?.financial || {};
  const performance = data?.performance || {};
  const charts = data?.charts || {};
  const recentActivity = data?.recentActivity || [];

  const MONTH_NAMES = [
    t('months.jan'), t('months.feb'), t('months.mar'), t('months.apr'),
    t('months.may'), t('months.jun'), t('months.jul'), t('months.aug'),
    t('months.sep'), t('months.oct'), t('months.nov'), t('months.dec')
  ];

  const monthlyIncomeData = charts.monthlyIncome?.length > 0
    ? charts.monthlyIncome.map(item => ({
      name: MONTH_NAMES[item._id - 1] || `${t('dashboard.month')} ${item._id}`,
      income: item.total || 0
    }))
    : [{ name: t('common.na') || 'N/A', income: 0 }];

  const completionData = charts.weeklyStats?.length > 0
    ? charts.weeklyStats.map(item => ({
      name: `Week ${item._id}`,
      value: item.count || 0
    }))
    : [
      { name: 'Week 1', value: 0 },
      { name: 'Week 2', value: 0 },
      { name: 'Week 3', value: 0 },
      { name: 'Week 4', value: 0 },
    ];

  const totalAssigned = cards.totalAssigned || 0;

  const renderStatCard = (title, value, icon, color, bg) => (
    <Card sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 2,
      boxShadow: (theme) => `0 8px 24px 0 ${alpha(theme.palette.common.black, 0.05)}`,
      position: 'relative',
      overflow: 'hidden',
      height: 140,
      border: 'none',
      bgcolor: 'white'
    }}>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 0.5 }}>{value}</Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>{title}</Typography>
        <Button
          variant="text"
          size="small"
          endIcon={<Iconify icon="solar:alt-arrow-right-bold" width={14} />}
          sx={{ p: 0, mt: 1.5, color: '#ffab00', fontWeight: 700, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
        >
          {t('dashboard.viewDetails')}
        </Button>
      </Box>

      {/* Background Shape */}
      <Box sx={{
        position: 'absolute',
        top: -15,
        right: -15,
        width: 100,
        height: 100,
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        bgcolor: alpha(color, 0.08),
        zIndex: 0
      }} />

      <Box sx={{
        p: 1.8,
        borderRadius: 1.5,
        bgcolor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <Iconify icon={icon} width={34} color={color} />
      </Box>
    </Card>
  );

  const renderTaskItem = (title, due, status, earning, icon, priority = 'Medium', priorityColor = '#00b8d9') => (
    <Box sx={{
      p: 2.5,
      bgcolor: '#f8f9fa',
      borderRadius: 1.5,
      mb: 2,
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.2s',
      '&:hover': { bgcolor: '#f0f2f5', transform: 'translateY(-2px)' }
    }}>
      <Box sx={{
        width: 52,
        height: 52,
        borderRadius: 1,
        bgcolor: alpha(priorityColor, 0.1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mr: 2.5
      }}>
        <Iconify icon={icon} width={26} color={priorityColor} />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{t('dashboard.due', { due })}</Typography>
      </Box>

      <Stack direction="row" spacing={3} alignItems="center">
        <Label
          variant="soft"
          sx={{
            bgcolor: alpha(priorityColor, 0.15),
            color: priorityColor,
            fontWeight: 700,
            px: 1.5,
            height: 24,
            fontSize: 11
          }}
        >
          {t(`dashboard.priority.label`, { priority: t(`dashboard.priority.${priority.toLowerCase()}`) })}
        </Label>
        <Typography variant="h6" sx={{ color: '#22c55e', fontWeight: 800 }}>
          {fCurrency(earning)}
        </Typography>
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: '#ffffff', minHeight: '100vh' }}>
      {/* Top Stat Cards */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          {renderStatCard(t('dashboard.tasksAssigned'), totalAssigned, 'solar:notes-bold-duotone', '#fb8c00', alpha('#fb8c00', 0.08))}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderStatCard(t('dashboard.activeTask'), cards.activeTasks || 0, 'solar:layers-minimalistic-bold-duotone', '#00b8d9', alpha('#00b8d9', 0.08))}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderStatCard(t('dashboard.tasksCompleted'), cards.completedTasks || 0, 'solar:check-square-bold-duotone', '#22c55e', alpha('#22c55e', 0.08))}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderStatCard(t('dashboard.totalEarning'), fCurrency(cards.totalEarnings || 0), 'solar:wallet-bold-duotone', '#8e33ff', alpha('#8e33ff', 0.08))}
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Recent Work */}
          <Card sx={{ p: 4, mb: 4, borderRadius: 2, border: 'none', boxShadow: (theme) => `0 8px 24px 0 ${alpha(theme.palette.common.black, 0.05)}` }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{t('dashboard.taskOverview') || 'Task Overview'}</Typography>
              <Tabs
                value={currentTab}
                onChange={handleChangeTab}
                sx={{
                  bgcolor: '#f4f6f8',
                  borderRadius: 1.5,
                  p: 0.5,
                  minHeight: 'auto',
                  '& .MuiTabs-indicator': { display: 'none' }
                }}
              >
                <Tab value="today" label={t('dashboard.todaysTasks')} sx={{ borderRadius: 1, minHeight: 44, px: 3, fontWeight: 700, '&.Mui-selected': { bgcolor: 'white', color: '#2d62ed', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' } }} />
                <Tab value="completed" label={t('dashboard.completed')} sx={{ borderRadius: 1, minHeight: 44, px: 3, fontWeight: 700, '&.Mui-selected': { bgcolor: 'white', color: '#2d62ed', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' } }} />
                <Tab value="upcoming" label={t('dashboard.upcoming')} sx={{ borderRadius: 1, minHeight: 44, px: 3, fontWeight: 700, '&.Mui-selected': { bgcolor: 'white', color: '#2d62ed', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' } }} />
              </Tabs>
            </Stack>

            {todayTasks.length > 0 ? (
              todayTasks.map((task, idx) => (
                renderTaskItem(
                  task.subTaskName,
                  task.updatedAt ? dayjs(task.updatedAt).format('h:mm A') : '2:00 PM',
                  task.status,
                  task.subtaskPrice || (idx === 0 ? 120 : idx === 1 ? 85 : 50),
                  idx === 0 ? 'solar:code-bold' : idx === 1 ? 'solar:chart-square-bold' : 'solar:users-group-rounded-bold',
                  idx === 0 ? 'High' : idx === 1 ? 'Medium' : 'Low',
                  idx === 0 ? '#ffab00' : idx === 1 ? '#00b8d9' : '#919eab'
                )
              ))
            ) : (
              <>
                {renderTaskItem('Update Website Homepage', '2:00 PM', 'completed', '120', 'solar:code-bold', 'High', '#ffab00')}
                {renderTaskItem('Monthly Report Analysis', '5:30 PM', 'completed', '85', 'solar:chart-square-bold', 'Medium', '#00b8d9')}
                {renderTaskItem('Team Meeting Preparation', '6:00 PM', 'completed', '50', 'solar:users-group-rounded-bold', 'Low', '#919eab')}
              </>
            )}
          </Card>

          {/* Charts Row */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, borderRadius: 2, border: 'none', boxShadow: (theme) => `0 8px 24px 0 ${alpha(theme.palette.common.black, 0.05)}` }}>
                <Typography variant="h5" sx={{ mb: 4, fontWeight: 800 }}>{t('dashboard.monthlyIncome')}</Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyIncomeData}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#007bff" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#007bff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f2f5" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#919eab' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#919eab' }} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="income" stroke="#007bff" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" dot={{ r: 4, fill: '#007bff', strokeWidth: 2, stroke: '#fff' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, borderRadius: 2, border: 'none', boxShadow: (theme) => `0 8px 24px 0 ${alpha(theme.palette.common.black, 0.05)}` }}>
                <Typography variant="h5" sx={{ mb: 4, fontWeight: 800 }}>{t('dashboard.taskOverview')}</Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={completionData}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f2f5" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#919eab' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#919eab' }} />
                      <Tooltip cursor={{ fill: 'transparent' }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={36}>
                        {completionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#00c292" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Financial Summary */}
          <Card sx={{ p: 4, mb: 4, borderRadius: 2, border: 'none', boxShadow: (theme) => `0 8px 24px 0 ${alpha(theme.palette.common.black, 0.05)}` }}>
            <Typography variant="h5" sx={{ mb: 4.5, fontWeight: 800 }}>{t('dashboard.financialSummary')}</Typography>
            <Stack spacing={3.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography color="text.secondary" variant="body1" sx={{ fontWeight: 600 }}>{t('dashboard.earningsPerTask')}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{fCurrency(financial.earningsPerTask || 89.50)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography color="text.secondary" variant="body1" sx={{ fontWeight: 600 }}>{t('dashboard.weeklyIncome')}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{fCurrency(financial.weeklyIncome || 1250)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography color="text.secondary" variant="body1" sx={{ fontWeight: 600 }}>{t('dashboard.monthlyTarget')}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{fCurrency(financial.monthlyTarget || 5000)}</Typography>
              </Stack>
              <Box sx={{ mt: 2 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                  <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 600 }}>{t('dashboard.progressToTarget')}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{financial.progress || 85}%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={financial.progress || 85} sx={{ height: 10, borderRadius: 5, bgcolor: '#f0f2f5', '& .MuiLinearProgress-bar': { bgcolor: '#2d62ed', borderRadius: 5 } }} />
              </Box>
            </Stack>
          </Card>

          {/* Performance Stats */}
          <Card sx={{ p: 4, mb: 4, borderRadius: 2, border: 'none', boxShadow: (theme) => `0 8px 24px 0 ${alpha(theme.palette.common.black, 0.05)}` }}>
            <Typography variant="h5" sx={{ mb: 4.5, fontWeight: 800 }}>{t('dashboard.performanceStats')}</Typography>
            <Stack spacing={4}>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                  <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 600 }}>{t('dashboard.taskCompletion')}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{performance.completionRate || 75}%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={performance.completionRate || 75} sx={{ height: 8, borderRadius: 2, bgcolor: '#f0f2f5', '& .MuiLinearProgress-bar': { bgcolor: '#00c292', borderRadius: 2 } }} />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                  <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 600 }}>{t('dashboard.qualityScore')}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{performance.qualityScore || 92}%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={performance.qualityScore || 92} sx={{ height: 8, borderRadius: 2, bgcolor: '#f0f2f5', '& .MuiLinearProgress-bar': { bgcolor: '#2d62ed', borderRadius: 2 } }} />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                  <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 600 }}>{t('dashboard.onTimeDelivery')}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{performance.onTimeDelivery || 88}%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={performance.onTimeDelivery || 88} sx={{ height: 8, borderRadius: 2, bgcolor: '#f0f2f5', '& .MuiLinearProgress-bar': { bgcolor: '#8e33ff', borderRadius: 2 } }} />
              </Box>
            </Stack>
          </Card>

          {/* Recent Activity */}
          <Card sx={{ p: 4, borderRadius: 2, border: 'none', boxShadow: (theme) => `0 8px 24px 0 ${alpha(theme.palette.common.black, 0.05)}` }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 800 }}>{t('dashboard.recentActivity.title')}</Typography>
            <Stack spacing={4}>
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <Stack key={activity._id} direction="row" spacing={2.5} alignItems="center">
                    <Avatar sx={{ bgcolor: alpha('#22c55e', 0.1), width: 44, height: 44 }}>
                      <Iconify icon={activity.status === 'completed' ? 'solar:check-circle-bold' : 'solar:add-circle-bold'} width={22} color={activity.status === 'completed' ? '#22c55e' : '#007bff'} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{activity.subTaskName}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {activity.status === 'completed' ? t('dashboard.taskCompleted') : t('dashboard.newTaskAssigned')} - {dayjs(activity.updatedAt).fromNow()}
                      </Typography>
                    </Box>
                  </Stack>
                ))
              ) : (
                <>
                  <Stack direction="row" spacing={2.5} alignItems="center">
                    <Avatar sx={{ bgcolor: alpha('#22c55e', 0.1), width: 44, height: 44 }}>
                      <Iconify icon="solar:check-circle-bold" width={22} color="#22c55e" />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Task completed</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Database optimization - 2 hours ago</Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={2.5} alignItems="center">
                    <Avatar sx={{ bgcolor: alpha('#007bff', 0.1), width: 44, height: 44 }}>
                      <Iconify icon="solar:add-circle-bold" width={22} color="#007bff" />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>New task assigned</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>UI/UX Review - 4 hours ago</Typography>
                    </Box>
                  </Stack>
                </>
              )}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
