import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { Iconify } from 'src/components/iconify';

import { FinanceSummaryCard } from './finance-summary-card';
import { FinanceBalanceCard, FinanceCurrentBalanceCard } from './finance-balance-card';
import { FinanceExpensePie, FinanceRevenueTrend, FinanceExpenseDonut, FinanceLiquidityForecast } from './finance-charts';
import { FinanceApprovalsList, FinanceOverdueInvoices, FinancePayrollActions, FinanceMWSTCard, FinanceAlerts } from './finance-lists';
import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function FinanceManagerView() {
   const { t } = useTranslation();

   return (
      <DashboardContent maxWidth="xl">
         <Stack spacing={4}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
               <Typography variant="h4" sx={{ fontWeight: '800' }}>
                  {t('finance_dashboard.title')}
               </Typography>

               <Stack direction="row" spacing={1.5}>
                  <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />} sx={{ bgcolor: '#2168E8', '&:hover': { bgcolor: '#1a56c5' } }}>
                     {t('finance_dashboard.newInvoice')}
                  </Button>
                  <Button variant="contained" startIcon={<Iconify icon="solar:document-bold" />} sx={{ bgcolor: '#10A142', '&:hover': { bgcolor: '#0d8536' } }}>
                     {t('finance_dashboard.newOffer')}
                  </Button>
                  <Button variant="contained" startIcon={<Iconify icon="solar:restart-bold" />} sx={{ bgcolor: '#F05F0A', '&:hover': { bgcolor: '#c84f08' } }}>
                     {t('finance_dashboard.creditNote')}
                  </Button>
                  <Button variant="contained" startIcon={<Iconify icon="solar:pen-new-square-bold" />} sx={{ bgcolor: '#9B45F2', '&:hover': { bgcolor: '#7d37c5' } }}>
                     {t('finance_dashboard.recordBooking')}
                  </Button>
                  <Button variant="contained" startIcon={<Iconify icon="solar:card-bold" />} sx={{ bgcolor: '#E12626', '&:hover': { bgcolor: '#b81f1f' } }}>
                     {t('finance_dashboard.recordExpense')}
                  </Button>
               </Stack>
            </Stack>

            {/* ─── ROW 1: 4 Summary Cards ─── */}
            <Grid container spacing={2.5}>
               <Grid xs={12} sm={6} md={3}>
                  <FinanceSummaryCard
                     title={t('finance_dashboard.openReceivables')}
                     amount={fCurrency(125400)}
                     subtitle={`${fCurrency(24000)} ${t('finance_dashboard.pending').toLowerCase()}`}
                     trend="down"
                  />
               </Grid>
               <Grid xs={12} sm={6} md={3}>
                  <FinanceSummaryCard
                     title={t('finance_dashboard.openPayables')}
                     amount={fCurrency(84300)}
                     subtitle={`${fCurrency(12500)} ${t('finance_dashboard.thisMonth').toLowerCase()}`}
                  />
               </Grid>
               <Grid xs={12} sm={6} md={3}>
                  <FinanceSummaryCard
                     title={t('finance_dashboard.bankBalance')}
                     amount={fCurrency(245680)}
                     subtitle={t('finance_dashboard.last_sync', { time: '2 min ago' })}
                  />
               </Grid>
               <Grid xs={12} sm={6} md={3}>
                  <FinanceSummaryCard
                     title={t('finance_dashboard.liquidity')}
                     amount="136%"
                     subtitle={t('finance_dashboard.healthy_liquidity')}
                     percent={2.4}
                  />
               </Grid>
            </Grid>

            {/* ─── ROW 2: Balance Cards & Pie Chart ─── */}
            <Grid container spacing={2.5}>
               <Grid xs={12} md={4}>
                  <FinanceBalanceCard
                     balance={fCurrency(45678.90)}
                     cardNumber="**** **** **** 4567"
                     accountType={t('finance_dashboard.totalBalance')}
                  />
               </Grid>
               <Grid xs={12} md={4}>
                  <FinanceCurrentBalanceCard
                     total={fCurrency(9990)}
                     orderTotal={fCurrency(10999)}
                     earning={fCurrency(1168)}
                     refunded={fCurrency(83.10)}
                  />
               </Grid>
               <Grid xs={12} md={4}>
                  <FinanceExpensePie
                     title={t('finance_dashboard.expense_breakdown')}
                     data={[
                        { name: 'Services', value: 25, color: '#007BFF' },
                        { name: 'Office', value: 35, color: '#36B37E' },
                        { name: 'IT', value: 20, color: '#FFAB00' },
                        { name: 'Travel', value: 15, color: '#FF5630' },
                        { name: 'Other', value: 5, color: '#7635DC' },
                     ]} />
               </Grid>
            </Grid>

            {/* ─── ROW 3: Main Trend & Donut Chart ─── */}
            <Grid container spacing={2.5}>
               <Grid xs={12} md={8}>
                  <FinanceRevenueTrend
                     label={t('finance_dashboard.revenue_trend')}
                     timeframe={t('finance_dashboard.last6Months')}
                     data={[
                        { name: 'May', revenue: 180000 },
                        { name: 'Jun', revenue: 200000 },
                        { name: 'Jul', revenue: 170000 },
                        { name: 'Aug', revenue: 220000 },
                        { name: 'Sep', revenue: 240000 },
                        { name: 'Oct', revenue: 260000 },
                     ]}
                  />
               </Grid>
               <Grid xs={12} md={4}>
                  <FinanceExpenseDonut
                     title={t('finance_dashboard.expense_breakdown')}
                     data={[
                        { name: 'Operationen', value: 45, percent: 45, color: '#007BFF' },
                        { name: 'Gehaltsabrechnung', value: 30, percent: 30, color: '#7635DC' },
                        { name: 'Marketing', value: 15, percent: 15, color: '#00B8D9' },
                        { name: 'Andere', value: 10, percent: 10, color: '#B0B0B0' },
                     ]}
                  />
               </Grid>
            </Grid>

            {/* ─── ROW 4: Approvals, Overdue, Payroll ─── */}
            <Grid container spacing={2.5}>
               <Grid xs={12} md={4}>
                  <FinanceApprovalsList
                     label={t('finance_dashboard.cost_approvals')}
                     items={[
                        { title: 'Q3-Marketingkampagne', subtitle: 'Anf. von Samir M. • Marketing', amount: fCurrency(12500) },
                        { title: 'IT-Hardware-Upgrade', subtitle: 'Anf. von David K. • IT-Abteilung', amount: fCurrency(4200) },
                        { title: 'Kundenessen - Zürich', subtitle: 'Anf. von Marc G. • Vertrieb', amount: fCurrency(450) },
                     ]}
                     count={3}
                  />
               </Grid>
               <Grid xs={12} md={4}>
                  <FinanceOverdueInvoices
                     label={t('finance_dashboard.overdue_invoices')}
                     countLabel={`2 ${t('finance_dashboard.critical')}`}
                     items={[
                        { company: 'TechSolutions AG', dueHint: 'Fällig: 15. Okt (3 Tage überfällig)', amount: fCurrency(8450), isOverdue: true, showAction: true },
                        { company: 'Global Logistics GmbH', dueHint: 'Fällig: 10. Okt (8 Tage überfällig)', amount: fCurrency(3200), isOverdue: true, showAction: true },
                        { company: 'Müller', dueHint: 'Fällig: Heute', amount: fCurrency(1180), isOverdue: false, showAction: true },
                     ]}
                  />
               </Grid>
               <Grid xs={12} md={4}>
                  <FinancePayrollActions
                     label={t('finance_dashboard.payroll_actions')}
                     nextRun="25 Oct 2023"
                     totalAmount={fCurrency(145000)}
                     checklists={[
                        { title: t('finance_dashboard.salaries_reviewed'), status: 'done' },
                        { title: t('finance_dashboard.expense_reports'), status: 'review', statusLabel: t('finance_dashboard.review') },
                        { title: t('finance_dashboard.bank_file_gen'), status: 'outstanding', statusLabel: t('finance_dashboard.pending') },
                     ]}
                  />
               </Grid>
            </Grid>

            {/* ─── ROW 5: Due Invoices, Small Revenue Trend, Cost Approvals ─── */}
            <Grid container spacing={2.5}>
               <Grid xs={12} md={4}>
                  <FinanceOverdueInvoices
                     label={t('finance_dashboard.overdue_invoices')}
                     countLabel={`3 ${t('finance_dashboard.pending')}`}
                     items={[
                        { company: 'TechCorp AG', dueHint: `INV-2024-001 • 15 ${t('finance_dashboard.days_overdue') || 'days overdue'}`, amount: fCurrency(8500), isOverdue: true },
                        { company: 'Swiss Solutions', dueHint: `INV-2024-045 • ${t('invoice.due_date') || 'Due today'}`, amount: fCurrency(3200), isOverdue: false },
                     ]}
                  />
               </Grid>
               <Grid xs={12} md={4}>
                  <FinanceRevenueTrend
                     label={t('finance_dashboard.revenue_trend')}
                     timeframe="Jan - Jun"
                     data={[
                        { name: 'Jan', revenue: 45000 },
                        { name: 'Feb', revenue: 52000 },
                        { name: 'Mar', revenue: 48000 },
                        { name: 'Apr', revenue: 61000 },
                        { name: 'May', revenue: 55000 },
                        { name: 'Jun', revenue: 78000 },
                     ]}
                  />
               </Grid>
               <Grid xs={12} md={4}>
                  <FinanceApprovalsList
                     label={t('finance_dashboard.cost_approvals')}
                     items={[
                        { title: 'Office Equipment', subtitle: `${t('support.by')}: M. Weber`, amount: fCurrency(2400) },
                        { title: 'Marketing Campaign', subtitle: `${t('support.by')}: S. Mueller`, amount: fCurrency(15000) },
                     ]}
                  />
               </Grid>
            </Grid>

            {/* ─── ROW 6: Final Row ─── */}
            <Grid container spacing={2.5}>
               <Grid xs={12} md={4}>
                  <FinanceMWSTCard amount={fCurrency(6040)} />
               </Grid>
               <Grid xs={12} md={4}>
                  <FinanceLiquidityForecast
                     title={t('finance_dashboard.liquidity_forecast')}
                     data={[
                        { name: 'Week 1', value: 240000 },
                        { name: 'Week 2', value: 210000 },
                        { name: 'Week 3', value: 235000 },
                        { name: 'Week 4', value: 260000 },
                     ]}
                  />
               </Grid>
               <Grid xs={12} md={4}>
                  <FinanceAlerts
                     title={t('finance_dashboard.alerts')}
                     items={[
                        { icon: '⚠️', title: t('finance_dashboard.overdue_alert', { count: 3 }), subtitle: `${t('common.total')}: ${fCurrency(24800)}`, color: '#FF5630' },
                        { icon: '💳', title: t('finance_dashboard.failed_payments_alert', { count: 2 }), subtitle: t('finance_dashboard.requires_attention'), color: '#FFAB00' },
                     ]}
                  />
               </Grid>
            </Grid>
         </Stack>
      </DashboardContent>
   );
}
