import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function NotificationItem({ notification }) {
  const theme = useTheme();

  const {
    avatar,
    title,
    createdAt,
    category,
    type,
    isUnread,
    actions,
    file,
    tags,
  } = notification;

  const renderTitle = (
    <Typography variant="subtitle2">
      {title}
    </Typography>
  );

  const renderDescription = (
    <Typography
      variant="caption"
      sx={{
        mt: 0.5,
        display: 'flex',
        alignItems: 'center',
        color: 'text.disabled',
      }}
    >
      {createdAt} • {category}
    </Typography>
  );

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        py: 2,
        px: 2.5,
        position: 'relative',
        '&:not(:last-of-type)': {
          borderBottom: `dashed 1px ${theme.palette.divider}`,
        },
      }}
    >
      {typeof avatar === 'string' ? (
        <Avatar alt={title} src={avatar} />
      ) : (
        <Box
          sx={{
            width: 40,
            height: 40,
            display: 'flex',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.neutral',
          }}
        >
          {avatar}
        </Box>
      )}

      <Stack spacing={1} flexGrow={1}>
        <ListItemText
          primary={renderTitle}
          secondary={renderDescription}
          primaryTypographyProps={{ typography: 'subtitle2' }}
          secondaryTypographyProps={{ typography: 'caption' }}
        />

        {file && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              p: 1.5,
              borderRadius: 1,
              bgcolor: 'background.neutral',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                borderRadius: 1,
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#001b2e',
                color: 'primary.main',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'white' }}>PS</Typography>
            </Box>

            <Stack spacing={0.5} flexGrow={1}>
              <Typography variant="subtitle2" noWrap>
                {file.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {file.size} • {file.time}
              </Typography>
            </Stack>

            <Button size="small" variant="outlined" color="inherit" sx={{ bgcolor: 'white' }}>
              Download
            </Button>
          </Stack>
        )}

        {tags && (
          <Stack direction="row" spacing={1}>
            {tags.map((tag) => (
              <Label key={tag.label} variant={tag.variant || 'soft'} color={tag.color || 'info'} sx={{ border: tag.border ? '1px solid currentColor' : 'none' }}>
                {tag.label}
              </Label>
            ))}
          </Stack>
        )}

        {actions && (
          <Stack direction="row" spacing={1}>
            {actions.map((action) => (
              <Button
                key={action.label}
                size="small"
                variant={action.variant || 'contained'}
                color={action.color || 'inherit'}
                sx={{ 
                    px: 2, 
                    ...(action.variant === 'contained' && { bgcolor: '#001b2e', color: 'white', '&:hover': { bgcolor: '#002642' } })
                }}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        )}
      </Stack>

      {isUnread && (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'info.main',
            position: 'absolute',
            right: 20,
            top: 24,
          }}
        />
      )}
    </Stack>
  );
}
