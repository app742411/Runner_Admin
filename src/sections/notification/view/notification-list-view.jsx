import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme, alpha } from '@mui/material/styles';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { NotificationItem } from '../notification-item';

// ----------------------------------------------------------------------

const NOTIFICATIONS = [
  {
    id: '1',
    avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
    title: 'Deja Brady sent you a friend request',
    createdAt: '12 Jan 2022',
    category: 'Communication',
    isUnread: true,
    actions: [
      { label: 'Accept', variant: 'contained' },
      { label: 'Decline', variant: 'outlined' },
    ],
  },
  {
    id: '2',
    avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
    title: 'Lainey Davidson added file to File manager',
    createdAt: '10 Sep 2022',
    category: 'File manager',
    isUnread: false,
    file: {
      name: 'design-suriname-2015.mp3',
      size: '2.3 GB',
      time: '30 min ago',
    },
  },
  {
    id: '3',
    avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
    title: 'Angelique Morse added new tags to File manager',
    createdAt: '09 Aug 2022',
    category: 'File manager',
    isUnread: false,
    tags: [
      { label: 'UI Design', color: 'info' },
      { label: 'Dashboard', color: 'warning', border: true },
      { label: 'Design system', color: 'inherit', border: true },
    ],
  },
  {
    id: '4',
    avatar: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
    title: 'Giana Brandt request a payment of CHF200',
    createdAt: '08 Apr 2022',
    category: 'File manager',
    isUnread: false,
    actions: [
      { label: 'Pay', variant: 'contained' },
      { label: 'Decline', variant: 'outlined' },
    ],
  },
  {
    id: '5',
    avatar: <Iconify icon="solar:box-bold" width={24} sx={{ color: 'warning.main' }} />,
    title: 'Your order is placed waiting for shipping',
    createdAt: '07 Aug 2022',
    category: 'Order',
    isUnread: false,
  },
  {
    id: '6',
    avatar: <Iconify icon="solar:delivery-bold" width={24} sx={{ color: 'info.main' }} />,
    title: 'Delivery processing your order is being shipped',
    createdAt: '06 May 2022',
    category: 'Order',
    isUnread: false,
  },
  {
    id: '7',
    avatar: <Iconify icon="solar:chat-line-bold" width={24} sx={{ color: 'success.main' }} />,
    title: 'You have new message 5 unread messages',
    createdAt: '05 Oct 2022',
    category: 'Communication',
    isUnread: false,
  },
  {
    id: '8',
    avatar: <Iconify icon="solar:letter-bold" width={24} sx={{ color: 'error.main' }} />,
    title: 'You have new mail',
    createdAt: '07 Sep 2020',
    category: 'Communication',
    isUnread: false,
  },
];

export function NotificationListView() {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState('notifications');
  const theme = useTheme();

  return (
    <DashboardContent maxWidth={false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {t('notification.title')}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2.5}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ bgcolor: '#001b2e', color: 'white', '&:hover': { bgcolor: '#002642' } }}
          >
            {t('notification.add')}
          </Button>

          <Iconify icon="eva:checkmark-circle-2-fill" width={24} sx={{ color: theme.palette.success.main, cursor: 'pointer' }} />
          <Iconify icon="solar:settings-bold" width={24} sx={{ color: 'text.disabled', cursor: 'pointer' }} />
        </Stack>
      </Stack>

      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between">
          <TextField
            placeholder={t('notification.search')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: 1, md: 320 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                bgcolor: 'background.paper',
              }
            }}
          />

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="solar:filter-bold" />}
            sx={{ borderColor: 'divider', color: 'text.secondary', bgcolor: 'background.paper' }}
          >
            {t('notification.filters')}
          </Button>
        </Stack>

        <Stack direction="row" sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(theme.palette.grey[500], 0.08) }}>
          <Box
            onClick={() => setCurrentTab('notifications')}
            sx={{
              flex: 1,
              py: 1.25,
              display: 'flex',
              cursor: 'pointer',
              borderRadius: 1,
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: currentTab === 'notifications' ? 'white' : 'transparent',
              boxShadow: currentTab === 'notifications' ? theme.customShadows.z1 : 'none',
              transition: theme.transitions.create(['background-color', 'box-shadow']),
            }}
          >
            <Typography variant="subtitle2" sx={{ mr: 1, color: currentTab === 'notifications' ? 'text.primary' : 'text.disabled' }}>
              {t('notification.tabs.notifications')}
            </Typography>
            <Label variant="filled" color="default" sx={{ bgcolor: '#001b2e', color: 'white', borderRadius: 1, height: 20 }}>
              22
            </Label>
          </Box>

          <Box
            onClick={() => setCurrentTab('messages')}
            sx={{
              flex: 1,
              py: 1.25,
              display: 'flex',
              cursor: 'pointer',
              borderRadius: 1,
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: currentTab === 'messages' ? 'white' : 'transparent',
              boxShadow: currentTab === 'messages' ? theme.customShadows.z1 : 'none',
              transition: theme.transitions.create(['background-color', 'box-shadow']),
            }}
          >
            <Typography variant="subtitle2" sx={{ mr: 1, color: currentTab === 'messages' ? 'text.primary' : 'text.disabled' }}>
              {t('notification.tabs.messages')}
            </Typography>
            <Label variant="soft" color="info" sx={{ borderRadius: 1, height: 20 }}>
              11
            </Label>
          </Box>
        </Stack>

        <Card sx={{ borderRadius: 2 }}>
          <Scrollbar sx={{ maxHeight: 600 }}>
            <Stack>
              {NOTIFICATIONS.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </Stack>
          </Scrollbar>
        </Card>
      </Stack>
    </DashboardContent>
  );
}
