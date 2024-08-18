import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setUncontrolledFormData } from '../store/formSlice';
import './UncontrolledFormPage.css';

const UncontrolledFormPage: React.FC = () => {
  const dispatch = useDispatch();

  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const pictureRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input id="age" ref={ageRef} type="number" className="form-control" />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            ref={emailRef}
            type="email"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            ref={passwordRef}
            type="password"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            ref={confirmPasswordRef}
            type="password"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select id="gender" ref={genderRef} className="form-control">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="termsAccepted">
            <input id="termsAccepted" ref={termsRef} type="checkbox" />
            Accept Terms and Conditions
          </label>
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
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            ref={countryRef}
            type="text"
            className="form-control"
          />
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UncontrolledFormPage;
