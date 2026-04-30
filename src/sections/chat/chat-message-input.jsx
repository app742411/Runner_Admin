import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ChatMessageInput({ onSendMessage, onTyping, onStopTyping }) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleSend = () => {
    if (!text.trim() && attachments.length === 0) return;
    
    onSendMessage(text, attachments);
    
    setText('');
    setAttachments([]);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      if (onStopTyping) onStopTyping();
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const handleChange = (event) => {
    setText(event.target.value);
    if (onTyping) onTyping();

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      if (onStopTyping) onStopTyping();
    }, 1500);
  };

  const handleAttach = (e) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  return (
    <Box
      sx={{
        minHeight: 56,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 1,
        paddingRight: 1,
        borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
      }}
    >
      <IconButton>
        <Iconify icon="eva:smiling-face-fill" />
      </IconButton>

      <InputBase
        fullWidth
        value={text}
        onKeyUp={handleKeyUp}
        onChange={handleChange}
        placeholder="Type a message"
        sx={{ ml: 1, flexGrow: 1 }}
      />

      <Stack direction="row" alignItems="center">
        {attachments.length > 0 && (
          <Box sx={{ mr: 1, color: 'text.secondary', fontSize: 12 }}>
            {attachments.length} file(s)
          </Box>
        )}
        <IconButton onClick={() => fileInputRef.current?.click()}>
          <Iconify icon="solar:gallery-add-bold" />
        </IconButton>
        <IconButton>
          <Iconify icon="eva:attach-2-fill" />
        </IconButton>
        <IconButton>
          <Iconify icon="solar:microphone-bold" />
        </IconButton>
      </Stack>

      <IconButton
        color="primary"
        onClick={handleSend}
        disabled={!text.trim() && attachments.length === 0}
        sx={{
          bgcolor: (theme) => (text.trim() || attachments.length > 0 ? theme.palette.primary.main : 'transparent'),
          color: (theme) => (text.trim() || attachments.length > 0 ? theme.palette.primary.contrastText : theme.palette.primary.main),
          '&:hover': {
            bgcolor: (theme) => (text.trim() || attachments.length > 0 ? theme.palette.primary.dark : 'transparent'),
          },
          ml: 1,
        }}
      >
        <Iconify icon="iconamoon:send-fill" />
      </IconButton>

      <input type="file" ref={fileInputRef} onChange={handleAttach} multiple style={{ display: 'none' }} />
    </Box>
  );
}
