// validation.js

// For adding a driver
export const validateAddDriver = (driver, image) => {
  let isValid = true;
  let errors = { name: "", phone: "", email: "", license_number: "", image: "" };

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

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!driver.email) {
    errors.email = "Email is required.";
    isValid = false;
  } else if (!emailRegex.test(driver.email)) {
    errors.email = "Invalid email format.";
    isValid = false;
  }

  // Validate license number (Nepali license number pattern)
  const licenseRegex = /^[A-Za-z]{2,3}\s?[0-9]{4}$/;
  if (!licenseRegex.test(driver.license_number)) {
    errors.license_number = "License number must be in a valid Nepali format (e.g., ABC 1234).";
    isValid = false;
  }

  // Validate image
  if (image) {
    const fileType = image.type.split("/")[0];
    const fileSize = image.size / 1024 / 1024; // MB

    if (fileType !== "image") {
      errors.image = "Uploaded file must be an image.";
      isValid = false;
    } else if (fileSize > 5) {
      errors.image = "Image size must be less than 5MB.";
      isValid = false;
    }
  }

  return { isValid, errors };
};

// For editing a driver
export const validateEditDriver = (driver, image, currentImage, updateAvailability = false) => {
  let isValid = true;
  let errors = { name: "", phone: "", email: "", license_number: "", image: "" };

  // Skip validations if only updating availability
  if (updateAvailability) return { isValid, errors };

  // Validate name
  if (!driver.name) {
    errors.name = "Name is required.";
    isValid = false;
  }

  // Validate phone number
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(driver.phone)) {
    errors.phone = "Phone number must be a 10-digit number.";
    isValid = false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!driver.email) {
    errors.email = "Email is required.";
    isValid = false;
  } else if (!emailRegex.test(driver.email)) {
    errors.email = "Invalid email format.";
    isValid = false;
  }

  // Validate license number
  const licenseRegex = /^[A-Z]{2,3}\s?\d{4}$/;
  if (!licenseRegex.test(driver.license_number.trim().toUpperCase())) {
    errors.license_number = "License number must be in a valid format (e.g., ABC 1234 or ABC1234).";
    isValid = false;
  }

  // Require image if no current image
  if (!image && !currentImage) {
    errors.image = "An image must be provided.";
    isValid = false;
  }

  return { isValid, errors };
};
