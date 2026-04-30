import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, Tooltip } from 'recharts';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTheme, alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

// ── EXPENSE PIE (ROW 2) ─────────────────────────────────────────────────
export function FinanceExpensePie({ title, data }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Card sx={{ p: 4, height: 1, borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
      <Typography variant="h6" sx={{ mb: 4 }}>{title || t('finance_dashboard.expense_breakdown')}</Typography>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" stroke="none">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <Stack spacing={1} sx={{ mt: 3 }}>
        {data.map((item) => (
          <Stack key={item.name} direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 12, height: 12, borderRadius: 0.25, bgcolor: item.color }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', flexGrow: 1 }}>{item.name}</Typography>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{item.value}%</Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

// ── REVENUE TREND (ROW 3) ───────────────────────────────────────────────
export function FinanceRevenueTrend({ title, data, label, timeframe }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Card sx={{ p: 4, height: 1, borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Box>
            <Typography variant="h6">{label || t('finance_dashboard.revenue_trend')}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{timeframe || t('finance_dashboard.last6Months')}</Typography>
        </Box>
      </Stack>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
              <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} tickFormatter={(val) => `CHF ${val/1000}k`} />
          <Tooltip 
             contentStyle={{ borderRadius: 8, border: 'none', boxShadow: theme.shadows[8] }}
             formatter={(value) => [`CHF ${value.toLocaleString()}`, 'Revenue']}
          />
          <Area type="monotone" dataKey="revenue" stroke={theme.palette.primary.main} strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ── EXPENSE DONUT (ROW 3 RIGHT) ──────────────────────────────────────────
export function FinanceExpenseDonut({ title, data, subheader }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Card sx={{ p: 4, height: 1, borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
      <Typography variant="h6" sx={{ mb: 4 }}>{title || t('finance_dashboard.expense_breakdown')}</Typography>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={80} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <Stack spacing={2} sx={{ mt: 4 }}>
        {data.map((item) => (
          <Stack key={item.name} direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box sx={{ width: 12, height: 12, borderRadius: 0.25, bgcolor: item.color }} />
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>{item.name}</Typography>
            </Stack>
            <Typography variant="subtitle2" sx={{ fontWeight: '800' }}>{item.percent}%</Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

// ── LIQUIDITY FORECAST (ROW 6 MIDDLE) ──────────────────────────────────
export function FinanceLiquidityForecast({ title, data }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Card sx={{ p: 4, height: 1, borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
      <Typography variant="h6" sx={{ mb: 4 }}>{title || t('finance_dashboard.liquidity_forecast')}</Typography>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `CHF ${val/1000}k`} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={theme.palette.success.main} strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <Box sx={{ mt: 3, p: 1.5, borderRadius: 1.5, bgcolor: alpha(theme.palette.success.main, 0.08) }}>
         <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 'bold' }}>
            ✓ {t('finance_dashboard.liquidityThreshold')}
         </Typography>
      </Box>
    </Card>
  );
}
