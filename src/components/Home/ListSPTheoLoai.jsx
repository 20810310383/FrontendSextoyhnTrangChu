import { useEffect, useState } from "react";
import Product from "../Product/Product"
import { fetchAllProductToCategoryLienQuan } from "../../services/productAPI";
import { useSelector } from "react-redux";
import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchAllTheLoai } from "../../services/loaiSPAPI";
const { Title } = Typography;

const ListSPTheoLoai = () => {

    const [productsByCategory, setProductsByCategory] = useState({});
    const [dataTheLoai, setDataTheLoai] = useState([])
    const navigator = useNavigate()

    useEffect(() => {
        fetchListTL()
    }, [])

    const fetchListTL = async (id) => {
        let query = `page=1&limit=9999`           
    
        const res = await fetchAllTheLoai(query)
        console.log("res TL: ", res);
        if (res && res.data) {
            setDataTheLoai(res.data)
        }
    }

    useEffect(() => {
        const fetchAllProducts = async () => {
          let result = {};
      
          for (let category of dataTheLoai) {
            const id = category._id;
            const res = await fetchAllProductToCategoryLienQuan(`IdLoaiSP=${id}`);
      
            result[id] = res?.data || [];
          }
      
          setProductsByCategory(result);
        };
      
        if (dataTheLoai.length > 0) {
          fetchAllProducts();
        }
    }, [dataTheLoai]);

    // {dataTheLoai
    //     .filter((item) => (productsByCategory[item._id] || []).length > 0)
    //     .map((item) => (
    //       <div key={item._id} className="category-block styled-block">
    //         <div className="category-name-detail">
    //           {/* <p className="category-name">{item.TenLoaiSP}</p> */}
    //           <Title style={{color:"navy"}} level={4}>{item.TenLoaiSP}</Title>
    //           <div className="clear" />
    //         </div>

    //         <ul className="product-list">
    //           {productsByCategory[item._id].map((product) => (
    //             <li key={product._id}>
    //               <Product data={product} />
    //             </li>
    //           ))}
    //         </ul>
    //       </div>
    // ))}

  return (
   <section id="aj_sextoy-cho-nu" className="cates js_cates">        
    {dataTheLoai
        .filter((item) => (productsByCategory[item._id] || []).length > 0)
        .map((item) => {
        const products = productsByCategory[item._id] || [];
        const productsToShow = products.slice(0, 20); // Chỉ lấy 20 sản phẩm đầu tiên
        return (
            <div key={item._id} className="cates_thumb">
            <div className="category-name-detail">                    
                <div className="bg_h2">
                <h2>{item?.TenLoaiSP}</h2>
                </div>
                <img className="js_img_lazy" src={item?.Icon} alt={item?.TenLoaiSP} />
                <section id="list_p" className="list_p-cate" js_alias="bao-cao-su" js_page={2} type="cate_id" js_id={18} js_query js_search>
                {productsToShow.map((product) => (
                    <Product key={product._id} dataSP={product} />                       
                ))}
                </section>
            </div>             
            {products.length > 20 && (
                <div className="btn_more-homefill">
                <a href="#" onClick={() => navigator(`/searchsp?IdLoaiSP=${item?._id}`)} className="btn">
                    <span>Xem thêm {item?.TenLoaiSP}</span>
                </a>
                </div>
            )}
            </div>
        );
        })}
    </section>

  )
}
export default ListSPTheoLoai