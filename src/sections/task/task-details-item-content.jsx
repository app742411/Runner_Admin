import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Label } from 'src/components/label';
import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

export default function TaskDetailsItemContent({
  currentSubTask,
  isEmployeeRole,
  onStartTimer,
  onStopTimer,
  onOpenAssign,
  onUploadImage,
  onSaveAfterDescription,
  uploadBefore,
  uploadAfter,
  t,
  formatDecimalTime
}) {
  const theme = useTheme();

  const [afterDescription, setAfterDescription] = useState('');

  useEffect(() => {
    setAfterDescription(currentSubTask?.afterWorkImagesdescription || currentSubTask?.afterWorkDescription || '');
  }, [currentSubTask]);

  const getImageUrl = (img) => {
    if (!img) return '';

    // Handle object structure from backend
    let path = typeof img === 'string' ? img : img.url;
    if (!path || typeof path !== 'string') return '';

    const baseUrl = import.meta.env.VITE_SERVER_URL;

    // If it's an absolute system path, try to resolve to a web-servable path
    // Assuming 'uploads' is the static folder
    if (path.includes('uploads/')) {
      path = path.substring(path.indexOf('uploads/'));
    }

    try {
      // If path is already a full URL, new URL(path, baseUrl) will just return path
      return new URL(path, baseUrl).href;
    } catch {
      // Fallback for non-standard paths
      return path.startsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`;
    }
  };

  if (!currentSubTask) return (
    <Box sx={{ p: 5, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">Select a subtask to view details</Typography>
    </Box>
  );

  return (
    <Box sx={{ p: 4, height: '100%', bgcolor: 'background.paper' }}>
      {/* Header Actions */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>{currentSubTask.subTaskName}</Typography>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1.5 }}>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ px: 1, py: 0.5, borderRadius: 1, bgcolor: alpha(theme.palette.grey[500], 0.08) }}>
              <Iconify icon="solar:clock-circle-bold" width={16} color="text.secondary" />
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {formatDecimalTime(currentSubTask.totalTimeSeconds || 0)} / {formatDecimalTime(currentSubTask.estimatedDurationSeconds || 0)}
              </Typography>
            </Stack>

            <Label variant="soft" color={currentSubTask.status === 'completed' ? 'success' : currentSubTask.status === 'in_progress' ? 'warning' : 'info'} sx={{ textTransform: 'capitalize' }}>
              {currentSubTask.status ? (t(`task.status.${currentSubTask.status}`) || currentSubTask.status) : 'N/A'}
            </Label>

            <Typography variant="subtitle1" sx={{ color: 'success.main', fontWeight: 800 }}>
              {fCurrency(currentSubTask.subtaskPrice || 0)}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
            {currentSubTask.expectedEndTime && (
              <Box>
                <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 0.5 }}>{t('task.details.expectedEnd')}</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{fDateTime(currentSubTask.expectedEndTime)}</Typography>
              </Box>
            )}
            {currentSubTask.timerCompletedAt && (
              <Box>
                <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 0.5 }}>{t('task.details.completedAt')}</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{fDateTime(currentSubTask.timerCompletedAt)}</Typography>
              </Box>
            )}
          </Stack>
        </Box>

        <Stack direction="row" spacing={1.5}>
          {isEmployeeRole && currentSubTask.status !== 'completed' && (
            <Button
              variant="contained"
              size="large"
              color={currentSubTask.status === 'in_progress' ? "error" : "success"}
              onClick={() => currentSubTask.status === 'in_progress' ? onStopTimer(currentSubTask._id) : onStartTimer(currentSubTask._id)}
              startIcon={<Iconify icon={currentSubTask.status === 'in_progress' ? "solar:stop-bold" : "solar:play-bold"} />}
              sx={{ borderRadius: 1.5, px: 4, fontWeight: 'bold', height: 48, boxShadow: currentSubTask.status === 'in_progress' ? theme.customShadows.error : theme.customShadows.success }}
            >
              {currentSubTask.status === 'in_progress' ? t('task.details.stopWork') : t('task.details.startWork')}
            </Button>
          )}
          {!isEmployeeRole && (
            <Button
              variant="contained"
              size="large"
              color="primary"
              startIcon={<Iconify icon="solar:user-plus-bold" />}
              onClick={(e) => onOpenAssign(e, currentSubTask._id)}
              sx={{ borderRadius: 1.5, px: 3, fontWeight: 'bold', height: 48 }}
            >
              {t('task.details.assignTo')}
            </Button>
          )}
        </Stack>
      </Stack>

      <Scrollbar sx={{ maxHeight: 700 }}>
        <Stack spacing={4}>
          <Box sx={{ p: 3, borderRadius: 2, bgcolor: alpha(theme.palette.grey[500], 0.04), border: `1px dashed ${theme.palette.divider}` }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify icon="solar:camera-bold" width={20} color="primary.main" />
              {t('task.details.picturesBefore')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {(Array.isArray(currentSubTask.beforeWorkImages) ? currentSubTask.beforeWorkImages : (currentSubTask.beforeWorkImage ? [currentSubTask.beforeWorkImage] : [])).map((img, idx) => (
                <Box key={idx} sx={{ position: 'relative', width: 120, height: 120, borderRadius: 1.5, overflow: 'hidden', border: `1px solid ${theme.palette.divider}`, boxShadow: theme.customShadows.z4 }}>
                  <Box component="img" src={getImageUrl(img)} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              ))}
              <Box
                component="label"
                sx={{
                  width: 120, height: 120,
                  borderRadius: 1.5,
                  border: (t) => `2px dashed ${alpha(t.palette.primary.main, 0.3)}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08), borderColor: theme.palette.primary.main }
                }}
              >
                <Iconify icon={uploadBefore.isPending ? "solar:refresh-bold-duotone" : "solar:camera-add-bold"} width={32} sx={{ color: 'primary.main', mb: 1, animation: uploadBefore.isPending ? 'spin 2s linear infinite' : 'none' }} />
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{t('common.upload') || 'Upload'}</Typography>
                <input type="file" hidden accept="image/*" onChange={(e) => onUploadImage(e, currentSubTask._id, 'before')} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 3, borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.04), border: `1px dashed ${alpha(theme.palette.success.main, 0.2)}` }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify icon="solar:camera-bold" width={20} color="success.main" />
              {t('task.details.picturesAfter')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
              {(Array.isArray(currentSubTask.afterWorkImages) ? currentSubTask.afterWorkImages : (currentSubTask.afterWorkImage ? [currentSubTask.afterWorkImage] : [])).map((img, idx) => (
                <Box key={idx} sx={{ position: 'relative', width: 120, height: 120, borderRadius: 1.5, overflow: 'hidden', border: `1px solid ${theme.palette.divider}`, boxShadow: theme.customShadows.z4 }}>
                  <Box component="img" src={getImageUrl(img)} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              ))}
              <Box
                component="label"
                sx={{
                  width: 120, height: 120,
                  borderRadius: 1.5,
                  border: (t) => `2px dashed ${alpha(t.palette.success.main, 0.3)}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                  bgcolor: alpha(theme.palette.success.main, 0.02),
                  '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.08), borderColor: theme.palette.success.main }
                }}
              >
                <Iconify icon={uploadAfter.isPending ? "solar:refresh-bold-duotone" : "solar:camera-add-bold"} width={32} sx={{ color: 'success.main', mb: 1, animation: uploadAfter.isPending ? 'spin 2s linear infinite' : 'none' }} />
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'success.main' }}>{t('common.upload') || 'Upload'}</Typography>
                <input type="file" hidden accept="image/*" onChange={(e) => onUploadImage(e, currentSubTask._id, 'after')} />
              </Box>
            </Box>

            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon="solar:notes-bold" width={18} color="text.secondary" />
                  {t('task.details.describeAfter')}
                </Typography>
                <LoadingButton
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => onSaveAfterDescription(currentSubTask._id, afterDescription)}
                  loading={uploadAfter.isPending}
                  sx={{ borderRadius: 1, fontWeight: 'bold' }}
                >
                  {t('common.save') || 'Save'}
                </LoadingButton>
              </Stack>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder={t('task.details.describeAfter')}
                variant="outlined"
                value={afterDescription}
                onChange={(e) => setAfterDescription(e.target.value)}
                sx={{
                  bgcolor: 'background.paper',
                  '& .MuiOutlinedInput-root': { borderRadius: 1.5 }
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </Scrollbar>
    </Box>
  );
}

TaskDetailsItemContent.propTypes = {
  currentSubTask: PropTypes.object,
  isEmployeeRole: PropTypes.bool,
  onStartTimer: PropTypes.func,
  onStopTimer: PropTypes.func,
  onOpenAssign: PropTypes.func,
  onUploadImage: PropTypes.func,
  onSaveAfterDescription: PropTypes.func,
  uploadBefore: PropTypes.object,
  uploadAfter: PropTypes.object,
  t: PropTypes.func,
  formatDecimalTime: PropTypes.func,
};
