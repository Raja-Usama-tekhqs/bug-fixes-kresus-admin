

const Index = ({
    mainHeader,
    subHeader,
    button,
    tag
}:
    {
        mainHeader?: string;
        subHeader?: string
        button?: JSX.Element;
        tag?: JSX.Element;
    }) => {
    return (
        <><div className='flex justify-between items-center min-h-[83px] px-3'>
            <div>
                <div>
                    <div className='text-[18px] font-semibold flex gap-3'>
                        <span>{mainHeader}</span>
                        <span>{tag}</span>
                    </div>

                    <div className='text-[14px]'>{subHeader}</div>
                </div>
            </div>
            <div>
                {button}
            </div>
        </div></>
    );
}

export default Index;
