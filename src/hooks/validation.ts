
import { showAlert } from "@/utils/notify";
const validateForm = (
  fullname: string,
  dateOfBirth: string,
  email: string,
  password: string,
  confirmPassword: string,
  gender: string,
  address: string
) => {
  if (!fullname || !dateOfBirth || !email || !password || !confirmPassword || !gender || !address) {
    showAlert("Missing Information", "Please fill in all required fields.");
    return false;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    showAlert("Invalid Email", "Please enter a valid email address.");
    return false;
  }
  if (password !== confirmPassword) {
    showAlert("Password Mismatch", "Password and confirm password must match.");
    return false;
  }
  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}[\]|:";'<>?,./]{8,}$/;
  if (!passwordPattern.test(password)) {
    showAlert(
      "Weak Password",
      "Password must be at least 8 characters and contain at least one letter and one number."
    );
    return false;
  }
  return true;
};

export default validateForm;