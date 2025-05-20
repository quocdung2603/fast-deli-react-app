import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Button,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "expo-router";
import { useAuth } from "@/app/Context/AuthContext";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { Formik } from "formik";
const Register = () => {
  const nav = useNavigation<any>();
  const { register } = useAuth();
  const { t } = useTranslation();

  const registerSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phoneNumber: Yup.string().required("Phone is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string().required("Comfirm Password is required")
  });
  const initialValues = {
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: false,
    password: "",
    confirmPassword: "",
  };
  const [error, setError] = useState("");




  
  return (
    <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
      <Image
        source={require("../../images/logo-white.png")}
        resizeMode="contain"
        style={styles.logo}
      />
      <Text style={styles.title}>{t("signup")}</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Formik
        initialValues={initialValues}
        validationSchema={registerSchema}
        onSubmit={(values) => {
          console.log("Data submit:",values);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder={t("fullname")}
              placeholderTextColor="#666"
              value={values.fullName}
              onChangeText={handleChange("fullName")}
              onBlur={handleBlur("fullName")}
            ></TextInput>
             {touched.fullName && errors.fullName && <Text style={{ color: 'red' }}>{errors.fullName}</Text>}
            <TextInput
              style={styles.input}
              placeholder={t("email")}
              placeholderTextColor="#666"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              keyboardType="email-address"
            />
            {touched.email && errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
            <TextInput
              style={styles.input}
              placeholder={t("phonenumber")}
              placeholderTextColor="#666"
              value={values.phoneNumber}
              onChangeText={handleChange("phoneNumber")}
              onBlur={handleBlur("phoneNumber")}
              keyboardType="phone-pad"
            />
            {touched.phoneNumber && errors.phoneNumber && <Text style={{ color: 'red' }}>{errors.phoneNumber}</Text>}
            <TextInput
              style={styles.input}
              placeholder={t("password")}
              placeholderTextColor="#666"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
            />
            {touched.password && errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}
            <TextInput
              style={styles.input}
              placeholder={t("confirmpassword")}
              placeholderTextColor="#666"
              secureTextEntry
              value={values.confirmPassword}
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
            />
            {touched.confirmPassword && errors.confirmPassword && <Text style={{ color: 'red' }}>{errors.confirmPassword}</Text>}
            <TouchableOpacity
              style={styles.button}
              onPress={()=>{handleSubmit()}}
            >
              <Text style={styles.buttonText}>{t("signup")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => nav.navigate("Login")}>
              <Text style={styles.loginLink}>{t("haveAccount")}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginVertical: 20,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    color: "#333",
    marginVertical: 10,
    fontFamily: "Cairo-Bold",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontFamily: "Cairo-Regular",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginTop: 20,
    fontFamily: "Cairo-Regular",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#53045F",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Cairo-SemiBold",
  },
  loginLink: {
    color: "#53045F",
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    textDecorationLine: "underline",
    textAlign: "center",
    paddingVertical: 20,
    marginVertical: 20,
  },
});
