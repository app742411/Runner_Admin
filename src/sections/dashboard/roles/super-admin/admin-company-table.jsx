import PropTypes from 'prop-types';
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
import { fDate } from 'src/utils/format-time';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

const STATUS_COLOR = {
  active: 'success',
  inactive: 'error',
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
};

export function AdminCompanyTable({ companies = [] }) {
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
              {companies.map((company) => (
                <TableRow key={company._id} hover>
                  <TableCell>
                    <Typography variant="subtitle2">{company.companyName}</Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>
                    <Label variant="soft" color={STATUS_COLOR[company.status] || 'default'}>
                      {t(`company.table.status.${company.status}`) || company.status}
                    </Label>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>
                    <Label variant="soft" color={STATUS_COLOR[company.subscriptionStatus] || 'default'}>
                      {t(`company.table.status.${company.subscriptionStatus}`) || company.subscriptionStatus}
                    </Label>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{fDate(company.createdAt)}</TableCell>
                  <TableCell>
                    <Label variant="soft" color={STATUS_COLOR[company.isApproved] || 'default'}>
                      {t(`company.table.status.${company.isApproved}`) || company.isApproved}
                    </Label>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {!companies.length && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <SearchNotFound query="" />
                  </TableCell>
                </TableRow>
              )}
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

AdminCompanyTable.propTypes = {
  companies: PropTypes.array,
};
