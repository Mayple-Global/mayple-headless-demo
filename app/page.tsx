import CountrySelector from "./components/country-selector";
import ShopifyProduct from "./components/shopify-product";
import { cookies } from "next/headers";
import { productById, availableCountries } from "./helpers/queries";
import { DEFAULT_COUNTRY_CODE, SHOPIFY_COOKIE_NAME } from "./helpers/constants";

const getStorefrontAccessToken = () => {
  const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set");
  }
  return accessToken;
};

const getShopifyLocales = async () => {
  const response = await fetch(
    "https://mayple-dev-store.myshopify.com/api/2025-07/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-shopify-storefront-access-token": getStorefrontAccessToken(),
      },
      body: JSON.stringify({ query: availableCountries }),
    }
  );
  return await response.json();
};

const getShopifyProduct = async (countryCode: string) => {
  console.log(`countryCode: ${countryCode}`);
  const response = await fetch(
    "https://mayple-dev-store.myshopify.com/api/2025-07/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-shopify-storefront-access-token": getStorefrontAccessToken(),
      },
      body: JSON.stringify({
        query: productById,
        variables: {
          id: "gid://shopify/Product/7208424964235",
          countryCode,
        },
      }),
    }
  );
  return await response.json();
};

export default async function Page() {
  const cookieStore = await cookies();
  const countryCode = cookieStore.get(SHOPIFY_COOKIE_NAME)?.value;
  const shopifyLocales = await getShopifyLocales();
  const shopifyProduct = await getShopifyProduct(
    countryCode || DEFAULT_COUNTRY_CODE
  );

  const variant = shopifyProduct.data.product.variants.nodes[0];
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>
          <label htmlFor="country" className="text-sm font-medium block">
            Country:
          </label>
          <CountrySelector
            locales={shopifyLocales.data.localization.availableCountries}
          />
          <ShopifyProduct
            product={{
              imageUrl: shopifyProduct.data.product.variants.nodes[0].image.src,
              title: shopifyProduct.data.product.title,
              price: variant.price.amount,
              currencyCode: variant.price.currencyCode,
              currencySymbol:
                shopifyLocales.data.localization.availableCountries.find(
                  (country: { isoCode: string }) =>
                    country.isoCode === countryCode
                )?.currency.symbol || "$",
            }}
          />
        </div>
      </main>
    </div>
  );
}
