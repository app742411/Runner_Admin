import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import { alpha, useTheme } from '@mui/material/styles';

import { useAddComment, useAddReply } from 'src/features/task/useTasks';
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
  formatDecimalTime,
  taskId,
  task
}) {
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);

  const [afterDescription, setAfterDescription] = useState('');
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState({});
  const [activeReplyBox, setActiveReplyBox] = useState(null);

  const addCommentMutation = useAddComment();
  const addReplyMutation = useAddReply();

  const getCommenterDetails = (createdBy) => {
    // 1. Check logged-in user
    if (user?._id === createdBy || user?.userId === createdBy || user?.id === createdBy) {
      return {
        name: user?.name || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || 'Me'),
        role: user?.role || 'employee',
        avatarUrl: user?.avatarUrl || user?.profilePicture || user?.employeeProfile?.profileImage?.fileUrl,
      };
    }

    // 2. Check assignedBy
    if (task?.assignedBy && (task.assignedBy.userId === createdBy || task.assignedBy._id === createdBy)) {
      return {
        name: task.assignedBy.name || 'Admin',
        role: 'company_admin',
        avatarUrl: '',
      };
    }

    // 3. Check assignedTo in current subtask
    const assignedEmp = currentSubTask?.assignedTo?.find(
      (emp) => emp.userId === createdBy || emp._id === createdBy
    );
    if (assignedEmp) {
      return {
        name: assignedEmp.name || 'Employee',
        role: 'employee',
        avatarUrl: assignedEmp.avatarUrl || assignedEmp.profilePicture || assignedEmp.employeeProfile?.profileImage?.fileUrl,
      };
    }

    // 4. Fallback default
    return {
      name: t('common.unknown') || 'User',
      role: 'user',
      avatarUrl: '',
    };
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      await addCommentMutation.mutateAsync({
        subTaskId: currentSubTask._id,
        text: commentText,
        taskId,
      });
      setCommentText('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddReply = async (commentId) => {
    const text = replyText[commentId];
    if (!text || !text.trim()) return;
    try {
      await addReplyMutation.mutateAsync({
        subTaskId: currentSubTask._id,
        commentId,
        text,
        taskId,
      });
      setReplyText((prev) => ({ ...prev, [commentId]: '' }));
      setActiveReplyBox(null);
    } catch (error) {
      console.error(error);
    }
  };

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
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{t('common.upload')}</Typography>
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
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'success.main' }}>{t('common.upload')}</Typography>
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
                  {t('common.save')}
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

          {/* Comments Section */}
          <Box sx={{ mt: 4, p: 3, borderRadius: 2, bgcolor: alpha(theme.palette.grey[500], 0.02), border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify icon="solar:chat-line-bold" width={22} color="primary.main" />
              {t('task.details.comments') || 'Comments & Feedback'}
              {(currentSubTask?.comments || []).length > 0 && (
                <Label color="primary" variant="filled" sx={{ borderRadius: '50%', width: 22, height: 22, p: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {(currentSubTask?.comments || []).length}
                </Label>
              )}
            </Typography>

            {/* Comment Input */}
            <Stack direction="row" spacing={1.5} sx={{ mb: 4 }}>
              <Avatar
                src={user?.avatarUrl || user?.profilePicture || user?.employeeProfile?.profileImage?.fileUrl}
                alt={user?.firstName || 'Me'}
                sx={{ width: 40, height: 40, border: `2px solid ${theme.palette.background.paper}`, boxShadow: theme.customShadows.z4 }}
              />
              <TextField
                fullWidth
                size="medium"
                placeholder={t('task.details.addCommentPlaceholder') || 'Write a comment...'}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={addCommentMutation.isPending}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <LoadingButton
                        color="primary"
                        variant="contained"
                        onClick={handleAddComment}
                        loading={addCommentMutation.isPending}
                        loadingPosition="start"
                        startIcon={<Iconify icon="solar:send-bold" width={16} />}
                        sx={{ borderRadius: 1, px: 2, height: 40, fontWeight: 'bold' }}
                      >
                        {t('common.submit') || 'Submit'}
                      </LoadingButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 1.5, bgcolor: 'background.paper' }
                }}
              />
            </Stack>

            {/* Comments List */}
            {(!currentSubTask?.comments || currentSubTask.comments.length === 0) ? (
              <Box sx={{ py: 6, textAlign: 'center', borderRadius: 1.5, bgcolor: 'background.paper', border: `1px dashed ${theme.palette.divider}` }}>
                <Iconify icon="solar:chat-square-broken" width={48} sx={{ color: 'text.disabled', mb: 1.5 }} />
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {t('task.details.noCommentsYet') || 'No comments yet'}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {t('task.details.beTheFirst') || 'Be the first to share an update or ask a question.'}
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2.5}>
                {currentSubTask.comments.map((comment) => {
                  const hasReplies = comment.replies && comment.replies.length > 0;
                  const isReplying = activeReplyBox === comment._id;

                  const commenter = getCommenterDetails(comment.createdBy);
                  const authorName = commenter.name;
                  const authorRole = commenter.role;
                  const authorAvatar = commenter.avatarUrl;

                  let roleColor = 'default';
                  if (authorRole === 'employee') roleColor = 'info';
                  else if (authorRole === 'company_admin') roleColor = 'secondary';
                  else if (authorRole === 'group_admin') roleColor = 'warning';

                  return (
                    <Paper
                      key={comment._id}
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.02)',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                          borderColor: theme.palette.divider,
                        }
                      }}
                    >
                      {/* Comment Author & Timestamp */}
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar
                          src={authorAvatar}
                          alt={authorName}
                          sx={{ width: 36, height: 36, boxShadow: theme.customShadows.z1 }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {authorName}
                            </Typography>
                            <Label size="small" variant="soft" color={roleColor} sx={{ textTransform: 'capitalize', height: 18, fontSize: '0.65rem' }}>
                              {authorRole.replace('_', ' ')}
                            </Label>
                            <Typography variant="caption" color="text.disabled" sx={{ ml: 'auto' }}>
                              {fDateTime(comment.createdAt)}
                            </Typography>
                          </Stack>

                          <Typography variant="body2" sx={{ mt: 1, color: 'text.primary', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                            {comment.text}
                          </Typography>

                          {/* Comment Actions */}
                          <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                            <Button
                              size="small"
                              color="inherit"
                              onClick={() => setActiveReplyBox(isReplying ? null : comment._id)}
                              startIcon={<Iconify icon="solar:pen-bold" width={14} />}
                              sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'text.secondary' }}
                            >
                              {t('common.reply') || 'Reply'}
                            </Button>
                          </Stack>

                          {/* Reply Input Box */}
                          <Collapse in={isReplying}>
                            <Stack direction="row" spacing={1.5} sx={{ mt: 2, pl: 2, borderLeft: `2px solid ${theme.palette.primary.main}` }}>
                              <TextField
                                fullWidth
                                size="small"
                                placeholder={t('task.details.replyPlaceholder') || 'Write a reply...'}
                                value={replyText[comment._id] || ''}
                                onChange={(e) => setReplyText({ ...replyText, [comment._id]: e.target.value })}
                                disabled={addReplyMutation.isPending}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <LoadingButton
                                        size="small"
                                        color="primary"
                                        variant="contained"
                                        onClick={() => handleAddReply(comment._id)}
                                        loading={addReplyMutation.isPending}
                                        loadingPosition="start"
                                        startIcon={<Iconify icon="solar:send-bold" width={12} />}
                                        sx={{ borderRadius: 0.75, px: 1.5, height: 32, fontWeight: 'bold' }}
                                      >
                                        {t('common.reply') || 'Reply'}
                                      </LoadingButton>
                                    </InputAdornment>
                                  )
                                }}
                              />
                            </Stack>
                          </Collapse>

                          {/* Replies List */}
                          {hasReplies && (
                            <Stack spacing={2} sx={{ mt: 2.5, pl: 3, borderLeft: `1px dashed ${theme.palette.divider}` }}>
                              {comment.replies.map((reply) => {
                                const replier = getCommenterDetails(reply.createdBy);
                                const replyAuthorName = replier.name;
                                const replyAuthorRole = replier.role;
                                const replyAuthorAvatar = replier.avatarUrl;

                                let replyRoleColor = 'default';
                                if (replyAuthorRole === 'employee') replyRoleColor = 'info';
                                else if (replyAuthorRole === 'company_admin') replyRoleColor = 'secondary';
                                else if (replyAuthorRole === 'group_admin') replyRoleColor = 'warning';

                                return (
                                  <Box key={reply._id}>
                                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                      <Avatar
                                        src={replyAuthorAvatar}
                                        alt={replyAuthorName}
                                        sx={{ width: 28, height: 28 }}
                                      />
                                      <Box sx={{ flexGrow: 1 }}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                                            {replyAuthorName}
                                          </Typography>
                                          <Label size="small" variant="soft" color={replyRoleColor} sx={{ textTransform: 'capitalize', height: 16, fontSize: '0.6rem' }}>
                                            {replyAuthorRole.replace('_', ' ')}
                                          </Label>
                                          <Typography variant="caption" color="text.disabled" sx={{ ml: 'auto', fontSize: '0.7rem' }}>
                                            {fDateTime(reply.createdAt)}
                                          </Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary', fontSize: '0.825rem', lineHeight: 1.5 }}>
                                          {reply.text}
                                        </Typography>
                                      </Box>
                                    </Stack>
                                  </Box>
                                );
                              })}
                            </Stack>
                          )}
                        </Box>
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
            )}
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
  taskId: PropTypes.string,
  task: PropTypes.object,
};

