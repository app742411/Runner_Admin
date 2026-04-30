import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { useCompanyDetails } from 'src/features/company/useCompanies';

// ----------------------------------------------------------------------

export function CompanyDetailsView({ id }) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { data: company, isLoading } = useCompanyDetails(id);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const {
    companyName = '-',
    _id = '-',
    contactEmail = '-',
    phoneNumber = '-',
    address = {},
    planId = {},
    subscriptionStartDate = '',
    subscriptionEndDate = '',
    subscriptionStatus = 'pending',
    licenseNo = '-',
    licenseDocuments = [],
  } = company || {};

  const fullAddress = `${address?.addressLine1 || ''}, ${address?.addressLine2 || ''}, ${address?.city || ''}, ${address?.state || ''}, ${address?.country || ''} - ${address?.pincode || ''}`;

  return (
    <Container maxWidth={false}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {companyName}
      </Typography>

      {/* Top Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('company.details.totalEarning')} value="CHF1000" icon="solar:users-group-rounded-bold" color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('company.details.totalTask')} value="7" icon="solar:box-bold" color="warning" showViewDetails />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('company.details.totalEmployee')} value="3" icon="solar:chart-2-bold" color="success" showViewDetails />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('company.details.totalProperty')} value="CHF1200" icon="solar:box-bold" color="error" showViewDetails />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
           <StatCard title={t('company.details.numberOfUsers')} value="102" icon="solar:box-bold" color="error" showViewDetails />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
           <StatCard title={t('company.details.requestsSupport')} value="102" icon="solar:box-bold" color="primary" showViewDetails />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
           <StatCard title={t('company.details.internalEffort')} value="102" icon="solar:box-bold" color="error" showViewDetails />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
           <StatCard title={t('company.details.netProfitLoss')} value="CHF102" icon="solar:chart-2-bold" color="success" showViewDetails />
        </Grid>
      </Grid>

      {/* Company & Subscription Detail Card */}
      <Card sx={{ p: 4, mb: 5 }}>
        <Stack direction="row" justifyContent="center" sx={{ mb: 4 }}>
             <Box sx={{ textAlign: 'center' }}>
                <Iconify icon="company-logo" width={60} />
                <Typography variant="overline" sx={{ display: 'block' }}>{t('company.title')}</Typography>
             </Box>
        </Stack>

        <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 3 }}>{t('company.details.companyDetails')}</Typography>
                <Stack spacing={2}>
                    <DetailRow label={`${t('company.form.companyName')}:`} value={companyName} />
                    <DetailRow label="Company ID" value={_id} />
                    <DetailRow label={`${t('company.form.email')}:`} value={contactEmail} />
                    <DetailRow label={`${t('company.form.phoneNumber')}:`} value={phoneNumber} />
                    <DetailRow label={`${t('company.form.country')}:`} value={fullAddress !== ', , , ,  - ' ? fullAddress : '-'} />
                </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
                 <Typography variant="h6" sx={{ mb: 3 }}>{t('company.details.subscriptionTitle')}</Typography>
                 <Stack spacing={2}>
                    <DetailRow label={`${t('company.form.plan')}:`} value={planId?.planName || '-'} valueColor="error" />
                    <DetailRow label={`${t('company.form.startDate')}:`} value={subscriptionStartDate ? new Date(subscriptionStartDate).toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'en-GB') : '[MM/DD/YYYY]'} />
                    <DetailRow label={`${t('company.form.expiryDate')}:`} value={subscriptionEndDate ? new Date(subscriptionEndDate).toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'en-GB') : '[MM/DD/YYYY]'} />
                    <DetailRow label={`${t('company.table.statusHeader')}:`} value={<Label color="success" variant="soft">{t(`company.table.status.${subscriptionStatus}`)}</Label>} isComponent />
                    <DetailRow label={t('company.details.tinNo')} value={licenseNo} />
                 </Stack>
            </Grid>
        </Grid>
      </Card>

      {/* Documents */}
      <Typography variant="h5" sx={{ mb: 3 }}>{t('company.details.documents')}</Typography>
      <Card sx={{ mb: 5 }}>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ bgcolor: theme.palette.background.neutral }}>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell>{t('company.details.docName')}</TableCell>
                  <TableCell>{t('company.details.type')}</TableCell>
                  <TableCell>{t('company.details.uploadedOn')}</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {licenseDocuments.map((doc) => (
                  <TableRow key={doc._id}>
                    <TableCell padding="checkbox" />
                    <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                             <Iconify icon={doc.fileName.endsWith('.pdf') ? "vscode-icons:file-type-pdf2" : "solar:file-bold"} width={24} />
                             <Typography variant="body2">{doc.fileName}</Typography>
                        </Stack>
                    </TableCell>
                    <TableCell>{doc.fileName.split('.').pop()}</TableCell>
                    <TableCell>{new Date(doc.uploadedAt).toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'en-GB')}</TableCell>
                    <TableCell align="right">
                        <IconButton><Iconify icon="eva:more-vertical-fill" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Card>

      {/* Employees */}
      <Typography variant="h5" sx={{ mb: 3 }}>{t('company.details.allEmployees')}</Typography>
      <Card>
          <TableContainer sx={{ overflow: 'unset' }}>
              <Scrollbar>
                  <Table sx={{ minWidth: 800 }}>
                      <TableHead sx={{ bgcolor: theme.palette.background.neutral }}>
                          <TableRow>
                              <TableCell>{t('company.details.userName')}</TableCell>
                              <TableCell>{t('company.form.email')}</TableCell>
                              <TableCell>{t('company.details.position')}</TableCell>
                              <TableCell>{t('company.details.status')}</TableCell>
                              <TableCell />
                          </TableRow>
                      </TableHead>
                      <TableBody>
                           {/* Empty or mock for now as per image if not in payload */}
                           <TableRow>
                               <TableCell>
                                   <Stack direction="row" alignItems="center" spacing={2}>
                                       <Avatar />
                                       <Typography variant="body2">Tanner Finsha</Typography>
                                   </Stack>
                               </TableCell>
                               <TableCell>alma.lawson@example.com</TableCell>
                               <TableCell>Manager</TableCell>
                               <TableCell><Label color="warning" variant="soft">{t('company.table.status.draft')}</Label></TableCell>
                               <TableCell align="right"><IconButton><Iconify icon="eva:more-vertical-fill" /></IconButton></TableCell>
                           </TableRow>
                      </TableBody>
                  </Table>
              </Scrollbar>
          </TableContainer>
      </Card>
    </Container>
  );
}

// ----------------------------------------------------------------------

function StatCard({ title, value, icon, color, showViewDetails }) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>{title}</Typography>
          <Typography variant="h3">{value}</Typography>
        </Stack>
        <Box
          sx={{
            width: 48,
            height: 48,
            display: 'flex',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette[color].main, 0.12),
            color: theme.palette[color].main,
          }}
        >
          <Iconify icon={icon} width={24} />
        </Box>
      </Stack>
      {showViewDetails && (
        <Stack direction="row" alignItems="center" sx={{ mt: 'auto' }}>
           <Typography variant="caption" sx={{ color: theme.palette[color].main, fontWeight: 'bold' }}>{t('company.details.viewDetails')}</Typography>
           <Iconify icon="eva:chevron-right-fill" width={16} sx={{ color: theme.palette[color].main }} />
        </Stack>
      )}
    </Card>
  );
}

function DetailRow({ label, value, valueColor, isComponent }) {
  return (
    <Stack direction="row" spacing={1}>
      <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 140 }}>
        {label}
      </Typography>
      {isComponent ? (
        value
      ) : (
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: valueColor ? (theme) => theme.palette[valueColor].main : 'inherit' }}>
          {value}
        </Typography>
      )}
    </Stack>
  );
}
