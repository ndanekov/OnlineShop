package com.course.onlineShop.payload.orderPayload;

import java.util.List;

public class OrderRequest {

    private List<OrderProductItem> orderProducts;

    private DeliveryContacts deliveryContacts;


    public List<OrderProductItem> getOrderProducts() {
        return orderProducts;
    }

    public void setOrderProducts(List<OrderProductItem> orderProducts) {
        this.orderProducts = orderProducts;
    }


    public DeliveryContacts getDeliveryContacts() {
        return deliveryContacts;
    }

    public void setDeliveryContacts(DeliveryContacts deliveryContacts) {
        this.deliveryContacts = deliveryContacts;
    }
}
