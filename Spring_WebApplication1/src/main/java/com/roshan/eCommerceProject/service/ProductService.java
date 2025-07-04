package com.roshan.eCommerceProject.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.roshan.eCommerceProject.Model.Product;
import com.roshan.eCommerceProject.Repository.ProductRepo;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepo productRepo;



    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }

    public Product getProductById(int id) {
        return productRepo.findById(id).orElse(new Product(-1));
    }

    public Product addOrUpdateProduct(Product product, MultipartFile image) throws IOException {
        product.setImageName(image.getOriginalFilename());
        product.setImageType(image.getContentType());
        product.setImageData(image.getBytes());

        return productRepo.save(product);
    }


    public void deleteProduct(int id) {
        productRepo.deleteById(id);
    }


    public List<Product> searchProducts(String keyword) {
        return productRepo.searchProducts(keyword);
    }

    public Product findById(int productId) {
        Product fetchedProd = productRepo.findById(productId).orElse(new Product(-1));
        return fetchedProd;

    }



    public List<Product> findComparables(int productId) {
        Product baseProduct = productRepo.findById(productId).orElse(new Product(-1));
        if (baseProduct.getId() == -1) return List.of();

        String category = baseProduct.getCategory();
        BigDecimal price = baseProduct.getPrice();
        String brand = baseProduct.getBrand();

        // Exclude the base product itself
        return productRepo.findByCategoryAndPriceLessThan(category, price).stream()
                .filter(p -> p.getId() != productId)
                .collect(Collectors.toList());
    }


    public List<Product> getByCategory(String name) {
        List<Product> producs = productRepo.findByCategory(name);
        return producs;
    }
}