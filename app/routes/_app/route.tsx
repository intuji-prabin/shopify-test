import {
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useSubmit,
} from '@remix-run/react';
import { ActionFunctionArgs, json } from '@remix-run/server-runtime';
import { useEffect, useState } from 'react';
import { useEventSource } from 'remix-utils/sse/react';
import BottomHeader from '~/components/ui/layouts/bottom-header';
import DesktopFooter from '~/components/ui/layouts/desktopFooter';
import { HamburgerMenuProvider } from '~/components/ui/layouts/elements/HamburgerMenuContext';
import MobileNav from '~/components/ui/layouts/elements/mobile-navbar/mobile-nav';
import TopHeader from '~/components/ui/layouts/top-header';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { CART_SESSION_KEY } from '~/lib/constants/cartInfo.constant';
import { ImpersonationMessage, UserRoleChangedMessage } from '~/lib/constants/event.toast.message';
import { EVENTS } from '~/lib/constants/events.contstent';
import { Routes } from '~/lib/constants/routes.constent';
import { AbilityContext, DEFAULT_ABILITIES } from '~/lib/helpers/Can';
import { defineAbilitiesForUser } from '~/lib/helpers/roles';
import { USER_SESSION_ID, isAuthenticate } from '~/lib/utils/auth-session.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
} from '~/lib/utils/toast-session.server';
import { USER_DETAILS_KEY, getUserDetails, getUserDetailsSession } from '~/lib/utils/user-session.server';
import {
  getCagetoryList,
  getSessionData
} from '~/routes/_app/app.server';
import { CustomerData, getCustomerByEmail } from '~/routes/_public.login/login.server';
import { AuthError } from '../../components/ui/authError';
import { getFooter } from './footer.server';

export interface Payload {
  type: 'cart' | 'wishlist' | 'productGroup ' | 'notification';
  totalNumber: any;
  companyId?: string;
  customerId?: string;
  sessionId?: string;
  action?: string;
}

export interface Handlers {
  [key: string]: () => void;
}
interface Data {
  customerId: string;
  message: string;
  // Add other properties if present in your data
}

export async function loader({ request, context }: ActionFunctionArgs) {
  await isAuthenticate(context);
  let { userDetails } = await getUserDetails(request);
  // to get the total wishlist, pending order, cart and notification count in the header
  const sessionData: any = await getSessionData(request, userDetails, context);
  const { session } = context;
  const impersonateCheck = userDetails?.impersonateEnable;
  if (!impersonateCheck) {
    const userDetailsSession = await getUserDetailsSession(request);
    userDetailsSession.unset(USER_DETAILS_KEY);
    userDetails = await getCustomerByEmail({
      context,
      email: userDetails.email,
    });
    userDetailsSession.set(USER_DETAILS_KEY, userDetails);
  }

  const userSessionId = session.get(USER_SESSION_ID);

  const categories = await getCagetoryList(context);
  const footer = await getFooter(context);

  const messageSession = await getMessageSession(request);

  const productGroup = sessionData?.productGroup;

  const totalNotifications = sessionData?.notification;

  const wishlistSession = sessionData?.wishlist;

  const headers = [] as any;

  const sessionCartInfo = sessionData?.cartDetails;
  if (sessionCartInfo) {
    const finalCartSession = {
      cartId: sessionCartInfo?.cartId,
      lineItems: sessionCartInfo?.lineItems,
    };
    context.session.set(CART_SESSION_KEY, finalCartSession);
    headers.push(['Set-Cookie', await context.session.commit({})]);
  }

  if (!categories) {
    setErrorMessage(messageSession, 'Category not found');
    headers.push(['Set-Cookie', await messageCommitSession(messageSession)]);
  }

  return json(
    {
      categories: categories ? categories : [],
      userDetails,
      sessionCartInfo,
      wishlistSession,
      pendingOrderCount: productGroup ?? 0,
      notificationCount: totalNotifications ?? 0,
      userSessionId,
      footer,
    },
    {
      headers,
    },
  );
}

export default function PublicPageLayout() {
  const {
    categories,
    userDetails,
    sessionCartInfo,
    wishlistSession,
    pendingOrderCount,
    notificationCount,
    userSessionId,
    footer,
  } = useLoaderData<typeof loader>();

  const submit = useSubmit();
  let cartCount = sessionCartInfo?.lineItems ?? 0;
  let wishlistCount = wishlistSession ?? 0;
  const [ability, setAbility] = useState(DEFAULT_ABILITIES);

  const [pendingOrderCounts, setPendingOrderCounts] = useState(
    pendingOrderCount | 0,
  );
  const [notificationCounts, setNotificationCounts] = useState(
    notificationCount | 0,
  );

  //Here this is for pending order count when sse hit
  useEffect(() => {
    setPendingOrderCounts(pendingOrderCount);
  }, [pendingOrderCount]);

  function getUserAbilities(roleData: any) {
    // if (roleData.value === 'admin-service-provider') {
    //   return defineAbilitiesForAdmin();
    // } else {
    return defineAbilitiesForUser(roleData.permission);
    // }
  }

  useEffect(() => {
    const roleData = userDetails?.meta?.user_role;

    if (!roleData) return;

    const userAbility = getUserAbilities(roleData);
    setAbility(userAbility);
  }, [userDetails]);

  const userData = useEventSource(Routes.LOGOUT_SUBSCRIBE, {
    event: EVENTS.LOGOUT.NAME,
  });

  useEffect(() => {
    if (userData) {
      const dataObject = JSON.parse(userData) as Data;
      if (dataObject.customerId === userDetails.id && dataObject.message === UserRoleChangedMessage) {
        submit(
          { message: dataObject.message },
          { method: 'POST', action: '/logout' },
        );
      }
      else if (dataObject.customerId === userDetails.id && dataObject.message === ImpersonationMessage && userDetails.impersonateEnable === true && userDetails.impersonatingUser) {
        submit(
          { message: dataObject.message },
          { method: 'POST', action: '/logout' },
        );
      }
    }
  }, [userData]);

  const hasPermissionBeenUpdated = useEventSource(
    Routes.PERMISSIONS_SUBSCRIBE,
    {
      event: EVENTS.PERMISSIONS_UPDATED.NAME,
    },
  );

  useEffect(() => {
    // Extract the user role from userDetails
    const userRole = userDetails?.meta?.user_role;
    // Check if hasPermissionBeenUpdated is a string
    if (typeof hasPermissionBeenUpdated === 'string') {
      // Parse the string into an object
      const parsedData = JSON.parse(hasPermissionBeenUpdated) as {
        permissionData: {
          payload: { user_role: string; permission: string[] };
        };
      };

      // Extract role and permissions from parsedData
      const eventUserRole = parsedData.permissionData.payload.user_role;
      const eventUserRolePermissions = parsedData.permissionData.payload;

      // If permissions are empty, logout the user
      if (eventUserRolePermissions.permission.length === 0) {
        submit({}, { method: 'POST', action: '/logout' });
      }

      // Check if the event role matches the user's role
      if (eventUserRole === userRole?.value) {
        let currentUrl = window.location.pathname; // Capture the current URL
        if (currentUrl === '/login') {
          currentUrl = '/';
        }

        //Here ability is created from the event because to reroute the user if it is already in the page whose permission changes
        const userAbility = getUserAbilities(eventUserRolePermissions);
        setAbility(userAbility);

        // Update user session with returnUrl
        submit(
          { returnUrl: currentUrl },
          { method: 'GET', action: '/update-user-session' },
        );
      }
    }
  }, [hasPermissionBeenUpdated]);


  const hasNotificationBeenUpdated = useEventSource(
    Routes.NOTIFICATIONS_SUBSCRIBE,
    {
      event: EVENTS.NOTIFICATIONS_UPDATED.NAME,
    },
  );

  useEffect(() => {
    if (typeof hasNotificationBeenUpdated === 'string') {
      const parsedData = JSON.parse(hasNotificationBeenUpdated) as {
        notificationData: {
          payload: Payload;
        };
      };

      const { type, totalNumber, customerId, companyId, sessionId, action } =
        parsedData.notificationData.payload;
      const currentUrl = window.location.pathname; // Capture the current URL
      const handlers: Handlers = {
        cart: () => {
          if (userDetails.id === customerId && userSessionId !== sessionId) {
            cartCount = totalNumber | 0;
            submit(
              { returnUrl: currentUrl, type, totalNumber },
              { method: 'GET', action: '/update-notifications-session' },
            );
          }
        },
        wishlist: () => {
          if (userDetails?.meta.company_id.companyId === companyId) {
            wishlistCount = totalNumber;
            submit(
              { returnUrl: currentUrl, type, totalNumber },
              { method: 'GET', action: '/update-notifications-session' },
            );
          }
        },
        productGroup: () => {
          if (userDetails?.meta.company_id.companyId === companyId) {
            setPendingOrderCounts(totalNumber);
          }
        },
        notification: () => {
          const loginCustomerId = userDetails?.id;

          //Here if the action is view and the login customer is the same as the customer id then only notification count will be updated
          if (action === 'view') {
            if (loginCustomerId === customerId) {
              setNotificationCounts(totalNumber);
            } else {
              return;
            }
          }
          else {
            const customer = totalNumber.find((c: { customerId: string; }) => c.customerId === loginCustomerId)
            if (customer) {
              setNotificationCounts(customer.notification);
            }
          }
        },
      };

      const handler = handlers[type];
      if (handler) {
        handler();
      }
    }
  }, [hasNotificationBeenUpdated]);


  return (
    <AbilityContext.Provider value={ability}>
      <Layout
        categories={categories}
        cartCount={cartCount}
        userDetails={userDetails}
        wishlistCount={wishlistCount}
        pedingOrderCount={pendingOrderCounts}
        notificationCount={notificationCounts}
        footerData={footer}
      >
        <Outlet />
      </Layout>
    </AbilityContext.Provider>
  );
}

const Layout = ({
  children,
  categories,
  userDetails,
  cartCount,
  wishlistCount,
  pedingOrderCount,
  notificationCount,
  footerData,
}: {
  children: React.ReactNode;
  categories: any;
  userDetails: CustomerData;
  cartCount: number;
  wishlistCount: number;
  pedingOrderCount: number;
  notificationCount: number;
  footerData: any;
}) => {
  const matches = useMediaQuery('(min-width: 768px)');
  const impersonateEnableCheck = userDetails?.impersonateEnable;
  return (
    <HamburgerMenuProvider>
      {impersonateEnableCheck &&
        <div className='bg-secondary-500'>
          <div className='container'>
            <p className='py-2 font-medium text-center'>IMPERSONATING AS <span className='font-semibold capitalize'>{userDetails?.displayName}</span> BY <span className='font-semibold capitalize'>{userDetails?.impersonatingUser?.name}</span></p>
          </div>
        </div>
      }
      {matches ? (
        <header>
          <TopHeader
            cartCount={cartCount}
            userDetails={userDetails}
            wishlistCount={wishlistCount}
            pendingOrderCount={pedingOrderCount}
            notificationCount={notificationCount}
          />
          <BottomHeader categories={categories} />
        </header>
      ) : (
        <MobileNav
          cartCount={cartCount}
          userDetails={userDetails}
          wishlistCount={wishlistCount}
          pendingOrderCount={pedingOrderCount}
          notificationCount={notificationCount}
        />
      )}
      <div className="mb-12">{children}</div>
      <footer>
        <DesktopFooter footerData={footerData} />
      </footer>
    </HamburgerMenuProvider>
  );
};

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    if (error.message.includes("Un-Authorize access") || error.message.includes("Impersonation already deactivate")) {
      return <AuthError errorMessage={error.message} />;
    }
    return (
      <div className="container pt-6">
        <div className="min-h-[400px] flex justify-center items-center ">
          <div className="flex flex-col items-center gap-2">
            <h3>Error has occured</h3>
            <p className="leading-[22px] text-lg text-grey uppercase font-medium text-red-500">
              {error?.message}
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
