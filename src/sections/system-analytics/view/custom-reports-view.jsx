import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import { useTheme, alpha } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard/main';

// ----------------------------------------------------------------------

const METRICS = [
  { id: 'companies', label: 'Companies Registration & Onboarding' },
  { id: 'contracts', label: 'Contract Lifecycle & Value' },
  { id: 'tasks', label: 'Tasks Accomplishments & Logs' },
  { id: 'finances', label: 'Financial Statements & Accounting' },
  { id: 'logs', label: 'System Errors & Server Performance Logs' },
];

export function CustomReportsView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const [startDate, setStartDate] = useState('2026-05-01');
  const [endDate, setEndDate] = useState('2026-05-08');
  const [format, setFormat] = useState('pdf');
  const [selectedMetrics, setSelectedMetrics] = useState(['companies', 'contracts']);
  const [generated, setGenerated] = useState(false);

  const handleToggleMetric = (id) => {
    if (selectedMetrics.includes(id)) {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== id));
    } else {
      setSelectedMetrics([...selectedMetrics, id]);
    }
  };

  const handleGenerate = () => {
    setGenerated(true);
    setTimeout(() => {
      setGenerated(false);
    }, 4000);
  };

  return (
    <DashboardContent maxWidth={false}>
      {/* HEADER */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Stack spacing={1}>
          <Typography variant="h4">{t('system.custom_reports.title') || 'Custom Reports Builder'}</Typography>
          <Breadcrumbs
            separator={
              <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push('/dashboard')} sx={{ cursor: 'pointer' }}>
              {t('nav.dashboard') || 'Dashboard'}
            </Link>
            <Typography color="text.primary">{t('system.custom_reports.title') || 'Custom Reports'}</Typography>
          </Breadcrumbs>
        </Stack>
      </Stack>

      <Grid container spacing={4}>
        {/* BUILDER PANEL */}
        <Grid xs={12} md={5}>
          <Card
            sx={{
              p: 4,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z4,
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              Configure Report Parameters
            </Typography>

            <Stack spacing={3}>
              {/* Dates */}
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>

              {/* Format selection */}
              <TextField
                select
                fullWidth
                label="Export Format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <MenuItem value="pdf">Adobe PDF (.pdf)</MenuItem>
                <MenuItem value="xlsx">Microsoft Excel (.xlsx)</MenuItem>
                <MenuItem value="csv">Comma-Separated Values (.csv)</MenuItem>
              </TextField>

              {/* Metrics Checkbox group */}
              <Stack spacing={1.5}>
                <Typography variant="subtitle2" color="text.secondary">
                  Include Metrics & Dimensions:
                </Typography>
                {METRICS.map((metric) => (
                  <FormControlLabel
                    key={metric.id}
                    control={
                      <Checkbox
                        checked={selectedMetrics.includes(metric.id)}
                        onChange={() => handleToggleMetric(metric.id)}
                        color="primary"
                      />
                    }
                    label={metric.label}
                  />
                ))}
              </Stack>

              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<Iconify icon="solar:document-text-bold" />}
                onClick={handleGenerate}
                disabled={selectedMetrics.length === 0}
              >
                Compile & Export Report
              </Button>
            </Stack>
          </Card>
        </Grid>

        {/* PREVIEW PANEL */}
        <Grid xs={12} md={7}>
          <Card
            sx={{
              p: 4,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z4,
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              bgcolor: 'background.paper',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            {generated ? (
              <Stack spacing={2.5} alignItems="center">
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.success.main, 0.15),
                    color: theme.palette.success.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="solar:check-circle-bold" width={36} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Report Compiled Successfully!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>
                  Your custom report containing {selectedMetrics.length} modules from {startDate} to {endDate} has been successfully downloaded.
                </Typography>
                <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
                  File download initiated in {format.toUpperCase()} format.
                </Alert>
              </Stack>
            ) : (
              <Stack spacing={2} alignItems="center">
                <Iconify icon="solar:document-add-bold-duotone" width={80} sx={{ color: 'text.disabled' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                  Custom Report Preview
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
                  Select the required dates, output format, and desired data dimensions on the left panel to generate your premium report.
                </Typography>
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
