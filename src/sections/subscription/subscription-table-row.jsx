import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function SubscriptionTableRow({ row, selected, onSelectRow, onEditRow, onDeleteRow, onToggleStatus }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const popover = usePopover();

  const {
    planName,
    monthlyFees,
    annualFees,
    planStatus,
    planFeatures,
    sequence,
    employeeLimit,
  } = row;

  let displayStatus = planStatus;
  let labelColor = 'default';

  if (planStatus === 'active') {
     displayStatus = t('subscription.status.active');
     labelColor = "success";
  } else if (planStatus === 'inactive') {
     displayStatus = t('subscription.status.inactive');
     labelColor = "error";
  }

  return (
    <>
      <TableRow hover selected={selected} sx={{ borderBottom: `1px dashed ${theme.palette.divider}` }}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>
            {planName}
          </Typography>
        </TableCell>

        <TableCell sx={{ color: 'text.secondary' }}>
           <Label variant="soft" color="info">
              {sequence}
           </Label>
        </TableCell>

        <TableCell sx={{ color: 'text.secondary' }}>
           {employeeLimit}
        </TableCell>

        <TableCell sx={{ color: 'text.secondary' }}>CHF{Number(monthlyFees).toFixed(2)}</TableCell>
        <TableCell sx={{ color: 'text.secondary' }}>CHF{Number(annualFees).toFixed(2)}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={labelColor}
            sx={{ textTransform: 'capitalize' }}
          >
            {displayStatus}
          </Label>
        </TableCell>
        
        <TableCell>
          <Tooltip 
            title={
              <Stack spacing={0.5} sx={{ p: 0.5 }}>
                {planFeatures?.length > 0 ? (
                  planFeatures.map((feature, index) => (
                    <Typography key={index} variant="caption">• {feature}</Typography>
                  ))
                ) : (
                  <Typography variant="caption">{t('subscription.noFeatures') || 'No features added'}</Typography>
                )}
              </Stack>
            } 
            placement="top" 
            arrow
          >
            <Box sx={{ p: 1, borderRadius: 1, border: `1px solid ${theme.palette.divider}`, display: 'inline-block', typography: 'caption', color: 'text.secondary', cursor: 'pointer' }}>
               {t('subscription.table.features')} {planFeatures?.length || 0}
            </Box>
          </Tooltip>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
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
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onToggleStatus();
          }}
        >
          <Iconify icon="solar:restart-bold" />
          {t('subscription.status.change') || 'Toggle Status'}
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onEditRow();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {t('common.edit') || 'Edit'}
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onDeleteRow();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('common.delete') || 'Delete'}
        </MenuItem>
      </CustomPopover>
    </>
  );
}
