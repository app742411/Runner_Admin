import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { fToNow } from 'src/utils/format-time';

// ----------------------------------------------------------------------

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': { transform: 'scale(.8)', opacity: 1 },
    '100%': { transform: 'scale(2.4)', opacity: 0 },
  },
}));

export default function ChatNav({ chats, selectedChatId, onSelectChat, participantStatus, currentTab, onChangeTab }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filteredChats = chats.filter((chat) =>
    chat.chatName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ width: 320, borderRight: (theme) => `solid 1px ${theme.palette.divider}`, display: 'flex', flexDirection: 'column' }}>
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Stack spacing={2} sx={{ p: 2.5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">{t('chat.title')}</Typography>
            <Stack direction="row" spacing={1}>
              <Iconify icon="solar:settings-bold" sx={{ color: 'text.secondary', cursor: 'pointer' }} />
              <Iconify icon="solar:user-plus-bold" sx={{ color: 'text.secondary', cursor: 'pointer' }} />
            </Stack>
          </Stack>

          <TextField
            fullWidth
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('chat.search')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <Tabs
            value={currentTab}
            onChange={(event, newValue) => onChangeTab(newValue)}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': { px: 1, minWidth: 0 },
            }}
          >
            <Tab value="direct" label={t('chat.direct')} />
            <Tab value="group" label={t('chat.group')} />
            <Tab value="ticket" label={t('chat.ticket')} />
          </Tabs>
        </Stack>

        <List disablePadding>
          {filteredChats.map((chat) => {
            const isSelected = selectedChatId === chat._id;
            const otherParticipantId = chat.participants?.find(p => p._id !== chat.me)?._id;
            const isOnline = participantStatus && participantStatus[otherParticipantId];

            return (
              <ListItemButton
                key={chat._id}
                onClick={() => onSelectChat(chat._id)}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  ...(isSelected && {
                    bgcolor: 'action.selected',
                  }),
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  {isOnline ? (
                    <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
                      <Avatar src={chat.chatImage} alt={chat.chatName} />
                    </StyledBadge>
                  ) : (
                    <Avatar src={chat.chatImage} alt={chat.chatName} />
                  )}
                </Box>

                <Stack spacing={0.5} sx={{ ml: 2, flexGrow: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle2" noWrap>
                      {chat.chatName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {chat.lastMessage ? fToNow(chat.lastMessage.createdAt) : ''}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {chat.lastMessage?.text || t('chat.no_messages')}
                    </Typography>
                    {chat.unreadCount > 0 && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: 'info.main',
                          borderRadius: '50%',
                          ml: 1,
                        }}
                      />
                    )}
                  </Stack>
                </Stack>
              </ListItemButton>
            );
          })}
        </List>
      </Scrollbar>
    </Box>
  );
}
