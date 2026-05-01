import { Box, LinearProgress } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';
import { ROLES } from 'src/config/roles';

import { StatCard } from 'src/components/analytics/StatCard';
import { CompanySalesChart } from 'src/sections/company-admin/company-sales-chart';
import { CompanyEmployeeTable } from 'src/sections/company-admin/company-employee-table';
import { CompanyTaskTable } from 'src/sections/company-admin/company-task-table';
import { useSuperAdminDashboard } from 'src/features/super-admin/useSuperAdmin';
import { fNumber, fCurrency } from 'src/utils/format-number';
import { AdminCompanyTable } from './admin-company-table';
import { AdminTasksChart } from './admin-tasks-chart';

// ----------------------------------------------------------------------

const SPARK_DATA = [{ v: 30 }, { v: 25 }, { v: 40 }, { v: 28 }, { v: 38 }, { v: 25 }];

export default function SuperAdminView() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);

  const { data: dashboardData, isLoading, error } = useSuperAdminDashboard();
  const data = dashboardData?.data;

  if (isLoading) return <Box sx={{ p: 5 }}><LinearProgress /></Box>;
  if (error) return <Box sx={{ p: 5 }}><Typography color="error">Error loading dashboard</Typography></Box>;

  const cards = data?.cards || {};
  const charts = data?.charts || {};

  return (
    <RoleBasedGuard hasContent currentRole={user?.role} acceptRoles={[ROLES.SUPER_ADMIN]}>
      <DashboardContent maxWidth="xl">
        <Stack spacing={4}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {t('dashboard.welcome')}
          </Typography>

          {/* ─── ROW 1: Stat Cards ─── */}
          <Grid container spacing={2.5}>
            <Grid xs={12} md={2}>
              <StatCard
                title={t('dashboard.totalContract')}
                total={fNumber(cards.totalContracts || 0)}
                percent={0}
                color="#36B37E"
                icon="solar:document-bold"
                sparkData={SPARK_DATA}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <StatCard
                title={t('dashboard.totalCompanies')}
                total={fNumber(cards.totalCompanies || 0)}
                percent={0}
                color="#7635DC"
                icon="solar:buildings-bold"
                sparkData={SPARK_DATA}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <StatCard
                title={t('dashboard.expenditure')}
                total={fCurrency(cards.totalExpense || 0)}
                percent={0}
                color="#00B8D9"
                icon="solar:bill-list-bold"
                sparkData={SPARK_DATA}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <StatCard
                title={t('dashboard.netProfitLoss')}
                total={fCurrency(cards.netProfit || 0)}
                percent={0}
                color="#FFAB00"
                icon="solar:chart-2-bold"
                sparkData={SPARK_DATA}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <StatCard
                title={t('dashboard.totalEmployee')}
                total={fNumber(cards.totalEmployees || 0)}
                percent={0}
                color="#FF5630"
                icon="solar:users-group-rounded-bold"
                sparkData={SPARK_DATA}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <StatCard
                title={t('dashboard.totalTask')}
                total={fNumber(cards.totalTasks || 0)}
                percent={0}
                color="#36B37E"
                icon="solar:checklist-minimalistic-bold"
                sparkData={SPARK_DATA}
              />
            </Grid>
          </Grid>


          {/* ─── CHARTS ─── */}
          <Grid container spacing={3}>
            <Grid xs={12} md={7}>
              <CompanySalesChart
                salesData={{
                  monthly: charts.monthlyIncome || [],
                  totalIncome: cards.totalIncome || 0
                }}
              />
            </Grid>
            <Grid xs={12} md={5}>
              <AdminTasksChart chartData={charts.taskTrend || []} />
            </Grid>
          </Grid>

          {/* ─── COMPANY MANAGEMENT TABLE ─── */}
          <AdminCompanyTable companies={data?.latestCompanies || []} />

          {/* ─── EMPLOYEE + TASK TABLES ─── */}
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <CompanyEmployeeTable />
            </Grid>
            <Grid xs={12} md={6}>
              <CompanyTaskTable />
            </Grid>
          </Grid>
        </Stack>
      </DashboardContent>
    </RoleBasedGuard>
  );
}

