import React from 'react';
import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) => (
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

// Function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  return token ? true : false;
};

// Function to get user role
const getUserRole = () => {
  return localStorage.getItem('role');
};

// Private Route component
const PrivateRoute = ({ element, roleRequired, ...rest }) => {
  const tokenExists = isAuthenticated();
  const userRole = getUserRole();
  const authorizedRoles = Array.isArray(roleRequired) ? roleRequired : [roleRequired];

  // Check if the token exists and user has the required role
  if (tokenExists && authorizedRoles.includes(userRole)) {
    return element;
  } else {
    return <Navigate to="/" replace />;
  }
};

// Lazy loaded components
const Status404 = Loader(lazy(() => import('src/content/pages/Status/Status404')));
const Status500 = Loader(lazy(() => import('src/content/pages/Status/Status500')));
const StatusComingSoon = Loader(lazy(() => import('src/content/pages/Status/ComingSoon')));
const StatusMaintenance = Loader(lazy(() => import('src/content/pages/Status/Maintenance')));

const Login = Loader(lazy(() => import('src/content/pages/Login/Login')));
const ForgotPasswordForm = Loader(lazy(() => import('src/content/pages/ForgetPassword/ForgetPassword')));



//PLUGO ADMIN ROUTES
const PlugoDashboard = Loader(lazy(() => import('src/Users/PlugoUser/PlugoDashboard')));
const ClientAdmin = Loader(lazy(() => import('src/Users/PlugoUser/ClientAdmin/ClientAdmin')));
const DepoCLient = Loader(lazy(() => import('src/Users/PlugoUser/DepoCLient/DepoCLient')));
const ServicesCourier = Loader(lazy(() => import('src/Users/PlugoUser/ServicesCourier/ServicesCourier')));
const SubscriptionReq = Loader(lazy(() => import('src/Users/PlugoUser/Subscription/SubscriptionReq')));


//LAMI ADMIN ROUTES
const Dashboard = Loader(lazy(() => import('src/Users/LamiUser/Dashboard/Dashboard')));
// const TicketDetails = Loader(lazy(() => import('src/Users/LamiUser/Ticket/TicketDetails/TicketDetails')));
const TicketList = Loader(lazy(() => import('src/Users/LamiUser/Ticket/TicketList/TicketList')));
const TicketTracker = Loader(lazy(() => import('src/Users/LamiUser/Ticket/TicketTracker/TicketTrackerList')));
const CourierList = Loader(lazy(() => import('src/Users/LamiUser/Courier/CourierList/CourierList')));
const CourierHistory = Loader(lazy(() => import('src/Users/LamiUser/Courier/CourierHistory/CourierHistory')));
const View = Loader(lazy(() => import('src/Users/LamiUser/Ticket/TicketDetails/NewTicketDetails/View')));
const Annonymous = Loader(lazy(() => import('src/Users/LamiUser/Annonymous/Annonymous')));

//Insurance and Invoice
const InsuranceList = Loader(lazy(() => import('src/Users/LamiUser/InsuranceList/InsuranceList')));
const InvoiceList = Loader(lazy(() => import('src/Users/LamiUser/InvoiceList/InvoiceList')));


//COURIERS ROUTES
const DriverCourierList = Loader(lazy(() => import('src/Users/LamiCourierUser/CourierList/CourierList')));
const MyHistory = Loader(lazy(() => import('src/Users/LamiCourierUser/MyHistory/MyHistory')));
const LostOffset = Loader(lazy(() => import('src/Users/LamiCourierUser/LostAndOffset/LostOffset')));


//COUSTOMER ROUTES
const CustomerForm1 = Loader(lazy(() => import('src/Users/CustomerView/CustomerForm1')));
const CustomerForm1View = Loader(lazy(() => import('src/Users/CustomerView/CustomerForm1View')));

const ServiceForm = Loader(lazy(() => import('src/Users/PlugoUser/ServiceInvite/ServiceForm')));
const PendingInvites = Loader(lazy(() => import('src/Users/PlugoUser/ServiceInvite/PendingInvites')));


const CourierView = Loader(lazy(() => import('src/Users/LamiCourierUser/CourierNewDetails/CourierView')));


//CLinet Admin Routes

const ClientDashboard = Loader(lazy(() => import('src/Users/ClientAdminUser/Dashboard/ClientDashboard')));
const ClientDepoList = Loader(lazy(() => import('src/Users/ClientAdminUser/Depo/ClientDepoList')));
const CourierOverview = Loader(lazy(() => import('src/Users/ClientAdminUser/CourierOverview/CourierOverview')));
const SpOverview = Loader(lazy(() => import('src/Users/ClientAdminUser/SpOverview/SpOverview')));
const DepoOverview = Loader(lazy(() => import('src/Users/ClientAdminUser/DepoOverview/DepoOverview')));
const ClientSubscription = Loader(lazy(() => import('src/Users/ClientAdminUser/ClientPlansSubscription/ClientSubscription')));

//Depo Admin Routes
const DepoDashboard = Loader(lazy(() => import('src/Users/DepoAdminUser/DepoDashboard/DepoDashboard')));

const DepoServiceProvider = Loader(lazy(() => import('src/Users/DepoAdminUser/DepoServiceProvider/DepoServiceProvider')));


const getDashboardPath = () => {
  const role = getUserRole();
  switch (role) {
    case 'Plugo_Admin':
      return '/plugo/plugo-dashboard';
    case 'LaMi_Admin':
      return '/lami/lami-dashboard';
    case 'LaMi_Courier':
      return '/lami-courier/dashboard';
    default:
      return '/'; // Default to root or a generic dashboard if needed
  }
};

// Define your routes
const routes: RouteObject[] = [
  {
    path: '',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: isAuthenticated() ? <Navigate to={getDashboardPath()} replace /> : <Login />
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordForm />
      },
      {
        path: '/customer-form/:ticketId/:linkId',
        element: <CustomerForm1 />
      },
      {
        path: '/customer-form-view',
        element: <CustomerForm1View />
      },
      {
        path: '/service-provider-registration',
        element: <ServiceForm />
      },

      {
        path: 'login',
        element: <Navigate to="/" replace />
      },
      {
        path: 'status',
        children: [
          {
            path: '',
            element: <Navigate to="404" replace />
          },
          {
            path: '404',
            element: <Status404 />
          },
          {
            path: '500',
            element: <Status500 />
          },
          {
            path: 'maintenance',
            element: <StatusMaintenance />
          },
          {
            path: 'coming-soon',
            element: <StatusComingSoon />
          }
        ]
      },
      {
        path: '*',
        element: <Status404 />
      }
    ]
  },

  {
    path: '/plugo',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="plugo-dashboard" replace />
      },
      {
        path: 'plugo-dashboard',
        element: (
          <PrivateRoute
            element={<PlugoDashboard />}
            roleRequired="Plugo_Admin"
          />
        )
      },
      {
        path: 'subscription-request',
        element: (
          <PrivateRoute
            element={<SubscriptionReq />}
            roleRequired="Plugo_Admin"
          />
        )
      },
      {
        path: 'client-admin-list',
        element: (
          <PrivateRoute
            element={<ClientAdmin />}
            roleRequired="Plugo_Admin"
          />
        )
      },
      {
        path: 'depo-client-list',
        element: (
          <PrivateRoute
            element={<DepoCLient />}
            roleRequired="Plugo_Admin"
          />
        )
      },
      {
        path: 'services-courier-list',
        element: (
          <PrivateRoute
            element={<ServicesCourier />}
            roleRequired="Plugo_Admin"
          />
        )
      },

    ]
  },
  {
    path: '/lami',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="lami-dashboard" replace />
      },
      {
        path: 'lami-dashboard',
        element: (
          <PrivateRoute
            element={<Dashboard />}
            roleRequired="LaMi_Admin"
          />
        )
      },
      {
        path: 'ticket-ticket_list',
        element: (
          <PrivateRoute
            element={<TicketList />}
            roleRequired="LaMi_Admin"
          />
        )
      },
      {
        path: 'ticket-ticket_list/:driverName/:status',
        element: (
          <PrivateRoute
            element={<TicketList />}
            roleRequired="LaMi_Admin"
          />
        )
      },
      // {
      //   path: 'ticket-ticket_details/:ticketId',
      //   element: (
      //     <PrivateRoute
      //       element={<TicketDetails />}
      //       roleRequired="LaMi_Admin"
      //     />
      //   )
      // },
      {
        path: 'ticket-ticket_details_new/:ticketId',
        element: (
          <PrivateRoute
            element={<View />}
            roleRequired="LaMi_Admin"
          />
        )
      },

      {
        path: 'ticket-ticket_tracker',
        element: (
          <PrivateRoute
            element={<TicketTracker />}
            roleRequired="LaMi_Admin"
          />
        )
      },

      {
        path: 'courier-courier_list',
        element: (
          <PrivateRoute
            element={<CourierList />}
            roleRequired="LaMi_Admin"
          />
        )
      },
      {
        path: 'courier-courier_history',
        element: (
          <PrivateRoute
            element={<CourierHistory />}
            roleRequired="LaMi_Admin"
          />
        )
      },
      {
        path: 'annonymous-list',
        element: (
          <PrivateRoute
            element={<Annonymous />}
            roleRequired="LaMi_Admin"
          />
        )
      },
      {
        path: 'insurance-list',
        element: (
          <PrivateRoute
            element={<InsuranceList />}
            roleRequired="LaMi_Admin"
          />
        )
      },
      {
        path: 'invoice-list',
        element: (
          <PrivateRoute
            element={<InvoiceList />}
            roleRequired="LaMi_Admin"
          />
        )
      },

    ]
  },

  {
    path: '/lami-courier',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="courier-list" replace />
      },
      {
        path: 'courier-list',
        element: (
          <PrivateRoute
            element={<DriverCourierList />}
            roleRequired="LaMi_Courier"
          />
        )
      },

      {
        path: 'courier-list-detail-new/:ticketId',
        element: (
          <PrivateRoute
            element={<CourierView />}
            roleRequired="LaMi_Courier"
          />
        )
      },

      {
        path: 'dashboard',
        element: (
          <PrivateRoute
            element={<MyHistory />}
            roleRequired="LaMi_Courier"
          />
        )
      },
      {
        path: 'lost&offset-list',
        element: (
          <PrivateRoute
            element={<LostOffset />}
            roleRequired="LaMi_Courier"
          />
        )
      },

    ]
  },
















  {
    path: '/client-admin',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" replace />
      },
      {
        path: 'dashboard',
        element: (
          <PrivateRoute
            element={<ClientDashboard />}
            roleRequired="Client_Admin"
          />
        )
      },

      {
        path: 'depo-list',
        element: (
          <PrivateRoute
            element={<ClientDepoList />}
            roleRequired="Client_Admin"
          />
        )
      },
      {
        path: 'pending-invites',
        element: (
          <PrivateRoute
            element={<PendingInvites />}
            roleRequired="Client_Admin"
          />
        )
      },
      {
        path: 'courier-overview',
        element: (
          <PrivateRoute
            element={<CourierOverview />}
            roleRequired="Client_Admin"
          />
        )
      },
      {
        path: 'service-provider-overview',
        element: (
          <PrivateRoute
            element={<SpOverview />}
            roleRequired="Client_Admin"
          />
        )
      },
      {
        path: 'depo-overview',
        element: (
          <PrivateRoute
            element={<DepoOverview />}
            roleRequired="Client_Admin"
          />
        )
      },
      {
        path: 'plans-subscription',
        element: (
          <PrivateRoute
            element={<ClientSubscription />}
            roleRequired="Client_Admin"
          />
        )
      }


    ]
  },


  {
    path: '/depo-admin',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" replace />
      },
      {
        path: 'dashboard',
        element: (
          <PrivateRoute
            element={<DepoDashboard />}
            roleRequired="Depo_Admin"
          />
        )
      },

      {
        path: 'service-provider-list',
        element: (
          <PrivateRoute
            element={<DepoServiceProvider />}
            roleRequired="Depo_Admin"
          />
        )
      },
      {
        path: 'pending-invites',
        element: (
          <PrivateRoute
            element={<PendingInvites />}
            roleRequired="Depo_Admin"
          />
        )
      },
      {
        path: 'courier-overview',
        element: (
          <PrivateRoute
            element={<CourierOverview />}
            roleRequired="Depo_Admin"
          />
        )
      },
      {
        path: 'service-provider-overview',
        element: (
          <PrivateRoute
            element={<SpOverview />}
            roleRequired="Depo_Admin"
          />
        )
      },
      {
        path: 'depo-overview',
        element: (
          <PrivateRoute
            element={<DepoOverview />}
            roleRequired="Depo_Admin"
          />
        )
      },
      {
        path: 'plans-subscription',
        element: (
          <PrivateRoute
            element={<ClientSubscription />}
            roleRequired="Depo_Admin"
          />
        )
      }


    ]
  }
];

export default routes;
