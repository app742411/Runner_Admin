import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function ClientTableRow({ row, selected, onSelectRow, onViewRow }) {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    name,
    clientLogo,
    email,
    phone,
    addressline1,
    city,
    country,
    propertyNames,
    totalTasks,
  } = row;

  // Mocking amount to match the design (e.g., CHF249.99)
  const totalAmount = (Math.random() * 1000 + 100).toFixed(2);
  
  // Random status for UI demonstration matching the image
  const statusOptions = ['Active', 'Pending', 'Banned', 'Rejected'];
  const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

  const translatedStatus = {
    Active: t('client.status.active'),
    Pending: t('client.status.pending'),
    Banned: t('client.status.banned'),
    Rejected: t('client.status.rejected'),
  };

  const popover = usePopover();

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

      <TableCell sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
        <Avatar
          alt={name}
          src={clientLogo ? `${import.meta.env.VITE_BACKEND_API}/${clientLogo.replace(/\\/g, '/')}` : ''}
          sx={{ mr: 2, width: 42, height: 42 }}
        >
          {name?.charAt(0).toUpperCase()}
        </Avatar>
        <ListItemText
          primary={name === "undefined" || !name ? t('client.unknownClient') : name}
          secondary={email}
          primaryTypographyProps={{ variant: 'subtitle2', noWrap: true, sx: { fontWeight: 'bold' } }}
          secondaryTypographyProps={{ variant: 'caption', noWrap: true, color: 'text.disabled' }}
        />
      </TableCell>

      <TableCell sx={{ color: 'text.primary', typography: 'body2', whiteSpace: 'nowrap' }}>
        {phone || '-'}
      </TableCell>

      <TableCell sx={{ color: 'text.secondary', typography: 'caption', minWidth: 160 }}>
        {addressline1 ? `${addressline1}, ${city}, ${country}` : '-'}
      </TableCell>

      <TableCell sx={{ color: 'text.primary', typography: 'body2' }}>
        {propertyNames?.[0] || '-'}
      </TableCell>

      <TableCell sx={{ color: 'text.primary', typography: 'body2' }}>
        {totalTasks || 0}
      </TableCell>

      <TableCell sx={{ fontWeight: 'bold', typography: 'body2' }}>
        CHF{totalAmount}
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'Active' && 'success') ||
            (status === 'Pending' && 'warning') ||
            (status === 'Banned' && 'error') ||
            'default'
          }
          sx={{ fontWeight: 'bold' }}
        >
          {translatedStatus[status] || status}
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
          onViewRow();
        }}
      >
        <Iconify icon="solar:pen-bold" />
        {t('common.edit')}
      </MenuItem>
    </CustomPopover>
    </>
  );
}

