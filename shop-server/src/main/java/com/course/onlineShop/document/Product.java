package com.course.onlineShop.document;

import com.course.onlineShop.document.audit.UserDateAudit;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;
import java.util.List;

@Document(collection="Product")
public class Product extends UserDateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @NotBlank
    @Size(max = 40)
    private String name;

    @Size(max = 200)
    private String description;

    @Positive
    private String price;

    @DBRef(lazy = true)
    @Size(max = 3)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<ImageFile> images;

    public Product(){

    }

    public Product(String name, String description, String price, @Size(max = 3) List<ImageFile> images){
        this.name = name;
        this.description = description;
        this.price = price;
        this.images = images;
    }

    public String getId(){
        return this.id;
    }

    public void setId(String id){
        this.id = id;
    }

    public String getName(){
        return this.name;
    }

    public void setName(String name){
        this.name = name;
    }

    public String getDescription(){
        return this.description;

    }

    public void setDescription(String description){
        this.description = description;
    }

    public String getPrice(){
        return this.price;
    }

    public void setPrice(String price){
        this.price = price;
    }


    public List<ImageFile> getImages() {
        return images;
    }

    public void setImages(List<ImageFile> images) {
        this.images = images;
    }
}
