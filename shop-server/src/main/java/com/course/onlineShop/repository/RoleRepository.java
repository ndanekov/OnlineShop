package com.course.onlineShop.repository;

import com.course.onlineShop.document.Role;
import com.course.onlineShop.document.RoleName;
import com.course.onlineShop.document.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;


public interface RoleRepository extends MongoRepository<Role, String> {
    Optional<Role> findByName(RoleName roleName);
}
