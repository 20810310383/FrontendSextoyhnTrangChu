import { Button, Col, Drawer, message, Row, Input, Space, Badge, Tooltip, Menu, Dropdown, Typography, Card, Divider, List } from 'antd'
const { Search } = Input;
import { PhoneOutlined } from '@ant-design/icons';
const { Title, Paragraph, Text } = Typography;

const DrawerTuVan = ({toggleDrawer, open}) => {
  return (
    <Drawer
        title="Thông tin hỗ trợ đặt hàng"
        placement="right"
        width={600}
        onClose={toggleDrawer}
        open={open}
      >
        {/* Các div liên hệ qua số điện thoại */}
        <div>
            <Title level={5}>Liên hệ qua SĐT:</Title>
            <Row gutter={[0, 12]}>
                <Col span={24}>
                <div style={{
                    padding: '12px',
                    border: '1px solid #1890ff',
                    borderRadius: '8px',
                    backgroundColor: '#e6f7ff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#1890ff',
                    cursor: 'pointer'
                }}>
                    <PhoneOutlined />
                    <a href="tel:0337.323.389" style={{ color: '#1890ff', textDecoration: 'none' }}>
                    0337.323.389
                    </a>
                </div>
                </Col>
                <Col span={24}>
                <div style={{
                    padding: '12px',
                    border: '1px solid #52c41a',
                    borderRadius: '8px',
                    backgroundColor: '#f6ffed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#389e0d',
                    cursor: 'pointer'
                }}>
                    <PhoneOutlined />
                    <a href="tel:0365.072.506" style={{ color: '#389e0d', textDecoration: 'none' }}>
                    0365.072.506
                    </a>
                </div>
                </Col>
                {/* <Col span={24}>
                <div style={{
                    padding: '12px',
                    border: '1px solid #faad14',
                    borderRadius: '8px',
                    backgroundColor: '#fffbe6',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#d48806',
                    cursor: 'pointer'
                }}>
                    <PhoneOutlined />
                    <a href="tel:0932123456" style={{ color: '#d48806', textDecoration: 'none' }}>
                    0932123456
                    </a>
                </div>
                </Col> */}
            </Row>
        </div>
        <br/>
        {/* Card chứa thông tin */}
        <Card
            bordered={true}
            style={{
                backgroundColor: '#fafafa',
                border: '1px solid #d9d9d9',
                borderRadius: '10px',
                padding: '16px',
            }}
        >
            <Title level={4} style={{ color: '#1890ff', marginBottom: 16 }}>
                📦 Thông tin hỗ trợ đặt hàng
            </Title>

            <Divider />

            <Paragraph>
                <strong style={{ color: '#389e0d' }}>✔ 100% có hàng:</strong> Không cần hỏi có hay không, đổi tên, đóng niêm phong kín đáo.
            </Paragraph>

            <Paragraph>
                <strong style={{ color: '#fa8c16' }}>🕐 Giao hàng từ 7h ➡ 2h sáng hôm sau:</strong> Tất cả các ngày trong tuần.
            </Paragraph>

            <Paragraph>
                <strong style={{ color: '#fa541c' }}>⚡ Giao hỏa tốc:</strong> 45 – 150 phút nhận hàng tại HN và tỉnh lân cận, có nhận gửi hàng qua nhà xe.
            </Paragraph>

            <Paragraph>
                <strong style={{ color: '#722ed1' }}>🚛 Gửi hàng đi tỉnh:</strong> Khoảng 1 – 5 ngày tùy khu vực.
            </Paragraph>

            <Divider />

            <Paragraph style={{ backgroundColor: '#e6f7ff', padding: 12, borderRadius: 6 }}>
                💡 <strong>Đặt hàng ngay trên web</strong> để được giao nhanh – đơn sẽ chuyển trực tiếp tới bộ phận giao hàng và nhân viên gọi lại trong 5 phút.
            </Paragraph>

            <Paragraph style={{ backgroundColor: '#fff1f0', padding: 12, borderRadius: 6 }}>
                🛎 Nếu chưa thấy trả lời trên Zalo, cứ đặt trên web – nhân viên sẽ gọi lại ngay nhé!
            </Paragraph>
        </Card>     
      </Drawer>
  )
}
export default DrawerTuVan