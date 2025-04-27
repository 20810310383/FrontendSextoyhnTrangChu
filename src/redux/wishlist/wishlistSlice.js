import { createSlice } from '@reduxjs/toolkit';
import { message, notification } from 'antd';

///
const initialState = {
    Wishlist: [], 
    customerId: null, 
};

// Khởi tạo danh sách yêu thích cho khách hàng chưa login
const initializeWishlistForGuest = () => {
    const savedWishlist = localStorage.getItem('wishlist-guest');
    return savedWishlist ? JSON.parse(savedWishlist) : []; // Nếu có ds yêu thích thì parse từ JSON, nếu không thì trả về mảng rỗng
};

// Khởi tạo danh sách yêu thích cho khách hàng đã login
const initializeWishlistForCustomer = (customerId) => {
    const savedWishlist = localStorage.getItem(`wishlist-${customerId}`);
    return savedWishlist ? JSON.parse(savedWishlist) : []; // Nếu có ds yêu thích thì parse từ JSON, nếu không thì trả về mảng rỗng
};

export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {             
        // Khi login, khởi tạo ds yêu thích từ localStorage
        doLoginActionWishlist: (state, action) => {
            const { customerId } = action.payload;
            state.customerId = customerId;
            
            // Lấy danh sách yêu thích từ localStorage theo customerId khi đăng nhập
            const savedWishlist = initializeWishlistForCustomer(customerId);
            
            // Kiểm tra và gán lại state.Wishlist
            if (savedWishlist.length > 0) {
                state.Wishlist = savedWishlist;
            } else {
                state.Wishlist = []; // Nếu không có dữ liệu trong localStorage, khởi tạo mảng rỗng
            }
        },

        // Thêm sản phẩm vào ds yêu thích
        doAddActionWishlist: (state, action) => {
            let { dataDetailSP, customerId, selectedItemss, selectedSize } = action.payload;
        
            let product = dataDetailSP;
            let priceDaChon = selectedItemss;
            let sizeDaChon = selectedSize;
        
            // Lưu ID khách hàng vào state
            state.customerId = customerId;
        
            // Kiểm tra xem sản phẩm đã có trong ds yêu thích chưa
            const existingProductIndex = state.Wishlist.findIndex(
                item => item._id === product._id && item.sizeDaChon === sizeDaChon && item.customerId === customerId
            );
        
            if (existingProductIndex !== -1) {
                // Nếu sản phẩm đã có trong ds yêu thích, thông báo lỗi
                message.error("Sản phẩm đã có trong danh sách yêu thích");
            } else {
                // Nếu sản phẩm chưa có trong ds yêu thích, thêm mới vào ds yêu thích
                state.Wishlist.push({
                    ...product,  // Truyền toàn bộ thông tin sản phẩm
                    sizeDaChon: sizeDaChon,
                    priceDaChon: priceDaChon || 0,
                    customerId: customerId // Lưu ID khách hàng vào sản phẩm trong ds yêu thích
                });
                message.success("Sản phẩm đã được thêm vào danh sách yêu thích");
            }
        
            // Lưu ds yêu thích vào localStorage sau khi thay đổi
            if (customerId) {
                // Lưu vào localStorage theo customerId khi login
                localStorage.setItem(`wishlist-${customerId}`, JSON.stringify(state.Wishlist));
            } else {
                // Lưu vào localStorage chung cho khách chưa login
                localStorage.setItem('wishlist-guest', JSON.stringify(state.Wishlist));
            }
        },
              

        // Xóa sản phẩm khỏi ds yêu thích
        doDeleteItemWishlistAction: (state, action) => {
            const { productId, size, customerId } = action.payload;

            // Tìm và xóa sản phẩm trong ds yêu thích
            state.Wishlist = state.Wishlist.filter(
                item => item._id !== productId || item.sizeDaChon !== size || item.customerId !== customerId
            );
            
            message.success("Sản phẩm đã được xóa khỏi danh sách yêu thích");
            // Lưu ds yêu thích vào localStorage sau khi thay đổi
            if (customerId) {
                // Lưu vào localStorage theo customerId khi login
                localStorage.setItem(`wishlist-${customerId}`, JSON.stringify(state.Wishlist));
            } else {
                // Lưu vào localStorage chung cho khách chưa login
                localStorage.setItem('wishlist-guest', JSON.stringify(state.Wishlist));
            }
        },

        // Xóa ds yêu thích khi logout
        doLogoutActionWishlist: (state) => {
            state.Wishlist = [];
            state.customerId = null;
            // Khi logout, không xóa ds yêu thích trong localStorage
        },

        // Reset ds yêu thích
        doResetWishlistAction: (state) => {
            state.Wishlist = [];
            state.customerId = null;            
        },
    },
});

export const { doLoginActionWishlist, doAddActionWishlist, doDeleteItemWishlistAction, doLogoutActionWishlist, doResetWishlistAction } = wishlistSlice.actions;

export default wishlistSlice.reducer;