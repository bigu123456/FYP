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

  // Validate license number (Nepali license number pattern)
  const licenseRegex = /^[A-Za-z]{2,3}\s?[0-9]{4}$/; // A simple pattern for Nepali license number
  if (!licenseRegex.test(driver.license_number)) {
    errors.license_number = "License number must be in a valid Nepali format (e.g., ABC 1234).";
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

export const validateEditDriver = (driver, image, currentImage, updateAvailability = false) => {
  let isValid = true;
  let errors = { name: "", phone: "", license_number: "", image: "" };

  // If availability is being updated and no other fields are required
  if (updateAvailability) {
    return { isValid, errors }; // Just return the current validity (no need to validate other fields)
  }

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

  // Validate license number (Nepali license number pattern)
  const licenseRegex = /^[A-Za-z]{2,3}\s?[0-9]{4}$/; // Adjust Nepali license number format
  if (!licenseRegex.test(driver.license_number)) {
    errors.license_number = "License number must be in a valid Nepali format (e.g., ABC 1234).";
    isValid = false;
  }

  // If no image and no current image, show image error
  if (!image && !currentImage) {
    errors.image = "An image must be provided.";
    isValid = false;
  }

  return { isValid, errors };
};
