import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { fDate } from 'src/utils/format-time';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import axios, { endpoints } from 'src/utils/axios';
import toast from 'react-hot-toast';

// ----------------------------------------------------------------------

export function EmployeeTableRow({ row, selected, onSelectRow, onDeleteRow }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const popover = usePopover();

  const {
    firstName,
    lastName,
    email,
    phone,
    gender,
    company,
    employeeProfile,
    isApproved,
    createdAt,
    _id,
  } = row;

  const displayName = `${firstName || ''} ${lastName || ''}`.trim() || t('employee.table.unknown');

  const displayPosition = employeeProfile?.jobPosition || '-';
  const displayExperience = employeeProfile?.workExperience || '-';
  const displayJoinedDate = employeeProfile?.startDate ? fDate(employeeProfile.startDate) : '-';
  const displayRegisterDate = fDate(createdAt);
  const displayCompany = company?.companyName || '-';

  let labelColor = 'default';
  if (isApproved === 'approved') {
    labelColor = 'success';
  } else if (isApproved === 'pending') {
    labelColor = 'warning';
  } else if (isApproved === 'banned') {
    labelColor = 'error';
  }

  const translatedStatus = {
    approved: t('employee.tabs.active'),
    pending: t('employee.tabs.pending'),
    banned: t('employee.tabs.banned'),
    rejected: t('employee.tabs.rejected'),
  };

  const handleOpenChat = async (e) => {
    e.stopPropagation();
    try {
      const res = await axios.post(endpoints.chat.init, {
        type: 'direct',
        receiverId: _id,
      });
      const chatId = res.data?.data?._id || res.data?._id;
      if (chatId) {
        router.push(`${paths.dashboard.chat}?id=${chatId}&type=direct`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to initiate chat');
    }
  };

  return (
    <>
      <TableRow
        hover
        selected={selected}
        onClick={() => router.push(paths.dashboard.employee.details(_id))}
        sx={{ cursor: 'pointer', borderBottom: `1px dashed ${theme.palette.divider}` }}
      >
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              alt={displayName}
              src={employeeProfile?.profileImage?.fileUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`}
            />
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>
              {displayName}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {employeeProfile?.jobPosition || '-'}
        </TableCell>

        <TableCell sx={{ color: 'text.secondary' }}>
          {email || '-'}
        </TableCell>

        <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
          {phone || '-'}
        </TableCell>

        <TableCell sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {gender || '-'}
        </TableCell>

        <TableCell sx={{ color: 'text.secondary' }}>
          {company?.companyName || '-'}
        </TableCell>

        <TableCell sx={{ color: 'text.secondary' }}>
          {employeeProfile?.workExperience || '-'}
        </TableCell>

        <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
          {employeeProfile?.startDate ? fDate(employeeProfile.startDate) : '-'}
        </TableCell>

        <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
          {fDate(createdAt)}
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={labelColor}
            sx={{ textTransform: 'capitalize' }}
          >
            {translatedStatus[isApproved] || isApproved || "Unknown"}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
          <IconButton color="default" onClick={handleOpenChat}>
            <Iconify icon="solar:chat-round-line-bold" width={20} />
          </IconButton>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" width={20} />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.dashboard.employee.edit(_id));
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {t('employee.popover.edit')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onDeleteRow();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('employee.popover.delete')}
        </MenuItem>
      </CustomPopover>
    </>
  );
}
