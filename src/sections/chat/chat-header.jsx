import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ChatHeader({ chat, isTyping, participantStatus }) {
  if (!chat) return null;

  // Assuming direct chats or tickets, we check the other participant
  const otherParticipantId = chat.participants?.find(p => p._id !== chat.me)?._id;
  const isOnline = participantStatus && participantStatus[otherParticipantId];

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        py: 1,
        px: 2,
        borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
      }}
    >
      <Avatar src={chat.chatImage} alt={chat.chatName} sx={{ width: 40, height: 40 }} />

      <Box sx={{ ml: 2, flexGrow: 1 }}>
        <Typography variant="subtitle2">
          {chat.chatName}
          {isOnline ? ' 🟢' : ' ⚫'}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {isTyping ? '✍️ typing...' : (isOnline ? 'Online' : 'Offline')}
        </Typography>
      </Box>

      <Stack direction="row">
        <IconButton>
          <Iconify icon="solar:phone-bold" />
        </IconButton>
        <IconButton>
          <Iconify icon="solar:videocamera-record-bold" />
        </IconButton>
        <IconButton>
          <Iconify icon="solar:info-circle-bold" />
        </IconButton>
        <IconButton>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
