import { Result } from "antd";
import Button from "components/Buttons/Button";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
    const navigate = useNavigate();
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <div>
                    <Button type="dashed" onClick={() => navigate(-1)} title='Back Page' />
                </div>
            }
        />
    );
};

export default PageNotFound;
