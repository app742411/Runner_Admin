import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export function RHFCodeField({ name }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <TextField
            {...field}
            value={field.value || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              field.onChange(value.slice(0, 6));
            }}
            placeholder="------"
            inputProps={{
              maxLength: 6,
              style: {
                letterSpacing: '10px',
                textAlign: 'center',
                fontSize: '20px',
              },
            }}
            error={!!error}
            helperText={error?.message}
            fullWidth
          />
        </Stack>
      )}
    />
  );
}
