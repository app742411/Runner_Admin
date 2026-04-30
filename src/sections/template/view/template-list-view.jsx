import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';

import { useTranslation } from 'react-i18next';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { useTemplates } from 'src/features/template/useTemplates';
import { DashboardContent } from 'src/layouts/dashboard/main';

// ----------------------------------------------------------------------

export function TemplateListView() {
  const { t } = useTranslation();
  const theme = useTheme();

  const { data: response, isLoading } = useTemplates();
  const templates = response?.data || [];

  const [openPreview, setOpenPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState(null);

  const handleOpenPreview = useCallback((template, initialHtml) => {
    setSelectedTemplate(template);
    setSelectedPreview(initialHtml);
    setOpenPreview(true);
  }, []);

  const handleClosePreview = () => {
    setOpenPreview(false);
    setSelectedTemplate(null);
    setSelectedPreview(null);
  };

  if (isLoading) {
    return (
      <DashboardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth={false}>
      <Stack spacing={1} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography variant="h4">{t('template.list.title') || 'Templates for Quotations'}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t('template.list.subtitle') || 'Select and customize your contract or invoice templates.'}
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {templates.map((template, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={template.templateId}>
            <TemplateItem 
              template={template} 
              index={index} 
              onPreview={handleOpenPreview} 
              t={t}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog open={openPreview} onClose={handleClosePreview} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {t('template.preview.title') || 'Template Preview'}
          <IconButton onClick={handleClosePreview}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              flexGrow: 1,
              width: '100%',
              minHeight: 500,
              bgcolor: 'background.neutral',
              display: 'flex',
              justifyContent: 'center',
              p: 2,
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 800,
                bgcolor: 'white',
                boxShadow: (theme) => theme.customShadows.z24,
                borderRadius: 1,
                overflow: 'hidden',
              }}
              dangerouslySetInnerHTML={{ __html: selectedPreview }}
            />
          </Box>

          {/* Theme Color Bar */}
          {selectedTemplate?.previews && (
            <Stack 
              direction="row" 
              justifyContent="center" 
              spacing={2} 
              sx={{ 
                p: 2, 
                bgcolor: 'background.paper',
                borderTop: (t) => `solid 1px ${t.palette.divider}` 
              }}
            >
              {selectedTemplate.previews.map((prev) => {
                const isSelected = selectedPreview === prev.previewHtml;
                return (
                  <Box
                    key={prev.theme}
                    onClick={() => setSelectedPreview(prev.previewHtml)}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: getThemeColor(prev.theme),
                      cursor: 'pointer',
                      border: (t) => isSelected ? `2px solid ${t.palette.primary.main}` : '2px solid transparent',
                      boxShadow: (t) => isSelected ? t.customShadows.primary : 'none',
                      transition: (t) => t.transitions.create(['transform', 'border-color']),
                      '&:hover': {
                        transform: 'scale(1.15)',
                      },
                    }}
                    title={prev.theme}
                  />
                );
              })}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} variant="outlined" color="inherit">
            {t('common.close')}
          </Button>
          <Button variant="contained" color="primary">
            {t('template.useThis') || 'Use this Template'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function TemplateItem({ template, index, onPreview, t }) {
  const theme = useTheme();
  
  // Use the first preview as default thumbnail or handle multiple themes
  const defaultPreview = template.previews?.[0];

  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        '&:hover .overlay': {
          opacity: 1,
        },
      }}
    >
      <Box
        sx={{
          height: 320,
          bgcolor: 'background.neutral',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        {/* Simplified Preview Content */}
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: 'white',
            borderRadius: 1,
            boxShadow: theme.customShadows.card,
            p: 1.5,
            overflow: 'hidden',
            fontSize: '6px', // Tiny text for preview look
            opacity: 0.8,
          }}
          dangerouslySetInnerHTML={{ __html: defaultPreview?.previewHtml }}
        />

        {/* Hover Overlay */}
        <Box
          className="overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: alpha(theme.palette.grey[900], 0.48),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: theme.transitions.create('opacity'),
            zIndex: 1,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => onPreview(template, defaultPreview?.previewHtml)}
            startIcon={<Iconify icon="solar:eye-bold" />}
          >
            {t('template.preview') || 'Preview Template'}
          </Button>
        </Box>

        {/* Format Labels */}
        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
          <Label variant="soft" color="inherit" sx={{ fontSize: '10px', borderRadius: 0.5 }}>PDF</Label>
          <Label variant="soft" color="inherit" sx={{ fontSize: '10px', borderRadius: 0.5 }}>DOCX</Label>
        </Stack>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {template.name || `Templates 0${index + 1}`}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          A touch of personality with a well-organized structure.
        </Typography>
        
        {/* Theme Selectors */}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          {template.previews?.map((prev) => (
            <Box
              key={prev.theme}
              onClick={() => onPreview(template, prev.previewHtml)}
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: getThemeColor(prev.theme),
                cursor: 'pointer',
                border: '2px solid transparent',
                '&:hover': {
                  transform: 'scale(1.2)',
                  borderColor: theme.palette.divider,
                },
              }}
              title={prev.theme}
            />
          ))}
        </Stack>
      </Box>
    </Card>
  );
}

function getThemeColor(theme) {
  switch (theme) {
    case 'blue': return '#1e40af';
    case 'green': return '#166534';
    case 'purple': return '#6d28d9';
    case 'red': return '#b91c1c';
    case 'orange': return '#c2410c';
    case 'teal': return '#115e59';
    case 'dark': return '#111827';
    default: return '#919EAB';
  }
}
