package com.course.onlineShop.payload;

import java.util.List;

public class UserInformation extends UserSummary {
    private List<String> roles;

    public UserInformation(String id, String username, String name, List<String> roles) {
        super(id, username, name);
        this.roles = roles;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
