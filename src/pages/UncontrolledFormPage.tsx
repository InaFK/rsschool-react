import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUncontrolledFormData } from '../store/formSlice';
import * as yup from 'yup';
import './UncontrolledFormPage.css';

const schema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[A-Z][a-z]*$/, 'Name must start with an uppercase letter')
    .required('Name is required'),
  age: yup
    .number()
    .typeError('Age must be a number')
    .positive('Age must be positive')
    .integer('Age must be an integer')
    .required('Age is required'),
  email: yup
    .string()
    .email('Invalid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  gender: yup
    .string()
    .notOneOf([''], 'Gender is required')
    .required('Gender is required'),
  termsAccepted: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required(),
  picture: yup
    .mixed()
    .test('fileSize', 'File size is too large (max 1MB)', (value) => {
      return !value || (value && (value as File).size <= 1024 * 1024);
    })
    .test('fileType', 'Unsupported file format (PNG, JPEG only)', (value) => {
      return !value || (value && ['image/png', 'image/jpeg'].includes((value as File).type));
    }),
  country: yup
    .string()
    .required('Country is required'),
});

const UncontrolledFormPage: React.FC = () => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const pictureRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);

  const validateForm = async () => {
    const formData = {
      name: nameRef.current?.value || '',
      age: Number(ageRef.current?.value) || undefined,
      email: emailRef.current?.value || '',
      password: passwordRef.current?.value || '',
      confirmPassword: confirmPasswordRef.current?.value || '',
      gender: genderRef.current?.value || '',
      termsAccepted: termsRef.current?.checked || false,
      picture: pictureRef.current?.files?.[0],
      country: countryRef.current?.value || '',
    };

    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      setIsFormValid(true);
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errorMessages = error.inner.reduce((acc, err) => ({
          ...acc,
          [err.path]: err.message,
        }), {});
        setErrors(errorMessages);
        setIsFormValid(false);
        return false;
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) return;

    const pictureFile = pictureRef.current?.files?.[0];
    let pictureBase64 = '';
    if (pictureFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        pictureBase64 = reader.result as string;
        dispatch(
          setUncontrolledFormData({
            name: nameRef.current?.value || '',
            age: Number(ageRef.current?.value) || 0,
            email: emailRef.current?.value || '',
            password: passwordRef.current?.value || '',
            gender: genderRef.current?.value || '',
            termsAccepted: termsRef.current?.checked || false,
            picture: pictureBase64,
            country: countryRef.current?.value || '',
          })
        );
      };
      reader.readAsDataURL(pictureFile);
    } else {
      dispatch(
        setUncontrolledFormData({
          name: nameRef.current?.value || '',
          age: Number(ageRef.current?.value) || 0,
          email: emailRef.current?.value || '',
          password: passwordRef.current?.value || '',
          gender: genderRef.current?.value || '',
          termsAccepted: termsRef.current?.checked || false,
          picture: pictureBase64,
          country: countryRef.current?.value || '',
        })
      );
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" ref={nameRef} type="text" className="form-control" />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input id="age" ref={ageRef} type="number" className="form-control" />
          {errors.age && <p className="error-message">{errors.age}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            ref={emailRef}
            type="email"
            className="form-control"
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            ref={passwordRef}
            type="password"
            className="form-control"
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            ref={confirmPasswordRef}
            type="password"
            className="form-control"
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select id="gender" ref={genderRef} className="form-control">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p className="error-message">{errors.gender}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="termsAccepted">
            <input id="termsAccepted" ref={termsRef} type="checkbox" />
            Accept Terms and Conditions
          </label>
          {errors.termsAccepted && <p className="error-message">{errors.termsAccepted}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="picture">Picture (PNG, JPEG only, max 1MB)</label>
          <input
            id="picture"
            ref={pictureRef}
            type="file"
            className="form-control"
            accept="image/png, image/jpeg"
          />
          {errors.picture && <p className="error-message">{errors.picture}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            ref={countryRef}
            type="text"
            className="form-control"
          />
          {errors.country && <p className="error-message">{errors.country}</p>}
        </div>

        <button type="submit" className="submit-button" disabled={!isFormValid}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default UncontrolledFormPage;
