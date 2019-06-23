package com.course.onlineShop.document.Order;

import com.course.onlineShop.document.User;
import com.course.onlineShop.document.audit.UserDateAudit;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Document(collection = "Order")
public class Order extends UserDateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @DBRef(lazy=true)
    @NotEmpty
    private List<OrderProduct> orderProducts;

    @NotBlank
    @NotNull

    private DeliveryContacts deliveryContacts;

    @DBRef(lazy = true)
    private User orderee;

    @NotBlank
    private OrderStatus status;

    @NotNull
    @NotBlank
    private String totalPrice;

    public Order(){

    }

    public Order(String id, @NotEmpty List<OrderProduct> orderProducts,
                 DeliveryContacts deliveryContacts, User orderee,
                 @NotBlank OrderStatus status, String totalPrice) {
        this.id = id;
        this.orderProducts = orderProducts;
        this.deliveryContacts = deliveryContacts;
        this.orderee = orderee;
        this.status = status;
        this.totalPrice = totalPrice;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<OrderProduct> getOrderProducts() {
        return orderProducts;
    }

    public void setOrderProducts(List<OrderProduct> orderProducts) {
        this.orderProducts = orderProducts;
    }

    public DeliveryContacts getDeliveryContacts() {
        return deliveryContacts;
    }

    public void setDeliveryContacts(DeliveryContacts deliveryContacts) {
        this.deliveryContacts = deliveryContacts;
    }

    public User getOrderee() {
        return orderee;
    }

    public void setOrderee(User orderee) {
        this.orderee = orderee;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(String totalPrice) {
        this.totalPrice = totalPrice;
    }
}
