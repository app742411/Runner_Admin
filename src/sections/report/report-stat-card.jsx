import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function ReportStatCard({ title, total, chartData, color = 'primary' }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        py: 3,
        px: 4,
        width: 1,
        borderRadius: 2,
        boxShadow: theme.customShadows.z4,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack spacing={0.5}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: '800' }}>
            {total}
          </Typography>
        </Stack>
        
        <Box sx={{ width: 80, height: 40, display: 'flex', alignItems: 'flex-end', gap: 0.5 }}>
           {chartData.map((val, idx) => (
             <Box
               key={idx}
               sx={{
                 width: 4,
                 height: `${val}%`,
                 bgcolor: color,
                 borderRadius: 0.5,
                 opacity: 0.8,
               }}
             />
           ))}
        </Box>
      </Stack>
    </Card>
  );
}
