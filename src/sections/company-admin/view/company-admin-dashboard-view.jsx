import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard/main';
import { StatCard } from 'src/components/analytics/StatCard';
import { CompanySalesChart } from '../company-sales-chart';
import { CompanyRecentActivity } from '../company-recent-activity';
import { CompanyEmployeeTable } from '../company-employee-table';
import { CompanyTaskTable } from '../company-task-table';

import { useTranslation } from 'react-i18next';

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

export function CompanyAdminDashboardView() {
  const { t } = useTranslation();

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={4}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {t('dashboard.welcome')}
        </Typography>

        {/* ─── STAT CARDS ─── */}
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <StatCard
              title={t('dashboard.totalContract')}
              total="4.01k"
              percent={-0.1}
              color="#36B37E"
              icon="📄"
              sparkData={SPARK_CONTRACT}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <StatCard
              title={t('dashboard.totalEmployee')}
              total="233"
              percent={2.8}
              color="#FF5630"
              icon="🧑‍💼"
              sparkData={SPARK_EMPLOYEE}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <StatCard
              title={t('dashboard.totalTask')}
              total="20"
              percent={3.6}
              color="#36B37E"
              icon="🎓"
              sparkData={SPARK_TASK}
            />
          </Grid>
        </Grid>

        {/* ─── CHART + ACTIVITY ─── */}
        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <CompanySalesChart />
          </Grid>
          <Grid xs={12} md={4}>
            <CompanyRecentActivity />
          </Grid>
        </Grid>

        {/* ─── TABLES ─── */}
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
  );
}
