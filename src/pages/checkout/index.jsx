import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  InputNumber,
  Button,
  Form,
  Input,
  Typography,
  Divider,
  List,
  Image,
  Space,
  Radio,
  message,
  Table,
  Modal,
  notification,
  Tabs,
} from 'antd';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { FaCartArrowDown } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { removeFromCart } from '../../services/cartAPI';
import { findOneOrderById, orderDH } from '../../services/orderAPI';
import { useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;
const { TabPane } = Tabs;


const CheckoutPage = () => {
    const [form] = Form.useForm();
    const { cart, fetchCart, updateItemQuantity } = useCart();
    const cartId = localStorage.getItem('cartId')?.trim();;
    const [loading, setLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('cod'); // Trạng thái mặc định là thanh toán online
    const [mangaunhien, setmangaunhien] = useState('')
    const [soTienCanTT, setsoTienCanTT] = useState(0)
    const [openModal, setOpenModal] = useState(false)
    const [idDH, setIdDH] = useState(null)
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState(false);

    const cartItems = cart?.products.map((item, index) => ({
        _idSP: item?._idSP?._id,       
        price: item?.price,     
        priceGoc: item?.priceGoc,     
        quantity: item?.quantity,     
        Image: item?._idSP?.Image,     
        TenSP: item?._idSP?.TenSP,     
    }));
    
    const handlePaymentChange = (e) => {
        console.log("Payment method changed:", e.target.value);
        setPaymentMethod(e.target.value); // Cập nhật trạng thái khi người dùng thay đổi lựa chọn thanh toán
    };

    const handleRemoveItem = async (_idSP) => {
        try {
            await removeFromCart(cartId, _idSP);
            await fetchCart()
            message.success('Xóa sản phẩm khỏi giỏ hàng thành công!')
        } catch (err) {
            console.error("Xoá sản phẩm thất bại", err);
        }
    };

    const handleUpdateQuantity = (idSP, newQuantity) => {
        updateItemQuantity(idSP, newQuantity);
    };

    const totalQuantity = cart?.products?.reduce((sum, item) => sum + item.quantity, 0);
    console.log("totalQuantity: ", totalQuantity);
    const handleDatHang = async (values) => {

        const orderData = {
            lastName: values.lastName,
            firstName: values.firstName,
            email: values.email,
            address: values.address,
            phone: values.phone,
            note: values.note,
            products: cart?.products?.map((item, index) => ({
                _idSP: item?._idSP?._id,
                price: item?.price,    
                quantity: item?.quantity           
            })),                       
            soTienGiamGia: cart.soPhanTramGiam || 0, 
            giamGia: cart.soPhanTramGiam || 0, 
            soTienCanThanhToan: cart?.soTienCanThanhToan, 
            thanhTien: cart?.tongTienChuaGiam, 
            tongSoLuong: totalQuantity, 
            cartId: cartId,
        };
        console.log("data: ", orderData);      
        
        
        if(paymentMethod === 'online') {
            setLoading(true)
            notification.warning({
                message: "Đang tiến hành đặt hàng",
                description: "Bạn vui lòng chờ trong giây lát...",            
            });
            const res = await orderDH(...Object.values(orderData));
            console.log("res tt vnpay: ", res);
            
            if(res && res.data) {

                // Hiển thị thông báo thành công
                // message.success(res.message)                
                setIdDH(res._idDH)
                setmangaunhien(res.mangaunhien)
                setsoTienCanTT(res.soTienCanThanhToan)
                setOpenModal(true)
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                notification.error({
                    message: 'Đặt hàng không thành công!',
                    description: res.message
                })
            }      
            setLoading(false)          
            
        } else {
            setLoading(true)
            notification.warning({
                message: "Đang tiến hành đặt hàng",
                description: "Bạn vui lòng chờ trong giây lát...",            
            });
            const res = await orderDH(...Object.values(orderData));
            if(res && res.data) {
                // Hiển thị thông báo thành công
                window.location.href = '/'
                await fetchCart()                 
                message.success(res.message)
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                notification.error({
                    message: 'Đặt hàng không thành công!',
                    description:  res.error
                })
            }      
            setLoading(false)
        }            
    };

    // Hàm kiểm tra trạng thái thanh toán
    const checkPaymentStatus = async () => {
        try {
            const response = await findOneOrderById(`idDH=${idDH}`);
            if (response.data && response.data.TinhTrangThanhToan === "Đã Thanh Toán") {
                setPaymentStatus(true);
            }
        } catch (error) {
            console.error("Error checking payment status:", error);
        }
    };

    // Kiểm tra khi modal mở
    useEffect(() => {
        if (openModal) {
            const interval = setInterval(() => {
                checkPaymentStatus();
            }, 2000); // Kiểm tra mỗi 3 giây

            return () => clearInterval(interval); // Xóa interval khi đóng modal
        }
    }, [openModal]);

    // Nếu thanh toán thành công => Tắt modal + hiển thị thông báo
    useEffect(() => {
        if (paymentStatus) {
            setOpenModal(false);
            window.location.href = '/'
            notification.success({
                message: "Thanh toán thành công",
                description: `Đơn hàng #${idDH} đã được thanh toán!`,
                duration: 3,
            });            
        }
    }, [paymentStatus]);       

    const cancelTT = () => {
        setOpenModal(false)
        navigate('/')
        // window.location.href = '/'
        message.warning("Bạn vừa tắt form thanh toán. Đơn hàng của bạn chưa được thanh toán, bạn có thể xem chi tiết đơn hàng tại email của mình!")
    }
    const [activeTabKey, setActiveTabKey] = useState(0);

    const banks = [
        {
          name: "MBBank",
          accountNumber: "331336969",
          accountName: "NGUYEN THE HUNG",
          bankCode: "970422", // for vietqr
        },
        {
          name: "VietinBank",
          accountNumber: "102872278100",
          accountName: "TRAN QUANG NGHIA",
          bankCode: "970415",
        },
    ];

    const currentBank = banks[activeTabKey];
    const prefix = currentBank.name === "VietinBank" ? "SEVQR" : "DH";

  
  return (
    <main style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
        <Row gutter={20}>
        {/* Giỏ hàng */}
        <Col xs={24} md={16}>
            <Card 
            style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}          
            title="🛒 Giỏ hàng của bạn" bordered>
            <div
            style={{
                overflowX: 'auto',   // Allow horizontal scrolling
                whiteSpace: 'nowrap', // Ensure items are displayed in a row, no line breaks
            }}>
                <List
                    itemLayout="horizontal"
                    dataSource={cartItems}
                    renderItem={(item) => (
                    <List.Item                
                        actions={[
                            <div style={{marginLeft:"200px", marginTop:"20px" }}>
                                <InputNumber
                                    min={1}
                                    style={{marginRight:"10px"}}
                                    value={item.quantity}
                                    onChange={(value) => handleUpdateQuantity(item?._idSP, value)}
                                />
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => {
                                        Modal.confirm({
                                            title: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
                                            content: 'Hành động này không thể hoàn tác.',
                                            okText: 'Xóa',
                                            cancelText: 'Không',
                                            onOk: () => handleRemoveItem(item?._idSP),
                                        });
                                    }}
                                />

                            </div>,
                        ]}
                    >
                        <List.Item.Meta
                        avatar={<Image width={80} src={item.Image} />}
                        title={<span style={{fontSize:"20px", color:"black"}}>{item.TenSP}</span>}
                        description={
                            <>                          
                            <br/>
                            <Text style={{fontSize:"16px", color:"navy"}}>
                            Giá: {item.price.toLocaleString('vi-VN')}₫ x {item.quantity} ={' '}
                            <Text strong style={{fontSize:"16px", color:"red"}}>
                            {(item.price * item.quantity).toLocaleString('vi-VN')}₫ 
                            </Text>
                        </Text>
                        </>
                        }
                        />
                    </List.Item>
                    )}
                />           
            </div>
            <Divider />
            <div style={{ textAlign: 'right' }}>
            <Title level={4}>
                Số tiền cần thanh toán:{' '}
                <Text style={{fontSize:"20px"}} type="danger">{cart?.soTienCanThanhToan.toLocaleString('vi-VN')}₫</Text>
            </Title>
        </div>
            </Card>
        </Col>

        {/* Form thông tin */}
        <Col xs={24} md={8}>
            <Card 
                style={{
                    borderRadius: 16,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    padding: '16px',
                    transition: 'all 0.3s ease',
                }}  
                hoverable
                title="📋 Thông tin nhận hàng" 
                bordered
            >
                <Form 
                    form={form}
                    onFinish={handleDatHang} 
                    layout="vertical"
                >
                    <Form.Item
                        label="Họ"
                        name="lastName"
                        rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                    >
                        <Input 
                            placeholder="Nguyễn" 
                            style={{ borderRadius: '8px', padding: '10px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tên"
                        name="firstName"
                        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    >
                        <Input 
                            placeholder="Văn A" 
                            style={{ borderRadius: '8px', padding: '10px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại!" },
                            { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ!" },
                        ]}
                    >
                        <Input 
                            placeholder="0123 456 789" 
                            style={{ borderRadius: '8px', padding: '10px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                    >
                        <Input 
                            placeholder="123 Đường ABC, Quận X, TP.HCM" 
                            style={{ borderRadius: '8px', padding: '10px' }}
                        />
                    </Form.Item>

                    <Form.Item 
                        label="Email" 
                        name="email" 
                        rules={[{ required: true, message: 'Vui lòng nhập email' }]}
                    >
                        <Input 
                            placeholder="email@example.com" 
                            style={{ borderRadius: '8px', padding: '10px' }}
                        />
                    </Form.Item>

                    <Form.Item 
                        label="Ghi chú" 
                        name="note"
                    >
                        <Input.TextArea 
                            rows={3} 
                            placeholder="Ghi chú thêm nếu có..." 
                            style={{ borderRadius: '8px', padding: '10px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Hình thức thanh toán"
                        name="paymentMethod"
                        initialValue="cod"
                        rules={[{ required: true, message: 'Vui lòng chọn hình thức thanh toán' }]}
                    >
                        <Radio.Group onChange={handlePaymentChange} value={paymentMethod}>
                            <Radio 
                                style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }} 
                                value="cod"
                            >
                                ✅ Thanh toán khi nhận hàng (COD)
                            </Radio>
                            <Radio 
                                style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }} 
                                value="online"
                            >
                                💳 Chuyển khoản ngân hàng
                            </Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Divider />
                    <Button 
                        type="primary" 
                        loading={loading} 
                        onClick={() => form.submit()} 
                        size="large" 
                        block 
                        icon={<FaCartArrowDown size={25} />} 
                        style={{
                            backgroundColor: "#ff6600", 
                            borderRadius: '8px', 
                            padding: '12px 0', 
                            fontSize: '18px',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#e55b00'}  // Hover effect
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6600'}
                    >
                        Xác nhận đặt hàng
                    </Button>
                </Form>
            </Card>
        </Col>


            <Modal
                title={
                <div style={{ textAlign: "center", fontSize: "20px", color: "#333" }}>
                    Mã QR Code Thanh Toán Đơn Hàng: <span style={{ color: "#1677ff" }}>{prefix}{mangaunhien}</span>
                </div>
                }
                open={openModal}
                onCancel={cancelTT}
                maskClosable={false}
                footer={null}
                width={650}
            >
            <Divider />
                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <h4 style={{ color: "red", marginBottom: 4 }}>
                    Nếu đóng, đơn hàng sẽ ở trạng thái <b>chưa thanh toán</b>
                    </h4>
                    <h4 style={{ color: "#fa8c16" }}>
                    Vui lòng điền <b>đúng nội dung chuyển khoản</b> nếu bạn nhập bằng tay
                    </h4>
                </div>

                <Tabs defaultActiveKey="0" centered onChange={(key) => setActiveTabKey(Number(key))}>
                    {banks.map((bank, index) => {
                        const prefixNoiDung = bank.name === "VietinBank" ? "SEVQR" : "DH";

                        return (
                    <TabPane tab={bank.name} key={index}>
                        <div
                        style={{
                            backgroundColor: "#f5f5f5",
                            padding: "20px",
                            borderRadius: "10px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                            marginBottom: "24px",
                        }}
                        >
                        <h4 style={{ color: "#1d39c4", textAlign: "center", marginBottom: 12 }}>
                            💰 Số tiền cần thanh toán:&nbsp;
                            <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>
                            {soTienCanTT.toLocaleString()}đ
                            </span>
                        </h4>

                        <h4 style={{ color: "#1d39c4", textAlign: "center", marginBottom: 8 }}>
                            📝 Nội dung chuyển khoản:&nbsp;
                            <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>{prefixNoiDung}{mangaunhien}</span>
                            <Button
                            size="small"
                            type="link"
                            icon={<CopyOutlined />}
                            onClick={() => {
                                navigator.clipboard.writeText(`${prefixNoiDung}${mangaunhien}`);
                                message.success("Đã sao chép nội dung chuyển khoản!");
                            }}
                            style={{ marginLeft: 8 }}
                            >
                            Sao chép
                            </Button>
                        </h4>

                        <h4 style={{ color: "#1d39c4", textAlign: "center", marginBottom: 4 }}>
                            🏦 Ngân hàng: {bank.name}
                        </h4>
                        <h4 style={{ color: "#1d39c4", textAlign: "center", marginBottom: 4 }}>
                            💳 Số tài khoản: {bank.accountNumber}
                            <Button
                            size="small"
                            type="link"
                            icon={<CopyOutlined />}
                            onClick={() => {
                                navigator.clipboard.writeText(bank.accountNumber);
                                message.success("Đã sao chép số tài khoản!");
                            }}
                            style={{ marginLeft: 8 }}
                            >
                            Sao chép
                            </Button>
                        </h4>
                        <h4 style={{ color: "#1d39c4", textAlign: "center", marginBottom: 0 }}>
                            👤 Chủ tài khoản: {bank.accountName}
                        </h4>
                        </div>

                        <h3 style={{ color: "red", textAlign: "center", marginBottom: 16 }}>
                        📲 Quét mã bên dưới để thanh toán nhanh
                        </h3>
                        <div style={{ textAlign: "center" }}>
                        <Image
                            width={350}
                            src={`https://img.vietqr.io/image/${bank.bankCode}-${bank.accountNumber}-print.png?amount=${soTienCanTT}&addInfo=${prefixNoiDung}${mangaunhien}&accountName=${bank.accountName.replace(/ /g, "+")}`}
                            alt={`QR ${bank.name}`}
                            style={{ borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        />
                        </div>
                    </TabPane>)
                    })}
                </Tabs>
            </Modal>

        </Row>
    </main>
  );
};

export default CheckoutPage;
