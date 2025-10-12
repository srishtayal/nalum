import React from 'react';

interface ProfileStepProps {
  title: string;
  children: React.ReactNode;
}

const ProfileStep: React.FC<ProfileStepProps> = ({ title, children }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
};

export default ProfileStep;
