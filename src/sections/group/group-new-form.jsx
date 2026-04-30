import { useMemo, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Form, Field } from 'src/components/hook-form';
import { groupApi } from 'src/store/api/group.api';
import { useEligibleUsers, useAvailableContracts, useUpdateGroup, useAvailableTasks, useSuggestMembers } from 'src/features/group/useGroups';

// ----------------------------------------------------------------------

export const NewGroupSchema = zod.object({
  groupName: zod.string().min(1, 'group.validation.groupName'),
  groupLeader: zod.string().min(1, 'group.validation.groupLeader'),
  contractList: zod.array(zod.string()).min(1, 'group.validation.contractList'),
  taskIds: zod.array(zod.string()).optional(),
  memberIds: zod.array(zod.string()).optional(),
  description: zod.string().optional(),
});

// ----------------------------------------------------------------------

export function GroupNewForm({ currentGroup, onSuccess }) {
  const { t } = useTranslation();
  const router = useRouter();

  const { data: eligibleUsers } = useEligibleUsers();
  const { data: availableContracts } = useAvailableContracts();
  const { mutateAsync: updateGroup } = useUpdateGroup();

  const defaultValues = useMemo(
    () => ({
      groupName: currentGroup?.groupName || currentGroup?.name || '',
      groupLeader: currentGroup?.groupLeaderId || currentGroup?.groupAdmin?._id || '',
      contractList: currentGroup?.contracts?.map((c) => c.contractId || c._id) || [],
      taskIds: currentGroup?.tasks?.map((t) => t.taskId || t._id) || [],
      memberIds: currentGroup?.members?.map((m) => m._id || m.id) || [],
      description: currentGroup?.description || '',
    }),
    [currentGroup]
  );

  const methods = useForm({
    resolver: zodResolver(NewGroupSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const selectedContracts = watch('contractList');
  const { data: availableTasks } = useAvailableTasks(selectedContracts);
  const { data: suggestMembers } = useSuggestMembers(selectedContracts);

  useEffect(() => {
    if (currentGroup) {
      reset(defaultValues);
    }
  }, [currentGroup, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        name: data.groupName,
        groupAdminId: data.groupLeader,
        contractIds: data.contractList,
        taskIds: data.taskIds || [],
        memberIds: data.memberIds || [],
        description: data.description,
      };

      if (currentGroup) {
        await updateGroup({ id: currentGroup._id, data: payload });
        toast.success(t('group.messages.successUpdate') || 'Group updated successfully!');
      } else {
        await groupApi.createGroup(payload);
        toast.success(t('group.messages.successCreate') || 'Group created successfully!');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(paths.dashboard.group.root);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Error occurred while saving group');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ p: 3 }}>
        {/* <Typography variant="h6" sx={{ mb: 1 }}>
          {t('group.form.info')}
        </Typography> */}

        <Field.Text name="groupName" label={t('group.form.groupName')} />

        <Field.Select name="groupLeader" label={t('group.form.groupLeader')}>
          {eligibleUsers?.map((user) => (
            <MenuItem key={user._id} value={user._id}>
              {`${user.firstName} ${user.lastName}`}
            </MenuItem>
          )) || []}
        </Field.Select>

        {currentGroup && (
          <Field.Text
            name="contractName"
            label={t('group.form.contractName') || 'current Contract Name'}
            disabled
            value={currentGroup?.contracts?.map((c) => c.contractNumber || c.clientName || 'N/A').join(', ')}
          />
        )}

        <Field.MultiSelect
          checkbox
          chip
          name="contractList"
          label={t('group.form.contractList')}
          options={(availableContracts || []).map((contract) => ({
            label: `${contract.contractNumber || 'N/A'} - ${contract.client?.name || 'Unknown Client'}`,
            value: contract._id || contract.id,
          }))}
        />

        <Field.MultiSelect
          checkbox
          chip
          name="taskIds"
          label={t('group.form.taskIds')}
          options={(availableTasks || []).map((task) => ({
            label: task.taskName || task.name,
            value: task._id || task.id,
          }))}
        />

        <Field.MultiSelect
          checkbox
          chip
          name="memberIds"
          label={t('group.form.memberIds')}
          options={(suggestMembers || []).map((member) => ({
            label: `${member.firstName} ${member.lastName}`,
            value: member._id || member.id,
          }))}
        />

        <Field.Text name="description" label={t('group.form.description')} multiline rows={4} />

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{
              bgcolor: '#003b51',
              '&:hover': { bgcolor: '#002636' },
              px: 4,
              py: 1,
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            {currentGroup ? t('group.form.update') : t('group.form.submit')}
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
