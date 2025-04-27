import axios from "../utils/axios-customize"

export const addToCart = (_idSP, quantity, cartId) => {
    return axios.post('/api/cart/add-to-cart', {
        _idSP, quantity, cartId
    })
}

export const getCart = (cartId) => {
    return axios.get(`/api/cart/get-cart-by-idkh?cartId=${cartId}`)
}

export const removeFromCart = (cartId, _idSP) => {
    return axios.post('/api/cart/remove-item', {
        cartId, _idSP
    })
}

export const updateCartByIdKH = (cartId, _idSP, quantity) => {
    return axios.put('/api/cart/update-quantity', {
        cartId, _idSP, quantity
    })
}

export const applyVoucherToCart = (cartId, voucherCode) => {
    return axios.post('/api/cart/apply-voucher', {
        cartId, voucherCode
    })
}