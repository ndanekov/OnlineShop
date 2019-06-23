package com.course.onlineShop.repository;

import com.course.onlineShop.document.Product;
import com.course.onlineShop.document.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, String> {
    Optional<Product> findById(String id);

    Page<Product> findByCreatedBy(String userId, Pageable pageable);

    long countByCreatedBy(String userId);

    List<Product> findByIdIn(List<Long> pollIds);

    List<Product> findByIdIn(List<Long> pollIds, Sort sort);
}
