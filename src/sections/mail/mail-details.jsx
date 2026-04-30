import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function MailDetails() {
  const theme = useTheme();

  return (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      sx={{
        p: 5,
        textAlign: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Box
        component="img"
        src="https://api-dev-minimal-v6.vercel.app/assets/illustrations/illustration-mail.webp"
        sx={{
          width: 200,
          mb: 5,
          opacity: 0.8,
        }}
      />

      <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 'bold', mb: 1 }}>
        No message selected
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.disabled' }}>
        Select a conversation to read
      </Typography>
    </Stack>
  );
}
