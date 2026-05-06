import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useTranslation } from 'react-i18next';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { usePopover, CustomPopover } from 'src/components/custom-popover';
import MenuItem from '@mui/material/MenuItem';

// ----------------------------------------------------------------------

export function ContractTableRow({ row, index, selected, onEditRow, onSelectRow, onDeleteRow, hideCompany }) {
  const { t } = useTranslation();
  const router = useRouter();
  const popover = usePopover();

  const {
    _id,
    contractNumber,
    invoiceNumber,
    referenceNumber,
    client,
    property,
    company,
    startDate,
    endDate,
    totalCost,
    clinetStatus,
    status,
    emailStatus,
    contractType,
  } = row;

  return (
    <>
      <TableRow
        hover
        selected={selected}
        onClick={() => router.push(paths.dashboard.contract.details(_id))}
        sx={{ cursor: 'pointer' }}
      >
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center">
            <Avatar src={client?.clientLogo} alt={client?.name} sx={{ mr: 2, width: 36, height: 36 }} />
            <ListItemText
              primary={client?.name || '-'}
              secondary={client?.email || '-'}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              secondaryTypographyProps={{ component: 'span', typography: 'caption', color: 'text.disabled', noWrap: true }}
            />
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{contractNumber || '-'}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{invoiceNumber || '-'}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{referenceNumber || '-'}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{property?.propertyName || '-'}</TableCell>

        {!hideCompany && <TableCell sx={{ whiteSpace: 'nowrap' }}>{company?.companyName || '-'}</TableCell>}

        <TableCell sx={{ textTransform: 'capitalize' }}>
          {contractType || '-'}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={startDate ? new Date(startDate).toLocaleDateString('en-GB') : '-'}
            secondary={endDate ? new Date(endDate).toLocaleDateString('en-GB') : '-'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ component: 'span', typography: 'caption', color: 'text.disabled', noWrap: true }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{totalCost ? totalCost.toFixed(2) : '0.00'}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'active' && 'success') ||
              (status === 'draft' && 'warning') ||
              (status === 'expired' && 'error') ||
              'default'
            }
          >
            {t(`contract.status.${status}`) || status}
          </Label>
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (clinetStatus === 'accepted' && 'success') ||
              (clinetStatus === 'pending' && 'warning') ||
              (clinetStatus === 'rejected' && 'error') ||
              'default'
            }
          >
            {t(`contract.status.${clinetStatus}`) || clinetStatus}
          </Label>
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (emailStatus === 'sent' && 'success') ||
              (emailStatus === 'pending' && 'warning') ||
              (emailStatus === 'failed' && 'error') ||
              'default'
            }
          >
            {t(`contract.status.${emailStatus}`) || emailStatus}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
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
