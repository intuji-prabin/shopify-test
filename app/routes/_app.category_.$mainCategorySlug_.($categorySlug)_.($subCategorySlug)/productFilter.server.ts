import {AppLoadContext} from '@remix-run/server-runtime';

interface FilterType {
  metaobjects: {
    edges: {
      node: FilterData;
    }[];
  };
}

export interface FilterData {
  filter_label: {
    value: string;
  };
  filter_key: {
    value: string;
  };
  filter_value: {
    value: string;
  };
}

export async function getProductFilterList(context: AppLoadContext) {
  const {storefront} = context;
  const filter = await storefront.query(STOREFRONT_PRODUCT_FILTER_QUERY);
  const finalFilters = formateResponseFilters(filter);
  return finalFilters;
}

const formateResponseFilters = (response: FilterType) => {
  const filterList = response?.metaobjects?.edges;
  if (filterList.length < 1) {
    return [];
  }

  const formatedFilterDataList = filterList.map((item) => {
    const filterValue = item?.node?.filter_value?.value;
    const finalFilterValue = (filterValue && filterValue.split(',')) || [];
    return {
      filterLabel: item?.node?.filter_label?.value,
      filterKey: item?.node?.filter_key?.value,
      filterValue: finalFilterValue,
    };
  });
  return formatedFilterDataList;
};

const STOREFRONT_PRODUCT_FILTER_QUERY = `query getFilterList {
      metaobjects(type : "filter_product_list", first: 10) {
        edges {
            node {
                filter_label: field(key: "label") { value }
                filter_key: field(key: "filter_key") { value }
                filter_value: field(key: "filter_value") { value }
            }
        }
      }
    }` as const;
