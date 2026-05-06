import { fDate } from 'src/utils/format-time';

import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { usePopover, CustomPopover } from 'src/components/custom-popover';
import MenuItem from '@mui/material/MenuItem';

// ----------------------------------------------------------------------

export function PropertyTableRow({ row, selected, onSelectRow, onEditRow, onViewRow }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const popover = usePopover();

  const {
    propertyName,
    propertyType,
    company,
    client,
    location,
    sizeSqm,
    noOfResidents,
    totalTasks,
    createdAt,
  } = row;

  // Mock status since API payload does not provide 'Contract Status' natively
  const isInactive = (propertyName?.length ?? 0) % 2 === 0;
  const statusLabel = isInactive ? t('property.status.inactive') : t('property.status.active');
  const labelColor = isInactive ? 'warning' : 'success';

  return (
    <>
      <TableRow
        hover
        selected={selected}
        onClick={onViewRow}
        sx={{
          borderBottom: `1px dashed ${theme.palette.divider}`,
          cursor: 'pointer'
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={(e) => {
              e.stopPropagation();
              onSelectRow();
            }}
          />
        </TableCell>

        <TableCell>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              fontWeight: 'bold',
            }}
          >
            {propertyName}
          </Typography>
        </TableCell>

        <TableCell sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {propertyType}
        </TableCell>

        <TableCell sx={{ color: 'text.secondary' }}>
          {company?.companyName || '-'}
        </TableCell>

        <TableCell sx={{ color: 'text.secondary' }}>
          <Stack spacing={0.5}>
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'medium' }}>
              {client?.clientName || client?.name || '-'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {client?.email || '-'}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell sx={{ color: 'text.secondary' }}>
          {location?.address || '-'}
        </TableCell>

        <TableCell sx={{ color: 'text.secondary' }}>
          {sizeSqm}
        </TableCell>

        <TableCell sx={{ color: 'text.secondary' }}>
          {noOfResidents}
        </TableCell>

        <TableCell sx={{ color: 'text.secondary' }}>
          {totalTasks}
        </TableCell>

        <TableCell sx={{ color: 'text.secondary' }}>
          {fDate(createdAt)}
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={labelColor}
            sx={{
              textTransform: 'capitalize',
              bgcolor: isInactive ? 'warning.lighter' : 'success.lighter',
              color: isInactive ? 'warning.dark' : 'success.dark',
              fontWeight: 'bold'
            }}
          >
            {statusLabel}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton
            color={popover.open ? 'primary' : 'default'}
            onClick={(e) => {
              e.stopPropagation();
              popover.onOpen(e);
            }}
          >
            <Iconify icon="eva:more-vertical-fill" width={20} />
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
            onViewRow();
          }}
        >
          <Iconify icon="solar:document-bold" />
          {t('common.view')}
        </MenuItem>
      </CustomPopover>
    </>
  );
}
