

const Footer = () => {

  
      return (
        <>
        <footer className="gridCenter" id="footer">
  <div className="container">
    <div id="contact" className="flex_between">
      <ul className="support_center">
        <li><strong>TRUNG TÂM HỖ TRỢ</strong></li>
        <li className="support_center-big flex_start">
          <a href="#" rel="nofollow" target="_blank" aria-label="Chat zalo với SEXTOYHN">
            <img src="css/icon/icon_zalo.svg" alt="Chat zalo với SEXTOYHN" loading="lazy" width={60} height={60} />
          </a>
          <a href="#" rel="nofollow" target="_blank" aria-label="Nhắn tin với SEXTOYHN trên Messenger">
            <img src="css/icon/icon_messenger.svg" alt="Nhắn tin với SEXTOYHN trên Messenger" loading="lazy" width={60} height={60} />
          </a>
          <a href="#" aria-label="Email cho Ochin">
            <img src="css/icon/icon_gmail.svg" alt="Email cho Ochin" loading="lazy" width={60} height={60} />
          </a>
        </li>
        <li className="support_phone">
          <span className="icon_phone-footer"><img src="css/icon/icon_viettel.svg" alt="Hotline Viettel 0337323389" loading="lazy" width={20} height={11} /></span>
          <a href="tel:0337323389" aria-label="Gọi điện cho SEXTOYHN - 0337323389"> 0337 323 389</a>
        </li>
        <li className="support_phone">
          <span className="icon_phone-footer"><img src="css/icon/icon_viettel.svg" alt="Hotline Viettel 0365072506" width={20} height={11} /></span>
          <a href="tel:0365072506" aria-label="Gọi điện cho SEXTOYHN - 0365072506"> 0365 072 506</a>
        </li>
       
      </ul>
      <ul className="local">
        {/* <li><strong>SEXTOYHN - HỒ CHÍ MINH</strong></li>
        <li>
          <span className="icon_local icon16" /><span>27-29 Kênh Tân Hoá, P.Tân Thới Hòa, Q.Tân Phú</span>
          <a href="https://maps.app.goo.gl/PNrRkPMLrthAkD6R8" className="img_map" target="_blank"><img src="css/icon/SEXTOYHN-google-map.webp" alt="Tìm địa chỉ SEXTOYHN trên google map" loading="lazy" width={429} height={215} /></a>
        </li> */}
        <li><strong> HÀ NỘI</strong></li>
        <li><span className="icon_local icon16" />112 nam dư, lĩnh nam, hoàng mai, hà nội</li>
        {/* <li><span className="icon_local icon16" />71 Tân Ấp, Phú Xá, Ba Đình</li> */}
      </ul>
      <ul className="about_me">
        <li><strong>VỀ SEXTOYHN</strong></li>
        <li>
          <a href="#">Giới thiệu về SEXTOYHN</a>
        </li>
        <li>
          <a href="#">Điều khoản dịch vụ</a>
        </li>
        <li>
          <a href="#">Chính sách bảo mật</a>
        </li>
        <li>
          <a href="#">Chính sách đổi trả</a>
        </li>
        <li>
          <a href="#">Hướng dẫn mua hàng</a>
        </li>
        <li>
          <a href="#">Chế độ bảo hành</a>
        </li>
        <li>
          <a href="#">Blog</a>
        </li>       
      </ul>
      <ul className="social">       
        <li><strong>PHƯƠNG THỨC THANH TOÁN</strong></li>
        <li className="flex_wrap-start flex_between-center">
          <div className="img_icon_dt" style={{backgroundColor:"white"}} ><img loading="lazy" src="css/icon/mbbank.svg" alt="Mbbank" /></div>
          <div className="img_icon_dt" style={{backgroundColor:"white"}}><img loading="lazy" src="css/icon/vietinbank.png" alt="vietinbank" /></div>
          {/* <div className="img_icon_dt"><img loading="lazy" src="css/icon/icon_zalopay_footer.svg" alt="Zalopay" /></div> */}
        </li>
        <li><strong>ĐỐI TÁC VẬN CHUYỂN</strong></li>
        <li className="flex_wrap-start">
          <div className="img_icon_dt"><img loading="lazy" src="css/icon/icon_ahamove.svg" alt="Ahamove" /></div>
        </li>
      </ul>
    </div>
    <div id="copyright">
      <small>© 2025 - Bản quyền thuộc về - SEXTOYHN.com</small> 
      <p>*Lưu ý: Tác dụng có thể khác nhau tuỳ cơ địa của người dùng</p>
    </div>
  </div>
</footer>

        </>
      )
}
export default Footer