package com.course.onlineShop.payload.orderPayload;

import javax.validation.constraints.NotBlank;

public class OrderProductResponse extends OrderProductItem {

    @NotBlank
    private String originalId;

    @NotBlank
    private String originalName;
    public OrderProductResponse(){

    }

    public OrderProductResponse(String id, int count, String originalId, String originalName){
        super(id,count);
        this.originalId = originalId;
        this.originalName = originalName;
    }

    public String getOriginalId() {
        return originalId;
    }

    public void setOriginalId(String originalId) {
        this.originalId = originalId;
    }

    public String getOriginalName() {
        return originalName;
    }

    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }
}
