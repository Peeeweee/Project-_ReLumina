import React from 'react';
import { UserRole } from '../types';
import { UsersIcon, CubeTransparentIcon, ClipboardDocumentCheckIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '../components/icons';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  onGuestLogin: () => void;
}

const roles: { id: UserRole; name: string; description: string; icon: React.ReactNode }[] = [
    { id: 'donor', name: 'Donor', description: 'Contribute to transparent campaigns and track your impact.', icon: <UsersIcon className="w-10 h-10"/> },
    { id: 'ngo', name: 'NGO', description: 'Create and manage milestone-based fundraising campaigns.', icon: <CubeTransparentIcon className="w-10 h-10"/> },
    { id: 'volunteer', name: 'Volunteer', description: 'Help verify on-the-ground project milestones.', icon: <ClipboardDocumentCheckIcon className="w-10 h-10"/> },
    { id: 'admin', name: 'Admin', description: 'Oversee platform activity and approve campaigns.', icon: <Cog6ToothIcon className="w-10 h-10"/> },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGuestLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="text-center mb-12 animate-fade-in-up">
        <div className="flex items-center justify-center space-x-3 mb-4">
            <svg className="w-12 h-12 text-brand-blue" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 7l9 5 9-5M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="font-bold text-5xl text-brand-gray-dark">ReLumina</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Welcome to the Future of Transparent Aid</h1>
        <p className="mt-2 text-gray-600 max-w-xl mx-auto">Please select your role to sign in and access your dashboard. Your actions help build a more accountable and impactful world.</p>
      </div>
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roles.map((role, index) => (
            <div 
              key={role.id}
              className="animate-fade-in-up opacity-0"
              style={{ animationDelay: `${150 * (index + 1)}ms`}}
            >
              <button 
                  onClick={() => onLogin(role.id)}
                  className="w-full h-full p-8 bg-white rounded-xl shadow-lg border border-gray-200 text-left flex flex-col items-center justify-center text-center transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-brand-blue hover:-translate-y-2 group"
              >
                  <div className="p-4 bg-blue-100 rounded-full text-brand-blue transition-colors duration-300 group-hover:bg-brand-blue group-hover:text-white">
                      {role.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mt-6">{role.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 flex-grow">{role.description}</p>
                  <div className="mt-6 flex items-center space-x-2 text-brand-blue font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span>Sign In</span>
                      <ArrowRightOnRectangleIcon className="w-5 h-5"/>
                  </div>
              </button>
            </div>
        ))}
      </div>

       <div className="text-center mt-12 animate-fade-in-up opacity-0" style={{ animationDelay: '800ms' }}>
            <button onClick={onGuestLogin} className="text-sm text-brand-blue hover:underline">
                Or continue as a Guest to explore campaigns
            </button>
        </div>
    </div>
  );
};
