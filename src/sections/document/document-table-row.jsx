import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function DocumentTableRow({ row, selected, onSelectRow }) {
  const theme = useTheme();

  const {
    name,
    userId,
    age,
    gender,
    email,
    mobileNo,
    role,
    joiningDate,
    department,
    documentStatus,
  } = row;

  return (
    <TableRow hover selected={selected} sx={{ borderBottom: `1px dashed ${theme.palette.divider}` }}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap sx={{ fontWeight: '600' }}>
          {name}
        </Typography>
      </TableCell>

      <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
        {userId}
      </TableCell>

      <TableCell sx={{ color: 'text.secondary' }}>
        {age}
      </TableCell>

      <TableCell sx={{ color: 'text.secondary' }}>
        {gender}
      </TableCell>

      <TableCell sx={{ color: 'text.secondary' }}>
        {email}
      </TableCell>

      <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
        {mobileNo}
      </TableCell>

      <TableCell>
        <Label variant="soft" color="warning" sx={{ textTransform: 'capitalize' }}>
          {role}
        </Label>
      </TableCell>

      <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
        {joiningDate}
      </TableCell>

      <TableCell sx={{ color: 'text.secondary' }}>
        {department}
      </TableCell>

      <TableCell>
        <Label variant="filled" color="success" sx={{ textTransform: 'uppercase' }}>
          {documentStatus}
        </Label>
      </TableCell>

      <TableCell align="right">
        <IconButton>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
