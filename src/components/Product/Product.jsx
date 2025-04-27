import { notification, Tooltip } from "antd";
import { v4 as uuidv4 } from 'uuid';
import { addToCart } from "../../services/cartAPI";
import { useCart } from "../../context/CartContext";

const Product = ({dataSP}) => {

    const giaGiam = dataSP.sizes - (dataSP.sizes * (dataSP.GiamGiaSP / 100));
    const giaSauGiam = Math.floor(giaGiam / 1000) * 1000; // Làm tròn xuống 10.000₫ gần nhất
    const { cart, fetchCart } = useCart();

    function renderLikeButton(giamgia) {
        return (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              width: "60px",
              height: "35px",
              background: "linear-gradient(45deg, #ff416c, #ff4b2b)",
              clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            -{giamgia}%
          </div>
        );
    }

    const handleRedirectLayIdDeXemDetailPageUrl = (item) => {
        console.log("id: ", item);
        // Lấy các _id từ mảng idLoaiSP và chuyển thành chuỗi
        const idLoaiSPString = item.IdLoaiSP.map(loai => loai._id).join(',');
        window.location.href = `/chitietsp?id=${item._id}&idLoaiSP=${idLoaiSPString}`
    }
      
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
    // <section id="list_p" className="list_p-cate" js_alias="bao-cao-su" js_page={2} type="cate_id" js_id={18} js_query js_search>

        <article js_p_id={dataSP?._id}>
            <a onClick={() => handleRedirectLayIdDeXemDetailPageUrl(dataSP)} style={{cursor:"pointer"}} className="product-link" data-video data-product-url="#">
            <figure className="thumb_p-cate">
                <picture>
                    <source srcSet={dataSP?.Image} media="(max-width: 600px)" />
                    <img src={dataSP?.Image}  className="js_img_lazy" alt="Bao cao su Crystal Shaped Set" width={400} height={500} />
                </picture>
                    
                    {dataSP?.GiamGiaSP > 0 ? (                   
                    <Tooltip title={`Giảm giá ${dataSP?.GiamGiaSP}%`} color="red">
                        {renderLikeButton(dataSP?.GiamGiaSP)}
                    </Tooltip>
                    ) : (
                        <></>
                    )}                 
            </figure>
            </a>
            <a onClick={() => handleRedirectLayIdDeXemDetailPageUrl(dataSP)} style={{cursor:"pointer"}} className="title"><strong>{dataSP?.TenSP}</strong></a>
            <div className="flex_between-center">
                {dataSP?.GiamGiaSP > 0 ? <>
                    <div className="price">
                        {giaSauGiam.toLocaleString()}&nbsp;<small>₫</small> &nbsp;
                        <span style={{
                            color:"#999", textDecoration:'line-through', fontStyle:"italic", fontSize:"15px"
                        }}>
                            {dataSP?.sizes?.toLocaleString()}&nbsp;<small>₫</small>
                        </span>
                    </div>
                </> : <>
                    <div className="price">{dataSP?.sizes?.toLocaleString()}&nbsp;<small>₫</small></div>
                </>}        
                <Tooltip title={`Thêm sản phẩm vào giỏ hàng!`} color="blue">
                    <div className="quick_cart icon24 icon_add_to_cart" onClick={() => handleAddToCart(dataSP?._id, 1)} product_id={dataSP?._id} variant={0} style={{fontSize:"20px"}} />
                </Tooltip>        
            </div>
            <div className="flex_between-center sku_sold">
                <div className="sku">{typeof dataSP?.MoTaMotChut === 'string' ? dataSP.MoTaMotChut.replace(/<[^>]+>/g, '') : ''}</div> 
            </div>
            <div className="flex_between-center sku_sold">
                {/* <div className="sku"></div>  */}
                <div className="sold">Đã bán: {dataSP?.SoLuongBan}</div>
            </div>
        </article>
       
// </section>

  )
}
export default Product