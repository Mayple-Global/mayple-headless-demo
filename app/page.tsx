import CountrySelector from "./components/country-selector";
import ShopifyProduct from "./components/shopify-product";
import { cookies, headers } from "next/headers";
import { DEFAULT_COUNTRY_CODE, SHOPIFY_COOKIE_NAME } from "./helpers/constants";
import { getShopifyLocales, getShopifyProduct } from "./helpers/queryHelpers";

export default async function Page() {
  // Get country code from cookie or header
  // If the country code is not in the cookie, use the country code detected by Vercel
  // Otherwise, use the default country code (this should be the primary market of the store).
  // If the detected country code is not in the list of available countries, it will be ignored
  // and the primary market will be used instead
  const cookieStore = await cookies();
  const headersList = await headers();
  const countryCode =
    cookieStore.get(SHOPIFY_COOKIE_NAME)?.value ||
    headersList.get("x-vercel-ip-country") ||
    DEFAULT_COUNTRY_CODE;

  // Get the list of available countries from Shopify
  const shopifyLocales = await getShopifyLocales();

  // Get the product from Shopify
  const shopifyProduct = await getShopifyProduct(countryCode);
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
            currentCountryCode={countryCode}
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
