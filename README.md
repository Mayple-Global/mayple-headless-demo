## Building Internationalization for Shopify Headless in Nextjs

### View the demo

[Headless Shopify Nextjs Demo](https://mayple-headless-shop-demo.vercel.app/)

#### Intro

Dynamically displaying pricing in the native currency of a visiting user is critical for conversion on an international store.

In headless Shopify sites, best practice is to automatically direct a user into the correct international experience based on their geolocation, and provide them the ability to change locations based on those available in the Shopify store.

For even better conversion, provide a welcome mat popup on their first visit telling international customers that shipping is available to their country.

#### Some helpful resources

[Shopify's Headless Guide](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/markets/)

- [Headless International Pricing](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/markets/international-pricing)

[Vercel/Nextjs geolocation example](https://edge-functions-geolocation.vercel.sh/)

### Get a list of locations that are available on the site

Use the [shopLocales query](https://shopify.dev/docs/api/admin-graphql/latest/queries/shoplocales?language=graphql) to get a list of available markets on the site. If the user's current country exists in the list of shopLocales, we will customize the site for their locale.

```graphql
query {
  localization {
    availableCountries {
      currency {
        isoCode
        name
        symbol
      }
      isoCode
      name
      unitSystem
    }
  }
}
```

### Direct customer to the correct experience

If you are using Vercel to host your site, use the header `x-vercel-ip-country` to detect the country of origin for a visiting user.

When a user visits the site, you should automatically save their visiting country in a cookie and allow them to change that update that cookie. We recommend expiring the cookie after 2 weeks.

Check out repo (page.tsx, components/country-selector.tsx) for a complete implementation.

```tsx
// page.ts
import { headers } from "next/headers";

export default async function Page() {
  const headersList = await headers();
  const visitorsCountry = headersList.get("x-vercel-ip-country");

```

This header can also be used in your routes. Be aware, you cannot retrieve a user's country for content that is statically generated, this is because the page is precompiled.

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

### Get localized Shopify data

Finally, add inContext directive to all your Shopify queries, Shopify will dynamically return the correct content based on these country filters.

```gql
query getProductById($id: ID!, $countryCode: CountryCode!)
@inContext(country: $countryCode) {
  product(id: $id) {
    id
    availableForSale
    requiresSellingPlan
    handle
    productType
    title
    vendor
    publishedAt
    onlineStoreUrl
    options {
      name
      values
    }
    variants(first: 100) {
      nodes {
        id
        title
        weight
        available: availableForSale
        selectedOptions {
          name
          value
        }
        sku
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        image {
          id
          src: originalSrc
          altText
          width
          height
        }
      }
    }
  }
}
```
