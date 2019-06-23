package com.course.onlineShop.payload;

import java.time.Instant;

public class UserProfile {

    private String id;
    private String username;
    private String name;
    private Instant joinedAt;
    private Long productCount;

    public UserProfile(String id,String username, String name , Instant joinedAt, Long productCount){
        this.id = id;
        this.username = username;
        this.name = name;
        this.joinedAt = joinedAt;
        this.productCount = productCount;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Instant joinedAt) {
        this.joinedAt = joinedAt;
    }

    public Long getProductCount() {
        return productCount;
    }

    public void setProductCount(Long pollCount) {
        this.productCount = pollCount;
    }

}
