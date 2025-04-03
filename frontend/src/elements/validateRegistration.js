// src/utils/validateRegistration.js

export const validateRegistration = ({ name, email, password, confirmPassword, number, city, age }) => {
  const errors = [];

  // Check if any required field is empty
  if (!name || !email || !password || !confirmPassword || !number || !city || !age) {
    errors.push("All fields are required.");
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    errors.push("Passwords do not match.");
  }

  // Password validation
  if (password) {
    // Password length check (e.g., minimum 8 characters)
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    // Password complexity check (requires at least 1 uppercase letter)
    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
  }

  // Validate email format (accepts gmail.com or any other domain)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (email && !emailRegex.test(email)) {
    errors.push("Please enter a valid email address.");
  }

  // Validate age (optional, for example, the age should be 18 or above)
  if (age && isNaN(age)) {
    errors.push("Age must be a valid number.");
  }

  if (age && age < 18) {
    errors.push("You must be at least 18 years old.");
  }

  // Validate contact number (optional, for example, the number should be numeric and of appropriate length)
  if (number && isNaN(number)) {
    errors.push("Contact number must be a valid number.");
  }

  return errors;
};
