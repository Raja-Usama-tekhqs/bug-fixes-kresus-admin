import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from 'antd';
export default function LanguageSelect() {
  const { i18n } = useTranslation();

  const onChange = (lng) => {
    i18n.changeLanguage(lng);
    window.location.reload();
  };
  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n.language]);
  return (
    <Select
      showSearch
      placeholder="Select a person"
      optionFilterProp="label"
      className="w-full text-left !border-[#d9d9d9] border-[1px] rounded-[5px]"
      onChange={onChange}
      options={[
        { value: 'en', label: 'English' },
        { value: 'de', label: 'German' },
        // { value: 'ar', label: 'Arabic' },
      ]}
      value={i18n.language}
    />
  );
}
