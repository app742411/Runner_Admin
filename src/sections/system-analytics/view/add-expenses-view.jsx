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

const CATEGORIES = [
  { value: 'hosting', label: 'Cloud Hosting & Servers' },
  { value: 'software', label: 'Software Licenses' },
  { value: 'marketing', label: 'Marketing & Ads' },
  { value: 'office', label: 'Office Supplies' },
  { value: 'travel', label: 'Travel & Dining' },
];

export function AddExpensesView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const [expenses, setExpenses] = useState([
    { id: 1, name: 'AWS Cloud Hosting', category: 'hosting', amount: 1240.5, date: '2026-05-01', note: 'Monthly cloud hosting bill' },
    { id: 2, name: 'GitHub Enterprise Licenses', category: 'software', amount: 450.0, date: '2026-05-03', note: 'Developer licenses' },
    { id: 3, name: 'Google Workspace', category: 'software', amount: 180.0, date: '2026-05-04', note: 'Email & collaboration tools' },
  ]);

  const [form, setForm] = useState({
    name: '',
    category: 'hosting',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.amount) return;

    setExpenses([
      {
        id: Date.now(),
        name: form.name,
        category: form.category,
        amount: Number(form.amount),
        date: form.date,
        note: form.note,
      },
      ...expenses,
    ]);

    setForm({
      name: '',
      category: 'hosting',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      note: '',
    });
  };

  return (
    <DashboardContent maxWidth={false}>
      {/* HEADER */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Stack spacing={1}>
          <Typography variant="h4">{t('system.expenses.title') || 'Expenses Tracker'}</Typography>
          <Breadcrumbs
            separator={
              <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push('/dashboard')} sx={{ cursor: 'pointer' }}>
              {t('nav.dashboard') || 'Dashboard'}
            </Link>
            <Typography color="text.primary">{t('system.expenses.title') || 'Expenses'}</Typography>
          </Breadcrumbs>
        </Stack>
      </Stack>

      <Grid container spacing={4}>
        {/* FORM */}
        <Grid xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z4,
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              Add New Expense
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth
                label="Expense Item / Vendor"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <TextField
                select
                fullWidth
                label="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Amount ($)"
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Note / Description"
                multiline
                rows={3}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
              <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
                Add Expense
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* LIST */}
        <Grid xs={12} md={8}>
          <Stack spacing={3}>
            {/* Summary */}
            <Card
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: theme.customShadows?.z4,
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
              }}
            >
              <Typography variant="subtitle1" sx={{ opacity: 0.8, mb: 1 }}>
                Total Tracked Expenses
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Typography>
            </Card>

            {/* Table */}
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: theme.customShadows?.z4,
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: theme.palette.background.neutral }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Expense Details</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenses.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {row.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.note || 'No notes'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Label variant="soft" color="info">
                            {row.category}
                          </Label>
                        </TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ${row.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
