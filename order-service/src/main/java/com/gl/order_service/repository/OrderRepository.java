package com.gl.order_service.repository;

import com.gl.order_service.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {
    List<Order> findByClientId(Long clientId);

    List<Order> findByVendorId(Long vendorId);
}
