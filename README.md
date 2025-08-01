## Building Internationalization for Shopify Headless in Nextjs

[Shopify Guide](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/markets/)

- [International Pricing](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/markets/international-pricing)

[Vercel/Nextjs geolocation example](https://edge-functions-geolocation.vercel.sh/)

Dynamically displaying pricing in the native currency of a visiting user is critical for conversion on an international site.

In headless Shopify sites, best practice is to automatically direct a user into the correct international experience based on their geolocation, as well as provide them the ability to change locations based on those available in the Shopify store.

### Get a list of locations that are available on the site

Use the [shopLocales query](https://shopify.dev/docs/api/admin-graphql/latest/queries/shoplocales?language=graphql) to get a list of available markets on the site. If the users current country exists in the list of shopLocales, set this as the customers country.

```graphql
query {
  localization {
    availableCountries {
      isoCode
      name
    }
  }
}
```

### Direct customer to the correct experience

You can use Nextjs Middleware to detect the country of origin for a visiting user. When a user visits the site, you should automatically save their visiting country in session storage an

```tsx
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_COUNTRY = "US";

export async function middleware(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country") || DEFAULT_COUNTRY;
  const response = NextResponse.next();
  response.headers.set("x-user-country", country);
  return response;
}
```

This country location can then be passed into your routes:

```tsx
// pages/index.ts
export async function getServerSideProps({ req }) {
  const country = req.headers["x-user-country"] || "US";

  return {
    props: {
      userCountry: country,
    },
  };
}
```

or in app pages

```tsx
// app/index.ts
const getDefaultCountryCode = async () => {
  return (await fetch("/api/geo")).text();
};

const getShopifyLocales = async () => {
  const response = await fetch(
    "https://[your-store-url].myshopify.com/api/2025-07/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-shopify-storefront-access-token":
          "your-shopify-storefront-access-token",
      },
      body: JSON.stringify({ query: SHOPIFY_LOCALES_QUERY }),
    }
  );
  return await response.json();
};

export default function Page({}) {
  const countries = use(getShopifyLocales());
  const defaultCountryCode = use(getDefaultCountryCode());
  const [country, setCountry] = useState<string>(defaultCountryCode);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>
          <label htmlFor="country" className="text-sm font-medium block">
            Country:
          </label>
          <select
            id="country"
            className="border border-gray-300 rounded-md p-2"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            {countries.data.localization.availableCountries.map(
              (country: { isoCode: string; name: string }) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              )
            )}
          </select>
        </div>
      </main>
    </div>
  );
}
```

Add inContext directive to all queries
