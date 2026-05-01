import { useState, useCallback } from 'react';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import { useTranslation } from 'react-i18next';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover, usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function DocumentTableRow({ row, selected, onSelectRow }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const popover = usePopover();
  const [openDetails, setOpenDetails] = useState(false);

  const {
    name,
    email,
    type,
    documents,
  } = row;

  const handleOpenDetails = useCallback(() => {
    popover.onClose();
    setOpenDetails(true);
  }, [popover]);

  const handleCloseDetails = useCallback(() => {
    setOpenDetails(false);
  }, []);

  const renderDocuments = (docs) => {
    if (!docs) return null;

    const allDocs = [];
    
    if (docs.profileImage) {
      allDocs.push({ ...docs.profileImage, type: 'Profile' });
    }
    
    if (docs.idImages) {
      docs.idImages.forEach(img => allDocs.push({ ...img, type: 'ID' }));
    }
    
    if (docs.aadhaarImages) {
      docs.aadhaarImages.forEach(img => allDocs.push({ ...img, type: 'Aadhaar' }));
    }

    return (
      <Stack direction="row" spacing={1} justifyContent="center">
        {allDocs.map((doc, index) => (
          <Tooltip key={index} title={`${doc.type}: ${doc.fileName}`}>
            <Link href={doc.fileUrl} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}>
              <Avatar 
                variant="rounded" 
                src={doc.fileUrl} 
                sx={{ width: 32, height: 32, cursor: 'pointer', border: `1px solid ${theme.palette.divider}` }}
              >
                <Iconify icon="solar:file-bold" />
              </Avatar>
            </Link>
          </Tooltip>
        ))}
      </Stack>
    );
  };

  return (
    <>
      <TableRow 
        hover 
        selected={selected} 
        onClick={handleOpenDetails}
        sx={{ 
          borderBottom: `1px dashed ${theme.palette.divider}`,
          cursor: 'pointer'
        }}
      >
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
        <Typography variant="subtitle2" noWrap sx={{ fontWeight: '600' }}>
          {name}
        </Typography>
      </TableCell>

      <TableCell sx={{ color: 'text.secondary' }}>
        {email}
      </TableCell>

      <TableCell>
        <Label variant="soft" color="info" sx={{ textTransform: 'capitalize' }}>
          {type}
        </Label>
      </TableCell>

      <TableCell>
        {renderDocuments(documents)}
      </TableCell>

      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
        <IconButton onClick={popover.onOpen}>
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
      <MenuItem onClick={handleOpenDetails}>
        <Iconify icon="solar:eye-bold" />
        {t('employee.popover.view')}
      </MenuItem>
    </CustomPopover>

    <Dialog open={openDetails} onClose={handleCloseDetails} fullWidth maxWidth="md">
      <DialogTitle sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar src={documents?.profileImage?.fileUrl} sx={{ width: 48, height: 48 }}>
            {name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{email}</Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Stack spacing={4}>
          {/* Profile Image Section */}
          {documents?.profileImage && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>{t('employee.form.profileImage')}</Typography>
              <Box
                component="img"
                src={documents.profileImage.fileUrl}
                sx={{ width: 200, height: 200, borderRadius: 2, objectFit: 'cover', border: `1px solid ${theme.palette.divider}` }}
              />
            </Box>
          )}

          {/* ID Images Section */}
          {documents?.idImages && documents.idImages.length > 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>{t('employee.form.idImages')}</Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {documents.idImages.map((img, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={img.fileUrl}
                    sx={{ width: 240, height: 160, borderRadius: 2, objectFit: 'contain', bgcolor: 'background.neutral', border: `1px solid ${theme.palette.divider}` }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Aadhaar Images Section */}
          {documents?.aadhaarImages && documents.aadhaarImages.length > 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>{t('employee.form.aadhaarImages')}</Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {documents.aadhaarImages.map((img, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={img.fileUrl}
                    sx={{ width: 240, height: 160, borderRadius: 2, objectFit: 'contain', bgcolor: 'background.neutral', border: `1px solid ${theme.palette.divider}` }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseDetails} color="inherit">
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  </>
);
}
