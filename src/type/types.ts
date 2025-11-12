import { ReactNode } from "react";

type RouteConfig = {
    path: string;
    page: React.ReactNode | JSX.Element;
    isPrivate: boolean;
}

export type AuthRouteProps = {
  children: ReactNode;
  isPrivate?: boolean;
}

export type { RouteConfig };

