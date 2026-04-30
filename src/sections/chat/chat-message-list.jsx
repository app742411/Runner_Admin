import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { Scrollbar } from 'src/components/scrollbar';
import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

const StyledMessage = styled(Box)(({ theme, owner }) => ({
  maxWidth: 480,
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: owner ? theme.palette.primary.main : theme.palette.background.neutral,
  color: owner ? theme.palette.primary.contrastText : theme.palette.text.primary,
  ...(owner && {
    borderTopRightRadius: 0,
  }),
  ...(!owner && {
    borderTopLeftRadius: 0,
  }),
}));

export default function ChatMessageList({ messages, currentUserId }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Scrollbar ref={scrollRef} sx={{ px: 3, py: 5, flexGrow: 1 }}>
      <Stack spacing={3}>
        {messages.map((message) => {
          const isOwner = message.sender?._id === currentUserId || message.sender === currentUserId;

          return (
            <Stack
              key={message._id}
              direction="row"
              justifyContent={isOwner ? 'flex-end' : 'flex-start'}
              spacing={2}
            >
              {!isOwner && (
                <Avatar
                  alt={message.sender?.firstName}
                  src={message.sender?.profilePic}
                  sx={{ width: 32, height: 32 }}
                />
              )}

              <Stack spacing={0.5} alignItems={isOwner ? 'flex-end' : 'flex-start'}>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  {!isOwner && `${message.sender?.firstName} `}
                  {fDateTime(message.createdAt)}
                </Typography>

                <StyledMessage owner={isOwner}>
                  {message.text && (
                    <Typography variant="body2">{message.text}</Typography>
                  )}
                  {message.attachments?.length > 0 && (
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      {message.attachments.map((file, index) => (
                        <Box
                          key={index}
                          component="img"
                          src={file.url}
                          sx={{ borderRadius: 1, maxWidth: 200 }}
                        />
                      ))}
                    </Stack>
                  )}
                  {isOwner && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        textAlign: 'right',
                        mt: 0.5,
                        color: 'inherit',
                        opacity: 0.8,
                      }}
                    >
                      {message.seenBy?.length > 1 ? '🔵' : message.deliveredTo?.length > 1 ? '✓✓' : '✓'}
                    </Typography>
                  )}
                </StyledMessage>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Scrollbar>
  );
}
