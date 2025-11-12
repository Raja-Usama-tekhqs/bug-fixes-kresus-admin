import React from 'react';
import { Typography } from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import { useSelector } from 'react-redux';
import { themeInputColor } from 'utils/constant';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const PhoneInput = ({
  label,
  name,
  error,
  value,
  onChange,
  isModel,
  onBlur,
  errorMessage,
  disabled,
  ...rest
}) => {
  const { themeMode } = useSelector((state) => state?.states);
  const theme = createTheme({
    components: {
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: themeMode === 'light' ? '' : '#121212',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: themeMode === 'light' ? '' : '#9f9b93',
            '&:hover': {
              backgroundColor: themeMode === 'light' ? '' : '#555',
            },
            '&.Mui-selected': {
              backgroundColor: themeMode === 'light' ? '' : '#1F1F1F',
              color: themeMode === 'light' ? '' : '#9FA8DA',
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="mt-[10px]">
        <MuiTelInput
          label={
            <span
              style={{
                color:
                  themeMode === 'light' && !error
                    ? themeInputColor.lightTextColor
                    : themeMode === 'dark' && !error
                    ? '#97938C'
                    : '#ff4d4f',
                fontWeight: '400px',
                background:
                  themeMode === 'light' && isModel
                    ? '#F7F7FA'
                    : themeMode === 'light' && !isModel
                    ? '#FFFFFF'
                    : '#000000',
                fontSize: '12px',
                padding: '5px',
              }}
            >
              {label}
            </span>
          }
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          size="small"
          fullWidth
          variant="outlined"
          defaultCountry="pk"
          InputProps={{
            style: {
              color:
                themeMode === 'light' && !error
                  ? 'black'
                  : themeMode === 'dark' && !error
                  ? '#97938C'
                  : '#ff4d4f',
              background:
                themeMode === 'light' && isModel
                  ? '#F7F7FA'
                  : themeMode === 'light' && !isModel
                  ? '#FFFFFF'
                  : '#000000',
              height: '30px',
              fontSize: '12px',
              fontWeight: '400px',
              border: '1px solid',
              borderColor:
                themeMode === 'light' && !error
                  ? '#d9d9d9'
                  : themeMode === 'dark' && !error
                  ? '#353535'
                  : '#ff4d4f',
            },
          }}
          helperText={
            <Typography
              sx={{
                color: error ? '#ff4d4f' : '#113D4E',
                fontSize: '10px',
                fontWeight: '200px',
                marginLeft: '-12px',
                marginTop:'-3px',
                position: 'absolute',
              }}
            >
              {errorMessage}
            </Typography>
          }
          sx={{
            '& .MuiOutlinedInput-root': {
              '& .MuiOutlinedInput-notchedOutline': {
                border: '0px solid',
                borderColor:
                  themeMode === 'light' && !error
                    ? '#d9d9d9'
                    : themeMode === 'dark' && !error
                    ? '#353535'
                    : '#ff4d4f',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: '0px solid',
                borderColor:
                  themeMode === 'light' && !error
                    ? '#d9d9d9'
                    : themeMode === 'dark' && !error
                    ? '#353535'
                    : '#ff4d4f',
                boxShadow: 'none',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: '0px solid',
                borderColor:
                  themeMode === 'light' && !error
                    ? '#d9d9d9'
                    : themeMode === 'dark' && !error
                    ? '#353535'
                    : '#ff4d4f',
                boxShadow: 'none',
              },
              '& .MuiOutlinedInput-input': {
                '&:focus': {
                  outline: 'none',
                },
              },
              '& .MuiTelInput-Flag': {
                height: '15px',
                width: '15px',
              },
              '& .MuiTelInput-Typography-calling-code': {
                color: 'blue',
              },
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
};

export default PhoneInput;
