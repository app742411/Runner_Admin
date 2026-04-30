import { useTranslation } from 'react-i18next';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Divider, MenuItem } from '@mui/material';
import { useUpdateCompanyStatus } from 'src/features/company/useCompanies';
import { toast } from 'react-hot-toast';

// ----------------------------------------------------------------------

export function CompanyTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, showStatus = false }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const {
    companyId,
    companyName,
    adminEmail,
    adminFullName,
    phoneNumber,
    address,
    licenseNo,
    createdAt,
    licenseExpiryDate,
    subscriptionAmount,
    subscriptionStatus,
    isApproved,
  } = row;

  const popover = usePopover();
  const updateStatus = useUpdateCompanyStatus();

  const handleUpdateStatus = async (status) => {
    popover.onClose();
    try {
      await updateStatus.mutateAsync({ id: companyId, isApproved: status });
      toast.success(t('company.table.statusUpdatedTo', { status: t(`company.table.status.${status}`) }));
    } catch (error) {
      console.error(error);
      toast.error(t('company.table.statusUpdateFailed'));
    }
  };

  const dateLocale = i18n.language === 'de' ? 'de-DE' : 'en-GB';

  return (
    <TableRow
      hover
      selected={selected}
      onClick={() => router.push(paths.dashboard.company.details(companyId))}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {companyName}
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={adminFullName} src={row.avatarUrl} sx={{ mr: 2 }} />

        <ListItemText
          primary={
            <Link
              noWrap
              color="inherit"
              variant="subtitle2"
              onClick={() => router.push(paths.dashboard.company.details(companyId))}
              sx={{ cursor: 'pointer' }}
            >
              {adminFullName}
            </Link>
          }
          secondary={adminEmail}
          primaryTypographyProps={{ variant: 'body2' }}
          secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {phoneNumber}
      </TableCell>

      <TableCell sx={{ minWidth: 200 }}>
        {address ? (
          <ListItemText
            primary={address.addressLine1}
            secondary={`${address.city}, ${address.state}, ${address.country} - ${address.pincode}`}
            primaryTypographyProps={{ variant: 'body2' }}
            secondaryTypographyProps={{ variant: 'caption', color: 'text.disabled' }}
          />
        ) : (
          '-'
        )}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {licenseNo}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {licenseExpiryDate ? (
          new Date(licenseExpiryDate).toLocaleDateString(dateLocale, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
        ) : (
          '-'
        )}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {createdAt ? (
          <>
            {new Date(createdAt).toLocaleDateString(dateLocale, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}{' '}
            {new Date(createdAt).toLocaleTimeString(dateLocale, {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </>
        ) : (
          '-'
        )}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {subscriptionAmount
          ? new Intl.NumberFormat(i18n.language === 'de' ? 'de-CH' : 'en-CH', { style: 'currency', currency: 'CHF' }).format(
            subscriptionAmount
          )
          : t('company.form.free')}
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (subscriptionStatus === 'active' && 'success') ||
            (subscriptionStatus === 'pending' && 'warning') ||
            (subscriptionStatus === 'banned' && 'error') ||
            'default'
          }
        >
          {t(`company.table.status.${subscriptionStatus}`)}
        </Label>
      </TableCell>

      {showStatus && (
        <TableCell>
          <Label
            variant="soft"
            color={
              (isApproved === 'approved' && 'success') ||
              (isApproved === 'pending' && 'warning') ||
              'error'
            }
          >
            {t(`company.table.status.${isApproved}`)}
          </Label>
        </TableCell>
      )}

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>

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
              onEditRow();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            {t('company.table.edit')}
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => handleUpdateStatus('approved')}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="eva:checkmark-circle-2-fill" />
            {t('company.table.approve')}
          </MenuItem>

          <MenuItem
            onClick={() => handleUpdateStatus('rejected')}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:close-circle-bold" />
            {t('company.table.reject')}
          </MenuItem>

          <MenuItem
            onClick={() => handleUpdateStatus('pending')}
            sx={{ color: 'warning.main' }}
          >
            <Iconify icon="solar:pause-circle-bold" />
            {t('company.table.pending')}
          </MenuItem>

          <MenuItem
            onClick={() => handleUpdateStatus('banned')}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:forbidden-circle-bold" />
            {t('company.table.ban')}
          </MenuItem>
        </CustomPopover>
      </TableCell>
    </TableRow>
  );
}
