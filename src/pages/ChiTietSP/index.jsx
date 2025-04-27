import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { fetchAllProductToCategoryLienQuan, fetchSPDetail } from "../../services/productAPI";
import { v4 as uuidv4 } from 'uuid';
import { addToCart } from "../../services/cartAPI";
import { Divider, InputNumber, notification, Typography } from "antd";
import Product from "../../components/Product/Product";
import 'react-image-gallery/styles/css/image-gallery.css';
import './cs.css'
import Gallery from 'react-image-gallery';
const { Title, Text } = Typography;

const ChiTietSP = () => {

    const [open, setOpen] = useState(false);
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const idLoaiSP = queryParams.get('idLoaiSP'); 

    const [dataSPCungLoai, setDataSPCungLoai] = useState([])
    const [dataDetailSP, setDataDetailSP] = useState(null)

    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(25)
    const [total, setTotal] = useState(0)

    const [selectedItemss, setSelectedItemss] = useState('');
    const [selectedSize, setSelectedSize] = useState('');  // Kích thước đã chọn
    const [currentQuantity, setCurrentQuantity] = useState(1);
    const [showMore, setShowMore] = useState(false);

    const { cart, fetchCart } = useCart();
    
    const giaGiam = dataDetailSP?.sizes - (dataDetailSP?.sizes * (dataDetailSP?.GiamGiaSP / 100));
    const giaSauGiam = Math.floor(giaGiam / 1000) * 1000; // Làm tròn xuống 10.000₫ gần nhất

    const handleFindProductToCategory = async () => {
        let query = `page=${current}&limit=${pageSize}`        

        const idLoaiSPArray = Array.isArray(idLoaiSP) ? idLoaiSP : [idLoaiSP];  // Nếu không phải mảng, chuyển thành mảng
  
        if (idLoaiSPArray.length > 0) {
          query += `&IdLoaiSP=${idLoaiSPArray.join(',')}`;  // Chuyển mảng thành chuỗi cách nhau bằng dấu phẩy
        }                

        const res = await fetchAllProductToCategoryLienQuan(query)
        if (res && res.data && res.data.length > 0) {
          // Nếu có sản phẩm thì cập nhật lại state
          setDataSPCungLoai(res.data);
          setTotal(res.totalSanPham)
        } else {
          // Nếu không có sản phẩm, sẽ không cần làm gì nữa
          setDataSPCungLoai([]);
        }
    }

    const fetchProductDetail= async () => {  
        if (!dataDetailSP) { 
            const res = await fetchSPDetail(id);
            console.log("res TL: ", res);
            if (res && res.data) {
                setDataDetailSP(res.data);
            }
        }
    }   

    useEffect(() => {
        handleFindProductToCategory()
    }, [idLoaiSP, current, pageSize])
       
  
    useEffect(() => {
        fetchProductDetail()
    },[id])

    // useEffect(() => {
    //     // Kiểm tra xem URL có các tham số 'id' và 'idLoaiSP' hay không
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const id = urlParams.get('id');
    //     const idLoaiSP = urlParams.get('idLoaiSP');
    
    //     if (!id || !idLoaiSP) {
    //       // Nếu không có các tham số này, điều hướng về trang chủ
    //       window.location.href = '/';
    //     }
    // }, []);
   
    const onChangeQuantity = (value) => {
        console.log('changed soluong', value);
        setCurrentQuantity(value)
    };

    const handleOnchangePage = (pagination) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
  
        // Cuộn về đầu trang
        window.scrollTo({ top: 1000, behavior: 'smooth' });
    }
    
    const images = dataDetailSP?.ImageSlider?.map(imageName => ({
            original: imageName,
            thumbnail: imageName, 
    })) ?? [];

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const getOrCreateCartId = () => {
        let cartId = localStorage.getItem('cartId');
      
        if (!cartId) {
          cartId = uuidv4(); // sinh ID mới
          localStorage.setItem('cartId', cartId);
        }
      
        return cartId;
    }
    const cartId = getOrCreateCartId()
    console.log("cartID: ", cartId);
    
    const handleAddToCart = async (_idSP, quantity) => {
        try {
            const res = await addToCart(_idSP, quantity, cartId);
            console.log("cart: ", res);
    
            if (res && res.data) {
                notification.success({
                    message: "Thành công",
                    description: res.message || "Đã thêm sản phẩm vào giỏ hàng.",
                    placement: 'topLeft',
                });
                await fetchCart()
            } else {
                notification.error({
                    message: "Thất bại",
                    description: res.message || "Không thể thêm sản phẩm vào giỏ hàng."
                });
            }
        } catch (error) {
            console.error("Lỗi thêm giỏ hàng:", error);
            notification.error({
                message: "Lỗi hệ thống",
                description: "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại."
            });
        }
    };


  return (
    <div>
        <main id="product_detail" product_id={2247}>
        <section className="product-detail">
            <div className="containerr">
                <div className="product-layout">
                
                {/* Left: Gallery */}
                <div className="product-gallery">
                    <Gallery items={images} />
                </div>

                {/* Right: Info */}
                <div className="product-info ">
                    <h1 className="product-title ">{dataDetailSP?.TenSP}</h1>
                    <p className="product-shortdesc">
                    {typeof dataDetailSP?.MoTaMotChut === 'string' ? dataDetailSP.MoTaMotChut.replace(/<[^>]+>/g, '') : ''}
                    </p>
                    <div className="product-price">
                        <div className="price-left">
                            {dataDetailSP?.GiamGiaSP > 0 ? (
                            <>
                                <strong>{giaSauGiam.toLocaleString()} ₫</strong>
                                <span className="price-old">{dataDetailSP?.sizes?.toLocaleString()} ₫</span>
                            </>
                            ) : (
                            <>
                                <strong>{dataDetailSP?.sizes?.toLocaleString()} ₫</strong>
                            </>
                            )}
                        </div>
                        <div className="sold-count" style={{ color: "navy" }}>
                            Đã bán: {dataDetailSP?.SoLuongBan}
                        </div>
                    </div>

                    <div>									                        
                        <Title level={4}>Số lượng mua:</Title>
                        <InputNumber 
                        size='large' 
                        // disabled={soLuongTonKho === 0 ? true : false} 
                        style={{width: "100px",}} min={1} max={1000} 
                        value={currentQuantity} defaultValue={1} onChange={onChangeQuantity} />
                    </div> <br/>

                    {/* CTA buttons */}
                    <div className="cta-buttons">
                    <div className="add_cart open_order" onClick={() => handleAddToCart(dataDetailSP?._id, currentQuantity)}>
                        <span className="txtCart">🛒 Thêm vào giỏ</span>
                    </div>
                    {/* <div className="buy_now open_order" redirect={1} product_id={2247}>
                        <span>⚡ Mua ngay</span>
                    </div> */}
                    </div>
                        <Divider/>
                    <ul className="shipping-info">
                        <li>🚚 Miễn phí giao hàng toàn quốc</li>
                        <li>🛡️ Bảo hành chính hãng </li>
                        <li>💬 Hỗ trợ đổi trả trong 7 ngày</li>
                    </ul>


                </div>

                </div>
            </div>
        </section>

  {/* <section className="video_main container">
    <h2>Video sản phẩm</h2>
    <video style={{display: 'table', marginLeft: 'auto', marginRight: 'auto'}} poster="../image/may-massage-tinh-yeu/ms149/lilo-cupid-stick-8.webp" controls="controls" loading="lazy">
      <source src="../ms-149-lilo-cupid-stick-full.mp4" type="video/mp4" />
    </video>
  </section> */}
 
  {/* Bài viết chi tiết */}
  <section id="article_p" className="container">
    <h2 id="neo-detail">Đặc điểm nổi bật của {dataDetailSP?.TenSP}</h2>
    <article className="panel content_article">
        {typeof dataDetailSP?.MoTa === 'string' ? dataDetailSP.MoTa.replace(/<[^>]+>/g, '') : ''}
    </article>
  </section>
 
  
  <section id="services_3">
    <div className="flex_between-center container">
      <div className="tab_main">
        <div className="icon_pay_method icon" />
        <div className="tab_main-title">
          <strong>Thanh toán linh hoạt</strong>
          <div className="tab_main-radial" />
        </div>
        <ul>
          <li>
            <strong>Thanh toán khi nhận hàng</strong>
            <p>Xem hàng đồng kiểm trước</p>
          </li>
          <li>
            <strong>Chuyển khoản - Ví điện tử</strong>
            <p>Vietinbank, MBBank</p>
          </li>
        </ul>
      </div>
      <div className="tab_main">
        <div className="icon_fast_ship icon" />
        <div className="tab_main-title">
          <strong>Giao hàng hoả tốc</strong>
          <div className="tab_main-radial" />
        </div>
        <ul>
          <li>
            <strong>Hoả tốc trong 1 giờ</strong>
            <p>Áp dụng trong nội thành HN </p>
          </li>
          <li>
            <strong>Gửi nhanh EMS 1~3 ngày</strong>
            <p>Áp dụng trên toàn quốc</p>
          </li>
        </ul>
        <div className="tab_main-radial" />
      </div><div className="tab_main">
        <div className="icon_kin_dao icon" />
        <div className="tab_main-title">
          <strong>Kín đáo tế nhị</strong>
          <div className="tab_main-radial" />
        </div>
        <ul>
          <li>
            <strong>Đóng gói bằng hộp carton</strong>
            <p>Bọc kín - Dán niêm phong</p>
          </li>
          <li>
            <strong>Không đề tên bên ngoài</strong>
            <p>Đảm bảo kín đáo tế nhị</p>
          </li>
        </ul>
        <div className="tab_main-radial" />
      </div>
    </div>
  </section>
  {/* Sản phẩm liên quan */}
  {dataSPCungLoai.length > 0 ? <>
  <section id="list_p-related">
    <h2 className="container" >Sản phẩm liên quan</h2>
    <section id="list_p" className="list_p-cate" js_alias="bao-cao-su" js_page={2} type="cate_id" js_id={18} js_query js_search>
    {dataSPCungLoai.map((item,index) => {
        return (
            <Product dataSP={item} />
        )
    })}
    </section>
  </section>
  </> : <></>}   
</main>

    </div>
  )
}
export default ChiTietSP