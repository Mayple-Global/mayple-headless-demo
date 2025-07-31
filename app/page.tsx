import CountrySelector from "./components/country-selector";
// import { use, useState } from "react";

const SHOPIFY_LOCALES_QUERY = `
  {
    localization {
      availableCountries {
        isoCode
        name
      }
    }
  }
`;

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
      body: JSON.stringify({ query: SHOPIFY_LOCALES_QUERY }),
    }
  );
  return await response.json();
};

export default async function Page() {
  const shopifyLocales = await getShopifyLocales();
  console.log(shopifyLocales);
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
        </div>
      </main>
    </div>
  );
}
