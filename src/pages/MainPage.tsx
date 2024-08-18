import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const MainPage: React.FC = () => {
  const [newData, setNewData] = useState(false);
  const hookFormData = useSelector(
    (state: RootState) => state.form.hookFormData
  );

  useEffect(() => {
    if (hookFormData) {
      setNewData(true);
      setTimeout(() => setNewData(false), 5000);
    }
  }, [hookFormData]);

  return (
    <div>
      <div style={{ backgroundColor: newData ? 'lightgreen' : 'transparent' }}>
        <h3>Hook Form Data:</h3>
        {hookFormData ? JSON.stringify(hookFormData, null, 2) : 'No Data'}
      </div>
    </div>
  );
};

export default MainPage;
