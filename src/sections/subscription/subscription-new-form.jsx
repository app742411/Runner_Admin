import { z as zod } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';

import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import toast from 'react-hot-toast';

import { planApi } from 'src/store/api/plan.api';

// ----------------------------------------------------------------------

export const NewPlanSchema = (t) => zod.object({
  planName: zod.string().min(1, { message: t('subscription.form.nameRequired') || 'Plan name is required' }),
  description: zod.string().min(1, { message: t('subscription.form.descRequired') || 'Description is required' }),
  monthlyFees: zod.union([zod.string(), zod.number()]),
  annualFees: zod.union([zod.string(), zod.number()]),
  employeeLimit: zod.coerce.number().min(1, { message: t('subscription.form.limitRequired') || 'Employee limit is required' }),
  sequence: zod.coerce.number().min(1, { message: t('subscription.form.seqRequired') || 'Sequence is required' }),
  planStatus: zod.string().min(1, { message: t('subscription.form.statusRequired') || 'Status is required' }),
  planFeatures: zod.array(
    zod.object({
      value: zod.string().min(1, { message: t('subscription.form.featureEmpty') || 'Feature cannot be empty' }),
    })
  ).min(1, { message: t('subscription.form.featureRequired') || 'At least one feature is required' }),
});

// ----------------------------------------------------------------------

export function SubscriptionNewForm() {
  const { t } = useTranslation();
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      planName: '',
      description: '',
      monthlyFees: '',
      annualFees: '',
      employeeLimit: 1,
      sequence: 1,
      planStatus: 'active',
      planFeatures: [{ value: '' }],
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(NewPlanSchema(t)),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'planFeatures',
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Map features array of objects back to flat string array for the payload
      const payload = {
        ...data,
        monthlyFees: String(data.monthlyFees),
        annualFees: String(data.annualFees),
        planFeatures: data.planFeatures.map((f) => f.value),
      };

      await planApi.createPlan(payload);
      
      reset();
      toast.success(t('subscription.form.createSuccess') || 'Subscription plan created successfully!');
      router.push(paths.dashboard.subscription.list);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || t('subscription.form.createError') || 'Failed to create plan!');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>{t('subscription.planInfo')}</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Field.Text name="planName" label={t('subscription.form.name')} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Field.Text name="monthlyFees" label={t('subscription.form.monthlyFees')} type="number" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Field.Text name="annualFees" label={t('subscription.form.annualFees')} type="number" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Field.Select name="planStatus" label={t('subscription.form.status')}>
               <MenuItem value="active">{t('subscription.status.active')}</MenuItem>
               <MenuItem value="inactive">{t('subscription.status.inactive')}</MenuItem>
            </Field.Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <Field.Text name="employeeLimit" label={t('subscription.form.employeeLimit')} type="number" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Field.Text name="sequence" label={t('subscription.form.sequence')} type="number" />
          </Grid>

          <Grid item xs={12}>
            <Field.Text 
               name="description" 
               label={t('subscription.form.description')} 
               multiline 
               rows={4} 
             />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 5, mb: 3 }}>{t('subscription.planFeatures')}</Typography>
        
        <Stack spacing={2}>
          {fields.map((item, index) => (
            <Stack key={item.id} direction="row" alignItems="center" spacing={2}>
               <Field.Text
                 name={`planFeatures[${index}].value`}
                 label={`${t('subscription.table.features')} ${String(index + 1).padStart(2, '0')}`}
                 fullWidth
               />
               <IconButton 
                 color="error" 
                 onClick={() => remove(index)}
                 sx={{ width: 48, height: 48 }}
               >
                  <Iconify icon="solar:trash-bin-trash-bold" />
               </IconButton>
            </Stack>
          ))}
        </Stack>

        <Button
           size="small"
           color="primary"
           startIcon={<Iconify icon="mingcute:add-circle-fill" />}
           onClick={() => append({ value: '' })}
           sx={{ mt: 2, fontWeight: 'bold' }}
        >
          {t('subscription.addFeatures')}
        </Button>

        <Box sx={{ mt: 4 }}>
          <LoadingButton 
             type="submit" 
             variant="contained" 
             loading={isSubmitting}
             sx={{ bgcolor: '#003b51', '&:hover': { bgcolor: '#002636' }, color: 'white', px: 4, py: 1.5 }}
          >
            {t('subscription.submitPlan')}
          </LoadingButton>
        </Box>
      </Card>
    </Form>
  );
}
