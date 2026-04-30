import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { ReportStatCard } from '../report-stat-card';
import { ReportForm } from '../report-form';

// ----------------------------------------------------------------------

export function ReportView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  return (
    <DashboardContent maxWidth={false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {t('report.title')}
        </Typography>

        <Button
          variant="contained"
          startIcon={<Iconify icon="solar:list-bold" />}
          onClick={() => router.push(paths.dashboard.report.work_reports)}
        >
          View All Reports
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <ReportStatCard
            title={t('report.stats.activeUsers')}
            total="8.2k"
            color="#54D62C"
            chartData={[40, 60, 30, 70, 50, 80]}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <ReportStatCard
            title={t('report.stats.totalCompanies')}
            total="86.6k"
            color="#00B8D9"
            chartData={[30, 50, 80, 40, 60, 90]}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <ReportStatCard
            title={t('report.stats.totalTasks')}
            total="73.9k"
            color="#FF5630"
            chartData={[50, 70, 40, 90, 60, 50]}
          />
        </Grid>

        <Grid xs={12}>
          <ReportForm />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
