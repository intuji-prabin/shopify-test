import {
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useSubmit,
} from '@remix-run/react';
import {ActionFunctionArgs, json} from '@remix-run/server-runtime';
import {useEffect, useState} from 'react';
import {useEventSource} from 'remix-utils/sse/react';
import BottomHeader from '~/components/ui/layouts/bottom-header';
import DesktopFooter from '~/components/ui/layouts/desktopFooter';
import {HamburgerMenuProvider} from '~/components/ui/layouts/elements/HamburgerMenuContext';
import MobileNav from '~/components/ui/layouts/elements/mobile-navbar/mobile-nav';
import TopHeader from '~/components/ui/layouts/top-header';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {CART_SESSION_KEY} from '~/lib/constants/cartInfo.constant';
import {Routes} from '~/lib/constants/routes.constent';
import {WISHLIST_SESSION_KEY} from '~/lib/constants/wishlist.constant';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
} from '~/lib/utils/toast-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {CustomerData} from '~/routes/_public.login/login.server';
import {
  getCagetoryList,
  getOrderId,
  getSessionCart,
  getSessionData,
} from '~/routes/_app/app.server';
import {getProductGroup} from '~/routes/_app.pending-order/pending-order.server';
import {EVENTS} from '~/lib/constants/events.contstent';
import { defineAbilitiesForAdmin, defineAbilitiesForUser } from '~/lib/helpers/roles';
import { AbilityContext, DEFAULT_ABILITIES } from '~/lib/helpers/Can';
import { LOCAL_STORAGE_KEYS } from '~/lib/constants/general.constant';
import StorageService from '~/services/storage.service';


export async function loader({request, context}: ActionFunctionArgs) {
  await isAuthenticate(context);
  const {userDetails} = await getUserDetails(request);

  const sessionData = await getSessionData(userDetails, context);
  const categories = await getCagetoryList(context);
  const messageSession = await getMessageSession(request);
  let sessionCartInfo = await context.session.get(CART_SESSION_KEY);

  const productGroup = await getProductGroup({customerId: userDetails.id});

  const headers = [] as any;
  const wishlistSession = await context.session.get(WISHLIST_SESSION_KEY);

  if (!sessionCartInfo) {
    sessionCartInfo = await getSessionCart(userDetails?.id, context);
    if (sessionCartInfo) {
      const finalCartSession = {
        cartId: sessionCartInfo?.cartId,
        lineItems: sessionCartInfo?.lineItems,
      };
      context.session.set(CART_SESSION_KEY, finalCartSession);
      headers.push(['Set-Cookie', await context.session.commit({})]);
    }
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
      pendingOrderCount: productGroup?.length ?? 0,
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
  } = useLoaderData<typeof loader>();

  const submit = useSubmit();

  const cartCount = sessionCartInfo?.lineItems ?? 0;
  const wishlistCount = wishlistSession ?? 0;
  const [ability, setAbility] = useState(DEFAULT_ABILITIES);
  const [loading, setLoading] = useState(true);

  function getUserAbilities(roleData: any) {
    if (roleData.value !== 'admin') {
      return defineAbilitiesForUser(roleData.permission);
    } else {
      return defineAbilitiesForAdmin();
    }
  }
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const storageService = new StorageService(); // Assuming StorageService is a class
        // const permissions = storageService.get(LOCAL_STORAGE_KEYS.PERMISSIONS);
        
        // if (permissions) {
        //   setAbility(getUserAbilities(permissions));
        // } else {
          const roleData = userDetails?.meta?.user_role;
          if (!roleData) throw new Error('User role data not available.');
  
          const userAbility = getUserAbilities(roleData);
          setAbility(userAbility);
        //   storageService.set(LOCAL_STORAGE_KEYS.PERMISSIONS, roleData);
        // }
      } catch (error) {
        console.error('Error fetching role data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [userDetails]); // Add userDetails to dependencies to re-run effect when it changes
  

  const userId = useEventSource(Routes.LOGOUT_SUBSCRIBE, {
    event: EVENTS.LOGOUT.NAME,
  });
  useEffect(() => {
    if (userId === userDetails.id) {
      submit({}, {method: 'POST', action: '/logout'});
    }
  }, [userId]);
  

  // const permissionsStream = useEventSource(Routes.PERMISSIONS_SUBSCRIBE, {
  //   event: EVENTS.PERMISSIONS_UPDATED.NAME,
  // });

  // useEffect(() => {
  //   console.log('Permissions stream:', permissionsStream);
  //   if (!permissionsStream) return;

  //   try {
  //     const permissions = JSON.parse(permissionsStream);

  //     // Update the user's abilities based on the received permissions
  //     const userAbility = getUserAbilities(permissions);
  //     console.log('User abilities updated:', userAbility);
  //     // Update the ability state with the new abilities
  //     setAbility(userAbility);
  //   } catch (error) {
  //     console.error('Error handling permissions update:', error);
  //   }
  // }, [permissionsStream])
  

  return (
    <AbilityContext.Provider value={ability}>
      <Layout
        categories={categories}
        cartCount={cartCount}
        userDetails={userDetails}
        wishlistCount={wishlistCount}
        pedingOrderCount={pendingOrderCount}
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
}: {
  children: React.ReactNode;
  categories: any;
  userDetails: CustomerData;
  cartCount: number;
  wishlistCount: number;
  pedingOrderCount: number;
}) => {
  const matches = useMediaQuery('(min-width: 768px)');
  return (
    <HamburgerMenuProvider>
      {matches ? (
        <header>
          <TopHeader
            cartCount={cartCount}
            userDetails={userDetails}
            wishlistCount={wishlistCount}
            pendingOrderCount={pedingOrderCount}
          />
          <BottomHeader categories={categories} />
        </header>
      ) : (
        <MobileNav
          cartCount={cartCount}
          userDetails={userDetails}
          wishlistCount={wishlistCount}
          pendingOrderCount={pedingOrderCount}
        />
      )}
      <div className="mb-12">{children}</div>

      <footer>
        <DesktopFooter />
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