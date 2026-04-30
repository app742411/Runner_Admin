import { z as zod } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMemo, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import toast from 'react-hot-toast';
import { Form, Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import AddressAutocomplete from 'src/components/map/address-autocomplete';

import { useSelector } from 'react-redux';
import { ROLES } from 'src/config/roles';
import { employeeApi } from 'src/store/api/employee.api';

// ----------------------------------------------------------------------

export function EmployeeNewEditForm({ currentEmployee, isProfile = false }) {
  const { t } = useTranslation();
  const router = useRouter();

  const NewEmployeeSchema = zod.object({
    firstName: zod.string().min(1, { message: t('employee.form.validation.firstName') }),
    lastName: zod.string().min(1, { message: t('employee.form.validation.lastName') }),
    email: zod.string().email({ message: t('employee.form.validation.emailInvalid') }).min(1, { message: t('employee.form.validation.emailRequired') }),
    phone: zod.string().min(1, { message: t('employee.form.validation.phone') }),
    gender: zod.string().min(1, { message: t('employee.form.validation.gender') }),
    password: zod.string().optional(),
    companyId: zod.string().optional(),
    jobPosition: zod.string().optional(),
    startDate: zod.any().optional(),
    workHoursAndAvailability: zod.string().optional(),
    professionalQualifications: zod.string().optional(),
    workExperience: zod.string().optional(),
    languageSkills: zod.string().optional(),
    specialSkills: zod.string().optional(),
    assignmentAreas: zod.string().optional(),
    medicalInformation: zod.string().optional(),
    emergencyContacts: zod.string().optional(),
    socialSecurityNumber: zod.string().optional(),
    taxInformation: zod.string().optional(),
    dateOfBirth: zod.any().optional(),
    privateAddress: zod.string().optional(),
    privatePhoneNumber: zod.string().optional(),
    ahvNumber: zod.string().optional(),
    bonusAndBenefits: zod.string().optional(),
    employmentContract: zod.string().optional(),
    notice: zod.string().optional(),
    contractChanges: zod.string().optional(),
    disciplinary: zod.string().optional(),
    performanceEvaluations: zod.string().optional(),
    futureDevelopmentPlans: zod.string().optional(),
    access: zod.string().optional(),
    security: zod.string().optional(),
    paymentType: zod.string().optional(),
    fixedSalary: zod.coerce.number().optional(),
    pf: zod.coerce.number().optional(),
    esi: zod.coerce.number().optional(),
    tax: zod.coerce.number().optional(),
    otherDeduction: zod.coerce.number().optional(),
    bonus: zod.coerce.number().optional(),
    perServiceRate: zod.coerce.number().optional(),
    hourlyRate: zod.coerce.number().optional(),
    bankAccountInformation: zod.object({
      bankName: zod.string().optional(),
      accountHolderName: zod.string().optional(),
      accountNumber: zod.string().optional(),
      ifscCode: zod.string().optional(),
      iban: zod.string().optional(),
      swiftCode: zod.string().optional(),
      branchName: zod.string().optional()
    }).optional(),
    childrens: zod.array(
      zod.object({
        name: zod.string().optional(),
        gender: zod.string().optional(),
        dateOfBirth: zod.any().optional(),
      })
    ).optional(),
    profileImage: zod.any().optional(),
    idImages: zod.any().optional(),
    aadhaarImages: zod.any().optional(),
  });

  const user = useSelector((state) => state.auth.user);
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;

  const defaultValues = useMemo(
    () => ({
      firstName: currentEmployee?.firstName || '',
      lastName: currentEmployee?.lastName || '',
      email: currentEmployee?.email || '',
      phone: currentEmployee?.phone || '',
      gender: currentEmployee?.gender || 'male',
      password: '',
      companyId: currentEmployee?.companyId || '',
      jobPosition: currentEmployee?.employeeProfile?.jobPosition || '',
      startDate: currentEmployee?.employeeProfile?.startDate || null,
      workHoursAndAvailability: currentEmployee?.employeeProfile?.workHoursAndAvailability || '',
      professionalQualifications: currentEmployee?.employeeProfile?.professionalQualifications || '',
      workExperience: currentEmployee?.employeeProfile?.workExperience || '',
      languageSkills: currentEmployee?.employeeProfile?.languageSkills || '',
      specialSkills: currentEmployee?.employeeProfile?.specialSkills || '',
      assignmentAreas: currentEmployee?.employeeProfile?.assignmentAreas || '',
      medicalInformation: currentEmployee?.employeeProfile?.medicalInformation || '',
      emergencyContacts: currentEmployee?.employeeProfile?.emergencyContacts || '',
      socialSecurityNumber: currentEmployee?.employeeProfile?.socialSecurityNumber || '',
      taxInformation: currentEmployee?.employeeProfile?.taxInformation || '',
      dateOfBirth: currentEmployee?.employeeProfile?.dateOfBirth || null,
      privateAddress: currentEmployee?.employeeProfile?.privateAddress || '',
      privatePhoneNumber: currentEmployee?.employeeProfile?.privatePhoneNumber || '',
      ahvNumber: currentEmployee?.employeeProfile?.ahvNumber || '',
      bonusAndBenefits: currentEmployee?.employeeProfile?.bonusAndBenefits || '',
      employmentContract: currentEmployee?.employeeProfile?.employmentContract || '',
      notice: currentEmployee?.employeeProfile?.notice || '',
      contractChanges: currentEmployee?.employeeProfile?.contractChanges || '',
      disciplinary: currentEmployee?.employeeProfile?.disciplinary || '',
      performanceEvaluations: currentEmployee?.employeeProfile?.performanceEvaluations || '',
      futureDevelopmentPlans: currentEmployee?.employeeProfile?.futureDevelopmentPlans || '',
      access: currentEmployee?.employeeProfile?.access || '',
      security: currentEmployee?.employeeProfile?.security || '',
      paymentType: currentEmployee?.employeeProfile?.paymentType || 'fixed',
      fixedSalary: currentEmployee?.employeeProfile?.fixedSalary || 0,
      pf: currentEmployee?.employeeProfile?.pf || 0,
      esi: currentEmployee?.employeeProfile?.esi || 0,
      tax: currentEmployee?.employeeProfile?.tax || 0,
      otherDeduction: currentEmployee?.employeeProfile?.otherDeduction || 0,
      bonus: currentEmployee?.employeeProfile?.bonus || 0,
      perServiceRate: currentEmployee?.employeeProfile?.perServiceRate || 0,
      hourlyRate: currentEmployee?.employeeProfile?.hourlyRate || 0,
      bankAccountInformation: {
        bankName: currentEmployee?.employeeProfile?.bankAccountInformation?.bankName || '',
        accountHolderName: currentEmployee?.employeeProfile?.bankAccountInformation?.accountHolderName || '',
        accountNumber: currentEmployee?.employeeProfile?.bankAccountInformation?.accountNumber || '',
        ifscCode: currentEmployee?.employeeProfile?.bankAccountInformation?.ifscCode || '',
        iban: currentEmployee?.employeeProfile?.bankAccountInformation?.iban || '',
        swiftCode: currentEmployee?.employeeProfile?.bankAccountInformation?.swiftCode || '',
        branchName: currentEmployee?.employeeProfile?.bankAccountInformation?.branchName || ''
      },
      childrens: currentEmployee?.employeeProfile?.childrens || [{ name: '', gender: 'male', dateOfBirth: null }],
      profileImage: null,
      idImages: [],
      aadhaarImages: [],
    }),
    [currentEmployee]
  );

  const methods = useForm({
    resolver: zodResolver(NewEmployeeSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'childrens',
  });

  const paymentType = methods.watch('paymentType');

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      // Basic fields
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('gender', data.gender);

      // Profile fields at root
      const profileFields = [
        'jobPosition', 'startDate', 'workHoursAndAvailability', 'professionalQualifications',
        'workExperience', 'languageSkills', 'specialSkills', 'assignmentAreas',
        'medicalInformation', 'emergencyContacts', 'socialSecurityNumber', 'taxInformation',
        'dateOfBirth', 'privateAddress', 'privatePhoneNumber', 'ahvNumber',
        'bonusAndBenefits', 'employmentContract', 'contractChanges', 'notice',
        'performanceEvaluations', 'disciplinary', 'futureDevelopmentPlans',
        'access', 'security', 'paymentType', 'fixedSalary', 'pf', 'esi',
        'tax', 'otherDeduction', 'bonus', 'perServiceRate', 'hourlyRate'
      ];

      profileFields.forEach(field => {
        const value = data[field];
        if (value !== undefined && value !== null && value !== '') {
          let formattedValue = value;
          // Handle Date objects (Luxon, Dayjs, or Native)
          if (value && typeof value.toISOString === 'function') {
            formattedValue = value.toISOString();
          }
          formData.append(field, formattedValue);
        }
      });

      // Nested structures
      if (data.bankAccountInformation) {
        Object.entries(data.bankAccountInformation).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            formData.append(`bankAccountInformation[${key}]`, value);
          }
        });
      }

      if (data.childrens && data.childrens.length > 0) {
        // Filter out empty children if necessary
        const validChildren = data.childrens.filter(c => c.name || c.dateOfBirth);
        if (validChildren.length > 0) {
          formData.append('childrens', JSON.stringify(validChildren));
        }
      }

      // Files
      if (data.profileImage && typeof data.profileImage !== 'string') {
        formData.append('profileImage', data.profileImage);
      }
      if (data.idImages?.length) {
        data.idImages.forEach(file => {
          if (typeof file !== 'string') formData.append('idImages', file);
        });
      }
      if (data.aadhaarImages?.length) {
        data.aadhaarImages.forEach(file => {
          if (typeof file !== 'string') formData.append('aadhaarImages', file);
        });
      }

      if (isProfile) {
        await employeeApi.updateProfile(formData);
        reset();
        toast.success(t('employee.updateSuccess'));
        router.push(paths.dashboard.employee.profile);
        return;
      }

      if (currentEmployee?._id) {
        if (isSuperAdmin) {
          await employeeApi.updateEmployeeAdmin(currentEmployee._id, formData);
        } else {
          await employeeApi.updateEmployeeCompany(currentEmployee._id, formData);
        }
      } else {
        if (isSuperAdmin) {
          await employeeApi.createEmployeeAdmin(formData);
        } else {
          await employeeApi.createEmployeeCompany(formData);
        }
      }

      reset();
      toast.success(currentEmployee ? t('employee.updateSuccess') : t('employee.createSuccess'));
      router.push(paths.dashboard.employee.list);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || t('employee.somethingWentWrong'));
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <GlobalStyles
        styles={{
          '.MuiContainer-root': {
            maxWidth: 'none !important',
          },
        }}
      />
      <Stack spacing={4} sx={{ width: '100%' }}>
        {/* Personal Information */}
        <Card sx={{ p: 3, width: '100%' }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            <Iconify icon="solar:user-bold" sx={{ mr: 1 }} /> {t('employee.sections.personalInfo') || 'Personal Information'}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Field.UploadAvatar
                name="profileImage"
                onDrop={(acceptedFiles) => {
                  const file = acceptedFiles[0];
                  if (file) {
                    setValue('profileImage', file, { shouldValidate: true });
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Field.Text name="firstName" label={t('employee.form.firstName')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field.Text name="lastName" label={t('employee.form.lastName')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field.Text name="email" label={t('employee.form.email')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field.Phone name="phone" label={t('employee.form.phone')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field.Select name="gender" label={t('employee.form.gender')}>
                    <MenuItem value="male">{t('employee.form.male')}</MenuItem>
                    <MenuItem value="female">{t('employee.form.female')}</MenuItem>
                  </Field.Select>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field.DatePicker name="dateOfBirth" label={t('employee.form.dob')} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>

        {/* Employment Details */}
        <Card sx={{ p: 3, width: '100%' }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            <Iconify icon="solar:case-minimalistic-bold" sx={{ mr: 1 }} /> {t('employee.sections.employmentInfo') || 'Employment Details'}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Field.Text name="jobPosition" label={t('employee.form.jobPosition')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.DatePicker name="startDate" label={t('employee.form.startDate')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="employmentContract" label={t('employee.form.contract')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="workHoursAndAvailability" label={t('employee.form.workHours')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="notice" label={t('employee.form.notice')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="access" label={t('employee.form.access')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="security" label={t('employee.form.security')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="contractChanges" label={t('employee.form.contractChanges')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="performanceEvaluations" label={t('employee.form.performance')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="disciplinary" label={t('employee.form.disciplinary')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="futureDevelopmentPlans" label={t('employee.form.development')} />
            </Grid>
          </Grid>
        </Card>

        {/* Salary & Benefits */}
        <Card sx={{ p: 3, width: '100%' }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            <Iconify icon="solar:wad-of-money-bold" sx={{ mr: 1 }} /> {t('employee.sections.paymentInfo') || 'Salary & Benefits'}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Field.Select name="paymentType" label={t('employee.form.paymentType') || 'Payment Type'}>
                <MenuItem value="fixed">{t('employee.form.fixed') || 'Fixed'}</MenuItem>
                <MenuItem value="per_service">{t('employee.form.perService') || 'Per Service'}</MenuItem>
                <MenuItem value="hourly">{t('employee.form.hourly') || 'Hourly'}</MenuItem>
              </Field.Select>
            </Grid>

            {paymentType === 'fixed' && (
              <Grid item xs={12} md={6}>
                <Field.Text name="fixedSalary" label={t('employee.form.fixedSalary') || 'Fixed Salary'} type="number" />
              </Grid>
            )}

            {paymentType === 'per_service' && (
              <Grid item xs={12} md={6}>
                <Field.Text name="perServiceRate" label={t('employee.form.perServiceRate') || 'Per Service Rate'} type="number" />
              </Grid>
            )}

            {paymentType === 'hourly' && (
              <Grid item xs={12} md={6}>
                <Field.Text name="hourlyRate" label={t('employee.form.hourlyRate') || 'Hourly Rate'} type="number" />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <Field.Text name="pf" label={t('employee.form.pf') || 'PF'} type="number" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="esi" label={t('employee.form.esi') || 'ESI'} type="number" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="tax" label={t('employee.form.tax') || 'Tax'} type="number" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="otherDeduction" label={t('employee.form.otherDeduction') || 'Other Deduction'} type="number" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="bonus" label={t('employee.form.bonus') || 'Bonus'} type="number" />
            </Grid>

            <Grid item xs={12} md={6}>
              <Field.Text name="bonusAndBenefits" label={t('employee.form.bonusAndBenefits') || 'Bonus and Benefits'} />
            </Grid>
          </Grid>
        </Card>

        {/* Bank Information */}
        <Card sx={{ p: 3, width: '100%' }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            <Iconify icon="solar:card-2-bold" sx={{ mr: 1 }} /> {t('employee.sections.bankInfo') || 'Bank Information'}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Field.Text name="bankAccountInformation.bankName" label={t('employee.form.bankName')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="bankAccountInformation.accountHolderName" label={t('employee.form.holderName')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="bankAccountInformation.accountNumber" label={t('employee.form.accountNumber')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="bankAccountInformation.ifscCode" label={t('employee.form.ifsc')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="bankAccountInformation.iban" label={t('employee.form.iban')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="bankAccountInformation.swiftCode" label={t('employee.form.swift')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="bankAccountInformation.branchName" label={t('employee.form.branch')} />
            </Grid>
          </Grid>
        </Card>

        {/* Qualifications & Skills */}
        <Card sx={{ p: 3, width: '100%' }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            <Iconify icon="solar:medal-ribbons-star-bold" sx={{ mr: 1 }} /> {t('employee.sections.skillsInfo') || 'Qualifications & Skills'}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Field.Text name="professionalQualifications" label={t('employee.form.qualifications')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="workExperience" label={t('employee.form.experience')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="languageSkills" label={t('employee.form.languages')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="specialSkills" label={t('employee.form.specialSkills')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="assignmentAreas" label={t('employee.form.assignment')} />
            </Grid>
          </Grid>
        </Card>

        {/* Private Details */}
        <Card sx={{ p: 3, width: '100%' }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            <Iconify icon="solar:home-2-bold" sx={{ mr: 1 }} /> {t('employee.sections.privateInfo') || 'Private Details'}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <AddressAutocomplete
                label={t('employee.form.address')}
                placeholder={t('employee.form.enterAddress') || 'Enter address...'}
                onAddressSelect={(data) => {
                  setValue('privateAddress', data.fullAddress, { shouldValidate: true });
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Phone name="privatePhoneNumber" label={t('employee.form.privatePhone')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="ahvNumber" label={t('employee.form.ahv')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="socialSecurityNumber" label={t('employee.form.ssn')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="taxInformation" label={t('employee.form.tax')} />
            </Grid>
          </Grid>
        </Card>

        {/* Medical & Emergency */}
        <Card sx={{ p: 3, width: '100%' }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            <Iconify icon="solar:shield-warning-bold" sx={{ mr: 1 }} /> {t('employee.sections.medicalInfo') || 'Medical & Emergency'}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Field.Text name="medicalInformation" label={t('employee.form.medical')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text name="emergencyContacts" label={t('employee.form.emergency')} />
            </Grid>
          </Grid>
        </Card>

        {/* Family Details */}
        <Card sx={{ p: 3, width: '100%' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
              <Iconify icon="solar:users-group-rounded-bold" sx={{ mr: 1 }} /> {t('employee.sections.familyInfo') || 'Family Details'}
            </Typography>
            <Button
              size="small"
              color="primary"
              variant="soft"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => append({ name: '', gender: 'male', dateOfBirth: null })}
            >
              {t('employee.form.addChild')}
            </Button>
          </Stack>

          <Stack spacing={3}>
            {fields.map((item, index) => (
              <Grid container spacing={2} key={item.id} alignItems="flex-end">
                <Grid item xs={12} md={4}>
                  <Field.Text name={`childrens[${index}].name`} label={t('employee.form.childName')} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Field.Select name={`childrens[${index}].gender`} label={t('employee.form.gender')}>
                    <MenuItem value="male">{t('employee.form.male')}</MenuItem>
                    <MenuItem value="female">{t('employee.form.female')}</MenuItem>
                  </Field.Select>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Field.DatePicker name={`childrens[${index}].dateOfBirth`} label={t('employee.form.dob')} />
                </Grid>
                <Grid item xs={12} md={1}>
                  <IconButton color="error" onClick={() => remove(index)} disabled={fields.length === 1}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Stack>
        </Card>

        {/* Documents */}
        <Card sx={{ p: 3, width: '100%' }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            <Iconify icon="solar:document-bold" sx={{ mr: 1 }} /> {t('employee.sections.documents') || 'Documents'}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>
                {t('employee.form.idImages')}
              </Typography>
              <Field.Upload
                multiple
                name="idImages"
                onDrop={(acceptedFiles) => setValue('idImages', acceptedFiles)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>
                {t('employee.form.aadhaarImages')}
              </Typography>
              <Field.Upload
                multiple
                name="aadhaarImages"
                onDrop={(acceptedFiles) => setValue('aadhaarImages', acceptedFiles)}
              />
            </Grid>
          </Grid>
        </Card>

        {/* Footer Actions */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 3 }}>
          <FormControlLabel control={<Switch defaultChecked color="success" />} label={t('employee.form.publish')} />

          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            loading={isSubmitting}
            sx={{ bgcolor: '#003b51', '&:hover': { bgcolor: '#002636' }, color: 'white', px: 6 }}
          >
            {t('employee.form.confirm')}
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
