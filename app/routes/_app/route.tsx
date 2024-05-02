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
import {
  defineAbilitiesForAdmin,
  defineAbilitiesForUser,
} from '~/lib/helpers/roles';
import {AbilityContext, DEFAULT_ABILITIES} from '~/lib/helpers/Can';
import {LOCAL_STORAGE_KEYS} from '~/lib/constants/general.constant';
import StorageService from '~/services/storage.service';
import { emitter } from '~/lib/utils/emitter.server';

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



// Function to fetch role data with a 3-second timeout
const fetchRoleDataWithTimeout = () => {
  return new Promise<RoleData>((resolve, reject) => {
    setTimeout(() => {
      // Simulate role data fetched from an API
      const roleData: RoleData = {
        title: 'Admin',
        value: 'test',
        permissions: [
          {
            id: 1,
            value: 'customer_login',
            title: 'Customer Login',
            key: 'login',
          },
          {
            id: 2,
            value: 'password_reset',
            title: 'Password Reset',
            key: 'reset',
          },
          {
            id: 3,
            value: 'customer_logout',
            title: 'Customer Logout',
            key: 'logout',
          },
          {
            id: 4,
            value: 'edit_own_profile',
            title: 'Edit Own Profile',
            key: 'edit_profile',
          },
          {
            id: 5,
            value: 'edit_other_profile',
            title: 'Edit Other Profile',
            key: 'edit_other_profile',
          },
          {
            id: 6,
            value: 'change_role',
            title: 'Change Role',
            key: 'view',
          },
          {
            id: 7,
            value: 'change_status',
            title: 'Change Status',
            key: 'view',
          },
          {
            id: 8,
            value: 'view_team',
            title: 'View Team',
            key: 'view',
          },
          {
            id: 9,
            value: 'search_customers',
            title: 'Search Customers',
            key: 'view',
          },
          {
            id: 10,
            value: 'add_customer',
            title: 'Add Customer',
            key: 'view',
          },
          {
            id: 11,
            value: 'view_categories',
            title: 'View Categories',
            key: 'read_categories',
          },
          {
            id: 12,
            value: 'view_products',
            title: 'View Products',
            key: 'read_products',
          },
          {
            id: 13,
            value: 'view_product_price',
            title: 'View Product Price',
            key: 'read_product_price',
          },
          {
            id: 14,
            value: 'view_product_detail',
            title: 'View Product Detail',
            key: 'view',
          },
          {
            id: 15,
            value: 'view_operating_manual',
            title: 'View Operating Manual',
            key: 'view',
          },
          {
            id: 16,
            value: 'view_service_manual',
            title: 'View Service Manual',
            key: 'read_service_manual',
          },
          {
            id: 17,
            value: 'add_to_cart',
            title: 'Add to Cart',
            key: 'view',
          },
          {
            id: 18,
            value: 'add_to_cart_bulk',
            title: 'Add to Cart Bulk',
            key: 'add_to_cart_bulk',
          },
          {
            id: 19,
            value: 'add_to_wishlist',
            title: 'Add to Wishlist',
            key: 'view',
          },
          {
            id: 20,
            value: 'add_wishlist_to_cart',
            title: 'Add Wishlist to Cart',
            key: 'view',
          },
          {
            id: 21,
            value: 'place_order',
            title: 'Place Order',
            key: 'place_order',
          },
          {
            id: 22,
            value: 'upload_bulk_order',
            title: 'Upload Bulk Order',
            key: 'upload_bulk_order',
          },
          {
            id: 23,
            value: 'search_products',
            title: 'Search Products',
            key: 'search_products',
          },
          {
            id: 24,
            value: 'add_product_list_to_cart',
            title: 'Add Product List to Cart',
            key: 'add_product_list_to_cart',
          },
          {
            id: 25,
            value: 'save_product_list_to_group',
            title: 'Save Product List to Group',
            key: 'save_product_list_to_group',
          },
          {
            id: 26,
            value: 'add_group_to_cart',
            title: 'Add Group to Cart',
            key: 'add_group_to_cart',
          },
          {
            id: 27,
            value: 'view_orders',
            title: 'View Orders',
            key: 'view',
          },
          {
            id: 28,
            value: 'reorder_order',
            title: 'Reorder Order',
            key: 'view',
          },
          {
            id: 29,
            value: 'view_company_statements',
            title: 'View Company Statements',
            key: 'view',
          },
          {
            id: 30,
            value: 'view_company_invoices',
            title: 'View Company Invoices',
            key: 'view',
          },
          {
            id: 31,
            value: 'recieve_user_notifications',
            title: 'Receive User Notifications',
            key: 'receive_user_notifications',
          },
          {
            id: 32,
            value: 'recieve_company_notifications',
            title: 'Receive Company Notifications',
            key: 'receive_company_notifications',
          },
          {
            id: 33,
            value: 'track_order',
            title: 'Track Order',
            key: 'view',
          },
          {
            id: 34,
            value: 'view_tracked_order_detail',
            title: 'View Tracked Order Detail',
            key: 'read_tracked_order_detail',
          },
          {
            id: 35,
            value: 'view_tracked_order_price',
            title: 'View Tracked Order Price',
            key: 'read_tracked_order_price',
          },
          {
            id: 36,
            value: 'customize_promotions',
            title: 'Customize Promotions',
            key: 'view',
          },
          {
            id: 37,
            value: 'edit_promotions',
            title: 'Edit Promotions',
            key: 'view',
          },
          {
            id: 38,
            value: 'export_promotions',
            title: 'Export Promotions',
            key: 'view',
          },
          {
            id: 39,
            value: 'delete_promotions',
            title: 'Delete Promotions',
            key: 'view',
          },
          {
            id: 40,
            value: 'open_ticket',
            title: 'Open Ticket',
            key: 'view',
          },
          
          {
            id: 41,
            value: 'view_company_information',
            title: 'View Company Information',
            key: 'view',
          },
          {
            id: 42,
            value: 'view_shipping_addresses',
            title: 'View Shipping Addresses',
            key: 'view',
          },
          {
            id: 43,
            value: 'view_promotional_banners',
            title: 'View Promotional Banners',
            key: 'view',
          },
          {
            id: 44,
            value: 'view_monthly_spending',
            title: 'View Monthly Spending',
            key: 'view',
          },
          {
            id: 45,
            value: 'view_total_spending',
            title: 'View Total Spending',
            key: 'view',
          },
          {
            id: 46,
            value: 'view_total_invoicing',
            title: 'View Total Invoicing',
            key: 'view',
          },
          {
            id: 47,
            value: 'view_expenditure',
            title: 'View Expenditure',
            key: 'view',
          },
          {
            id: 48,
            value: 'view_spending_list',
            title: 'View Spending List',
            key: 'view',
          },
          {
            id: 49,
            value: 'view_transaction_history',
            title: 'View Transaction History',
            key: 'view',
          },
          {
            id: 50,
            value: 'ticket_operations',
            title: 'Ticket Operations',
            key: 'view',
          },
          {
            id: 51,
            value: 'view_contact_details',
            title: 'View Contact Details',
            key: 'view',
          },
          {
            id: 52,
            value: 'allow_impersonation',
            title: 'Allow Impersonation',
            key: 'view',
          },
          {
            id: 53,
            value: 'conformance_certificates',
            title: 'Conformance Certificates',
            key: 'view',
          },


        ],
      };
      resolve(roleData);
    }, 1000); // Simulate 3-second delay
  });
};

// Define an interface for role data
interface RoleData {
  title: string;
  value: string;
  permissions: {
    id: number;
    value: string;
    title: string;
    key: string;
  }[];
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
  console.log('userDetails', userDetails);
  const cartCount = sessionCartInfo?.lineItems ?? 0;
  const wishlistCount = wishlistSession ?? 0;
  const [ability, setAbility] = useState(DEFAULT_ABILITIES);
  const [loading, setLoading] = useState(true);

  function getUserAbilities(roleData: any) {
    if (roleData.value === 'admin distributor') {
      return defineAbilitiesForAdmin();
    } else {
      return defineAbilitiesForUser(roleData.permission);
    }
  }

  useEffect(() => {
    const roleData = userDetails?.meta?.user_role;

    if (!roleData) return;

    const userAbility = getUserAbilities(roleData);
    setAbility(userAbility);
    setLoading(false);
  }, [userDetails]);

 
  const userId = useEventSource(Routes.LOGOUT_SUBSCRIBE, {
    event: EVENTS.LOGOUT.NAME,
  });
  

  useEffect(() => {
    if (userId === userDetails.id) {
      submit({}, {method: 'POST', action: '/logout'});
    }
  }, [userId]);
  const hasPermissionBeenUpdated = useEventSource('/permissions/sync', {
    event: EVENTS.PERMISSIONS_UPDATED.NAME,
  });

  console.log('Permission updates:', hasPermissionBeenUpdated);
  // useEffect(() => {
  //   console.log('TEST', hasPermissionBeenUpdated);
  //   if (hasPermissionBeenUpdated) {
  //     const roleData = userDetails?.meta?.user_role;
  //     if (!roleData) throw new Error('User role data not available.');
  //     const userAbility = getUserAbilities(roleData);
  //     setAbility(userAbility);
  //   }
  // }, [hasPermissionBeenUpdated]);

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
  const submit = useSubmit();
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
