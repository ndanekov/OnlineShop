package com.course.onlineShop.payload;

import com.mongodb.lang.NonNull;

import javax.validation.constraints.NotEmpty;

public class ImageFileContainer {
    @NonNull
    private String fileName;
    @NonNull
    private String fileType;
    @NotEmpty
    private byte[] data;

    public ImageFileContainer(String fileName, String fileType, byte[] data){
        this.fileName = fileName;
        this.fileType = fileType;
        this.data = data;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }
}
