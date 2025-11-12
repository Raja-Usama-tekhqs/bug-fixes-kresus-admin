import { Input } from 'antd';
import { useSelector } from 'react-redux';
import { themeInputColor } from 'utils/constant';
const { TextArea: TextAreaField } = Input;

const TextArea = ({
  id,
  label,
  type,
  name,
  value,
  rows,
  disabled,
  onChange,
  onBlur,
  placeholder,
  required,
  error,
  errorMessage,
  ...rest
}) => {
  const { themeMode } = useSelector((state) => state?.states);
  const text = `${placeholder} ${required ? '*' : ''}`;
  return (
    <>
      <div>
        {label && (
          <label
            className={` text-[14px] font-med `}
            style={{
              color: themeMode === 'light' ? '#000000' : '#9F9B93',
            }}
          >
            {label}
          </label>
        )}
        <div>
          <TextAreaField
            id={id}
            type={type}
            name={name}
            value={value}
            placeholder={`${placeholder} ${required ? '*' : ''}`}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            style={{
              backgroundColor: 'transparent',
              border: error
                ? `1px solid ${themeInputColor.errorBorderColor}`
                : themeMode === 'light'
                ? `1px solid ${themeInputColor.lightBorderColor}`
                : `1px solid ${themeInputColor.darkBorderColor}`,
              borderRadius: '5px',
              // caretColor: themeMode === 'light' ? colorTheme : '#9F9B93',
              color: themeMode === 'light' ? 'black' : '#9F9B93',
              // fontFamily: 'inter-med',
              boxShadow: 'none',
            }}
            className={`${
              error
                ? 'error-placeholder-text-area'
                : 'normal-placeholder-text-area'
            }`}
            status={`${error && 'error'}`}
            rows={rows}
            {...rest}
          />
        </div>
        {error ? (
          <span className="text-error text-sm absolute">{errorMessage}</span>
        ) : null}
      </div>
      <style jsx>{`
        .error-placeholder-text-area::placeholder {
          color: #ff4d4f;
        }

        .normal-placeholder-text-area::placeholder {
          color: ${themeMode === 'light' ? '' : '#9F9B93'};
        }
      `}</style>
    </>
  );
};

export default TextArea;
