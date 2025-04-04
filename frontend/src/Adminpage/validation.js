// validation.js

export const validateAddDriver = (driver, image) => {
    let isValid = true;
    let errors = { name: "", phone: "", license_number: "", image: "" };
  
    // Validate name
    if (!driver.name) {
      errors.name = "Name is required.";
      isValid = false;
    }
  
    // Validate phone number (example: should be a 10-digit number)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(driver.phone)) {
      errors.phone = "Phone number must be a 10-digit number.";
      isValid = false;
    }
  
    // Validate license number (example: alphanumeric format)
    const licenseRegex = /^[A-Za-z0-9]{6,10}$/;
    if (!licenseRegex.test(driver.license_number)) {
      errors.license_number = "License number must be between 6-10 alphanumeric characters.";
      isValid = false;
    }
  
    // Validate image (check file type and size)
    if (image) {
      const fileType = image.type.split("/")[0];
      const fileSize = image.size / 1024 / 1024; // MB
  
      if (fileType !== "image") {
        errors.image = "Uploaded file must be an image.";
        isValid = false;
      } else if (fileSize > 5) { // Max size of 5MB
        errors.image = "Image size must be less than 5MB.";
        isValid = false;
      }
    }
  
    return { isValid, errors };
  };
  
  export const validateEditDriver = (driver, image, currentImage) => {
    let isValid = true;
    let errors = { name: "", phone: "", license_number: "", image: "" };
  
    // Validate name
    if (!driver.name) {
      errors.name = "Name is required.";
      isValid = false;
    }
  
    // Validate phone number (example: should be a 10-digit number)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(driver.phone)) {
      errors.phone = "Phone number must be a 10-digit number.";
      isValid = false;
    }
  
    // Validate license number (example: alphanumeric format)
    const licenseRegex = /^[A-Za-z0-9]{6,10}$/;
    if (!licenseRegex.test(driver.license_number)) {
      errors.license_number = "License number must be between 6-10 alphanumeric characters.";
      isValid = false;
    }
  
    // If no image and no current image, show image error
    if (!image && !currentImage) {
      errors.image = "An image must be provided.";
      isValid = false;
    }
  
    return { isValid, errors };
  };
  