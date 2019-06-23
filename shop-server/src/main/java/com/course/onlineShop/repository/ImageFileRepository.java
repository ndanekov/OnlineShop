package com.course.onlineShop.repository;

import com.course.onlineShop.document.ImageFile;
import org.springframework.data.mongodb.repository.MongoRepository;



public interface ImageFileRepository extends MongoRepository<ImageFile, String> {
}
