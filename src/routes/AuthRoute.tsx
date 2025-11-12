import Layout from 'layout';
import React from "react";

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  return (
    <Layout>
      {children}
    </Layout>
  );
};

export default AuthRoute;
