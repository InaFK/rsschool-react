import React, { useState, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { UseFormRegisterReturn } from 'react-hook-form';

interface CountryAutocompleteProps {
  id: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register?: UseFormRegisterReturn<string>;
}

const CountryAutocomplete = forwardRef<HTMLInputElement, CountryAutocompleteProps>(
  ({ id, name, value, onChange, register }, ref) => {
    const countries = useSelector((state: RootState) => state.form.countries);
    const inputValue = register ? undefined : value;
    const handleChange = register ? register.onChange : onChange;

    const filteredCountries = countries.filter((country) =>
      country
        .toLowerCase()
        .startsWith((inputValue || '').toLowerCase())
    );

    return (
      <div className="autocomplete-container">
        <input
          id={id}
          name={name}
          type="text"
          value={inputValue}
          onChange={handleChange}
          list={`${id}-datalist`}
          className="form-control"
          ref={register ? register.ref : ref}
        />
        <datalist id={`${id}-datalist`}>
          {filteredCountries.map((country) => (
            <option key={country} value={country} />
          ))}
        </datalist>
      </div>
    );
  }
);

CountryAutocomplete.displayName = 'CountryAutocomplete';

export default CountryAutocomplete;