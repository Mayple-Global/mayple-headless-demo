"use client";

// import { headers } from "next/headers";
import { use } from "react";

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

const getDefaultCountryCode = async () => {
  return (await fetch("/api/geo")).text();
};

const getShopifyLocales = async () => {
  const response = await fetch(
    "https://mayple-dev-store.myshopify.com/api/2025-07/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-shopify-storefront-access-token": "dfe59ad59fafce550d29321bd0cf5c93",
      },
      body: JSON.stringify({ query: SHOPIFY_LOCALES_QUERY }),
    }
  );
  return await response.json();
};

// const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//   console.log(event.target.value);
// };

export default function Home({}) {
  const countries = use(getShopifyLocales());
  const defaultCountryCode = use(getDefaultCountryCode());

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Hello World</h1>
        <p>Country: {JSON.stringify(countries)}</p>
        <p>Default Country: {JSON.stringify(defaultCountryCode)}</p>
        {/* <p>Locales: {JSON.stringify(defaultCountryCode)}</p> */}
        {/* <select
          className="border border-gray-300 rounded-md p-2"
          defaultValue={defaultCountryCode}
          onChange={handleCountryChange}
        >
          {locales.data.localization.availableCountries.map(
            (country: { isoCode: string; name: string }) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            )
          )}
        </select>  */}
      </main>
    </div>
  );
}
