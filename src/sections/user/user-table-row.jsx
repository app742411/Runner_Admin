import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { t, i18n } = useTranslation();
  const popover = usePopover();

  const {
    firstName,
    lastName,
    email,
    role,
    company,
    createdAt,
    isApproved,
    profilePic,
  } = row;

  const fullName = `${firstName} ${lastName}`;

  // Default to en-GB if i18n.language is undefined
  const currentLocale = i18n.language || 'en-GB';

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={fullName} src={profilePic} sx={{ mr: 2 }} />

          <ListItemText
            primary={fullName}
            secondary={email}
            primaryTypographyProps={{ variant: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {company?.companyName || '-'}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textTransform: 'capitalize' }}>
          {role?.replace('_', ' ') || '-'}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {createdAt ? (
            <>
              {new Date(createdAt).toLocaleDateString(currentLocale, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}{' '}
              {new Date(createdAt).toLocaleTimeString(currentLocale, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </>
          ) : (
            '-'
          )}
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (isApproved === 'approved' && 'success') ||
              (isApproved === 'pending' && 'warning') ||
              (isApproved === 'banned' && 'error') ||
              (isApproved === 'rejected' && 'default') ||
              'default'
            }
          >
            {isApproved}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={popover.anchorEl}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onEditRow();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {t('common.edit')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onDeleteRow();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('common.delete')}
        </MenuItem>
      </CustomPopover>
    </>
  );
}
