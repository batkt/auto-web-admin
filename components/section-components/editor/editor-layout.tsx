import { useAuth } from '@/contexts/auth-context';
import React from 'react';

interface EditorLayoutProps {
  children: React.ReactNode;
  preview?: React.ReactNode;
}

const EditorLayout = ({ children, preview }: EditorLayoutProps) => {
  const { currentUser } = useAuth();
  const isAdmin = ['super-admin', 'admin'].includes(currentUser?.role);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          <div className="mb-6 flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">Section Editor</h1>
            <p className="text-gray-600 mt-1">Edit section content and see live preview</p>
          </div>

          {/* Preview Area */}
          <div className="flex-1 overflow-hidden">
            {preview ? (
              <div className="bg-gray-50 rounded-lg p-8 h-full overflow-auto">{preview}</div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 h-full flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">Preview Area</h2>
                  <p className="text-gray-500">Section preview will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Right Sidebar - Fixed width and full height */}
      {isAdmin && (
        <div className="w-96 border-l border-gray-200 bg-white flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
};

export default EditorLayout;
