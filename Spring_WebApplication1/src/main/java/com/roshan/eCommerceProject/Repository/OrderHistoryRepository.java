package com.roshan.eCommerceProject.Repository;

import com.roshan.eCommerceProject.Model.OrderHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderHistoryRepository extends JpaRepository<OrderHistory, Long> {
    List<OrderHistory> findAllByOrderByOrderTimeDesc();
}
