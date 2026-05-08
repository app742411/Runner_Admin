import { Box, Card, LinearProgress } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useTranslation } from 'react-i18next';

import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { StatCard } from 'src/components/analytics/StatCard';
import { CompanySalesChart } from 'src/sections/company-admin/company-sales-chart';
import { CompanyRecentActivity } from 'src/sections/company-admin/company-recent-activity';
import { CompanyEmployeeTable } from 'src/sections/company-admin/company-employee-table';
import { CompanyTaskTable } from 'src/sections/company-admin/company-task-table';

import { useCompanyAdminDashboard } from 'src/features/company-admin/useCompanyAdmin';
import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

const SPARK_CONTRACT = [
  { v: 30 }, { v: 25 }, { v: 40 }, { v: 28 }, { v: 38 }, { v: 25 },
];
const SPARK_EMPLOYEE = [
  { v: 40 }, { v: 50 }, { v: 38 }, { v: 60 }, { v: 42 }, { v: 55 },
];
const SPARK_TASK = [
  { v: 20 }, { v: 40 }, { v: 30 }, { v: 50 }, { v: 45 }, { v: 60 },
];

export default function CompanyAdminView() {
  const { t } = useTranslation();
  const { data: dashboardData, isLoading, error } = useCompanyAdminDashboard();
  const data = dashboardData?.data;

  if (isLoading) return <Box sx={{ p: 5 }}><LinearProgress /></Box>;
  if (error) return <Box sx={{ p: 5 }}><Typography color="error">Error loading dashboard</Typography></Box>;

  const subTaskStats = data?.subTaskStats || {};
  const cards = data?.cards || {};
  const yearlySales = data?.yearlySales || {};
  const recentActivity = data?.recentActivity || [];
  const employees = data?.employees || [];
  const tasks = data?.tasks || [];

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={4}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {t('dashboard.welcome')}
          </Typography>
        </Stack>

        {/* ─── MAIN CARDS (6 IN 1 ROW) ─── */}
        <Grid container spacing={2}>
          <Grid xs={6} sm={4} md={2}>
            <StatCard
              title={t('dashboard.totalContract')}
              total={cards.totalContracts || 0}
              percent={12}
              color="#00B8D9"
              icon="solar:file-text-bold-duotone"
              sparkData={SPARK_CONTRACT}
            />
          </Grid>
          <Grid xs={6} sm={4} md={2}>
            <StatCard
              title={t('dashboard.totalEmployee')}
              total={cards.totalEmployees || 0}
              percent={2.8}
              color="#FF5630"
              icon="solar:users-group-rounded-bold-duotone"
              sparkData={SPARK_EMPLOYEE}
            />
          </Grid>
          <Grid xs={6} sm={4} md={2}>
            <StatCard
              title={t('dashboard.totalTask')}
              total={cards.totalTasks || 0}
              percent={3.6}
              color="#FFAB00"
              icon="solar:clipboard-list-bold-duotone"
              sparkData={SPARK_TASK}
            />
          </Grid>
          <Grid xs={6} sm={4} md={2}>
            <StatCard
              title={t('dashboard.sales.totalIncome')}
              total={fCurrency(cards.totalIncome || 0)}
              percent={8.5}
              color="#22C55E"
              icon="solar:cash-out-bold-duotone"
              sparkData={[{ v: 10 }, { v: 15 }, { v: 25 }, { v: 35 }, { v: 45 }, { v: 60 }]}
            />
          </Grid>
          <Grid xs={6} sm={4} md={2}>
            <StatCard
              title={t('dashboard.sales.totalExpenses')}
              total={fCurrency(cards.totalExpense || 0)}
              percent={-4.2}
              color="#FF5630"
              icon="solar:wallet-bold-duotone"
              sparkData={[{ v: 50 }, { v: 45 }, { v: 38 }, { v: 42 }, { v: 35 }, { v: 25 }]}
            />
          </Grid>
          <Grid xs={6} sm={4} md={2}>
            <StatCard
              title={t('dashboard.netProfitLoss')}
              total={fCurrency(cards.profit || 0)}
              percent={cards.profit >= 0 ? 15.4 : -12.5}
              color={cards.profit >= 0 ? "#22C55E" : "#FF5630"}
              icon="solar:graph-bold-duotone"
              sparkData={[{ v: 5 }, { v: 12 }, { v: 18 }, { v: 24 }, { v: 30 }, { v: 45 }]}
            />
          </Grid>
        </Grid>

        {/* ─── SUBTASK INSIGHTS OVERVIEW ─── */}
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Card sx={{ p: 3, borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <Iconify icon="solar:tuning-bold-duotone" width={24} color="info.main" />
                <Typography variant="h6">{t('dashboard.subTaskInsights')}</Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid xs={6} sm={2.4}>
                  <SummaryItem label={t('common.total') || 'Total'} value={subTaskStats.total || 0} color="primary" />
                </Grid>
                <Grid xs={6} sm={2.4}>
                  <SummaryItem label={t('task.status.pending')} value={subTaskStats.pending || 0} color="warning" />
                </Grid>
                <Grid xs={6} sm={2.4}>
                  <SummaryItem label={t('task.status.inProgress')} value={subTaskStats.inProgress || 0} color="info" />
                </Grid>
                <Grid xs={6} sm={2.4}>
                  <SummaryItem label={t('task.status.completed')} value={subTaskStats.completed || 0} color="success" />
                </Grid>
                <Grid xs={12} sm={2.4}>
                  <SummaryItem label={t('task.status.success')} value={`${subTaskStats.completionRate || 0}%`} color="secondary" />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        {/* ─── CHART + ACTIVITY ─── */}
        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <CompanySalesChart salesData={yearlySales} />
          </Grid>
          <Grid xs={12} md={4}>
            <CompanyRecentActivity list={recentActivity} />
          </Grid>
        </Grid>

        {/* ─── TABLES ─── */}
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <CompanyEmployeeTable employees={employees} />
          </Grid>
          <Grid xs={12} md={6}>
            <CompanyTaskTable tasks={tasks} />
          </Grid>
        </Grid>
      </Stack>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function SummaryItem({ label, value, color }) {
  return (
    <Stack spacing={1} sx={{ textAlign: 'center', p: 1.5, borderRadius: 1.5, bgcolor: 'background.neutral' }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ color: `${color}.main`, fontWeight: '900' }}>
        {value}
      </Typography>
    </Stack>
  );
}
