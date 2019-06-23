package com.course.onlineShop.repository;

import com.course.onlineShop.document.Order.OrderProduct;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OrderProductRepository extends MongoRepository<OrderProduct, String> {
}
