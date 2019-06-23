package com.course.onlineShop.payload;

import com.course.onlineShop.document.ImageFile;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;

public class ProductRequest {

    @NotBlank
    @Size(max = 40)
    private String name;

    @NotBlank
    @Size(max = 200)
    private String description;

    @Positive
    private float price;

    private MultipartFile[] images;

    public String getName(){  return name;}

    public void setName(String name){  this.name = name;}

    public String getDescription(){  return description;}

    public void setDescription(String description) {  this.description = description;}

    public float getPrice(){  return price;}

    public void setPrice(float price){  this.price = price;}


    public MultipartFile[] getImages() {
        return images;
    }

    public void setImages(MultipartFile[] images) {
        this.images = images;
    }
}
