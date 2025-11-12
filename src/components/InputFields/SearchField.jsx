import Loading from 'components/Loading';
import { useEffect } from 'react';
import { MdCancel, MdSearch } from 'react-icons/md';
import { useSelector } from 'react-redux';
function SearchField({
  label,
  placeholder,
  onBlur,
  type,
  value,
  id,
  error,
  className = '',
  htmlFor,
  disabled,
  setDebouncedSearch,
  setPageNumber,
  refetch,
  searchLoading,
  setSearchLoading,
  debouncedSearch,
  setSearch,
  search,
  width = 'w-[220px]',
  ...props
}) {
  const { themeMode, colorTheme } = useSelector((state) => state?.states);
  const handleSearchChange = (event) => {
    const inputValue = event.target.value;
    const audio = new Audio('/sounds/key-press.wav');
    audio.play();
    setPageNumber(1);
    setDebouncedSearch(inputValue);
    if (setSearchLoading) setSearchLoading(true);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(debouncedSearch);
      setSearchLoading(false);
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedSearch]);

  return (
    <>
      <div
        className={` flex justify-between items-center rounded-[6px]  border-[1px]  ${className}`}
        style={{
          borderColor: themeMode === 'light' ? '#f0f0f0' : '#353535',
        }}
      >
        <div className=" px-[7px]  flex items-center relative z-0">
          <div>
            <input
              type={type}
              onChange={handleSearchChange}
              placeholder={placeholder}
              value={value}
              onBlur={onBlur}
              className={`h-[33px] ${width} outline-none rounded-[6px] custom-search-input px-[6px] placeholder:text-[12px] !text-[13px] placeholder:pb-4 pb-3`}
              style={{
                backgroundColor: themeMode === 'light' ? '' : '#1F1F1F',
                color: themeMode === 'light' ? '' : '#9F9B93',
              }}
              id={id}
              disabled={disabled}
            />
          </div>
          {!!value && (
            <div
              className={`flex justify-end items-center absolute z-10 -right-[0px] px-[10px] h-[32px] ${
                themeMode === 'light' ? 'bg-[white]' : 'bg-[#1F1F1F]'
              } `}
            >
              <MdCancel
                className="cursor-pointer"
                onClick={() => {
                  setDebouncedSearch('');
                  setSearch('');
                  setPageNumber(1);
                  refetch();
                }}
                style={{
                  color: themeMode === 'light' ? '#A9A3B7' : '#9F9B93',
                }}
              />
            </div>
          )}
        </div>
        <div
          className="flex items-center px-[10px] "
          style={{
            borderLeft:
              themeMode === 'light'
                ? '1px solid #b2b2b2b2'
                : '1px solid #353535',
          }}
        >
          {searchLoading ? (
            <>
              <Loading size="small" />
            </>
          ) : (
            <MdSearch
              className=""
              size={20}
              color={themeMode === 'light' ? '#b2b2b2b2' : '#b5b5b5'}
              // onClick={() => {
              //   setPageNumber(1);
              //   refetch();
              // }}
            />
          )}
        </div>
      </div>
    </>
  );
}
export default SearchField;
