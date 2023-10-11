import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ZYDUSPOSTER from "./../assets/zydus_poster.png";
import usersData from "./../lib/users.json";
import { toast } from "react-toastify";
import { useContext, useEffect } from "react";
import { AppContext } from "../context";
import { useLocation, useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { user, setUser } = useContext(AppContext);
  const validationSchema = Yup.object().shape({
    emp_id: Yup.string().required("Employee ID is required"),
    password: Yup.string().required("Password is required").test(checkPass),
  });

  function checkPass() {
    const { parent } = this;
    if (parent.password !== "zydus") {
      return false;
    } else {
      return true;
    }
  }
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, from, navigate]);
  return (
    <div className="pt-6">
      <img src={ZYDUSPOSTER} alt="zydusposter" className="mb-6" />

      <Formik
        initialValues={{
          emp_id: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(val) => {
          console.log(val);
          const checkUser = usersData.find((item) => item.emp_id == val.emp_id);
          if (checkUser) {
            setUser(checkUser);
          } else {
            toast.error("Please enter valid employee id");
          }
          //   console.log(usersData);
        }}
      >
        {({ handleBlur, handleSubmit, isValid, dirty, handleChange }) => (
          <>
            <Form
              className="py-4 px-10 w-full space-y-4"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label htmlFor="emp_id" className="form-label">
                  Enter Employee ID
                </label>
                <Field
                  id="emp_id"
                  name="emp_id"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="form-control"
                />
                <ErrorMessage
                  name="emp_id"
                  component="div"
                  className="hasError"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Enter Your Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="form-control"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="hasError"
                />
              </div>
              <button
                className="btn w-full"
                type="submit"
                disabled={!(isValid && dirty)}
              >
                Login
              </button>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};
export default Login;
