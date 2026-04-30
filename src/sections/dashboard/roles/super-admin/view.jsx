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
import { AdminCompanyTable } from './admin-company-table';
import { AdminTasksChart } from './admin-tasks-chart';

// ----------------------------------------------------------------------

const SPARK_A = [{ v: 30 }, { v: 25 }, { v: 40 }, { v: 28 }, { v: 38 }, { v: 25 }];
const SPARK_B = [{ v: 40 }, { v: 55 }, { v: 38 }, { v: 60 }, { v: 42 }, { v: 65 }];
const SPARK_C = [{ v: 20 }, { v: 35 }, { v: 25 }, { v: 45 }, { v: 38 }, { v: 50 }];
const SPARK_D = [{ v: 50 }, { v: 40 }, { v: 60 }, { v: 35 }, { v: 55 }, { v: 45 }];
const SPARK_E = [{ v: 40 }, { v: 50 }, { v: 38 }, { v: 60 }, { v: 42 }, { v: 55 }];
const SPARK_F = [{ v: 20 }, { v: 40 }, { v: 30 }, { v: 50 }, { v: 45 }, { v: 60 }];

export default function SuperAdminView() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);

  return (
    <RoleBasedGuard hasContent currentRole={user?.role} acceptRoles={[ROLES.SUPER_ADMIN]}>
      <DashboardContent maxWidth="xl">
        <Stack spacing={4}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {t('dashboard.welcome')}
          </Typography>

          {/* ─── ROW 1: 3 Stat Cards ─── */}
          <Grid container spacing={2.5}>
            <Grid xs={12} md={2}>
              <StatCard title={t('dashboard.totalContract')} total="4.01k" percent={-0.1} color="#36B37E" icon="solar:document-bold" sparkData={SPARK_A} />
            </Grid>
            <Grid xs={12} md={2}>
              <StatCard title={t('dashboard.totalCompanies')} total="102" percent={2.6} color="#7635DC" icon="solar:buildings-bold" sparkData={SPARK_B} />
            </Grid>
            <Grid xs={12} md={2}>
              <StatCard title={t('dashboard.expenditure')} total="178" percent={2.6} color="#00B8D9" icon="solar:bill-list-bold" sparkData={SPARK_C} />
            </Grid>
            <Grid xs={12} md={2}>
              <StatCard title={t('dashboard.netProfitLoss')} total="182" percent={2.6} color="#FFAB00" icon="solar:chart-2-bold" sparkData={SPARK_D} />
            </Grid>
            <Grid xs={12} md={2}>
              <StatCard title={t('dashboard.totalEmployee')} total="233" percent={2.8} color="#FF5630" icon="solar:users-group-rounded-bold" sparkData={SPARK_E} />
            </Grid>
            <Grid xs={12} md={2}>
              <StatCard title={t('dashboard.totalTask')} total="20" percent={3.6} color="#36B37E" icon="solar:checklist-minimalistic-bold" sparkData={SPARK_F} />
            </Grid>
          </Grid>


          {/* ─── CHARTS ─── */}
          <Grid container spacing={3}>
            <Grid xs={12} md={7}>
              <CompanySalesChart />
            </Grid>
            <Grid xs={12} md={5}>
              <AdminTasksChart />
            </Grid>
          </Grid>

          {/* ─── COMPANY MANAGEMENT TABLE ─── */}
          <AdminCompanyTable />

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

