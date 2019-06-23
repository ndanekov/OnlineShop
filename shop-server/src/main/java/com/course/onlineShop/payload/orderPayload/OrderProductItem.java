package com.course.onlineShop.payload.orderPayload;

public class OrderProductItem {
    private int count;
    private String id;

    public OrderProductItem(String id,int count){
        this.id = id;
        this.count = count;
    }

    public OrderProductItem(){

    }
    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
