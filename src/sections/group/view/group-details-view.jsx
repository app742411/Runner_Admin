import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Unstable_Grid2';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { toast } from 'react-hot-toast';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useTranslation } from 'react-i18next';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useSelector } from 'react-redux';
import { ROLES } from 'src/config/roles';
import {
  useGroup,
  useGroupFullDetails,
  useAddGroupMember,
  useRemoveGroupMember,
  useSuggestMembers,
  useChangeGroupAdmin,
  useEligibleUsers,
  useGroupMembersForAssign
} from 'src/features/group/useGroups';
import { useAssignUsers, useRemoveUsers } from 'src/features/task/useTasks';
import { fCurrency } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function GroupDetailsView({ id }) {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);

  const isGroupAdmin = user?.role === ROLES.GROUP_ADMIN;
  const isCompanyAdmin = user?.role === ROLES.COMPANY_ADMIN || user?.role === ROLES.SUPER_ADMIN;

  const companyAdminQuery = useGroup(id, { enabled: isCompanyAdmin && !!id });
  const groupAdminQuery = useGroupFullDetails(id, { enabled: isGroupAdmin && !!id });

  const { data: groupData, isLoading, error } = isGroupAdmin ? groupAdminQuery : companyAdminQuery;

  const [openAddMember, setOpenAddMember] = useState(false);
  const [selectedNewMembers, setSelectedNewMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const { mutateAsync: addMember } = useAddGroupMember();
  const { mutateAsync: removeMember } = useRemoveGroupMember();
  const { data: suggestedMembers } = useSuggestMembers(
    (isCompanyAdmin && (groupData?.contract?._id || groupData?.contract?.id)) ? (groupData?.contract?._id || groupData?.contract?.id) : null,
    { enabled: isCompanyAdmin && !!(groupData?.contract?._id || groupData?.contract?.id) }
  );

  const [openChangeAdmin, setOpenChangeAdmin] = useState(false);
  const [selectedNewAdmin, setSelectedNewAdmin] = useState(null);
  const { data: eligibleUsers } = useEligibleUsers({ enabled: isCompanyAdmin });
  const { mutateAsync: changeAdmin } = useChangeGroupAdmin();

  // Subtask Assignment
  const [openAssign, setOpenAssign] = useState(false);
  const [selectedSubTask, setSelectedSubTask] = useState(null);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const { data: assignableMembers } = useGroupMembersForAssign((isGroupAdmin || isCompanyAdmin) ? id : null);
  const { mutateAsync: assignUsers } = useAssignUsers();
  const { mutateAsync: removeUsers } = useRemoveUsers();

  const handleAddMember = async () => {
    if (!selectedNewMembers.length) return;
    try {
      const userIds = selectedNewMembers.map((member) => member._id);

      await addMember({ groupId: id, userIds });

      toast.success(t('group.messages.membersAdded') || 'Members added successfully');
      setOpenAddMember(false);
      setSelectedNewMembers([]);
    } catch (err) {
      toast.error(err.message || 'Error adding members');
    }
  };

  const handleRemoveMembers = async (userIds) => {
    const isBulk = userIds.length > 1;
    const message = isBulk
      ? (t('group.messages.confirmRemoveMembers') || `Are you sure you want to remove ${userIds.length} members?`)
      : (t('group.messages.confirmRemoveMember') || 'Are you sure you want to remove this member?');

    if (!window.confirm(message)) return;

    try {
      await removeMember({ groupId: id, userIds });
      toast.success(isBulk ? (t('group.messages.membersRemoved')) : (t('group.messages.memberRemoved')));
      if (isBulk) setSelectedMembers([]);
    } catch (err) {
      toast.error(err.message || 'Error removing members');
    }
  };

  const handleChangeAdmin = async () => {
    if (!selectedNewAdmin) return;
    try {
      await changeAdmin({ groupId: id, newAdminId: selectedNewAdmin._id });
      toast.success(t('group.messages.adminChanged') || 'Group admin changed successfully');
      setOpenChangeAdmin(false);
      setSelectedNewAdmin(null);
    } catch (err) {
      toast.error(err.message || 'Error changing admin');
    }
  };

  const handleOpenAssign = (subTask) => {
    setSelectedSubTask(subTask);
    // Find initial selected assignees if any (mapping names back to member objects or just IDs if available)
    // The subTask.assignedTo usually contains names, but we need IDs for the API.
    // For now, start empty or match by name if members list is available.
    setSelectedAssignees([]);
    setOpenAssign(true);
  };

  const handleAssignSubTask = async () => {
    if (!selectedSubTask || !selectedAssignees.length) return;
    try {
      const userIds = selectedAssignees.map((m) => m._id);
      await assignUsers({
        subTaskId: selectedSubTask._id,
        data: { userIds },
        taskId: task?._id // For invalidation
      });
      toast.success(t('task.messages.assigned') || 'Members assigned successfully');
      setOpenAssign(false);
      setSelectedAssignees([]);
    } catch (err) {
      toast.error(err.message || 'Error assigning members');
    }
  };

  const handleRemoveUser = async (subTaskId, userId) => {
    if (!window.confirm(t('task.messages.confirmRemove') || 'Are you sure you want to remove this user?')) return;
    try {
      await removeUsers({ subTaskId, userIds: [userId], taskId: task?._id });
      toast.success(t('task.messages.removed') || 'Member removed successfully');
    } catch (err) {
      toast.error(err.message || 'Error removing member');
    }
  };

  const handleOpenChat = async () => {
    try {
      const res = await axios.post(endpoints.chat.init, {
        type: 'group',
        groupId: id,
      });
      const chatId = res.data?.data?._id || res.data?._id;
      if (chatId) {
        router.push(`${paths.dashboard.chat}?id=${chatId}&type=group`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to initiate chat');
    }
  };

  if (isLoading) {
    return (
      <DashboardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </DashboardContent>
    );
  }

  if (error || !groupData) {
    return (
      <DashboardContent>
        <Typography variant="h6" color="error">{t('group.details.errorLoad')}</Typography>
      </DashboardContent>
    );
  }

  const {
    name,
    description,
    task,
    contract,
    groupAdmin,
    totalMembers,
    members = [],
    subTasks = [],
  } = groupData;

  const adminName = groupAdmin ? `${groupAdmin.firstName} ${groupAdmin.lastName}` : t('group.details.na');

  return (
    <DashboardContent maxWidth={false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: { xs: 3, md: 5 } }}>
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{t('group.details.title')}</Typography>
          <Breadcrumbs
            separator={<Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />}
          >
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.root)} sx={{ cursor: 'pointer' }}>
              {t('common.dashboard')}
            </Link>
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.group.root)} sx={{ cursor: 'pointer' }}>
              {t('group.title')}
            </Link>
            <Typography color="text.disabled">{name || t('group.details.details')}</Typography>
          </Breadcrumbs>
        </Stack>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="solar:chat-round-line-bold" />}
          onClick={handleOpenChat}
          sx={{ borderRadius: 2 }}
        >
          {t('group.details.openChat', { defaultValue: 'Open Chat' })}
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Top Summary Stats */}
        <Grid xs={12}>
          <Card sx={{ p: 3, bgcolor: 'background.neutral' }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>
                <Avatar alt={name} src={groupAdmin?.avatarUrl} sx={{ width: 64, height: 64, border: (theme) => `solid 2px ${theme.palette.primary.main}` }} />
                <Box>
                  <Typography variant="h5">{name}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{description || t('group.details.noDescription')}</Typography>
                </Box>
              </Stack>

              <Stack spacing={0.5} sx={{ minWidth: 160 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>{t('group.details.leader')}</Typography>
                  {isCompanyAdmin && (
                    <IconButton size="small" onClick={() => setOpenChangeAdmin(true)} sx={{ p: 0.5 }}>
                      <Iconify icon="solar:pen-bold" width={14} />
                    </IconButton>
                  )}
                </Stack>
                <Typography variant="subtitle2">{adminName}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{groupAdmin?.email}</Typography>
              </Stack>

              <Stack spacing={0.5} sx={{ minWidth: 120 }}>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>{t('group.details.totalMembers')}</Typography>
                <Typography variant="h6">{totalMembers}</Typography>
              </Stack>

              <Stack spacing={0.5} sx={{ minWidth: 120 }}>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>{t('task.table.status')}</Typography>
                <Chip
                  label={task?.status || 'N/A'}
                  color={task?.status === 'completed' ? 'success' : task?.status === 'pending' ? 'warning' : 'default'}
                  variant="soft"
                  size="small"
                />
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {/* Contract & Task Row */}
        <Grid xs={12} md={6}>
          <Card sx={{ height: 1 }}>
            <CardHeader title={t('group.details.contractInfo')} sx={{ mb: 1 }} />
            <Divider />
            <Stack spacing={2} sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t('dashboard.table.contractNumber')}</Typography>
                <Typography variant="subtitle2">{contract?.contractNumber}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t('client.table.name')}</Typography>
                <Typography variant="subtitle2">{contract?.clientName}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t('task.details.propertyName')}</Typography>
                <Typography variant="subtitle2">{contract?.propertyName}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t('dashboard.table.totalCost')}</Typography>
                <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>{fCurrency(contract?.totalCost)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t('dashboard.table.contractStatus')}</Typography>
                <Chip label={contract?.status} size="small" variant="soft" color={contract?.status === 'active' ? 'success' : 'default'} />
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card sx={{ height: 1 }}>
            <CardHeader title={t('group.details.taskInfo')} sx={{ mb: 1 }} />
            <Divider />
            <Stack spacing={2} sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t('task.table.taskName')}</Typography>
                <Typography variant="subtitle2">{task?.taskName}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t('task.table.category')}</Typography>
                <Typography variant="subtitle2">{task?.taskCategory}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t('task.table.workPrice')}</Typography>
                <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>{fCurrency(task?.taskPrice)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t('task.table.status')}</Typography>
                <Chip label={task?.status} size="small" variant="soft" color={task?.status === 'completed' ? 'success' : 'warning'} />
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {/* Members Full Width */}
        <Grid xs={12}>
          <Card>
            <CardHeader
              title={t('group.details.members')}
              subheader={`${members.length} ${t('group.table.members')}`}
              action={
                <Stack direction="row" spacing={1} alignItems="center">
                  {selectedMembers.length > 0 && isCompanyAdmin && (
                    <Button
                      variant="soft"
                      color="error"
                      startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                      onClick={() => handleRemoveMembers(selectedMembers)}
                    >
                      {t('common.delete')} ({selectedMembers.length})
                    </Button>
                  )}
                  {isCompanyAdmin && (
                    <Button
                      variant="contained"
                      startIcon={<Iconify icon="mingcute:add-line" />}
                      onClick={() => setOpenAddMember(true)}
                    >
                      {t('group.details.addMember') || 'Add Member'}
                    </Button>
                  )}
                </Stack>
              }
            />
            <TableContainer component={Scrollbar} sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {isCompanyAdmin && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selectedMembers.length > 0 && selectedMembers.length < members.length}
                          checked={members.length > 0 && selectedMembers.length === members.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMembers(members.map((m) => m._id));
                            } else {
                              setSelectedMembers([]);
                            }
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell>{t('employee.table.name')}</TableCell>
                    <TableCell>{t('employee.form.email')}</TableCell>
                    <TableCell align="center">{t('company.list.role')}</TableCell>
                    {isCompanyAdmin && <TableCell align="right">{t('group.table.action')}</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member._id} hover selected={selectedMembers.includes(member._id)}>
                      {isCompanyAdmin && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedMembers.includes(member._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMembers([...selectedMembers, member._id]);
                              } else {
                                setSelectedMembers(selectedMembers.filter((id) => id !== member._id));
                              }
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar alt={member.firstName} sx={{ width: 40, height: 40, bgcolor: 'primary.lighter', color: 'primary.dark' }}>
                            {member.firstName.charAt(0)}
                          </Avatar>
                          <Typography variant="subtitle2">{`${member.firstName} ${member.lastName}`}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={member.role.replace('_', ' ')}
                          size="small"
                          variant="soft"
                          color={member.role === 'GROUP_ADMIN' ? 'primary' : 'info'}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      {isCompanyAdmin && (
                        <TableCell align="right">
                          <IconButton onClick={() => handleRemoveMembers([member._id])} color="error">
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Subtasks Full Width */}
        <Grid xs={12}>
          <Card>
            <CardHeader title={t('group.details.subTasks')} />
            <TableContainer component={Scrollbar}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('task.table.subTaskName')}</TableCell>
                    <TableCell align="center">{t('task.table.status')}</TableCell>
                    <TableCell>{t('task.table.assignedTo')}</TableCell>
                    {(isGroupAdmin || isCompanyAdmin) && <TableCell align="right">{t('group.table.action')}</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subTasks.map((subTask) => (
                    <TableRow key={subTask._id} hover>
                      <TableCell>
                        <Typography variant="subtitle2">{subTask.subTaskName}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={subTask.status}
                          size="small"
                          variant="soft"
                          color={subTask.status === 'completed' ? 'success' : 'warning'}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {subTask.assignedTo?.length > 0 ? (
                            subTask.assignedTo.map((assignee, idx) => {
                              let label = '';
                              if (typeof assignee === 'object') {
                                if (assignee.firstName || assignee.lastName) {
                                  label = `${assignee.firstName || ''} ${assignee.lastName || ''}`.trim();
                                } else {
                                  label = assignee.name || '';
                                }
                              } else {
                                label = assignee;
                              }
                              return (
                                <Chip
                                  key={idx}
                                  label={label}
                                  size="small"
                                  variant="outlined"
                                  onDelete={(isGroupAdmin || isCompanyAdmin) ? () => handleRemoveUser(subTask._id, assignee._id || assignee) : undefined}
                                  sx={{ mb: 0.5 }}
                                />
                              );
                            })
                          ) : (
                            <Typography variant="body2" sx={{ color: 'text.disabled' }}>{t('group.details.none')}</Typography>
                          )}
                        </Stack>
                      </TableCell>
                      {(isGroupAdmin || isCompanyAdmin) && (
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="soft"
                            onClick={() => handleOpenAssign(subTask)}
                            startIcon={<Iconify icon="solar:user-plus-bold" />}
                          >
                            {t('task.table.assign') || 'Assign'}
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  {subTasks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={(isGroupAdmin || isCompanyAdmin) ? 4 : 3} sx={{ textAlign: 'center', py: 6 }}>
                        <Iconify icon="solar:clipboard-list-broken" width={48} sx={{ mb: 2, color: 'text.disabled' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t('group.details.noTasks')}</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Add Member Dialog */}
      <Dialog open={openAddMember} onClose={() => setOpenAddMember(false)} fullWidth maxWidth="xs">
        <DialogTitle>{t('group.details.addMember') || 'Add New Member'}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            {t('group.details.selectMemberDesc') || 'Select a user from the suggested list based on the contract.'}
          </Typography>
          <Autocomplete
            multiple
            options={(suggestedMembers || []).filter(
              (m) => !members.some((existing) => existing._id === m._id)
            )}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.email})`}
            value={selectedNewMembers}
            onChange={(event, newValue) => setSelectedNewMembers(newValue)}
            renderInput={(params) => (
              <TextField {...params} label={t('group.form.memberIds')} variant="outlined" fullWidth />
            )}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddMember(false)} color="inherit">
            {t('common.cancel') || 'Cancel'}
          </Button>
          <Button onClick={handleAddMember} variant="contained" disabled={!selectedNewMembers.length}>
            {t('common.add') || 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Admin Dialog */}
      <Dialog open={openChangeAdmin} onClose={() => setOpenChangeAdmin(false)} fullWidth maxWidth="xs">
        <DialogTitle>{t('group.details.changeLeader') || 'Change Group Leader'}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            {t('group.details.changeLeaderDesc') || 'Select a new leader for this group. This person must be an eligible employee.'}
          </Typography>
          <Autocomplete
            options={eligibleUsers || []}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.email})`}
            value={selectedNewAdmin}
            onChange={(event, newValue) => setSelectedNewAdmin(newValue)}
            renderInput={(params) => (
              <TextField {...params} label={t('group.form.groupLeader')} variant="outlined" fullWidth />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangeAdmin(false)} color="inherit">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleChangeAdmin} variant="contained" disabled={!selectedNewAdmin}>
            {t('common.update')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Member to Subtask Dialog */}
      <Dialog open={openAssign} onClose={() => setOpenAssign(false)} fullWidth maxWidth="xs">
        <DialogTitle>
          {t('task.table.assign') || 'Assign Members'}
          <Typography variant="caption" display="block" color="text.secondary">
            {selectedSubTask?.subTaskName}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            {t('task.details.assignDesc') || 'Select members from this group to assign to this subtask.'}
          </Typography>
          <Autocomplete
            multiple
            options={assignableMembers?.members || []}
            getOptionLabel={(option) => `${option.name} (${option.email})`}
            value={selectedAssignees}
            onChange={(event, newValue) => setSelectedAssignees(newValue)}
            renderInput={(params) => (
              <TextField {...params} label={t('group.details.members')} variant="outlined" fullWidth />
            )}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssign(false)} color="inherit">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleAssignSubTask} variant="contained" disabled={!selectedAssignees.length}>
            {t('common.assign') || 'Assign'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
