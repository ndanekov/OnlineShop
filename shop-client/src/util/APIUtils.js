import { API_BASE_URL, ITEM_LIST_SIZE, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    let headers = new Headers({
       'Content-Type': 'application/json',
    })
    if(options.method === 'POST' && 
        (options.url.endsWith("/products")|| options.url.includes("/products/edit/"))){
        headers = new Headers({

        })
    }else{
        headers = new Headers({
            'Content-Type': 'application/json',
        })
    }

    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);
    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;

        })
    );
};

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}


export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function createProduct(productData) {
    return request({
        url: API_BASE_URL + "/products",
        method: 'POST',
        body: productData 
    });
}

export function makeOrder(orderData) {
    return request({
        url: API_BASE_URL + "/orders",
        method: 'POST',
        body: JSON.stringify(orderData)
    });
}

export function getAllProducts(page, size) {
    page = page || 0;
    size = size || ITEM_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/products?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllOrders(page, size) {
    page = page || 0;
    size = size || ITEM_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/orders?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getOrderById(orderId){
    return request({
        url: API_BASE_URL + "/orders/byId/" + orderId,
        method: 'GET',

    });
}

export function updateOrderStatus(status){

    return request({
        url: API_BASE_URL + "/orders/updateStatus",
        method: 'POST',
        body: JSON.stringify(status)
    });
}

export function getUserCreatedProducts(username, page, size) {
    page = page || 0;
    size = size || ITEM_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/products?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getCurrentUserOrders(page,size){
    page = page || 0;
    size = size || ITEM_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/orders/mine" + "?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getProductById(productId){
    return request({
        url: API_BASE_URL + "/products/" + productId,
        method: 'GET',

    });
}

export function deleteProduct(productId){
    return request({
        url: API_BASE_URL + "/products/delete/" + productId,
        method: 'GET',

    });
}
export function editProduct(data,productId){
    return request({
        url: API_BASE_URL + "/products/edit/" + productId,
        method: 'POST',
        body: data
    });
}