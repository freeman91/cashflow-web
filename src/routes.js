import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import MainLayout from './layouts/MainLayout';
import DashboardView from './views/main/DashboardView';
import MonthView from './views/main/MonthView';
import YearView from './views/main/YearView';
import NetWorthView from './views/main/NetWorthView';
import SettingsView from './views/main/SettingsView';
import LoginView from './views/auth/LoginView';
import NotFoundView from './views/errors/NotFoundView';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'month', element: <MonthView /> },
      { path: 'year', element: <YearView /> },
      { path: 'networth', element: <NetWorthView /> },
      { path: 'settings', element: <SettingsView /> },
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      //   { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/login" /> },
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
];

export default routes;
