package com.course.onlineShop.payload;

import com.course.onlineShop.document.ImageFile;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class ProductResponse {
    private String id;
    private String name;
    private String description;
    private float price;
    private UserSummary createdBy;
    private Instant creationDateTime;
    private List<ImageFileContainer> images;

    public ProductResponse(){
        images = new ArrayList<ImageFileContainer>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public float getPrice(){
        return price;
    }

    public void setPrice(float price){
        this.price = price;
    }

    public UserSummary getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserSummary createdBy) {

        this.createdBy = createdBy;
    }

    public Instant getCreationDateTime() {
        return creationDateTime;
    }

    public void setCreationDateTime(Instant creationDateTime) {
        this.creationDateTime = creationDateTime;
    }

    public List<ImageFileContainer> getImages() {
        return images;
    }

    public void setImages(List<ImageFileContainer> images) {
        this.images = images;
    }
}
