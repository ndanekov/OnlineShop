package com.course.onlineShop.payload.orderPayload;

import javax.validation.constraints.NotBlank;

public class OrderStatusRequest {

    @NotBlank
    public String newStatus;

    @NotBlank
    public String orderId;

    public OrderStatusRequest(String newStatus,String orderId){
        this.newStatus = newStatus;
        this.orderId = orderId;
    }
    public void setNewStatus(String newStatus){
        this.newStatus = newStatus;
    }

    public String getNewStatus(){
        return this.newStatus;
    }

    public void setOrderId(String orderId){
        this.orderId = orderId;
    }

    public String getOrderId(){
        return this.orderId;
    }
}
