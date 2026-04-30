import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ----------------------------------------------------------------------

const DATA = [
  { month: 'Jan', income: 20, expenses: 40 },
  { month: 'Feb', income: 25, expenses: 55 },
  { month: 'Mar', income: 50, expenses: 60 },
  { month: 'Apr', income: 45, expenses: 65 },
  { month: 'May', income: 55, expenses: 50 },
  { month: 'Jun', income: 60, expenses: 58 },
  { month: 'Jul', income: 75, expenses: 52 },
  { month: 'Aug', income: 70, expenses: 45 },
  { month: 'Sep', income: 65, expenses: 22 },
];

export function CompanySalesChart({ salesData }) {
  const { t } = useTranslation();
  const theme = useTheme();

  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const chartData = salesData?.monthly?.map(item => ({
    month: MONTH_NAMES[item._id - 1] || `Month ${item._id}`,
    income: item.total || 0,
  })) || [];

  const totalIncome = salesData?.totalIncome || 0;

  return (
    <Card sx={{ p: 3, borderRadius: 2, height: 1 }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 1 }}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {t('dashboard.sales.yearlySales')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {`(+43%) ${t('dashboard.sales.thanLastYear')}`}
          </Typography>

          <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
            <Stack spacing={0.25}>
              <Typography variant="caption" sx={{ color: 'text.disabled', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#36B37E', display: 'inline-block' }} />
                {t('dashboard.sales.totalIncome')}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>CHF {totalIncome.toLocaleString()}</Typography>
            </Stack>
          </Stack>
        </Stack>

        <FormControl size="small" variant="outlined">
          <Select defaultValue="2026" sx={{ fontSize: 14 }}>
            <MenuItem value="2026">2026</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#36B37E" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#36B37E" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: theme.palette.text.disabled }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: theme.palette.text.disabled }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: 'none', boxShadow: theme.customShadows?.z12 }}
          />
          <Area type="monotone" dataKey="income" stroke="#36B37E" strokeWidth={2.5} fill="url(#incomeGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
