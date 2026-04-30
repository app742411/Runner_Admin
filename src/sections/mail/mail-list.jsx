import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const MAILS = [
  { id: '1', avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp', name: 'Jayvion Simon', summary: 'She eagerly opened the...', time: '3 days', isUnread: true },
  { id: '2', avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp', name: 'Lucian Obrien', summary: 'The scent of blooming flo...', time: '1 hours', isUnread: false },
  { id: '3', avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp', name: 'Deja Brady', summary: 'The athlete sprinted acro...', time: '10 hours', isUnread: false },
  { id: '4', avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp', name: 'Harrison Stein', summary: 'The aroma of freshly bak...', time: '3 days', isUnread: true },
  { id: '5', avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp', name: 'Reece Chung', summary: 'The newborn baby let out...', time: '10 hours', isUnread: false },
  { id: '6', avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp', name: 'Cristopher Cardenas', summary: 'She gazed up at the night...', time: '10 hours', isUnread: false },
  { id: '7', avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp', name: 'Melanie Noble', summary: 'The majestic waterfall cas...', time: '10 hours', isUnread: false },
  { id: '8', avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp', name: 'Shawn Manning', summary: 'The aroma of freshly bak...', time: '10 hours', isUnread: false },
  { id: '9', avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp', name: 'Soren Durham', summary: 'The old oak tree stood tall...', time: '10 hours', isUnread: false },
  { id: '10', avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp', name: 'Soren Durham', summary: 'The newborn baby let out...', time: '10 hours', isUnread: false },
];

export function MailList({ selectedId, onSelect }) {
  const theme = useTheme();

  return (
    <Stack sx={{ width: 320, p: 2, borderRight: `dashed 1px ${theme.palette.divider}`, height: 1 }}>
      <TextField
        fullWidth
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                bgcolor: 'background.paper',
            }
        }}
      />

      <Scrollbar sx={{ maxHeight: 'calc(100vh - 280px)', pr: 1.5 }}>
        <Stack spacing={0.5}>
          {MAILS.map((mail) => {
            const isSelected = selectedId === mail.id;

            return (
              <ListItemButton
                key={mail.id}
                onClick={() => onSelect(mail.id)}
                sx={{
                  py: 1.5,
                  px: 2,
                  borderRadius: 1.5,
                  bgcolor: isSelected ? theme.palette.action.selected : 'transparent',
                  '&:hover': { bgcolor: theme.palette.action.hover },
                  transition: theme.transitions.create(['background-color', 'box-shadow']),
                  position: 'relative',
                }}
              >
                <Avatar alt={mail.name} src={mail.avatar} sx={{ width: 44, height: 44, mr: 2 }} />

                <Stack spacing={0.5} flexGrow={1} sx={{ minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <Typography variant="subtitle2" noWrap sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                      {mail.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled', whiteSpace: 'nowrap' }}>
                      {mail.time}
                    </Typography>
                  </Stack>

                  <Typography variant="caption" noWrap sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                    {mail.summary}
                  </Typography>
                </Stack>

                {mail.isUnread && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'info.main',
                      position: 'absolute',
                      right: 12,
                      bottom: 16,
                    }}
                  />
                )}
              </ListItemButton>
            );
          })}
        </Stack>
      </Scrollbar>
    </Stack>
  );
}
