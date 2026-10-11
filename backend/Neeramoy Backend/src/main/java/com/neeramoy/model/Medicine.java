package com.neeramoy.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "medicines")
public class Medicine {
    @Id
    private String id;
    private String name;
    private String genericName;
    private String manufacturer;
    @com.fasterxml.jackson.annotation.JsonProperty("isOtc")
    private Boolean isOtc;
    private String form;
    private String packSize;
    private Double price;
    private Double originalPrice;
    private Double discount;
    private String unit;
    private Double rating;
    private String category;
    private Boolean inStock;
    private Integer stock;
    private String description;
    private List<String> indications;
    private String howToUse;
    private String safetyInfo;
    private String image;
    private String imageId;

    public boolean isInStock() {
        if (this.inStock != null) {
            return this.inStock;
        }
        return this.stock != null && this.stock > 0;
    }

    public boolean isOtc() {
        return Boolean.TRUE.equals(this.isOtc);
    }
}
