package com.course.onlineShop.service;

import com.course.onlineShop.document.ImageFile;
import com.course.onlineShop.exception.FileStorageException;
import com.course.onlineShop.exception.MyFileNotFoundException;
import com.course.onlineShop.repository.ImageFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class FileStorageService {

    @Autowired
    private ImageFileRepository imageFileRepository;

    public ImageFile storeFile(MultipartFile file){

        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try{
            if(fileName.contains("..")){
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            ImageFile imageFile = new ImageFile(fileName,file.getContentType(),file.getBytes());

            return imageFileRepository.save(imageFile);
        } catch (IOException ex){
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public ImageFile getFile(String fileId){
        return imageFileRepository.findById(fileId)
                .orElseThrow(() -> new MyFileNotFoundException("File not found with id " + fileId));
    }
}
