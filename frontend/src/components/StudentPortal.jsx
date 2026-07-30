import React, { useState } from 'react';
import ComplaintForm from './ComplaintForm';
import ComplaintList from './ComplaintList';

export default function StudentPortal() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleComplaintSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      <ComplaintForm onComplaintSubmitted={handleComplaintSubmitted} />
      <ComplaintList refreshTrigger={refreshTrigger} />
    </div>
  );
}
