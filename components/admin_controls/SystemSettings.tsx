import React from 'react';

export const SystemSettings: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">System Settings</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <label htmlFor="platform-fees" className="text-sm font-medium text-gray-700">Platform Fee (%)</label>
                    <input type="number" id="platform-fees" defaultValue="2.5" className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-700">New Campaign Submissions</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" defaultChecked/>
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 sr-only">Toggle</span>
                    </label>
                </div>
                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-700">Emergency Platform Halt</span>
                     <button className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md">
                        Activate Halt
                    </button>
                </div>
            </div>
        </div>
    );
};
