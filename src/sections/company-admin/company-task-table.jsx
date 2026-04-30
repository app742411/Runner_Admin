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

const TASKS = [
  { id: 1, taskName: 'Task 1', assignedTo: 'Employee A', dueDate: '01/01/2024', company: 'Company name', status: 'Active' },
  { id: 2, taskName: 'Task 1', assignedTo: 'Employee A', dueDate: '01/01/2024', company: 'Company name', status: 'Active' },
  { id: 3, taskName: 'Task 1', assignedTo: 'Employee A', dueDate: '01/01/2024', company: 'Company name', status: 'Active' },
  { id: 4, taskName: 'Task 1', assignedTo: 'Employee A', dueDate: '01/01/2024', company: 'Company name', status: 'Active' },
  { id: 5, taskName: 'Task 1', assignedTo: 'Employee A', dueDate: '01/01/2024', company: 'Company name', status: 'Active' },
];

import dayjs from 'dayjs';

export function CompanyTaskTable({ tasks = [] }) {
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
          {t('dashboard.allTasks')}
        </Typography>
      </Stack>

      <Scrollbar>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'transparent' }}>
              <TableRow>
                <TableCell sx={{ color: 'info.main', fontWeight: 'bold' }}>{t('dashboard.table.taskName')}</TableCell>
                <TableCell sx={{ color: 'info.main', fontWeight: 'bold' }}>{t('dashboard.table.assignedTo')}</TableCell>
                <TableCell sx={{ color: 'info.main', fontWeight: 'bold' }}>{t('contract.table.date')}</TableCell>
                <TableCell sx={{ color: 'info.main', fontWeight: 'bold' }}>{t('dashboard.table.status')}</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.taskId} hover>
                  <TableCell>
                    <Typography variant="subtitle2">{task.taskName}</Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{task.assignedBy?.name || '-'}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{dayjs(task.createdAt).format('DD/MM/YYYY')}</TableCell>
                  <TableCell>
                    <Label 
                      variant="soft" 
                      color={
                        (task.status === 'completed' && 'success') ||
                        (task.status === 'in_progress' && 'info') ||
                        (task.status === 'pending' && 'warning') ||
                        'default'
                      }
                    >
                      {t(`task.status.${task.status}`) || task.status}
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
