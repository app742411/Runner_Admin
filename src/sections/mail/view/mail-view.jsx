import { useState } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/dashboard/main';
import { MailNav } from '../mail-nav';
import { MailList } from '../mail-list';
import { MailDetails } from '../mail-details';

// ----------------------------------------------------------------------

export function MailView() {
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedMail, setSelectedMail] = useState(null);
  const theme = useTheme();

  return (
    <DashboardContent maxWidth={false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Mail
        </Typography>
      </Stack>

      <Card
        sx={{
          height: 'calc(100vh - 200px)',
          display: 'flex',
          overflow: 'hidden',
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <MailNav
          selectedId={selectedFolder}
          onSelect={setSelectedFolder}
        />

        <MailList
          selectedId={selectedMail}
          onSelect={setSelectedMail}
        />

        <MailDetails />
      </Card>
    </DashboardContent>
  );
}
