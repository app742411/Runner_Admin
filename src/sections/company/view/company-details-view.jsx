import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
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

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { Image } from 'src/components/image';
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
    cards = {},
    subscription: subInfo = {},
    documents: docs = [],
    company: companyData = {},
  } = company || {};

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
  } = companyData;

  const fullAddress = `${address?.addressLine1 || ''}, ${address?.addressLine2 || ''}, ${address?.city || ''}, ${address?.state || ''}, ${address?.country || ''} - ${address?.pincode || ''}`;

  return (
    <Container maxWidth={false}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {companyName}
      </Typography>

      {/* Top Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={4} md={2}>
          <StatCard title={t('company.details.totalEarning')} value={fCurrency(cards.totalEarning || 0)} icon="solar:users-group-rounded-bold" color="primary" />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <StatCard title={t('company.details.totalTask')} value={String(cards.totalTasks || 0)} icon="solar:box-bold" color="warning" />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <StatCard title={t('company.details.totalEmployee')} value={String(cards.totalEmployees || 0)} icon="solar:chart-2-bold" color="success" />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <StatCard title={t('company.details.totalContract')} value={String(cards.totalContracts || 0)} icon="solar:box-bold" color="error" />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <StatCard title={t('company.details.totalSubTask')} value={String(cards.totalSubTasks || 0)} icon="solar:box-bold" color="info" />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <StatCard title={t('company.details.netProfit')} value={fCurrency(cards.netProfit || 0)} icon="solar:chart-2-bold" color="success" />
        </Grid>
      </Grid>

      {/* Company & Subscription Detail Card */}
      <Card sx={{ p: 4, mb: 5 }}>
        <Stack direction="row" justifyContent="center" sx={{ mb: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            {companyData.companyLogo || companyData.logo ? (
              <Box sx={{ 
                width: 120, 
                height: 120, 
                mx: 'auto', 
                mb: 2,
                p: 1,
                borderRadius: '50%',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                border: (theme) => `dashed 1px ${alpha(theme.palette.primary.main, 0.2)}`
              }}>
                <Image
                  src={companyData.companyLogo || companyData.logo}
                  alt={companyName}
                  visibleByDefault
                  sx={{ width: 1, height: 1, borderRadius: '50%', objectFit: 'contain' }}
                />
              </Box>
            ) : (
              <Box sx={{ 
                width: 120, 
                height: 120, 
                borderRadius: '50%', 
                mx: 'auto', 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                border: (theme) => `dashed 1px ${alpha(theme.palette.grey[500], 0.2)}`
              }}>
                <Iconify icon="solar:camera-add-bold" width={48} sx={{ color: 'text.disabled' }} />
              </Box>
            )}
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{companyName}</Typography>
            <Typography variant="overline" sx={{ display: 'block', color: 'text.secondary', letterSpacing: 1 }}>{t('nav.company')}</Typography>
          </Box>
        </Stack>

        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 3 }}>{t('company.details.companyDetails')}</Typography>
            <Stack spacing={2}>
              <DetailRow label={`${t('company.form.companyName')}:`} value={companyName} />
              <DetailRow label={`${t('company.table.companyId')}:`} value={_id} />
              <DetailRow label={`${t('company.form.email')}:`} value={contactEmail} />
              <DetailRow label={`${t('company.form.phoneNumber')}:`} value={phoneNumber} />
              <DetailRow label={`${t('company.table.address')}:`} value={fullAddress !== ', , , ,  - ' ? fullAddress : '-'} />
              <DetailRow label={`${t('company.details.createdBy') || 'Created By'}:`} value={companyData.createdBy ? `${companyData.createdBy.firstName} ${companyData.createdBy.lastName}` : '-'} />
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 3 }}>{t('company.details.subscriptionTitle')}</Typography>
            <Stack spacing={2}>
              <DetailRow label={`${t('company.form.plan')}:`} value={subInfo?.plan || '-'} valueColor="error" />
              <DetailRow label={`${t('company.form.startDate')}:`} value={subInfo?.startDate ? new Date(subInfo.startDate).toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'en-GB') : '-'} />
              <DetailRow label={`${t('company.form.renewalDate') || 'Renewal Date'}:`} value={subInfo?.renewalDate ? new Date(subInfo.renewalDate).toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'en-GB') : '-'} />
              <DetailRow label={`${t('company.table.statusHeader')}:`} value={<Label color="success" variant="soft">{t(`company.table.status.${subInfo?.status || 'pending'}`)}</Label>} isComponent />
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
                {docs.map((doc) => (
                  <TableRow key={doc._id}>
                    <TableCell padding="checkbox" />
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Iconify icon={doc.fileName.endsWith('.pdf') ? "vscode-icons:file-type-pdf2" : "solar:file-bold"} width={24} />
                        <Link href={doc.fileUrl} target="_blank" variant="body2" color="inherit">
                          {doc.fileName}
                        </Link>
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
    <Card sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      height: '100%',
      aspectRatio: '1/1',
      minWidth: 0,
      position: 'relative'
    }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          display: 'flex',
          borderRadius: '50%',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: alpha(theme.palette[color].main, 0.12),
          color: theme.palette[color].main,
          mb: 1.5,
        }}
      >
        <Iconify icon={icon} width={24} />
      </Box>

      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', mb: 0.5, width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {title}
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>

      {showViewDetails && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{
            mt: 1,
            position: 'absolute',
            bottom: 8,
            left: 0,
            right: 0
          }}
        >
          <Typography variant="caption" sx={{ color: theme.palette[color].main, fontWeight: 'bold', fontSize: 10 }}>
            {t('company.details.viewDetails')}
          </Typography>
          <Iconify icon="eva:chevron-right-fill" width={12} sx={{ color: theme.palette[color].main }} />
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
