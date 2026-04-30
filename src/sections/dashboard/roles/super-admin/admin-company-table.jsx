import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import { useTheme } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const COMPANIES = [
  { id: 1, name: 'Company 1', activeType: 'Active', subscription: 'Active', dateToUse: '17 Jan 2022  10:00 PM', status: 'Active' },
  { id: 2, name: 'Company 2', activeType: 'Inactive', subscription: 'Inactive', dateToUse: '14 Feb 2022  12:30 PM', status: 'Inactive' },
  { id: 3, name: 'Company 3', activeType: 'Active', subscription: 'Active', dateToUse: '29 Mar 2022  11:15 AM', status: 'Active' },
  { id: 4, name: 'Company 4', activeType: 'Active', subscription: 'Active', dateToUse: '05 Apr 2022  09:46 AM', status: 'Pending' },
  { id: 5, name: 'Company 5', activeType: 'Inactive', subscription: 'Inactive', dateToUse: '10 May 2022  08:20 PM', status: 'Inactive' },
];

const STATUS_COLOR = {
  Active: 'success',
  Inactive: 'error',
  Pending: 'warning',
};

export function AdminCompanyTable() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Card sx={{ borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" sx={{ px: 3, py: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {t('dashboard.companyManagement')}
        </Typography>
      </Stack>

      <Scrollbar>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: theme.palette.background.neutral }}>
              <TableRow>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: 12 }}>{t('dashboard.table.companyName')}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: 12 }}>{t('dashboard.table.activeType')}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: 12 }}>{t('dashboard.table.subscription')}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: 12 }}>{t('dashboard.table.dateToUse')}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: 12 }}>{t('dashboard.table.status')}</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {COMPANIES.map((company) => (
                <TableRow key={company.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2">{company.name}</Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{t(`company.table.status.${company.activeType.toLowerCase()}`) || company.activeType}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{t(`company.table.status.${company.subscription.toLowerCase()}`) || company.subscription}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{company.dateToUse}</TableCell>
                  <TableCell>
                    <Label variant="soft" color={STATUS_COLOR[company.status] || 'default'}>
                      {t(`company.table.status.${company.status.toLowerCase()}`) || company.status}
                    </Label>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{ px: 3, py: 2, borderTop: `dashed 1px ${theme.palette.divider}`, cursor: 'pointer', color: 'text.secondary' }}
      >
        <Typography variant="caption" sx={{ fontWeight: 'bold', mr: 0.5 }}>{t('dashboard.viewAll')}</Typography>
        <Iconify icon="solar:arrow-right-bold" width={14} />
      </Stack>
    </Card>
  );
}
