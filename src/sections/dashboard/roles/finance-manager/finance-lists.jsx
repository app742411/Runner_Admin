import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

// ── COST APPROVALS (ROW 4 / ROW 5) ──────────────────────────────────────
export function FinanceApprovalsList({ title, items, count, label }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Card sx={{ p: 4, height: 1, borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h6">{label || t('finance_dashboard.cost_approvals')}</Typography>
        {count && <Box sx={{ px: 1, py: 0.25, borderRadius: 0.5, bgcolor: '#FFAB00', color: 'white', fontWeight: 'bold', fontSize: 11 }}>{count} {t('finance_dashboard.pending')}</Box>}
      </Stack>
      <Stack spacing={3}>
        {items.map((item, index) => (
          <Box key={index}>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 1 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: '800' }}>{item.title}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{item.subtitle}</Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: '800' }}>{item.amount}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
               <Typography variant="caption" sx={{ color: 'error.main', cursor: 'pointer', fontWeight: 'bold' }}>{t('finance_dashboard.reject')}</Typography>
               <Typography variant="caption" sx={{ color: 'success.main', cursor: 'pointer', fontWeight: 'bold' }}>{t('finance_dashboard.approve')}</Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
      <Box sx={{ mt: 'auto', pt: 3, textAlign: 'center' }}>
         <Link sx={{ typography: 'caption', fontWeight: 'bold', cursor: 'pointer', color: 'primary.main' }}>{t('finance_dashboard.viewAllApprovals')}</Link>
      </Box>
    </Card>
  );
}

// ── OVERDUE INVOICES (ROW 4) ───────────────────────────────────────────
export function FinanceOverdueInvoices({ items, label, countLabel }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Card sx={{ p: 4, height: 1, borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h6">{label || t('finance_dashboard.overdue_invoices')}</Typography>
        <Box sx={{ px: 1, py: 0.25, borderRadius: 0.5, bgcolor: 'error.main', color: 'white', fontWeight: 'bold', fontSize: 11 }}>{countLabel || `2 ${t('finance_dashboard.critical')}`}</Box>
      </Stack>
      <Stack spacing={3}>
        {items.map((item, index) => (
          <Box key={index}>
             <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                   <Typography variant="subtitle2" sx={{ fontWeight: '800' }}>{item.company}</Typography>
                   <Typography variant="caption" sx={{ color: item.isOverdue ? 'error.main' : 'text.secondary' }}>{item.dueHint}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                   <Typography variant="subtitle2" sx={{ fontWeight: '800', color: item.isOverdue ? 'error.main' : 'text.primary' }}>{item.amount}</Typography>
                   {item.showAction && <Box sx={{ px: 1, py: 0.25, mt: 0.5, borderRadius: 0.5, border: `1px solid ${theme.palette.divider}`, cursor: 'pointer', display: 'inline-block' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t('finance_dashboard.remind')}</Typography>
                   </Box>}
                </Box>
             </Stack>
          </Box>
        ))}
      </Stack>
      <Box sx={{ mt: 'auto', pt: 3, textAlign: 'center' }}>
         <Link sx={{ typography: 'caption', fontWeight: 'bold', cursor: 'pointer', color: 'primary.main' }}>{t('finance_dashboard.viewReceivables')}</Link>
      </Box>
    </Card>
  );
}

// ── ALERTS (ROW 6 RIGHT) ──────────────────────────────────────────────
export function FinanceAlerts({ title, items }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Card sx={{ p: 4, height: 1, borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
      <Typography variant="h6" sx={{ mb: 4 }}>{title || t('finance_dashboard.alerts')}</Typography>
      <Stack spacing={2}>
        {items.map((item, index) => (
          <Stack key={index} direction="row" spacing={2} sx={{ p: 2, borderRadius: 1.5, bgcolor: alpha(item.color || theme.palette.error.main, 0.08) }}>
             <Box sx={{ fontSize: 24, p: 0.5 }}>{item.icon}</Box>
             <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: '800' }}>{item.title}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{item.subtitle}</Typography>
             </Box>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

// ── PAYROLL ACTIONS (ROW 4 RIGHT) ──────────────────────────────────────────
export function FinancePayrollActions({ label, nextRun, totalAmount, checklists }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Card sx={{ p: 4, height: 1, borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h6">{label || t('finance_dashboard.payroll_actions')}</Typography>
        <Box sx={{ px: 1, py: 0.25, borderRadius: 0.5, bgcolor: '#007BFF', color: 'white', fontWeight: 'bold', fontSize: 11 }}>{t('finance_dashboard.upcoming')}</Box>
      </Stack>
      <Stack spacing={3}>
         <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
               <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t('finance_dashboard.nextRun')}</Typography>
               <Typography variant="subtitle2" sx={{ fontWeight: '800' }}>{nextRun}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
               <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t('finance_dashboard.estTotal')}</Typography>
               <Typography variant="subtitle2" sx={{ fontWeight: '800' }}>{totalAmount}</Typography>
            </Box>
         </Stack>
         <Stack spacing={1.5}>
            {checklists.map((item, index) => (
               <Stack key={index} direction="row" alignItems="center" spacing={1.5} justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing={1}>
                     <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'text.disabled' }} />
                     <Typography variant="body2" sx={{ color: 'text.secondary' }}>{item.title}</Typography>
                  </Stack>
                  {item.status === 'done' ? (
                     <Box sx={{ color: 'success.main', fontSize: 16 }}>✓</Box>
                  ) : (
                     <Box sx={{ px: 1, py: 0.25, borderRadius: 0.5, bgcolor: 'error.main', color: 'white', fontSize: 10 }}>{item.statusLabel}</Box>
                  )}
               </Stack>
            ))}
         </Stack>
      </Stack>
      <Box sx={{ mt: 'auto', pt: 3, p: 2, borderRadius: 1.5, bgcolor: alpha(theme.palette.divider, 0.05), textAlign: 'center' }}>
         <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t('finance_dashboard.checkPayroll')}</Typography>
      </Box>
    </Card>
  );
}

// ── MWST STATUS (ROW 6 LEFT) ──────────────────────────────────────────
export function FinanceMWSTCard({ amount, status }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Card sx={{ p: 4, height: 1, borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
      <Typography variant="h6" sx={{ mb: 4 }}>{t('finance_dashboard.mwst_status')}</Typography>
      <Box sx={{ p: 3, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), mb: 3 }}>
         <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t('finance_dashboard.mwstDue')}</Typography>
         <Typography variant="h3" sx={{ fontWeight: '800', mb: 1 }}>{amount}</Typography>
         <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 'bold' }}>{status || t('finance_dashboard.pending')}</Typography>
      </Box>
      <Button fullWidth variant="contained" size="large" sx={{ py: 1.5, borderRadius: 1.5, bgcolor: theme.palette.primary.main }}>
         {t('finance_dashboard.prepareMwst')}
      </Button>
    </Card>
  );
}
