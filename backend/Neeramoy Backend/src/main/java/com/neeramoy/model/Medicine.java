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
    private boolean isOtc;
    private String form;
    private String packSize;
    private double price;
    private double originalPrice;
    private double discount;
    private String unit;
    private double rating;
    private String category;
    private boolean inStock;
    private String description;
    private List<String> indications;
    private String howToUse;
    private String safetyInfo;
    private String image;
}
