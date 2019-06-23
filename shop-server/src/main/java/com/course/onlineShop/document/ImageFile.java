package com.course.onlineShop.document;

import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Document(collection="Images")
public class ImageFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    private String fileName;

    private String fileType;

    private byte[] data;

    public ImageFile(String fileName, String fileType, byte[] data) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.data = data;
    }

    public void setId(String id){
        this.id = id;
    };

    public String getId(){
        return this.id;
    }

    public void setFileName(String fileName){
        this.fileName = fileName;
    };

    public String getFileName(){
        return this.fileName;
    }

    public void setFileType(String fileType){
        this.id = fileType;
    };

    public String getFileType(){
        return this.fileType;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }
}
