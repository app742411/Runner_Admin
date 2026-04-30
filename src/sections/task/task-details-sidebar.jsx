import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

export default function TaskDetailsSidebar({ 
  subTasks, 
  activeSubTaskId, 
  onSelectSubTask,
  t,
  formatDecimalTime
}) {
  const theme = useTheme();

  return (
    <Box sx={{ borderRight: (t) => `1px solid ${t.palette.divider}`, bgcolor: alpha(theme.palette.grey[500], 0.04), height: '100%' }}>
      <Stack sx={{ p: 2, bgcolor: 'background.paper', borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:list-bold-duotone" width={20} color="primary.main" />
          {t('contract.form.taskManagement')} ({subTasks.length})
        </Typography>
      </Stack>
      
      <Scrollbar sx={{ maxHeight: 700 }}>
        <Stack spacing={1} sx={{ p: 1.5 }}>
          {subTasks.map((subTask) => {
            const isSelected = (activeSubTaskId || subTasks[0]?._id) === subTask._id;
            const isCompleted = subTask.status === 'completed';
            const isInProgress = subTask.status === 'in_progress';
            
            return (
              <Box 
                key={subTask._id}
                onClick={() => onSelectSubTask(subTask._id)}
                sx={{ 
                  p: 2, 
                  borderRadius: 1.5, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: theme.transitions.create(['all']),
                  bgcolor: isSelected ? 'background.paper' : 'transparent',
                  border: '1px solid',
                  borderColor: isSelected ? alpha(theme.palette.primary.main, 0.2) : 'transparent',
                  boxShadow: isSelected ? theme.customShadows.z8 : 'none',
                  '&:hover': { 
                    bgcolor: isSelected ? 'background.paper' : alpha(theme.palette.primary.main, 0.04),
                    borderColor: isSelected ? alpha(theme.palette.primary.main, 0.3) : alpha(theme.palette.divider, 0.5)
                  }
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                   <Typography variant="subtitle2" sx={{ fontWeight: isSelected ? 'bold' : 'medium', color: isSelected ? 'primary.main' : 'text.primary', noWrap: true }}>
                     {subTask.subTaskName}
                   </Typography>
                   <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.disabled', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Iconify icon="solar:clock-circle-linear" width={12} />
                        {formatDecimalTime(subTask.estimatedDurationSeconds || 0)}
                      </Typography>
                      <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.disabled' }} />
                      <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                        CHF {subTask.subtaskPrice || 0}
                      </Typography>
                   </Stack>
                </Box>

                <Box sx={{ 
                  width: 24, height: 24, 
                  borderRadius: '50%', 
                  border: (t) => `2px solid ${isCompleted ? theme.palette.success.main : isInProgress ? theme.palette.warning.main : theme.palette.divider}`,
                  bgcolor: isCompleted ? theme.palette.success.main : isInProgress ? alpha(theme.palette.warning.main, 0.1) : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {isCompleted && <Iconify icon="solar:check-circle-bold" width={16} color="white" />}
                  {isInProgress && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main', animation: 'pulse 1.5s infinite' }} />}
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Scrollbar>
    </Box>
  );
}

TaskDetailsSidebar.propTypes = {
  subTasks: PropTypes.array,
  activeSubTaskId: PropTypes.string,
  onSelectSubTask: PropTypes.func,
  t: PropTypes.func,
  formatDecimalTime: PropTypes.func,
};
