import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
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

const EMPLOYEES = [
  { id: 1, name: 'Tanner Finsha', avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp', company: 'ABC Corp', position: 'Manager', status: 'Draft' },
  { id: 2, name: 'Emeto Winner', avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp', company: 'AB Corp', position: 'Intern', status: 'Published' },
  { id: 3, name: 'Tassy Omah', avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp', company: 'ABC Corp', position: 'Contractor', status: 'Published' },
  { id: 4, name: 'James Muriel', avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp', company: 'AB Corp', position: 'Executive', status: 'Draft' },
  { id: 5, name: 'James Muriel', avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp', company: 'AB Corp', position: 'Executive', status: 'Draft' },
];

export function CompanyEmployeeTable({ employees = [] }) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Card sx={{ borderRadius: 2, height: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 3, py: 2.5 }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {t('dashboard.totalEmployee')}
        </Typography>
      </Stack>

      <Scrollbar>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: theme.palette.background.neutral }}>
              <TableRow>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                  {t('dashboard.table.employeeName')} ↓
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{t('employee.form.email')}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{t('dashboard.table.position')}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{t('dashboard.table.status')}</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp._id} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar src={emp.avatarUrl} sx={{ width: 36, height: 36 }}>
                        {emp.firstName?.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle2">{`${emp.firstName} ${emp.lastName}`}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{emp.email}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{emp.jobPosition || '-'}</TableCell>
                  <TableCell>
                    <Label
                      variant="soft"
                      color="success"
                    >
                      {t('employee.tabs.active')}
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
        <Typography variant="caption" sx={{ fontWeight: 'bold', mr: 0.5 }}>
          {t('dashboard.viewAll')}
        </Typography>
        <Iconify icon="solar:arrow-right-bold" width={14} />
      </Stack>
    </Card>
  );
}
