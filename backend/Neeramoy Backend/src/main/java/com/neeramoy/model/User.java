package com.neeramoy.model;

import com.neeramoy.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String fullName;

    @Indexed(unique = true, sparse = true)
    private String email;

    @Indexed(unique = true)
    private String phone;

    private String password;

    private Role role;
    
    // Address fields expected by frontend
    private String address;
    private String city;
    private String area;
    private String postalCode;
}
