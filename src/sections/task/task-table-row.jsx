import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export function TaskTableRow({ row, selected, onSelectRow }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const user = useSelector((state) => state.auth.user);
  const isEmployee = user?.role === 'employee';

  const {
    taskId,
    taskName,
    taskCategory,
    taskSubCategory,
    taskPrice,
    status,
    company,
    assignedBy,
    createdAt,
    subTaskName,
    subTasks,
    task: taskData,
  } = row;

  const isSubTask = !!taskData;

  // Adapt for subtask data structure
  const displayName = isSubTask ? (taskData?.taskName || '-') : taskName;
  const displayCategory = isSubTask ? (taskData?.taskCategory || '-') : taskCategory;
  const displaySubCategory = isSubTask ? (taskData?.taskSubCategory || '-') : taskSubCategory;
  const displayPrice = isSubTask ? (taskData?.taskPrice || 0) : taskPrice;
  const displayCompany = isSubTask ? (row.company || '-') : company;
  const displayAssignedBy = assignedBy?.name || assignedBy?.firstName ? `${assignedBy?.firstName || ''} ${assignedBy?.lastName || ''}`.trim() : '-';

  const navigationId = isSubTask ? taskData?._id : (taskId || row._id);

  let labelColor = 'default';
  if (status === 'completed') labelColor = 'success';
  else if (status === 'pending') labelColor = 'warning';
  else if (status === 'rejected') labelColor = 'error';
  else if (status === 'in_progress') labelColor = 'info';

  return (
    <TableRow
      hover
      selected={selected}
      onClick={() => router.push(paths.dashboard.task.details(navigationId))}
      sx={{ cursor: 'pointer', borderBottom: `1px dashed ${theme.palette.divider}` }}
    >
      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>
          {displayName}
        </Typography>
      </TableCell>

      {isEmployee && (
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {subTaskName}
          </Typography>
        </TableCell>
      )}

      <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
        {displayCategory}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
        {displaySubCategory}
      </TableCell>

      <TableCell onClick={(e) => e.stopPropagation()}>
        <Tooltip
          title={
            <Stack spacing={0.5} sx={{ p: 0.5 }}>
              {subTasks?.length > 0 ? (
                subTasks.map((st, idx) => (
                  <Typography key={idx} variant="caption">• {st.subTaskName}</Typography>
                ))
              ) : (
                <Typography variant="caption">{t('task.noSubtasks') || 'No subtasks'}</Typography>
              )}
            </Stack>
          }
          placement="top"
          arrow
        >
          <Box sx={{ p: 1, borderRadius: 1, border: `1px solid ${theme.palette.divider}`, display: 'inline-block', typography: 'caption', color: 'text.secondary', cursor: 'pointer' }}>
            {subTasks?.length || 0}
          </Box>
        </Tooltip>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
        {fCurrency(displayPrice)}
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={labelColor}
          sx={{ textTransform: 'capitalize' }}
        >
          {t(`task.status.${status}`) || status}
        </Label>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
        {typeof displayCompany === 'string' ? displayCompany : (displayCompany?.companyName || '-')}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
        {displayAssignedBy}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
        {fDate(createdAt)}
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
        <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="flex-end">
          <IconButton color="default">
            <Iconify icon="solar:pen-bold" width={20} />
          </IconButton>
          <IconButton color="default">
            <Iconify icon="eva:more-vertical-fill" width={20} />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
