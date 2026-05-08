import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState, useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { chatApi } from 'src/store/api/chat.api';
import toast from 'react-hot-toast';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export function GroupTableRow({ row, selected, onSelectRow, onDeleteRow, onEditRow, onViewRow, isGroupAdminView = false }) {
  const { t } = useTranslation();
  const {
    name,
    description,
    task,
    groupAdmin,
    totalMembers,
    createdAt,
    contract,
    _id,
  } = row;

  const popover = usePopover();
  const router = useRouter();

  const handleOpenChat = async (e) => {
    e.stopPropagation();
    try {
      const res = await chatApi.initChat({
        type: 'group',
        groupId: _id,
      });
      const chatId = res.data?.data?._id || res.data?._id;
      if (chatId) {
        router.push(`${paths.dashboard.chat}?id=${chatId}&type=group`);
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
        onClick={onViewRow}
        sx={{ cursor: 'pointer' }}
      >
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
          {name}
        </TableCell>

        {isGroupAdminView ? (
          <>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              {row.company?.companyName || row.companyName || row.company?.name || row.companyId?.companyName || '-'}
            </TableCell>

            <TableCell sx={{ minWidth: 240 }}>
              <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
                {description || '-'}
              </Typography>
            </TableCell>

            <TableCell align="center">
              {totalMembers || 0}
            </TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              {contract?.contractNumber || '-'}
            </TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              {fCurrency(contract?.totalCost)}
            </TableCell>

            <TableCell>
              <Label
                variant="soft"
                color={
                  (contract?.status === 'active' && 'success') ||
                  (contract?.status === 'draft' && 'warning') ||
                  'default'
                }
              >
                {contract?.status || '-'}
              </Label>
            </TableCell>
          </>
        ) : (
          <>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              {row.company?.companyName || row.companyName || row.company?.name || row.companyId?.companyName || '-'}
            </TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              {task?.taskName || '-'}
            </TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              {groupAdmin ? `${groupAdmin.firstName} ${groupAdmin.lastName}` : '-'}
            </TableCell>

            <TableCell align="center">
              {totalMembers || 0}
            </TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              {fDate(createdAt)}
            </TableCell>
          </>
        )}

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
          <IconButton onClick={handleOpenChat} color="default">
            <Iconify icon="solar:users-group-two-rounded-bold" />
          </IconButton>

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {t('group.table.edit')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            onDeleteRow();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('group.table.delete')}
        </MenuItem>
      </CustomPopover>
    </>
  );
}
