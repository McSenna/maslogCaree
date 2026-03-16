import { Alert } from "react-native";

 const validateForm = (fullname, dateOfBirth, email, password, confirmPassword, gender, address) => {
    if (!fullname || !dateOfBirth || !email || !password || !confirmPassword || !gender || !address) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Password and confirm password must match.");
      return false;
    }
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}[\]|:";'<>?,./]{8,}$/;
    if (!passwordPattern.test(password)) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 8 characters and contain at least one letter and one number."
      );
      return false;
    }
    return true;
  };

export default validateForm;