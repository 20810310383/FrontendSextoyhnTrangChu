import { useNavigate } from "react-router-dom";
import { Button, Result } from 'antd';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <>
            <Result
                status="404"
                title="Xin chào! Không tìm thấy trang."
                subTitle="Quay lại trang chủ để tìm kiếm sản phẩm bạn cần."
                extra={<Button type="primary"
                    onClick={() => navigate('/')}
                >Quay lại trang chủ</Button>}
            />
        </>
    )
}

export default NotFound;
