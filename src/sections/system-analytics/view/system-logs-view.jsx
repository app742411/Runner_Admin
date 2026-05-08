import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTheme, alpha } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { DashboardContent } from 'src/layouts/dashboard/main';

// ----------------------------------------------------------------------

const INITIAL_LOGS = [
  { id: 1, level: 'info', timestamp: '2026-05-08 12:45:01', module: 'AuthService', message: 'Successfully validated OTP code for user user@example.com' },
  { id: 2, level: 'warning', timestamp: '2026-05-08 12:46:12', module: 'DatabasePool', message: 'Database pool connection limit reached, queuing new queries' },
  { id: 3, level: 'error', timestamp: '2026-05-08 12:48:33', module: 'PaymentGateway', message: 'Frictionless checkout failed: Insufficient funds from bank side' },
  { id: 4, level: 'info', timestamp: '2026-05-08 12:50:24', module: 'GroupModule', message: 'Group details updated successfully for ID: group-alpha-001' },
  { id: 5, level: 'info', timestamp: '2026-05-08 12:51:10', module: 'NotificationSystem', message: 'Delivered push notification broadcast to 410 users' },
];

export function SystemLogsView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [level, setLevel] = useState('all');
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = level === 'all' || log.level === level;
    const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase()) ||
                          log.module.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleClear = () => {
    setLogs([]);
  };

  return (
    <DashboardContent maxWidth={false}>
      {/* HEADER */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Stack spacing={1}>
          <Typography variant="h4">{t('system.logs.title') || 'System Logs'}</Typography>
          <Breadcrumbs
            separator={
              <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push('/dashboard')} sx={{ cursor: 'pointer' }}>
              {t('nav.dashboard') || 'Dashboard'}
            </Link>
            <Typography color="text.primary">{t('system.logs.title') || 'System Logs'}</Typography>
          </Breadcrumbs>
        </Stack>

        <Button
          variant="contained"
          color="error"
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          onClick={handleClear}
        >
          Clear Logs
        </Button>
      </Stack>

      <Card
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: theme.customShadows?.z4,
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        }}
      >
        {/* Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
          <TextField
            select
            label="Log Level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">All Levels</MenuItem>
            <MenuItem value="info">Info</MenuItem>
            <MenuItem value="warning">Warning</MenuItem>
            <MenuItem value="error">Error</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Search logs (e.g. Auth, Gateway, connection...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <Iconify icon="solar:magnifer-linear" sx={{ color: 'text.disabled', mr: 1 }} />
              ),
            }}
          />
        </Stack>

        {/* LOG PANEL TABLE */}
        <TableContainer sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: theme.palette.background.neutral }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: 120 }}>Level</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: 200 }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: 180 }}>Module</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      No logs found matching your filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Label
                        variant="soft"
                        color={
                          row.level === 'info'
                            ? 'success'
                            : row.level === 'warning'
                            ? 'warning'
                            : 'error'
                        }
                      >
                        {row.level.toUpperCase()}
                      </Label>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                      {row.timestamp}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                      [{row.module}]
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', color: row.level === 'error' ? 'error.main' : 'text.primary' }}>
                      {row.message}
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
