import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setHookFormData } from '../store/formSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import './HookFormPage.css';

interface FormData {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  termsAccepted: boolean;
  picture: FileList;
  country: string;
}

const schema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[A-Z]/, 'Must start with an uppercase letter')
    .required(),
  age: yup.number().min(0, 'No negative values').required(),
  email: yup.string().email('Invalid email').required(),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), ''], 'Passwords must match')
    .required(),
  gender: yup.string().required(),
  termsAccepted: yup
    .bool()
    .oneOf([true], 'You must accept the terms and conditions'),
  picture: yup.mixed().test('fileSize', 'File Size is too large', (value) => {
    return value && (value as FileList)[0]?.size <= 1024 * 1024;
  }),
  country: yup.string().required(),
});

const HookFormPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const pictureFile = data.picture[0];
    let pictureBase64 = '';

    if (pictureFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        pictureBase64 = reader.result as string;
        dispatch(setHookFormData({ ...data, picture: pictureBase64 }));
        navigate('/');
      };
      reader.readAsDataURL(pictureFile);
    } else {
      dispatch(setHookFormData({ ...data, picture: pictureBase64 }));
      navigate('/');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            {...register('name')}
            type="text"
            className={`form-control ${errors.name ? 'input-error' : ''}`}
          />
          {errors.name && (
            <p className="error-message">{errors.name.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            {...register('age')}
            type="number"
            className={`form-control ${errors.age ? 'input-error' : ''}`}
          />
          {errors.age && <p className="error-message">{errors.age.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            {...register('email')}
            type="email"
            className={`form-control ${errors.email ? 'input-error' : ''}`}
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            {...register('password')}
            type="password"
            className={`form-control ${errors.password ? 'input-error' : ''}`}
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            {...register('confirmPassword')}
            type="password"
            className={`form-control ${errors.confirmPassword ? 'input-error' : ''}`}
          />
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            {...register('gender')}
            className={`form-control ${errors.gender ? 'input-error' : ''}`}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && (
            <p className="error-message">{errors.gender.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="termsAccepted">
            <input
              id="termsAccepted"
              {...register('termsAccepted')}
              type="checkbox"
              className={`form-control ${errors.termsAccepted ? 'input-error' : ''}`}
            />
            Accept Terms and Conditions
          </label>
          {errors.termsAccepted && (
            <p className="error-message">{errors.termsAccepted.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="picture">Picture (PNG, JPEG only, max 1MB)</label>
          <input
            id="picture"
            {...register('picture')}
            type="file"
            className={`form-control ${errors.picture ? 'input-error' : ''}`}
          />
          {errors.picture && (
            <p className="error-message">{errors.picture.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            {...register('country')}
            type="text"
            className={`form-control ${errors.country ? 'input-error' : ''}`}
          />
          {errors.country && (
            <p className="error-message">{errors.country.message}</p>
          )}
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default HookFormPage;
