import * as Yup from "yup";
const validationSchema = Yup.object().shape({
  account: Yup.string().required("Account cannot be blank!"),
  password: Yup.string()
    .required("Password is required!")
    .min(6, "Password must have min 6 characters")
    .max(32, "Password have max 32 characters"),
});

export default validationSchema;
