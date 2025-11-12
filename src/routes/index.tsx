import Login from 'modules/auth';
import Dashboard from 'modules/dashboard';
import Tokens from 'modules/tokens';
import Whitelist from 'modules/waitlist'
import PageNotFound from 'modules/pageNotFound';
import { RouteConfig } from "type/types";
import { routes } from "./route";

export const AllRoutes: RouteConfig[] = [
  {
    path: routes.ROUTE_LOGIN,
    page: <Login />,
    isPrivate: false,
  },
  {
    path: routes.ROUTE_DASHBOARD,
    page: <Dashboard />,
    isPrivate: true,
  },
  {
    path: routes.ROUTE_PAGE_NOTE_FOUND,
    page: <PageNotFound />,
    isPrivate: true,
  },
  {
    path: routes.ROUTE_TOKENS,
    page: <Tokens />,
    isPrivate: true,
  },
  {
    path: routes.ROUTE_WHITELIST,
    page: <Whitelist />,
    isPrivate: true,
  },
];
