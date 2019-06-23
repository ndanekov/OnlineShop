package com.course.onlineShop.payload.orderPayload;

import com.course.onlineShop.payload.UserSummary;

import java.time.Instant;
import java.util.List;

public class OrderResponse {

    private String Id;

    private String status;

    private float totalPrice;

    private UserSummary orderee;

    private List<OrderProductResponse> orderProducts;

    private DeliveryContacts deliveryContacts;

    private Instant creationTime;

    public String getId() {
        return Id;
    }

    public void setId(String id) {
        Id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public float getTotalprice() {
        return totalPrice;
    }

    public void setTotalprice(float totalprice) {
        this.totalPrice = totalprice;
    }

    public UserSummary getOrderee() {
        return orderee;
    }

    public void setOrderee(UserSummary orderee) {
        this.orderee = orderee;
    }

    public List<OrderProductResponse> getOrderProducts() {
        return orderProducts;
    }

    public void setOrderProducts(List<OrderProductResponse> orderProducts) {
        this.orderProducts = orderProducts;
    }

    public DeliveryContacts getDeliveryContacts() {
        return deliveryContacts;
    }

    public void setDeliveryContacts(DeliveryContacts deliveryContactsRequest) {
        this.deliveryContacts = deliveryContactsRequest;
    }

    public Instant getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(Instant creationDateTime) {
        this.creationTime = creationDateTime;
    }
}
