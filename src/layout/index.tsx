import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
  
      {/* Main Content */}
      <main>
        <div className="w-full ">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
