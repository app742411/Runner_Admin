import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { useEmployee, useEmployeeProfile } from 'src/features/employee/useEmployees';
import { fDate } from 'src/utils/format-time';
import { chatApi } from 'src/store/api/chat.api';
import toast from 'react-hot-toast';

// ----------------------------------------------------------------------

export function EmployeeDetailsView({ id }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  // If no ID, fetch the logged-in user's profile
  const { data: employeeData, isLoading: isEmployeeLoading } = useEmployee(id);
  const { data: profileData, isLoading: isProfileLoading } = useEmployeeProfile();

  const employee = id ? employeeData?.data : profileData?.data;
  const isLoading = id ? isEmployeeLoading : isProfileLoading;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h5">{t('employee.details.notFound')}</Typography>
      </Box>
    );
  }

  const {
    firstName,
    lastName,
    email,
    employeeProfile,
  } = employee;

  const displayName = `${firstName || ''} ${lastName || ''}`.trim() || t('employee.table.unknown');
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U';

  // Stats Mock based on Image
  const STATS = [
    { label: t('employee.details.stats.assigned'), value: '6', icon: 'solar:clipboard-check-bold', color: 'warning', action: t('employee.details.stats.viewDetails') },
    { label: t('employee.details.stats.active'), value: '6', icon: 'solar:clock-circle-bold', color: 'info', action: t('employee.details.stats.viewDetails') },
    { label: t('employee.details.stats.completed'), value: '3', icon: 'solar:check-circle-bold', color: 'success', action: t('employee.details.stats.viewDetails') },
    { label: t('employee.details.stats.earning'), value: 'CHF102', icon: 'solar:wallet-bold', color: 'secondary', action: t('employee.details.stats.viewDetails') },
  ];

  const handleOpenChat = async () => {
    try {
      const res = await chatApi.initChat({
        type: 'direct',
        receiverId: employee._id,
      });
      const chatId = res.data?.data?._id || res.data?._id;
      if (chatId) {
        router.push(`${paths.dashboard.chat}?id=${chatId}&type=direct`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to initiate chat');
    }
  };

  return (
    <Container maxWidth={false} sx={{ py: 3 }}>
      {/* Top Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            color="inherit"
            sx={{ minWidth: 'auto', p: 1, mr: 1 }}
            onClick={() => router.push(paths.dashboard.employee.list)}
          >
            <Iconify icon="eva:arrow-ios-back-fill" width={24} />
          </Button>
          <Avatar
            src={employeeProfile?.profileImage?.fileUrl}
            alt={displayName}
            sx={{ width: 56, height: 56, bgcolor: 'primary.main', color: 'primary.contrastText', fontSize: 24, fontWeight: 700 }}
          >
            {initials}
          </Avatar>
          <Typography variant="h4">{displayName}</Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Iconify icon="solar:chat-round-line-bold" />}
            sx={{ borderRadius: 2 }}
            onClick={handleOpenChat}
          >
            {t('employee.details.openChat', { defaultValue: 'Open Chat' })}
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="solar:pen-bold" />}
            sx={{ borderColor: 'divider', borderRadius: 2 }}
            onClick={() => router.push(id ? paths.dashboard.employee.edit(id) : paths.dashboard.employee.editProfile)}
          >
            {t('employee.details.editProfile')}
          </Button>
        </Stack>
      </Stack>

      {/* Top Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {STATS.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ p: 3, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ mb: 0.5 }}>{stat.value}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>{stat.label}</Typography>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: `${stat.color}.main`, typography: 'subtitle2', cursor: 'pointer' }}>
                  {stat.action}
                  <Iconify icon="eva:arrow-ios-forward-fill" width={16} />
                </Stack>
              </Box>
              <Box sx={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1.5, bgcolor: alpha(theme.palette[stat.color].main, 0.12), color: `${stat.color}.main` }}>
                <Iconify icon={stat.icon} width={24} />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* LEFT COLUMN */}
        <Grid item xs={12} md={8}>
          <Stack spacing={4}>
            {/* Employee Details Card */}
            <Card sx={{ p: 4, borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
                <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, bgcolor: alpha(theme.palette.info.main, 0.12), color: 'info.main' }}>
                  <Iconify icon="solar:user-bold" width={20} />
                </Box>
                <Typography variant="h6" sx={{ mb: 3 }}>{t('employee.details.title')}</Typography>
              </Stack>

              <Divider sx={{ mb: 4, borderStyle: 'dashed' }} />

              <Grid container spacing={4} rowSpacing={4}>
                <DataField label={t('employee.form.firstName')} value={firstName} xs={6} />
                <DataField label={t('employee.form.lastName')} value={lastName} xs={6} />
                <DataField label={t('employee.form.jobPosition')} value={employeeProfile?.jobPosition} xs={6} />
                <DataField label={t('employee.form.startDate')} value={employeeProfile?.startDate ? fDate(employeeProfile.startDate) : '-'} xs={6} />
                <DataField label={t('employee.form.workHours')} value={employeeProfile?.workHoursAndAvailability} xs={6} />
                <DataField label={t('employee.form.qualifications')} value={employeeProfile?.professionalQualifications} xs={6} />
                <DataField label={t('employee.form.experience')} value={employeeProfile?.workExperience} xs={6} />
                <DataField label={t('employee.form.languages')} value={employeeProfile?.languageSkills} xs={6} />
                <DataField label={t('employee.form.specialSkills')} value={employeeProfile?.specialSkills} xs={6} />
                <DataField label={t('employee.form.assignment')} value={employeeProfile?.assignmentAreas} xs={6} />
                <DataField label={t('employee.form.medical')} value={employeeProfile?.medicalInformation} xs={6} />
                <DataField label={t('employee.form.emergency')} value={employeeProfile?.emergencyContacts} xs={6} />
                <DataField label={t('employee.form.ssn')} value={employeeProfile?.socialSecurityNumber} xs={6} />
                <DataField label={t('employee.form.taxInfo')} value={employeeProfile?.taxInformation} xs={6} />
              </Grid>
            </Card>

            {/* 4 Cards Grid - Financial, Contract, Security, Performance */}
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ p: 4, borderRadius: 2, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
                    <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, bgcolor: alpha(theme.palette.success.main, 0.12), color: 'success.main' }}>
                      <Iconify icon="solar:wallet-bold" width={20} />
                    </Box>
                    <Typography variant="subtitle1">{t('employee.details.financialInfo')}</Typography>
                  </Stack>
                  <Stack spacing={3}>
                    <DataField label={t('employee.form.paymentType')} value={employeeProfile?.employeePayment?.paymentType} />
                    {employeeProfile?.employeePayment?.paymentType === 'fixed' && (
                      <DataField label={t('employee.form.fixedSalary')} value={employeeProfile?.employeePayment?.fixedSalary} />
                    )}
                    {employeeProfile?.employeePayment?.paymentType === 'per_service' && (
                      <DataField label={t('employee.form.perServiceRate')} value={employeeProfile?.employeePayment?.perServiceRate} />
                    )}
                    {employeeProfile?.employeePayment?.paymentType === 'hourly' && (
                      <DataField label={t('employee.form.hourlyRate')} value={employeeProfile?.employeePayment?.hourlyRate} />
                    )}
                    <Divider sx={{ borderStyle: 'dashed' }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}><DataField label={t('employee.form.pf')} value={employeeProfile?.employeePayment?.deductions?.pf} /></Grid>
                      <Grid item xs={6}><DataField label={t('employee.form.esi')} value={employeeProfile?.employeePayment?.deductions?.esi} /></Grid>
                      <Grid item xs={6}><DataField label={t('employee.form.tax')} value={employeeProfile?.employeePayment?.deductions?.tax} /></Grid>
                      <Grid item xs={6}><DataField label={t('employee.form.otherDeduction')} value={employeeProfile?.employeePayment?.deductions?.other} /></Grid>
                      <Grid item xs={6}><DataField label={t('employee.form.bonus')} value={employeeProfile?.employeePayment?.bonus} /></Grid>
                    </Grid>
                    <Divider sx={{ borderStyle: 'dashed' }} />
                    <DataField label={t('employee.form.bankName')} value={employeeProfile?.bankAccountInformation?.bankName} />
                    <DataField label={t('employee.form.accountNumber')} value={employeeProfile?.bankAccountInformation?.accountNumber} />
                    <DataField label={t('employee.form.ifsc')} value={employeeProfile?.bankAccountInformation?.ifscCode} />
                    <DataField label={t('employee.form.branch')} value={employeeProfile?.bankAccountInformation?.branchName} />
                    <DataField label={t('employee.form.bonusAndBenefits')} value={employeeProfile?.bonusAndBenefits} />
                  </Stack>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ p: 4, borderRadius: 2, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
                    <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, bgcolor: alpha(theme.palette.warning.main, 0.12), color: 'warning.main' }}>
                      <Iconify icon="solar:document-text-bold" width={20} />
                    </Box>
                    <Typography variant="subtitle1">{t('employee.details.contractInfo')}</Typography>
                  </Stack>
                  <Stack spacing={3}>
                    <DataField label={t('employee.form.contract')} value={employeeProfile?.employmentContract} />
                    <DataField label={t('employee.details.noticePeriods')} value={employeeProfile?.notice} />
                    <DataField label={t('employee.details.contractChanges')} value={employeeProfile?.contractChanges} />
                  </Stack>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ p: 4, borderRadius: 2, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
                    <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, bgcolor: alpha(theme.palette.error.main, 0.12), color: 'error.main' }}>
                      <Iconify icon="solar:shield-warning-bold" width={20} />
                    </Box>
                    <Typography variant="subtitle1">{t('employee.details.securitySection')}</Typography>
                  </Stack>
                  <Stack spacing={3}>
                    <DataField label={t('employee.details.accessRights')} value={employeeProfile?.access} />
                    <DataField label={t('employee.details.securityClearances')} value={employeeProfile?.security} />
                  </Stack>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ p: 4, borderRadius: 2, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
                    <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, bgcolor: alpha(theme.palette.info.main, 0.12), color: 'info.main' }}>
                      <Iconify icon="solar:chart-square-bold" width={20} />
                    </Box>
                    <Typography variant="subtitle1">{t('employee.details.performanceSection')}</Typography>
                  </Stack>
                  <Stack spacing={3}>
                    <DataField label={t('employee.details.performanceEvaluations')} value={employeeProfile?.performanceEvaluations} />
                    <DataField label={t('employee.details.disciplinaryActions')} value={employeeProfile?.disciplinary} />
                    <DataField label={t('employee.details.futurePlans')} value={employeeProfile?.futureDevelopmentPlans} />
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 4, borderRadius: 2, height: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
              <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, bgcolor: alpha(theme.palette.info.main, 0.12), color: 'info.main' }}>
                <Iconify icon="solar:info-circle-bold" width={20} />
              </Box>
              <Typography variant="h6">{t('employee.details.personalInfo')}</Typography>
            </Stack>

            <Divider sx={{ mb: 4, borderStyle: 'dashed' }} />

            <Stack spacing={3}>
              <DataField label={t('employee.form.dob')} value={employeeProfile?.dateOfBirth ? fDate(employeeProfile.dateOfBirth) : '-'} />
              <DataField label={t('employee.form.address')} value={employeeProfile?.privateAddress} />
              <DataField label={t('employee.form.privatePhone')} value={employeeProfile?.privatePhoneNumber} />
              <DataField label={t('employee.form.email')} value={email} />

              <Box>
                <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 1.5 }}>
                  {t('employee.details.childrens')} ({employeeProfile?.childrens?.length || '0'})
                </Typography>
                <Grid container sx={{ mb: 1 }}>
                  <Grid item xs={5}><Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{t('employee.details.childTable.name')}</Typography></Grid>
                  <Grid item xs={2}><Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{t('employee.details.childTable.sex')}</Typography></Grid>
                  <Grid item xs={5} align="right"><Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{t('employee.details.childTable.dob')}</Typography></Grid>
                </Grid>

                {employeeProfile?.childrens?.length > 0 && (
                  employeeProfile.childrens.map((child, idx) => (
                    <Grid container key={idx} sx={{ mb: 1, alignItems: 'center' }}>
                      <Grid item xs={5}><Typography variant="subtitle2">{child.name}</Typography></Grid>
                      <Grid item xs={2}><Typography variant="subtitle2" color="text.secondary">{child.gender?.charAt(0).toUpperCase()}</Typography></Grid>
                      <Grid item xs={5} align="right"><Typography variant="subtitle2" color="info.main">{fDate(child.dateOfBirth)}</Typography></Grid>
                    </Grid>
                  ))
                )}
              </Box>

              <DataField label={t('employee.form.ahv')} value={employeeProfile?.ahvNumber} />
              <DataField label={t('employee.details.nationality')} value="-" />
              <DataField label={t('employee.details.taxAuthority')} value="-" />
              <DataField label={t('employee.details.maritalStatus')} value="-" />
              <DataField label={t('employee.details.typeOfId')} value="-" />

              <Box>
                <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 1.5 }}>{t('employee.details.copyId')}</Typography>
                <Stack spacing={2}>
                  {employeeProfile?.documents?.idImages?.map((doc, idx) => (
                    <Box key={idx} sx={{ width: '100%', borderRadius: 1.5, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
                      <img src={doc.fileUrl} alt={doc.fileName} style={{ width: '100%', display: 'block' }} />
                    </Box>
                  ))}
                  {employeeProfile?.documents?.aadhaarImages?.map((doc, idx) => (
                    <Box key={`a-${idx}`} sx={{ width: '100%', borderRadius: 1.5, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
                      <img src={doc.fileUrl} alt={doc.fileName} style={{ width: '100%', display: 'block' }} />
                    </Box>
                  ))}
                  {(!employeeProfile?.documents?.idImages?.length && !employeeProfile?.documents?.aadhaarImages?.length) && (
                    <Box sx={{ width: '100%', height: 200, bgcolor: 'background.neutral', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" color="text.disabled">{t('employee.details.noId')}</Typography>
                    </Box>
                  )}
                </Stack>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 1.5 }}>{t('employee.details.ahvCard')}</Typography>
                <Box sx={{ width: '100%', borderRadius: 1.5, overflow: 'hidden', border: `1px solid ${theme.palette.divider}`, mb: 2 }}>
                  <img src="https://i.ibb.co/b3wJQQf/ahv-mock.png" alt="AHV Card" style={{ width: '100%', display: 'block', objectFit: 'contain' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Mock+AHV+Card'; }} />
                </Box>

                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.08), borderRadius: 1.5, border: `1px solid ${alpha(theme.palette.info.main, 0.24)}` }}>
                  <Typography variant="subtitle2" sx={{ color: 'info.main', textAlign: 'center' }}>
                    {t('employee.form.ahv')}: {employeeProfile?.ahvNumber || '-'}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

// ----------------------------------------------------------------------

function DataField({ label, value, xs }) {
  const content = (
    <Box>
      <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="subtitle2" sx={{ color: 'text.primary', wordWrap: 'break-word' }}>
        {value || '-'}
      </Typography>
    </Box>
  );

  if (xs) {
    return <Grid item xs={12} sm={xs}>{content}</Grid>;
  }

  return content;
}
