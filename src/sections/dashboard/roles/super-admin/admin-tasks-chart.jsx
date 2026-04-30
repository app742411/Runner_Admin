import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ----------------------------------------------------------------------

const DATA = [
  { year: 'Pre Q1', tasks: 22 },
  { year: '2Q20', tasks: 28 },
  { year: '3Q20', tasks: 25 },
  { year: '1Q21', tasks: 32 },
  { year: '2Q21', tasks: 38 },
  { year: '3Q21', tasks: 55 },
  { year: '1Q22', tasks: 48 },
  { year: '2Q22', tasks: 42 },
  { year: '3Q22', tasks: 40 },
];

export function AdminTasksChart() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Card sx={{ p: 3, borderRadius: 2, height: 1 }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {t('dashboard.allTasks')}
        </Typography>
        <FormControl size="small" variant="outlined">
          <Select defaultValue="2022" sx={{ fontSize: 14 }}>
            <MenuItem value="2022">2022</MenuItem>
            <MenuItem value="2023">2023</MenuItem>
            <MenuItem value="2024">2024</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fill: theme.palette.text.disabled }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: theme.palette.text.disabled }}
            axisLine={false}
            tickLine={false}
            domain={[20, 60]}
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: 'none', boxShadow: theme.customShadows?.z8 }}
          />
          <Line
            type="monotone"
            dataKey="tasks"
            stroke={theme.palette.text.primary}
            strokeWidth={2.5}
            dot={{ r: 4, fill: theme.palette.text.primary }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
