"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_COUNTRY_CODE,
  SHOPIFY_COOKIE_NAME,
} from "../helpers/constants";

export default function CountrySelector({
  locales,
  currentCountryCode,
}: {
  locales: {
    isoCode: string;
    name: string;
  }[];
  currentCountryCode: string;
}) {
  const [selectedCountry, setSelectedCountry] =
    useState<string>(currentCountryCode);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleCountryChange = (countryCode: string) => {
    // Set cookie
    document.cookie = `${SHOPIFY_COOKIE_NAME}=${countryCode}; max-age=${
      60 * 60 * 24 * 365
    }; SameSite=Lax;`;

    setSelectedCountry(countryCode);
    setIsOpen(false);

    // Refresh the page to trigger middleware and update any server-side content
    router.refresh();
  };

  const selectedCountryData =
    locales.find((c) => c.isoCode === selectedCountry) || locales[0];

  return (
    <div className="relative inline-block text-left w-full">
      <div>
        <button
          type="button"
          className="w-full inline-flex justify-between items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded="true"
          aria-haspopup="true"
        >
          <span>{selectedCountryData.name}</span>
          <svg
            className="-mr-1 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-[200px] overflow-y-auto">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {locales.map((country) => (
              <button
                key={country.isoCode}
                className={`flex items-center gap-3 px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${
                  selectedCountry === country.isoCode
                    ? "bg-gray-50 font-medium text-black"
                    : "text-gray-700"
                }`}
                role="menuitem"
                onClick={() => handleCountryChange(country.isoCode)}
              >
                {country.name}
                {selectedCountry === country.isoCode && (
                  <svg
                    className="ml-auto h-5 w-5 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
