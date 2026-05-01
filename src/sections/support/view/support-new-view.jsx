import { z as zod } from 'zod';
import { useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import { DashboardContent } from 'src/layouts/dashboard/main';

import Avatar from '@mui/material/Avatar';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import toast from 'react-hot-toast';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { useCreateTicket, useAssignableUsers } from 'src/features/support/useTickets';

// ----------------------------------------------------------------------

export default function SupportNewView() {
  const { t } = useTranslation();
  const router = useRouter();

  const createTicket = useCreateTicket();
  const { data: usersData } = useAssignableUsers();
  const assignableUsers = usersData?.data || [];

  const NewTicketSchema = zod.object({
    title: zod.string().min(1, t('support.form.validation.titleRequired') || 'Title is required'),
    description: zod.string().min(1, t('support.form.validation.descriptionRequired') || 'Description is required'),
    assignedTo: zod.string().min(1, t('support.form.validation.assignedToRequired') || 'Assigned to is required'),
    ticketFile: zod.array(schemaHelper.file()).optional(),
  });

  const defaultValues = useMemo(
    () => ({
      title: '',
      description: '',
      assignedTo: '',
      ticketFile: [],
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(NewTicketSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('assignedTo', data.assignedTo);
      // category and priority might not be in the current API but good to have if needed
      // formData.append('category', data.category);
      // formData.append('priority', data.priority);

      if (data.ticketFile?.length) {
        data.ticketFile.forEach((file) => {
          formData.append('ticketFile', file);
        });
      }

      await createTicket.mutateAsync(formData);

      reset();
      toast.success(t('support.form.createSuccess') || 'Ticket created successfully!');
      router.push(paths.dashboard.support.list);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Something went wrong');
    }
  });

  return (
    <DashboardContent maxWidth={false}>
      <Box sx={{ width: 1 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>{t('support.title') || 'Supports'}</Typography>
        
        <Breadcrumbs
          separator={
            <Box
              component="span"
              sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
            />
          }
          sx={{ mb: 4 }}
        >
          <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.root)} sx={{ cursor: 'pointer' }}>
            {t('common.dashboard')}
          </Link>
          <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.support.list)} sx={{ cursor: 'pointer' }}>
            {t('nav.support')}
          </Link>
          <Typography color="text.primary">{t('support.add_new')}</Typography>
        </Breadcrumbs>

      <Form methods={methods} onSubmit={onSubmit}>
        <Card sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>{t('support.form.fill_details')}</Typography>
          
          <Stack spacing={3}>
            <Field.Text name="title" label={t('support.form.title_label')} placeholder={t('support.form.title_label')} />


            <Field.Select name="assignedTo" label={t('support.form.assigned_to')}>
              {assignableUsers.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar alt={user.firstName} src={user.profilePic} sx={{ width: 32, height: 32 }} />
                    <Stack>
                      <Typography variant="subtitle2">
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {user.role?.name || 'User'}
                      </Typography>
                    </Stack>
                  </Stack>
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text name="description" label={t('support.form.description_label')} multiline rows={4} />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>{t('support.form.upload_media')}</Typography>
              <Field.Upload
                multiple
                thumbnail
                name="ticketFile"
                maxSize={3145728}
                onDrop={(acceptedFiles) => {
                  const currentFiles = values.ticketFile || [];
                  setValue('ticketFile', [...currentFiles, ...acceptedFiles], { shouldValidate: true });
                }}
                onRemove={(file) => {
                  const filtered = values.ticketFile.filter((f) => f !== file);
                  setValue('ticketFile', filtered, { shouldValidate: true });
                }}
                onRemoveAll={() => setValue('ticketFile', [])}
              />
            </Box>

            <Stack direction="row" justifyContent="flex-end">
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                sx={{ bgcolor: '#00334e', color: 'white', '&:hover': { bgcolor: '#002233' }, px: 4 }}
              >
                {t('support.form.submit')}
              </LoadingButton>
            </Stack>
          </Stack>
        </Card>
      </Form>
    </Box>
    </DashboardContent>
  );
}
