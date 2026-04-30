import { useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  Stack,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  Button,
  LinearProgress,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  alpha,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { useEmployeeFinancial } from 'src/features/employee/useEmployees';
import dayjs from 'dayjs';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

export default function EmployeeFinanceView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const [status, setStatus] = useState('All Status');

  const { data: financialData, isLoading, error } = useEmployeeFinancial();
  const data = financialData?.data;

  if (isLoading) return <Box sx={{ p: 5 }}><LinearProgress /></Box>;
  if (error) return <Box sx={{ p: 5 }}><Typography color="error">Error loading financial data</Typography></Box>;

  const cards = data?.cards || {};
  const recentTransactions = data?.recentTransactions || [];
  const monthlyEarningsRaw = data?.monthlyEarnings || [];
  const taskStats = data?.taskStats || {};
  const taskDetails = data?.taskDetails || null;

  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const chartData = monthlyEarningsRaw.length > 0
    ? monthlyEarningsRaw.map(item => ({
      name: MONTH_NAMES[item._id - 1] || `Month ${item._id}`,
      earnings: item.total || 0
    }))
    : [{ name: 'N/A', earnings: 0 }];

  const totalTasks = (taskStats.completed || 0) + (taskStats.inProgress || 0) + (taskStats.pending || 0);
  const completionRate = totalTasks > 0 ? Math.round((taskStats.completed / totalTasks) * 100) : 0;
  const inProgressRate = totalTasks > 0 ? Math.round((taskStats.inProgress / totalTasks) * 100) : 0;
  const pendingRate = totalTasks > 0 ? Math.round((taskStats.pending / totalTasks) * 100) : 0;

  const handleViewTask = (id) => {
    router.push(paths.dashboard.task.details(id));
  };

  const renderStatCard = (title, value, subValue, subLabel, icon, color) => (
    <Card sx={{
      p: 3,
      borderRadius: 4,
      boxShadow: '0 8px 24px 0 rgba(0,0,0,0.05)',
      border: 'none',
      bgcolor: 'white',
      height: '100%'
    }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>{title}</Typography>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>{value}</Typography>
        </Box>
        <Box sx={{
          p: 1.5,
          borderRadius: 2,
          bgcolor: alpha(color, 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Iconify icon={icon} width={28} color={color} />
        </Box>
      </Stack>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Typography variant="caption" sx={{ color: color, fontWeight: 700 }}>
          {subValue}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          {subLabel}
        </Typography>
      </Stack>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      {/* Task Details Section */}
      {taskDetails && (
        <Card sx={{ p: 3, mb: 4, borderRadius: 4, bgcolor: 'white', border: 'none', boxShadow: '0 8px 24px 0 rgba(0,0,0,0.05)' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar sx={{ width: 64, height: 64, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                <Iconify icon="solar:folder-with-files-bold" width={32} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{taskDetails.taskName}</Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                  <Label variant="soft" color="primary">{taskDetails.taskCategory}</Label>
                  <Label variant="soft" color="info">{taskDetails.taskSubCategory}</Label>
                </Stack>
              </Box>
            </Stack>
            <Stack direction="row" spacing={4} alignItems="center">
              <Box textAlign="right">
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>Project Price</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main' }}>CHF {taskDetails.taskPrice}</Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>Status</Typography>
                <Box>
                  <Label variant="filled" color={taskDetails.status === 'in_progress' ? 'warning' : 'success'} sx={{ textTransform: 'capitalize', fontWeight: 800 }}>
                    {taskDetails.status.replace('_', ' ')}
                  </Label>
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Card>
      )}

      {/* Top Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          {renderStatCard('Total Earnings', `CHF ${cards.totalEarnings || 0}`, '10%', 'from last month', 'solar:dollar-bold', '#22c55e')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderStatCard('Completed Tasks', cards.completedTasks || 0, '+8.2%', 'from last month', 'solar:check-circle-bold', '#007bff')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderStatCard('Pending Amount', `CHF ${cards.pendingAmount || 0}`, '5 tasks', 'awaiting approval', 'solar:clock-circle-bold', '#ffab00')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderStatCard('This Month', `CHF ${cards.thisMonthEarnings || 0}`, '24', 'completed', 'solar:calendar-bold', '#8e33ff')}
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Left Column - Recent Transactions */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 4, borderRadius: 4, border: 'none', boxShadow: '0 8px 24px 0 rgba(0,0,0,0.05)' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Recent Transactions</Typography>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  sx={{ borderRadius: 2, bgcolor: '#f4f6f8', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                >
                  <MenuItem value="All Status">All Status</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600, bgcolor: 'transparent' }}>Task</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600, bgcolor: 'transparent' }}>Date</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600, bgcolor: 'transparent' }}>Amount</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600, bgcolor: 'transparent' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTransactions.map((row) => (
                    <TableRow
                      key={row._id}
                      hover
                      onClick={() => handleViewTask(row._id)}
                      sx={{
                        cursor: 'pointer',
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{row.subTaskName}</Typography>
                        <Typography variant="caption" color="text.secondary">#{row._id?.slice(-8).toUpperCase()}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                          {dayjs(row.updatedAt).format('MMM D, YYYY')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>CHF {row.subtaskPrice || 0}</Typography>
                      </TableCell>
                      <TableCell>
                        <Label
                          variant="soft"
                          color={
                            (row.status === 'completed' && 'success') ||
                            (row.status === 'pending' && 'warning') ||
                            'error'
                          }
                          sx={{ borderRadius: 1.5, fontWeight: 700 }}
                        >
                          {row.status}
                        </Label>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Showing {recentTransactions.length} of {cards.completedTasks || cards.totalEarnings || 0} transactions
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" sx={{ borderRadius: 2, px: 3, borderColor: '#e0e0e0', color: 'text.primary' }}>Previous</Button>
                <Button variant="contained" sx={{ borderRadius: 2, px: 4, bgcolor: '#007bff' }}>Next</Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Monthly Earnings Chart */}
          <Card sx={{ p: 4, mb: 3, borderRadius: 4, border: 'none', boxShadow: '0 8px 24px 0 rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 800 }}>Monthly Earnings</Typography>
            <Box height={280}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#007bff" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#007bff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f2f5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#919eab' }} dy={10} interval={1} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#919eab' }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#007bff"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorEarnings)"
                    dot={{ r: 3, fill: '#007bff', strokeWidth: 1.5, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>

          {/* Task Completion Rate */}
          <Card sx={{ p: 4, mb: 3, borderRadius: 4, border: 'none', boxShadow: '0 8px 24px 0 rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 800 }}>Task Completion Rate</Typography>
            <Stack spacing={3}>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Completed</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>{completionRate}%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={completionRate} sx={{ height: 8, borderRadius: 4, bgcolor: '#f0f2f5', '& .MuiLinearProgress-bar': { bgcolor: '#22c55e', borderRadius: 4 } }} />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>In Progress</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>{inProgressRate}%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={inProgressRate} sx={{ height: 8, borderRadius: 4, bgcolor: '#f0f2f5', '& .MuiLinearProgress-bar': { bgcolor: '#007bff', borderRadius: 4 } }} />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Pending</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>{pendingRate}%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={pendingRate} sx={{ height: 8, borderRadius: 4, bgcolor: '#f0f2f5', '& .MuiLinearProgress-bar': { bgcolor: '#ff5630', borderRadius: 4 } }} />
              </Box>
            </Stack>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ p: 4, borderRadius: 4, border: 'none', boxShadow: '0 8px 24px 0 rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 800 }}>Quick Actions</Typography>
            <Stack spacing={2}>
              <Button
                variant="soft"
                fullWidth
                startIcon={<Iconify icon="solar:download-bold" />}
                sx={{
                  py: 1.5,
                  borderRadius: 2.5,
                  justifyContent: 'center',
                  bgcolor: alpha('#007bff', 0.05),
                  color: '#007bff',
                  fontWeight: 700,
                  fontSize: 15
                }}
              >
                Export Transactions
              </Button>
              <Button
                variant="soft"
                fullWidth
                startIcon={<Iconify icon="solar:file-text-bold" />}
                sx={{
                  py: 1.5,
                  borderRadius: 2.5,
                  justifyContent: 'center',
                  bgcolor: alpha('#22c55e', 0.05),
                  color: '#22c55e',
                  fontWeight: 700,
                  fontSize: 15
                }}
              >
                Generate Invoice
              </Button>
              <Button
                variant="soft"
                fullWidth
                startIcon={<Iconify icon="solar:chart-bold" />}
                sx={{
                  py: 1.5,
                  borderRadius: 2.5,
                  justifyContent: 'center',
                  bgcolor: alpha('#8e33ff', 0.05),
                  color: '#8e33ff',
                  fontWeight: 700,
                  fontSize: 15
                }}
              >
                View Reports
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
