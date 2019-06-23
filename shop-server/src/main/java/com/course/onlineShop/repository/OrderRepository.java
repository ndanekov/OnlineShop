package com.course.onlineShop.repository;

import com.course.onlineShop.document.Order.Order;
import com.course.onlineShop.document.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

public interface OrderRepository  extends MongoRepository<Order, String> {

    Page<Order> findByOrderee(User user, Pageable pageable);
}
