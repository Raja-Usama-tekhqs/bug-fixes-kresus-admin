import { useSelector } from 'react-redux';

const LabelGrid = ({ children, label, style, className }) => {
  const { themeMode, colorTheme } = useSelector((state) => state?.states);
  return (
    <>
      <div className=" relative my-[20px]">
        <div
          className="  px-3 py-1 absolute top-0 left-[10px] transform -translate-y-1/2 font-med text-[10px]"
          style={{
            backgroundColor: themeMode === 'light' ? 'white' : '#1F1F1F',
            color: themeMode === 'light' ? colorTheme : '#9FA8DA',
          }}
        >
          {label}
        </div>
        <div
          className={`${className}`}
          style={{
            border:
              themeMode === 'light' ? '1px solid #f0f0f0' : '1px solid #9FA8DA',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default LabelGrid;
