import { useEffect, useState } from 'react';
import { Drawer, Button, Input } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { fetchAllTheLoai } from '../../services/loaiSPAPI';
import './css.css'
import { useNavigate } from 'react-router-dom';
const { Search } = Input;
import { FaSearch } from 'react-icons/fa'
import { useCart } from '../../context/CartContext';


const Header = () => {
    const [open, setOpen] = useState(false);
    const [dataTheLoai, setDataTheLoai] = useState([])
    const navigate = useNavigate()
    const { cart, fetchCart } = useCart();
    console.log("---> cart: ", cart);
  
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

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onSearch = (value) => {
        // Chuyển hướng đến trang /searchsp và gửi từ khóa tìm kiếm
        console.log("value: ",value);
        
        if (value) {
            navigate(`/searchsp?query=${value}`);
        }
    };

  return (
    <div>
      <header id="header_v3">
        <div className="header_main flex_between-center container">
          
           {/* Nút 3 gạch menu cho mobile */}
           <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: 24, color:"white" }} />}
            onClick={showDrawer}
            className="menu_mobile_button"
          />

          {/* Logo */}
          <a href="/" className="logoo" aria-label="Logo Oichin">
            {/* <div className="icon_logo_oichin_full" />
            <div className="icon_logo_oichin_short" /> */}
            <img src={'/css/icon/Sex.png'} style={{ height:"60px" }} />
          </a>

         

          {/* Search + Cart */}
          <div className="search_cart flex_between-center">
            {/* Search */}
            <div id="search_nav">
              {/* <form className="search_form flex_between" action="https://oichin.com/search" method="GET">
                <input type="text" autoComplete="off" name="search" placeholder="Tìm kiếm sản phẩm" id="search_input" />
                <label>Tìm tên - mã sản phẩm</label>
                <button type="submit" aria-label="Tìm sản phẩm" disabled>
                  <div className="icon_search icon18" />
                </button>
              </form> */}
                <Search
                className="search_form flex_between"
                    placeholder="Tìm kiếm sản phẩm..."
                    enterButton={<FaSearch/>}
                    onSearch={(e) => onSearch(e)}                                    
                />
            </div>

            {/* Cart */}
            <div className="cart" onClick={() => window.location.href = "/checkout"}>
              <div className="icon_cart icon32 gridCenter">
                <div>
                  <span id="cart_qty">{cart?.products.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu desktop */}
          <div className="head_nav container desktop_menu" aria-label="Danh mục sản phẩm">
            {/* nguyên phần nav của bạn */}
          </div>
        </div>

        {/* Drawer cho mobile */}
        <Drawer
          title="Danh mục sản phẩm"
          placement="left"
          onClose={onClose}
          open={open}
        >
            {dataTheLoai.length > 0 ? <>
            <ul className="nav_main-left">
                {dataTheLoai.map((item, index) => {

                    return (
                        <li key={index} onClick={() => {
                            navigate(`/searchsp?IdLoaiSP=${item?._id}`)
                            onClose()
                        }}>
                            <span style={{ marginRight: 8 }}>📦</span> 
                            {item?.TenLoaiSP}
                        </li>
                    )
                })}
            </ul>
            </> : <></>}  
        </Drawer>
      </header>

      {/* CSS responsive thêm */}
      <style jsx>{`
        .menu_mobile_button {
          display: none;
        }

        .desktop_menu {
          display: block;
         
        }

        @media (max-width: 768px) {
          .menu_mobile_button {
            display: block;
          }

          .desktop_menu {
            display: none;
          }

          .search_cart {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Header;
