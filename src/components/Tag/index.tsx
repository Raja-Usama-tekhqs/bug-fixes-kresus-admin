import { Tag } from 'antd';

const Index = (
    { color = "", title = '' }:
        { color: string, title: string }
) => {
    return (
        <>
            <Tag className='rounded-[16px] h-[22px] !text-[#002A36] font-semibold px-3 text-[12px] flex justify-center items-center' color={color}>{title}</Tag>
        </>
    );
}

export default Index;
