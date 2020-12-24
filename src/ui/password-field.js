import React from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

export const PasswordField = (props) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <TextField
      {...props}
      type={showPassword ? 'text' : 'password'}
      inputProps={{ 'data-testid': 'password-input' }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="Toggle password visibility"
              data-testid="togglePasswordVisibility"
              onClick={(): void =>
                setShowPassword((showPassword) => !showPassword)
              }
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};
