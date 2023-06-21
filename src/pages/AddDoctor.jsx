import { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PicModal from "../components/PicModal";
import { AppContext } from "../context";
import { useNavigate } from "react-router-dom";

const AddDoctor = () => {
  const { setDocInfo, selectedPoster } = useContext(AppContext);
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    doc_name: Yup.string().required("Doctor name is required"),
    doc_contact: Yup.number().required("Doctor contact is required"),
    poster_language: Yup.string().required("Poster language is required"),
    photo: Yup.mixed().when({
      is: null,
      then: Yup.mixed().required(),
      otherwise: Yup.mixed().notRequired(),
    }),
  });

  const [openModal, setOpenModal] = useState({});

  useEffect(() => {
    if (!selectedPoster?.poster_name) {
      navigate("/");
    }
  }, [selectedPoster?.poster_name]);
  return (
    <>
      <div className="grow flex flex-col items-center w-full px-6">
        <Formik
          initialValues={{
            doc_name: "",
            doc_contact: "",
            poster_language: "english",
            photo: null,
          }}
          validationSchema={validationSchema}
          onSubmit={(val) => {
            const data = {
              doc_name: `Dr. ${val.doc_name}`,
              doc_contact: val.doc_contact,
              poster_language: val.poster_language,
              photo: val.photo,
            };
            setDocInfo(data);
            navigate("/download-poster");
          }}
        >
          {({
            handleBlur,
            handleSubmit,
            errors,
            isValid,
            dirty,
            handleChange,
            setFieldValue,
            values,
          }) => (
            <>
              <Form
                className="py-4 px-6 bg-white shadow-xl rounded-xl mt-4 w-full space-y-4"
                onSubmit={handleSubmit}
              >
                <h4 className="text-theme_purple-500 font-bold text-xl text-center">
                  Doctor Details
                </h4>
                <div>
                  {values.photo ? (
                    <div
                      className="border-dashed border-2 border-theme-blue rounded w-[50%] pt-[50%] h-0 mx-auto overflow-hidden relative block"
                      onClick={() => {
                        setOpenModal({
                          show: true,
                          setFieldValue: setFieldValue,
                        });
                      }}
                    >
                      <div className="text-center absolute top-0 left-0 w-full h-full block text-theme-blue">
                        <img
                          src={values.photo}
                          alt="user"
                          className="w-full h-full"
                        />
                        <div className="absolute bottom-0 left-0 w-full bg-gray-900/75 text-white p-2">
                          Edit
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="border-dashed border-2 border-theme-blue rounded w-[50%] pt-[50%] h-0 mx-auto overflow-hidden relative block"
                      onClick={() => {
                        setOpenModal({
                          show: true,
                          setFieldValue: setFieldValue,
                        });
                      }}
                    >
                      <div className="text-center absolute  top-0 left-0 w-full h-full flex items-center justify-center text-theme-blue">
                        <svg
                          className="svg-icon text-[4rem]"
                          viewBox="0 0 20 20"
                          width="143"
                          height="143"
                        >
                          <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
                        </svg>
                        <div className="absolute bottom-0 left-0 w-full bg-gray-900/90 text-white p-2 text-sm">
                          Upload Photo
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="doc_name" className="form-label">
                    Full Name
                  </label>
                  <div className="relative">
                    <Field
                      id="doc_name"
                      name="doc_name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control !pl-9"
                    />
                    <div className="absolute bottom-2 left-3">Dr.</div>
                  </div>
                  <ErrorMessage
                    name="doc_name"
                    component="div"
                    className="hasError"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="doc_contact" className="form-label">
                    Contact Number
                  </label>
                  <div className="relative">
                    <Field
                      id="doc_contact"
                      name="doc_contact"
                      type="number"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control"
                    />
                  </div>
                  <ErrorMessage
                    name="doc_contact"
                    component="div"
                    className="hasError"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="poster_language" className="form-label">
                    Select Poster Language
                  </label>
                  <div className="relative">
                    <Field
                      as="select"
                      id="poster_language"
                      name="poster_language"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control"
                    >
                      {selectedPoster?.lang.length > 0 &&
                        selectedPoster?.lang.map((lang, index) => {
                          return (
                            <option key={index} value={lang}>
                              {lang.toUpperCase()}
                            </option>
                          );
                        })}
                      {/* <option value="hindi">Hindi</option> */}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="poster_language"
                    component="div"
                    className="hasError"
                  />
                </div>

                <button
                  type="submit"
                  className="btn w-full"
                  disabled={!(isValid && dirty)}
                >
                  Submit
                </button>
              </Form>
            </>
          )}
        </Formik>
      </div>
      <PicModal
        show={openModal.show}
        setShow={setOpenModal}
        setFieldValue={openModal.setFieldValue}
      />
    </>
  );
};
export default AddDoctor;
