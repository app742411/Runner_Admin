import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';

import { useSelector } from 'react-redux';
import LoadingButton from '@mui/lab/LoadingButton';
import toast from 'react-hot-toast';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTranslation } from 'react-i18next';
import { Label } from 'src/components/label';
import { fDateTime } from 'src/utils/format-time';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useAcceptTicket } from 'src/features/support/useTickets';

// ----------------------------------------------------------------------

export default function SupportTicketCard({ ticket }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const acceptTicketMutation = useAcceptTicket();

  const {
    _id,
    title,
    description,
    createdBy,
    status,
    assignedTo,
    createdAt,
    attachments,
  } = ticket;

  const isAuthorized = user?.role === 'company_admin' || user?.role === 'superAdmin';
  const canAccept = isAuthorized && (status === 'pending' || status === 'Created' || status === 'new');

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    try {
      await acceptTicketMutation.mutateAsync({ ticketId: _id, status: newStatus });
      toast.success(t('support.status_updated', { status: newStatus }));
    } catch (error) {
      toast.error(error.message || t('support.status_update_failed'));
    }
  };

  const STATUS_OPTIONS = [
    ...(status !== 'accepted' && status !== 'closed' ? [{ value: status, label: t(`support.status.${status.toLowerCase().replace('-', '_')}`) || status }] : []),
    { value: 'accepted', label: t('support.status.accepted') },
    { value: 'closed', label: t('support.status.closed') },
  ];

  let statusColor = 'grey';
  if (status === 'accepted' || status === 'Resolved') statusColor = 'success';
  else if (status === 'pending' || status === 'Created' || status === 'new' || status === 'open') statusColor = 'info';
  else if (status === 'in_progress' || status === 'On-Going') statusColor = 'warning';
  else if (status === 'rejected' || status === 'Closed' || status === 'closed') statusColor = 'error';

  return (
    <Card sx={{ p: 3, mb: 2, position: 'relative' }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.palette[statusColor]?.main || theme.palette.grey[500] }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Ticket# {_id.substring(0, 8).toUpperCase()} - {title}
        </Typography>


        <Box sx={{ flexGrow: 1 }} />

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {t('support.posted_at', { time: fDateTime(createdAt) })}
        </Typography>
      </Stack>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {description}
      </Typography>

      {attachments?.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Iconify icon="eva:attach-2-fill" width={16} sx={{ color: 'text.disabled' }} />
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            {attachments.length} {attachments.length === 1 ? t('support.attachment') : t('support.attachments')}
          </Typography>
        </Stack>
      )}

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 2, borderTop: `1px solid ${alpha(theme.palette.grey[500], 0.12)}` }}>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar
              alt={createdBy?.firstName}
              src={createdBy?.avatarUrl}
              sx={{ width: 28, height: 28 }}
            />
            <Typography variant="caption">
              {t('support.by')}: {createdBy?.firstName} {createdBy?.lastName}
            </Typography>
          </Stack>

          {assignedTo && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                alt={assignedTo?.firstName}
                src={assignedTo?.avatarUrl}
                sx={{ width: 28, height: 28 }}
              />
              <Typography variant="caption">
                {t('support.assigned')}: {assignedTo?.firstName} {assignedTo?.lastName}
              </Typography>
            </Stack>
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2}>
          {isAuthorized && (
            <Select
              size="small"
              value={status}
              onChange={handleStatusChange}
              disabled={acceptTicketMutation.isPending}
              sx={{
                minWidth: 120,
                height: 32,
                fontSize: '0.875rem',
                bgcolor: alpha(theme.palette[statusColor]?.main || theme.palette.grey[500], 0.08),
                borderColor: alpha(theme.palette[statusColor]?.main || theme.palette.grey[500], 0.24),
                '& .MuiSelect-select': { py: 0.5 }
              }}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}

          <Link
            component={RouterLink}
            href={`${paths.dashboard.chat}?id=${_id}&type=ticket`}
            color="inherit"
            variant="subtitle2"
            sx={{ color: 'primary.main', textDecoration: 'underline', mr: 2 }}
          >
            {t('support.open_chat')}
          </Link>

          <Link
            component={RouterLink}
            href={paths.dashboard.support.details(_id)}
            color="inherit"
            variant="subtitle2"
            sx={{ color: 'primary.main', textDecoration: 'underline' }}
          >
            {t('support.open_ticket')}
          </Link>
        </Stack>
      </Stack>
    </Card>
  );
}
