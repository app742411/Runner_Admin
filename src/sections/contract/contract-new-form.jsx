import { z as zod } from 'zod';
import { useSelector } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form';
import { ROLES } from 'src/config/roles';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useMemo, useCallback, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import TableContainer from '@mui/material/TableContainer';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { m, AnimatePresence } from 'framer-motion';
import { alpha, useTheme } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import AddressAutocomplete from 'src/components/map/address-autocomplete';

import { fData } from 'src/utils/format-number';

import toast from 'react-hot-toast';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

import { useCreateContract } from 'src/features/contract/useContracts';
import { useCompanies } from 'src/features/company/useCompanies';
import { useEmployees } from 'src/features/employee/useEmployees';
import { useTemplates } from 'src/features/template/useTemplates';

// ----------------------------------------------------------------------

const TASK_CATEGORY_OPTIONS = ['Cleaning', 'Security', 'Maintenance', 'Gardening'];
const TASK_SUB_CATEGORY_OPTIONS = ['Deep Clean', 'Window Clean', 'Regular Clean', 'Repair', 'Inspection', 'Mowing'];

// ----------------------------------------------------------------------

export function ContractNewForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;

  const createContract = useCreateContract();
  const { data: companiesData } = useCompanies({ limit: 100 });
  const companies = companiesData?.data || [];

  const { data: employeesData } = useEmployees({ limit: 100 });
  const employees = employeesData?.data || [];

  const { data: templatesResponse } = useTemplates();
  const templates = templatesResponse?.data || [];

  const NewContractSchema = useMemo(() => zod.object({
    contractType: zod.string().min(1, t('contract.form.validation.typeRequired')),
    startDate: schemaHelper.date().nullable().refine((val) => val !== null, t('contract.form.validation.startDateRequired')),
    endDate: schemaHelper.date().nullable().refine((val) => val !== null, t('contract.form.validation.endDateRequired')),
    company: zod.string().optional(),
    client: zod.object({
      name: zod.string().min(1, t('contract.form.validation.nameRequired')),
      email: zod.string().email(t('contract.form.validation.emailInvalid')),
      phone: zod.string().min(1, t('contract.form.validation.phoneRequired')),
      country: zod.string().min(1, t('contract.form.validation.countryRequired')),
      state: zod.string().min(1, t('contract.form.validation.stateRequired')),
      city: zod.string().min(1, t('contract.form.validation.cityRequired')),
      pincode: zod.string().min(1, t('contract.form.validation.pincodeRequired')),
      addressLine1: zod.string().min(1, t('contract.form.validation.addressRequired')),
      addressLine2: zod.string().optional(),
      logo: schemaHelper.file().nullable(),
    }),
    property: zod.object({
      propertyName: zod.string().min(1, t('contract.form.validation.propertyNameRequired')),
      propertyType: zod.string().min(1, t('contract.form.propertyTypeRequired')),
      sizeSqm: zod.coerce.number().min(1, t('contract.form.validation.sizeRequired')),
      description: zod.string().min(1, t('contract.form.validation.descriptionRequired')),
      noOfResidents: zod.coerce.number().min(1, t('contract.form.validation.residentsRequired')),
      specialFeatureEndDate: schemaHelper.date().nullable(),
      location: zod.object({
        type: zod.string().default('Point'),
        coordinates: zod.array(zod.coerce.number()).length(2),
        address: zod.string().min(1, t('contract.form.validation.locationAddressRequired')),
      }),
    }),
    billingType: zod.string().min(1, t('contract.form.validation.billingTypeRequired')),
    hourlyRate: zod.coerce.number().min(0).optional(),
    tasks: zod.array(
      zod.object({
        taskName: zod.string().min(1, t('contract.form.validation.taskNameRequired')),
        taskCategory: zod.string().min(1, t('contract.form.validation.categoryRequired')),
        taskSubCategory: zod.string().min(1, t('contract.form.validation.subCategoryRequired')),
        taskPrice: zod.coerce.number().min(0).optional(),
        description: zod.string().min(1, t('contract.form.validation.descriptionRequired')),
        dueDate: schemaHelper.date().nullable(),
        scheduledDate: schemaHelper.date().nullable().optional(),
        subTasks: zod.array(
          zod.object({
            subTaskName: zod.string().min(1, t('contract.form.validation.subTaskNameRequired')),
            taskDuration: zod.coerce.number().min(0.1, t('contract.form.validation.durationRequired')),
            taskDurationUnit: zod.string().min(1, t('contract.form.validation.durationRequired')),
            assignedTo: zod.array(zod.string()).optional(),
            subtaskPrice: zod.coerce.number().optional(),
            description: zod.string().optional(),
          })
        ).optional(),
      })
    ).min(1, t('contract.form.validation.taskNameRequired')),
    additionalDocuments: zod.array(schemaHelper.file()).optional(),
    theme: zod.string().optional(),
    emailTemplateCode: zod.string().optional(),
  }), [t]);

  const defaultValues = useMemo(
    () => ({
      contractType: 'one-time',
      startDate: null,
      endDate: null,
      company: '',
      client: {
        name: '',
        email: '',
        phone: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        addressLine1: '',
        addressLine2: '',
        logo: null,
      },
      property: {
        propertyName: '',
        propertyType: 'commercial',
        sizeSqm: 1,
        description: '',
        noOfResidents: 1,
        specialFeatureEndDate: null,
        location: {
          type: 'Point',
          coordinates: [0, 0],
          address: '',
        },
      },
      billingType: 'per_service',
      hourlyRate: 0,
      tasks: [],
      additionalDocuments: [],
      theme: 'blue',
      emailTemplateCode: 'invoice_v1',
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(NewContractSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tasks',
  });

  const [showSubtasks, setShowSubtasks] = useState(false);

  const [currentTask, setCurrentTask] = useState({
    taskName: '',
    taskCategory: '',
    taskSubCategory: '',
    taskPrice: 0,
    description: '',
    dueDate: null,
    scheduledDate: null,
    subTasks: [],
  });

  const [currentSubTask, setCurrentSubTask] = useState({
    subTaskName: '',
    taskDuration: 0,
    taskDurationUnit: 'hours',
    assignedTo: [],
    subtaskPrice: 0,
    description: '',
  });

  const values = watch();

  const selectedTemplate = useMemo(() =>
    templates.find(t => t.templateCode === values.emailTemplateCode),
    [templates, values.emailTemplateCode]
  );

  const totalTime = useMemo(() => {
    // 1. Calculate time from added tasks
    const addedTasksTime = values.tasks.reduce((acc, task) => {
      return acc + (task.subTasks?.reduce((sum, sub) => {
        let duration = Number(sub.taskDuration) || 0;
        if (sub.taskDurationUnit === 'minutes') duration /= 60;
        if (sub.taskDurationUnit === 'days') duration *= 8;
        return sum + duration;
      }, 0) || 0);
    }, 0);

    // 2. Calculate time from current task being edited
    const currentTaskTime = currentTask.subTasks?.reduce((sum, sub) => {
      let duration = Number(sub.taskDuration) || 0;
      if (sub.taskDurationUnit === 'minutes') duration /= 60;
      if (sub.taskDurationUnit === 'days') duration *= 8;
      return sum + duration;
    }, 0) || 0;

    // 3. Calculate time from current subtask being typed
    let currentSubTaskDuration = Number(currentSubTask.taskDuration) || 0;
    if (currentSubTask.taskDurationUnit === 'minutes') currentSubTaskDuration /= 60;
    if (currentSubTask.taskDurationUnit === 'days') currentSubTaskDuration *= 8;

    return addedTasksTime + currentTaskTime + currentSubTaskDuration;
  }, [values.tasks, currentTask.subTasks, currentSubTask.taskDuration, currentSubTask.taskDurationUnit]);

  const totalCost = useMemo(() => {
    if (values.billingType === 'hourly') {
      return totalTime * (Number(values.hourlyRate) || 0);
    }

    // Per service: Sum of added tasks + current task + current subtask
    const addedTasksCost = values.tasks.reduce((acc, task) => acc + (Number(task.taskPrice) || 0), 0);
    const currentTaskCost = currentTask.subTasks?.reduce((sum, sub) => sum + (Number(sub.subtaskPrice) || 0), 0) || 0;
    const currentSubTaskCost = Number(currentSubTask.subtaskPrice) || 0;

    return addedTasksCost + currentTaskCost + currentSubTaskCost;
  }, [values.tasks, values.billingType, values.hourlyRate, totalTime, currentTask.subTasks, currentSubTask.subtaskPrice]);

  const totalSubTasksCount = useMemo(() => {
    const addedSubTasks = values.tasks.reduce((acc, task) => acc + (task.subTasks?.length || 0), 0);
    const currentTaskSubTasks = currentTask.subTasks?.length || 0;
    const typingSubTask = currentSubTask.subTaskName ? 1 : 0;
    return addedSubTasks + currentTaskSubTasks + typingSubTask;
  }, [values.tasks, currentTask.subTasks, currentSubTask.subTaskName]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      const parseData = (val) => {
        if (typeof val === 'string') {
          try {
            return JSON.parse(val);
          } catch (error) {
            console.error('Error parsing data:', error);
            return val;
          }
        }
        return val;
      };

      const client = parseData(data.client);
      const property = parseData(data.property);
      const tasks = parseData(data.tasks);

      formData.append('contractType', data.contractType);
      if (data.startDate) formData.append('startDate', new Date(data.startDate).toISOString());
      if (data.endDate) formData.append('endDate', new Date(data.endDate).toISOString());

      if (isSuperAdmin) {
        formData.append('company', data.company);
      } else if (user?.companyId) {
        formData.append('company', user.companyId);
      }

      formData.append('theme', data.theme || 'blue');
      formData.append('emailTemplateCode', data.emailTemplateCode || 'invoice_v1');
      formData.append('billingType', data.billingType || 'fixed');
      formData.append('hourlyRate', String(data.hourlyRate || 0));

      // Recursive function to append nested data to FormData
      const appendToFormData = (form, key, data) => {
        if (data === null || data === undefined) return;

        if (data instanceof File || data instanceof Blob) {
          form.append(key, data);
        } else if (Array.isArray(data)) {
          data.forEach((item, index) => {
            appendToFormData(form, `${key}[${index}]`, item);
          });
        } else if (typeof data === 'object' && !(data instanceof Date)) {
          Object.keys(data).forEach((prop) => {
            appendToFormData(form, `${key}[${prop}]`, data[prop]);
          });
        } else {
          form.append(key, data instanceof Date ? data.toISOString() : data);
        }
      };

      const { logo, ...clientDetails } = client;

      // Send client, property and other nested data as individual fields
      appendToFormData(formData, 'client', clientDetails);
      appendToFormData(formData, 'property', property);

      const tasksFormatted = (Array.isArray(tasks) ? tasks : []).map((task) => ({
        ...task,
        dueDate: task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : null,
        scheduledDate: task.scheduledDate ? dayjs(task.scheduledDate).format('YYYY-MM-DD') : null,
      }));

      tasksFormatted.forEach((task, index) => {
        Object.keys(task).forEach((key) => {
          if (key === 'subTasks' && Array.isArray(task.subTasks)) {
            task.subTasks.forEach((sub, subIdx) => {
              Object.keys(sub).forEach((subKey) => {
                appendToFormData(formData, `tasks[${index}][subTasks][${subIdx}][${subKey}]`, sub[subKey]);
              });
            });
          } else {
            appendToFormData(formData, `tasks[${index}][${key}]`, task[key]);
          }
        });
      });

      const finalLogo = logo instanceof File ? logo : (data.client?.logo instanceof File ? data.client.logo : null);
      if (finalLogo) {
        formData.append('clientLogo', finalLogo);
      }

      if (data.additionalDocuments?.length) {
        data.additionalDocuments.forEach((file) => {
          if (file instanceof File) {
            formData.append('additionalDocuments', file);
          }
        });
      }

      await createContract.mutateAsync(formData);

      reset();
      toast.success(t('contract.form.createContractSuccess') || 'Contract created successfully!');
      router.push(paths.dashboard.contract.list);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Something went wrong');
    }
  });


  const handleAddTask = useCallback(() => {
    const { taskName, taskCategory, taskSubCategory, taskPrice, description, subTasks } = currentTask;

    if (!taskName || !taskCategory || !taskSubCategory || !description) {
      toast.error(t('contract.form.fillTaskFields'));
      return;
    }

    append(currentTask);
    setCurrentTask({
      taskName: '',
      taskCategory: '',
      taskSubCategory: '',
      taskPrice: 0,
      description: '',
      dueDate: null,
      scheduledDate: null,
      subTasks: [],
    });
    setShowSubtasks(false);
  }, [append, currentTask, t]);

  const handleAddSubTask = useCallback(() => {
    if (!currentSubTask.subTaskName || !currentSubTask.taskDuration) {
      toast.error(t('contract.form.fillSubTaskFields') || 'Please fill subtask name and duration');
      return;
    }

    setCurrentTask((prev) => {
      const updatedSubTasks = [...prev.subTasks, {
        ...currentSubTask,
        subtaskPrice: values.billingType === 'hourly' ? 0 : currentSubTask.subtaskPrice
      }];
      const updatedPrice = values.billingType === 'hourly' ? 0 : updatedSubTasks.reduce((sum, sub) => sum + (Number(sub.subtaskPrice) || 0), 0);
      return {
        ...prev,
        subTasks: updatedSubTasks,
        taskPrice: updatedPrice
      };
    });

    setCurrentSubTask({
      subTaskName: '',
      taskDuration: 0,
      taskDurationUnit: 'hours',
      assignedTo: [],
      subtaskPrice: 0,
      description: '',
    });
  }, [currentSubTask, t, values.billingType]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>

          <Stack spacing={3}>
            {/* Contract Information Card */}
            <Card sx={{
              p: 3,
              boxShadow: (theme) => `0 0 2px 0 ${alpha(theme.palette.grey[500], 0.2)}, 0 12px 24px -4px ${alpha(theme.palette.grey[500], 0.12)}`,
              borderRadius: 2,
              border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.08)}`
            }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                  <Iconify icon="solar:clipboard-text-bold" width={24} />
                </Box>
                {t('contract.form.contractInfo')}
              </Typography>

              <Grid container spacing={2.5}>
                {isSuperAdmin && (
                  <Grid item xs={12}>
                    <Field.Select name="company" label={t('contract.form.selectCompany')}>
                      {companies.map((company) => (
                        <MenuItem key={company.companyId} value={company.companyId}>
                          {company.companyName}
                        </MenuItem>
                      ))}
                    </Field.Select>
                  </Grid>
                )}
                <Grid item xs={12} md={6}>
                  <Field.Select name="contractType" label={t('contract.form.contractType')}>
                    <MenuItem value="one-time">{t('contract.form.oneTime')}</MenuItem>
                    <MenuItem value="long-term">{t('contract.form.longTerm')}</MenuItem>
                  </Field.Select>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field.Select name="billingType" label={t('contract.form.billingType') || 'Billing Type'}>
                    <MenuItem value="per_service">{t('contract.form.perService')}</MenuItem>
                    <MenuItem value="hourly">{t('contract.form.hourly')}</MenuItem>
                  </Field.Select>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field.DatePicker name="startDate" label={t('contract.form.startDate')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field.DatePicker name="endDate" label={t('contract.form.endDate')} />
                </Grid>

                {values.billingType === 'hourly' && (
                  <Grid item xs={12}>
                    <Field.Text
                      name="hourlyRate"
                      label={t('contract.form.hourlyRate') || 'Hourly Rate'}
                      type="number"
                      InputProps={{ startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>CHF</Box> }}
                    />
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ borderStyle: 'dashed', my: 3 }} />

              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                  <Iconify icon="solar:users-group-rounded-bold" width={24} />
                </Box>
                {t('contract.form.clientDetails')}
              </Typography>

              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <AddressAutocomplete
                    label={t('contract.form.addressSearch') || 'Search Client Address'}
                    placeholder={t('contract.form.enterAddress') || 'Enter address to autofill...'}
                    onAddressSelect={(addressData) => {
                      setValue('client.addressLine1', addressData.addressLine1);
                      setValue('client.city', addressData.city);
                      setValue('client.state', addressData.state);
                      setValue('client.country', addressData.country);
                      setValue('client.pincode', addressData.pincode);
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field.Text name="client.name" label={t('contract.form.name')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field.Text name="client.email" label={t('contract.form.email')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field.Text name="client.phone" label={t('contract.form.phone')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field.Text name="client.addressLine1" label={t('contract.form.addressLine1')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field.Text name="client.addressLine2" label={t('contract.form.addressLine2')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Field.Text name="client.city" label={t('contract.form.city')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Field.Text name="client.state" label={t('contract.form.state')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Field.Text name="client.pincode" label={t('contract.form.pincode')} />
                </Grid>
                <Grid item xs={12}>
                  <Field.Text name="client.country" label={t('contract.form.country')} />
                </Grid>
              </Grid>
            </Card>

            {/* Property Details Card */}
            <Card sx={{
              p: 3,
              boxShadow: (theme) => `0 0 2px 0 ${alpha(theme.palette.grey[500], 0.2)}, 0 12px 24px -4px ${alpha(theme.palette.grey[500], 0.12)}`,
              borderRadius: 2,
              border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.08)}`
            }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                  <Iconify icon="solar:home-2-bold" width={24} />
                </Box>
                {t('contract.form.propertyDetails')}
              </Typography>

              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <Field.Text name="property.propertyName" label={t('contract.form.propertyName')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field.Select name="property.propertyType" label={t('contract.form.propertyType')}>
                    <MenuItem value="commercial">{t('contract.form.commercial')}</MenuItem>
                    <MenuItem value="residential">{t('contract.form.residential')}</MenuItem>
                  </Field.Select>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Field.Text name="property.sizeSqm" label={t('contract.form.propertySize')} type="number" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Field.Text name="property.noOfResidents" label={t('contract.form.noOfResidents')} type="number" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Field.DatePicker name="property.specialFeatureEndDate" label={t('contract.form.specialFeatureEndDate')} />
                </Grid>
                <Grid item xs={12}>
                  <Field.Text name="property.description" label={t('contract.form.propertyDescription')} multiline rows={3} />
                </Grid>
                <Grid item xs={12}>
                  <AddressAutocomplete
                    label={t('contract.form.propertyLocationSearch') || 'Search Property Location'}
                    onAddressSelect={(addressData) => {
                      setValue('property.location.address', addressData.fullAddress);
                      setValue('property.location.coordinates.1', addressData.latitude);
                      setValue('property.location.coordinates.0', addressData.longitude);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field.Text name="property.location.address" label={t('contract.form.locationAddress')} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Field.Text name="property.location.coordinates.1" label={t('contract.form.latitude')} type="number" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Field.Text name="property.location.coordinates.0" label={t('contract.form.longitude')} type="number" InputProps={{ readOnly: true }} />
                </Grid>
              </Grid>
            </Card>

            {/* Additional Documents Card */}
            <Card sx={{
              p: 3,
              boxShadow: (theme) => `0 0 2px 0 ${alpha(theme.palette.grey[500], 0.2)}, 0 12px 24px -4px ${alpha(theme.palette.grey[500], 0.12)}`,
              borderRadius: 2,
              border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.08)}`
            }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                  <Iconify icon="solar:document-add-bold" width={24} />
                </Box>
                {t('contract.form.additionalDocuments')}
              </Typography>
              <Field.Upload
                multiple
                thumbnail
                name="additionalDocuments"
                maxSize={3145728}
                placeholder={t('contract.form.uploadText')}
                helperText={
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block', textAlign: 'center' }}>
                    {t('contract.form.maxSize')}
                  </Typography>
                }
                onDrop={(acceptedFiles) => {
                  const currentFiles = values.additionalDocuments || [];
                  setValue('additionalDocuments', [...currentFiles, ...acceptedFiles], { shouldValidate: true });
                }}
                onRemove={(file) => {
                  const filtered = values.additionalDocuments.filter((f) => f !== file);
                  setValue('additionalDocuments', filtered, { shouldValidate: true });
                }}
                onRemoveAll={() => setValue('additionalDocuments', [])}
              />
            </Card>

            {/* Task Management Card */}
            <Card sx={{
              p: 3,
              boxShadow: (theme) => `0 0 2px 0 ${alpha(theme.palette.grey[500], 0.2)}, 0 12px 24px -4px ${alpha(theme.palette.grey[500], 0.12)}`,
              borderRadius: 2,
              border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.08)}`
            }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                  <Iconify icon="solar:checklist-minimalistic-bold" width={24} />
                </Box>
                {t('contract.form.taskManagement')}
                <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1.5, fontWeight: 'normal' }}>
                  {t('contract.form.addMultipleTasks')}
                </Typography>
              </Typography>

              {fields.length > 0 && (
                <TableContainer sx={{ mb: 4, borderRadius: 1.5, border: (theme) => `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
                  <Table size="medium">
                    <TableHead sx={{ bgcolor: (theme) => alpha(theme.palette.grey[500], 0.05) }}>
                      <TableRow>
                        <TableCell>{t('contract.form.taskName')}</TableCell>
                        <TableCell>{t('contract.form.category')}</TableCell>
                        <TableCell>{t('contract.form.subCategory')}</TableCell>
                        <TableCell>{t('contract.form.scheduledDate')}</TableCell>
                        <TableCell>{t('contract.form.dueDate')}</TableCell>
                        <TableCell align="center">{t('contract.form.price') || 'Price'}</TableCell>
                        <TableCell align="center">{t('contract.form.subtasks') || 'Subtasks'}</TableCell>
                        <TableCell align="right" />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <AnimatePresence mode="popLayout">
                        {fields.map((item, index) => (
                          <TableRow
                            key={item.id}
                            component={m.tr}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                          >
                            <TableCell sx={{ fontWeight: 'bold' }}>{item.taskName}</TableCell>
                            <TableCell>
                              <Label color="info" variant="soft">{item.taskCategory}</Label>
                            </TableCell>
                            <TableCell>
                              <Label color="default" variant="soft">{item.taskSubCategory}</Label>
                            </TableCell>
                            <TableCell>{item.scheduledDate ? dayjs(item.scheduledDate).format('DD MMM YYYY') : '-'}</TableCell>
                            <TableCell>{item.dueDate ? dayjs(item.dueDate).format('DD MMM YYYY') : '-'}</TableCell>
                            <TableCell align="center">
                              <Typography variant="subtitle2">
                                CHF {(Number(item.taskPrice) || 0).toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Label variant="filled" color="default" sx={{ borderRadius: 1 }}>
                                {item.subTasks?.length || 0}
                              </Label>
                            </TableCell>
                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <IconButton size="small" sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05) }}>
                                  <Iconify icon="solar:pen-bold" width={18} />
                                </IconButton>
                                <IconButton size="small" color="error" sx={{ bgcolor: (theme) => alpha(theme.palette.error.main, 0.05) }} onClick={() => remove(index)}>
                                  <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <Box sx={{ p: 3, borderRadius: 2, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04), border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}` }}>
                <Typography variant="subtitle1" sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
                  <Iconify icon="solar:add-circle-bold" sx={{ mr: 1, color: 'primary.main' }} />
                  {t('contract.form.addTaskToContract')}
                </Typography>

                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label={t('contract.form.taskName')} value={currentTask.taskName} onChange={(e) => setCurrentTask({ ...currentTask, taskName: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      freeSolo
                      options={TASK_CATEGORY_OPTIONS}
                      value={currentTask.taskCategory}
                      onChange={(event, newValue) => {
                        setCurrentTask({ ...currentTask, taskCategory: newValue || '' });
                      }}
                      onInputChange={(event, newInputValue) => {
                        setCurrentTask({ ...currentTask, taskCategory: newInputValue });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label={t('contract.form.category')} fullWidth />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      freeSolo
                      options={TASK_SUB_CATEGORY_OPTIONS}
                      value={currentTask.taskSubCategory}
                      onChange={(event, newValue) => {
                        setCurrentTask({ ...currentTask, taskSubCategory: newValue || '' });
                      }}
                      onInputChange={(event, newInputValue) => {
                        setCurrentTask({ ...currentTask, taskSubCategory: newInputValue });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label={t('contract.form.subCategory')} fullWidth />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DatePicker label={t('contract.form.scheduledDate')} value={currentTask.scheduledDate ? dayjs(currentTask.scheduledDate) : null} onChange={(date) => setCurrentTask({ ...currentTask, scheduledDate: date ? date.toDate() : null })} slotProps={{ textField: { fullWidth: true } }} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DatePicker label={t('contract.form.dueDate')} value={currentTask.dueDate ? dayjs(currentTask.dueDate) : null} onChange={(date) => setCurrentTask({ ...currentTask, dueDate: date ? date.toDate() : null })} slotProps={{ textField: { fullWidth: true } }} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label={t('contract.form.taskDescription')} value={currentTask.description} onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })} />
                  </Grid>

                  <Grid item xs={12}>
                    {!showSubtasks ? (
                      <Button variant="soft" color="primary" fullWidth size="large" onClick={() => setShowSubtasks(true)} sx={{ py: 1.5, border: '1px dashed' }}>
                        {t('contract.form.proceedToSubtasks')}
                      </Button>
                    ) : (
                      <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <Box sx={{ mt: 2, p: 2.5, borderRadius: 2, bgcolor: 'background.paper', border: (theme) => `1px solid ${theme.palette.divider}` }}>
                          <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <Iconify icon="solar:layers-bold" sx={{ mr: 1, color: 'primary.main' }} />
                            {t('contract.form.manageSubTasks')}
                          </Typography>

                          <Stack spacing={2} sx={{ mb: 3 }}>
                            {currentTask.subTasks.map((sub, idx) => (
                              <Box key={idx} sx={{ p: 1.5, borderRadius: 1, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05), display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {sub.subTaskName} <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'normal', ml: 1 }}>({sub.taskDuration} {t(`contract.form.${sub.taskDurationUnit}`)})</Box>
                                </Typography>
                                <IconButton size="small" color="error" onClick={() => {
                                  const updated = currentTask.subTasks.filter((_, i) => i !== idx);
                                  setCurrentTask({ ...currentTask, subTasks: updated });
                                }}>
                                  <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                                </IconButton>
                              </Box>
                            ))}
                          </Stack>

                          <Grid container spacing={2} alignItems="flex-end">
                            <Grid item xs={12} md={4}>
                              <TextField fullWidth size="small" label={t('contract.form.subTaskName')} value={currentSubTask.subTaskName} onChange={(e) => setCurrentSubTask({ ...currentSubTask, subTaskName: e.target.value })} />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField fullWidth size="small" type="number" label={t('contract.form.duration')} value={currentSubTask.taskDuration} onChange={(e) => setCurrentSubTask({ ...currentSubTask, taskDuration: Number(e.target.value) })} />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField select fullWidth size="small" label={t('contract.form.unit')} value={currentSubTask.taskDurationUnit} onChange={(e) => setCurrentSubTask({ ...currentSubTask, taskDurationUnit: e.target.value })}>
                                <MenuItem value="hours">{t('contract.form.hours')}</MenuItem>
                                <MenuItem value="minutes">{t('contract.form.minutes')}</MenuItem>
                                <MenuItem value="days">{t('contract.form.days')}</MenuItem>
                              </TextField>
                            </Grid>
                            {/* <Grid item xs={12} md={4}>
                              <TextField
                                select
                                fullWidth
                                size="small"
                                label={t('contract.form.assignedTo')}
                                SelectProps={{ multiple: true }}
                                value={currentSubTask.assignedTo || []}
                                onChange={(e) => setCurrentSubTask({ ...currentSubTask, assignedTo: e.target.value })}
                              >
                                {employees.map((emp) => (
                                  <MenuItem key={emp.id} value={emp.id}>
                                    {emp.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid> */}
                            {values.billingType !== 'hourly' && (
                              <Grid item xs={12} md={3}>
                                <TextField fullWidth size="small" type="number" label={t('contract.form.subTaskPrice')} value={currentSubTask.subtaskPrice} onChange={(e) => setCurrentSubTask({ ...currentSubTask, subtaskPrice: Number(e.target.value) })} />
                              </Grid>
                            )}
                            <Grid item xs={12}>
                              <TextField fullWidth size="small" multiline rows={2} label={t('contract.form.subTaskDescription')} value={currentSubTask.description} onChange={(e) => setCurrentSubTask({ ...currentSubTask, description: e.target.value })} />
                            </Grid>
                            <Grid item xs={12}>
                              <Button variant="contained" color="primary" onClick={handleAddSubTask} startIcon={<Iconify icon="solar:add-circle-bold" />}>
                                {t('contract.form.add')}
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </m.div>
                    )}
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" size="large" color="primary" onClick={handleAddTask} sx={{ px: 4 }}>
                    {t('contract.form.addTask')}
                  </Button>
                </Box>
              </Box>
            </Card>

            {/* Template Selection Card */}
            <Card sx={{
              p: 3,
              boxShadow: (theme) => `0 0 2px 0 ${alpha(theme.palette.grey[500], 0.2)}, 0 12px 24px -4px ${alpha(theme.palette.grey[500], 0.12)}`,
              borderRadius: 2,
              border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.08)}`
            }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                  <Iconify icon="solar:palette-bold" width={24} />
                </Box>
                {t('contract.form.offerTemplate') || 'Offer Template'}
              </Typography>

              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <Field.Select name="emailTemplateCode" label={t('contract.form.selectTemplate') || 'Select Template'}>
                    <MenuItem value="invoice_v1">Invoice Template 1</MenuItem>
                  </Field.Select>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field.Select
                    name="theme"
                    label={t('contract.form.selectTheme') || 'Select Theme'}
                    disabled={!values.emailTemplateCode}
                  >
                    {selectedTemplate?.previews?.map((prev) => (
                      <MenuItem key={prev.theme} value={prev.theme}>
                        {prev.theme.charAt(0).toUpperCase() + prev.theme.slice(1)}
                      </MenuItem>
                    ))}
                  </Field.Select>
                </Grid>
              </Grid>
            </Card>
          </Stack>
        </Grid>

        {/* Right Sidebar - Sticky Summary */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3} sx={{ position: 'sticky', top: 80 }}>
            {/* Client Logo Card */}
            <Card sx={{
              p: 3,
              textAlign: 'center',
              boxShadow: (theme) => `0 0 2px 0 ${alpha(theme.palette.grey[500], 0.2)}, 0 12px 24px -4px ${alpha(theme.palette.grey[500], 0.12)}`,
              borderRadius: 2,
              border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.08)}`
            }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                  <Iconify icon="solar:camera-add-bold" width={24} />
                </Box>
                {t('contract.form.clientLogo')}
              </Typography>

              <Field.UploadAvatar
                name="client.logo"
                maxSize={3145728}
                onDrop={(acceptedFiles) => {
                  const file = acceptedFiles[0];
                  if (file) {
                    setValue('client.logo', Object.assign(file, { preview: URL.createObjectURL(file) }), { shouldValidate: true });
                  }
                }}
                helperText={
                  <Typography variant="caption" sx={{ mt: 3, mx: 'auto', display: 'block', color: 'text.disabled' }}>
                    {t('contract.form.uploadText')}
                    <br /> {t('contract.form.maxSize')} {fData(3145728)}
                  </Typography>
                }
              />
            </Card>

            {/* Offer Summary Card */}
            <Card sx={{
              p: 3,
              background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              boxShadow: (theme) => `0 0 2px 0 ${alpha(theme.palette.grey[500], 0.2)}, 0 12px 24px -4px ${alpha(theme.palette.grey[500], 0.12)}`,
              borderRadius: 2,
              border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.08)}`
            }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                  <Iconify icon="solar:bill-list-bold" width={24} />
                </Box>
                {t('contract.form.offerDetails')}
              </Typography>

              <Stack spacing={2.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">{t('contract.form.totalSubTask') || 'Total Sub Task'}</Typography>
                  <Label variant="soft" color="info" sx={{ minWidth: 24 }}>{totalSubTasksCount}</Label>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">{t('contract.form.totalTime')}</Typography>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify icon="solar:clock-circle-bold" width={16} sx={{ mr: 0.5, color: 'text.disabled' }} />
                    {totalTime} {t('contract.form.hours')}
                  </Typography>
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box sx={{ p: 2, borderRadius: 1.5, bgcolor: (theme) => alpha(theme.palette.error.main, 0.05) }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="subtitle2" color="error.main">{t('contract.form.totalCost')}</Typography>
                    <Typography variant="h4" color="error.main" sx={{ fontWeight: 800 }}>
                      CHF {totalCost.toFixed(2)}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'right' }}>
                    {t('contract.form.vatExcluded') || '(Excluding VAT/Tax)'}
                  </Typography>
                </Box>

                <LoadingButton
                  fullWidth
                  color="primary"
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  sx={{ boxShadow: (theme) => theme.customShadows.primary, py: 1.5 }}
                >
                  {t('contract.form.createContract')}
                </LoadingButton>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Final Action - only on mobile if summary is far away, but sticky handles most cases */}
      <Box sx={{ mt: 5, mb: 5, display: { xs: 'block', md: 'none' } }}>
        <LoadingButton
          fullWidth
          size="large"
          variant="contained"
          loading={isSubmitting}
          sx={{ py: 2, borderRadius: 2 }}
          type="submit"
        >
          {t('contract.form.createContract')}
        </LoadingButton>
      </Box>
    </Form>
  );
}
