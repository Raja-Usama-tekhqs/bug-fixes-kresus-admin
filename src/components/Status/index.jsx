import { Tag } from 'antd';
import { useSelector } from 'react-redux';

const Status = ({ tag, className = 'py-[1px] px-[16px] text-[11px]' }) => {
  const { themeMode } = useSelector((state) => state?.states);

  const getColor = (tagValue) => {
    switch (tagValue) {
      case true:
      case 'Active':
        return {
          color: '#389e0d',
          background: '#f6ffed',
          borderColor: '#b7eb8f',
        };
      case false:
      case 'InActive':
        return {
          color: '#d4380d',
          background: '#fff2e8',
          borderColor: '#ffbb96',
        };
      case 'Suspended':
        return {
          color: '#d46b08',
          background: '#fff7e6',
          borderColor: '#ffd591',
        };
      case 'Pending':
        return {
          color: '#08979c',
          background: '#e6fffb',
          borderColor: '#87e8de',
        };
      case 'Completed':
        return {
          color: '#7cb305',
          background: '#fcffe6',
          borderColor: '#eaff8f',
        };
      case 'Delayed':
        return {
          color: '#cf1322',
          background: '#fff1f0',
          borderColor: '#ffa39e',
        };
      case 'Assigned':
        return {
          color: '#7cb305',
          background: '#fcffe6',
          borderColor: '#eaff8f',
        };
      case 'UnAssigned':
        return {
          color: '#d46b08',
          background: '#fff7e6',
          borderColor: '#ffd591',
        };
      case 'In-Transit':
        return {
          color: '#d46b08',
          background: '#fff7e6',
          borderColor: '#ffd591',
        };
      case 'Cancel':
        return {
          color: '#cf1322',
          background: '#fff1f0',
          borderColor: '#ffa39e',
        };
      default:
        return 'default';
    }
  };

  const displayTag = tag === true ? 'Active' : tag === false ? 'InActive' : tag;

  const color = getColor(displayTag);

  return (
    <Tag
      key={displayTag}
      className={className}
      style={{
        color: themeMode === 'dark' ? color.color : color.color,
        background: themeMode === 'dark' ? '#242925' : color.background,
        borderColor: color.borderColor,
        fontWeight: '600',
      }}
    >
      {displayTag}
    </Tag>
  );
};

export default Status;
