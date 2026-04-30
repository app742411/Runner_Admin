import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  { id: 'all', label: 'All', icon: 'fluent:mail-24-filled' },
  { id: 'inbox', label: 'Inbox', icon: 'fluent:box-24-filled' },
  { id: 'sent', label: 'Sent', icon: 'iconamoon:send-fill' },
  { id: 'drafts', label: 'Drafts', icon: 'fluent:file-text-24-filled' },
  { id: 'trash', label: 'Trash', icon: 'solar:trash-bin-trash-bold' },
  { id: 'spam', label: 'Spam', icon: 'eva:alert-circle-fill' },
  { id: 'important', label: 'Important', icon: 'fluent:chevron-double-right-24-filled' },
  { id: 'starred', label: 'Starred', icon: 'eva:star-fill' },
  { id: 'social', label: 'Social', icon: 'fluent:tag-24-filled', color: '#54D62C' },
  { id: 'promotions', label: 'Promotions', icon: 'fluent:tag-24-filled', color: '#FFC107' },
  { id: 'forums', label: 'Forums', icon: 'fluent:tag-24-filled', color: '#FF4842' },
];

export function MailNav({ selectedId, onSelect }) {
  const theme = useTheme();

  return (
    <Stack spacing={2} sx={{ width: 240, p: 2 }}>
      <Button
        fullWidth
        variant="contained"
        startIcon={<Iconify icon="mingcute:pencil-fill" />}
        sx={{
          bgcolor: '#001b2e',
          color: 'white',
          py: 1.5,
          '&:hover': { bgcolor: '#002642' },
          borderRadius: 1.5,
          fontWeight: 'bold',
        }}
      >
        Compose
      </Button>

      <Stack spacing={0.5}>
        {NAV_ITEMS.map((item) => {
          const isSelected = selectedId === item.id;

          return (
            <ListItemButton
              key={item.id}
              onClick={() => onSelect(item.id)}
              sx={{
                px: 1.5,
                height: 48,
                borderRadius: 1,
                typography: 'body2',
                color: isSelected ? 'text.primary' : 'text.secondary',
                bgcolor: isSelected ? theme.palette.action.selected : 'transparent',
                '&:hover': { bgcolor: theme.palette.action.hover },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: item.color || (isSelected ? theme.palette.text.primary : theme.palette.text.secondary) }}>
                <Iconify icon={item.icon} width={24} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  typography: 'body2',
                  fontWeight: isSelected ? 'fontWeightBold' : 'fontWeightMedium',
                }}
              />
            </ListItemButton>
          );
        })}
      </Stack>
    </Stack>
  );
}
