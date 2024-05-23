export const getFooter = async (context: any) => {
  try {
    const {storefront} = context;
    const footerList = await storefront.query(GET_FOOTER_QUERY);
    const formattedFooter = await formatFooter(
      footerList?.metaobjects?.nodes[0],
    );
    return formattedFooter;
  } catch (error) {
    if (error instanceof Error) {
      console.log('error is ', error.message);
      return [];
    }
    console.log('new error', error);
    return [];
  }
};

const formatFooter = async (footerList: any) => {
  const formatColumn = (data: any) => {
    return data.map((item: any) => {
      let parts = item.split('&');
      let obj: any = {};
      parts.forEach((part: any) => {
        let [key, value] = part.split('=');
        obj[key] = value;
      });
      return obj;
    });
  };
  return {
    phoneNumber: footerList?.phoneNumber?.value,
    email: footerList?.email?.value,
    logo: footerList?.logo?.value,
    firstColumn: {
      firstColumnTitle: footerList?.firstColumnTitle?.value,
      firstColumnList: formatColumn(
        JSON.parse(footerList?.firstColumnList?.value),
      ),
    },
    secondColumn: {
      secondColumnTitle: footerList?.secondColumnTitle?.value,
      secondColumnList: formatColumn(
        JSON.parse(footerList?.secondColumnList?.value),
      ),
    },
    thirdColumn: {
      thirdColumnTitle: footerList?.thirdColumnTitle?.value,
      thirdColumnList: formatColumn(
        JSON.parse(footerList?.thirdColumnList?.value),
      ),
    },
    fourthColumn: {
      fourthColumnTitle: footerList?.fourthColumnTitle?.value,
      fourthColumnList: formatColumn(
        JSON.parse(footerList?.fourthColumnList?.value),
      ),
    },
  };
};

const GET_FOOTER_QUERY = `query getMetaDefinition {
    metaobjects( first: 1, type: "portal_footer" ) {
        nodes {
            phoneNumber: field(key: "phone_number") {value}
            email: field(key: "email") {value}
            logo: field(key: "logo") {value}
            firstColumnTitle : field(key: "column_first_header") { value }
            firstColumnList : field(key: "column_first_list") { value }
            secondColumnTitle : field(key: "column_second_header") { value }
            secondColumnList : field(key: "column_second_list") { value }
            thirdColumnTitle : field(key: "column_third_header") { value }
            thirdColumnList : field(key:"column_third_list") { value }
            fourthColumnTitle : field(key: "column_fourth_header") { value }
            fourthColumnList : field(key:"column_fourth_list") { value }
        }
    }
}` as const;
