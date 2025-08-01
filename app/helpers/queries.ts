export const money = `{
	amount
	currencyCode
}`;

export const mailingAddressFields = `
	address1
	address2
	city
	company
	country
	countryCodeV2
	firstName
	lastName
	formatted
	phone
	province
	provinceCode
	zip
`;

export const productFields = `
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
`;

export const sellingPlanFields = `
	sellingPlan {
		id
		name
		options {
			name
			value
		}
		description
		recurringDeliveries
	}
	priceAdjustments {
		compareAtPrice ${money}
		price ${money}
		perDeliveryPrice ${money}
	}
`;

export const variantFields = `
	id
	title
	weight
	available: availableForSale
	selectedOptions {
		name
		value
	}
	sku
	price ${money}
	compareAtPrice ${money}
	image {
		id
		src: originalSrc
		altText
		width
		height
	}
	selectedOptions {
		name
		value
	}
	unitPrice ${money}
	unitPriceMeasurement {
		measuredType
		quantityUnit
		quantityValue
		referenceUnit
		referenceValue
	}
	product {
		${productFields}
	}
	sellingPlanAllocations(first: 100) {
		edges {
			node {
				${sellingPlanFields}
			}
		}
	}
	metafield(namespace: "mayple_inventory", key: "is_available") {
		id
		value
	}
`;

export const productById = `query getProductById($id: ID!, $countryCode: CountryCode!) @inContext(country: $countryCode) {
	product(id: $id) {
		${productFields}
		variants(first: 100) {
			nodes {
					${variantFields}
			}
		}
	}
}`;

const cartFields = `{
	id
	checkoutUrl
	note
	buyerIdentity {
		countryCode
	}
	estimatedCost {
		subtotalAmount ${money}
		totalAmount ${money}
	}
	lines(first: 100) {
		edges {
			node {
				id
				quantity
				sellingPlanAllocation {
					${sellingPlanFields}
				}
				merchandise {
					__typename
					... on ProductVariant {
						${variantFields}
					}
				}
				attributes {
					key
					value
				}
				cost {
					amountPerQuantity ${money}
					compareAtAmountPerQuantity ${money}
					subtotalAmount ${money}
					totalAmount ${money}
				}
				sellingPlanAllocation {
					sellingPlan {
						id
						name
					}
					priceAdjustments {
						price ${money}
						compareAtPrice ${money}
						perDeliveryPrice ${money}
					}
				}
			}
		}
	}
	attributes {
		key
		value
	}
	buyerIdentity {
		countryCode
		email
		phone
		deliveryAddressPreferences {
			... on MailingAddress {
				${mailingAddressFields}
			}
		}
	}
	deliveryGroups(first: 100) {
		edges {
			node {
				deliveryOptions {
					code
					handle
					title
					description
					estimatedCost ${money}
					deliveryMethodType
				}
			}
		}
	}
}`;

export const cartById = `query($id: ID!) {
  cart(id: $id) ${cartFields}
}`;

export const cartCreate = (
  countryId: string
) => `mutation @inContext(country: ${countryId}) {
	cartCreate(input: {
		buyerIdentity: {
			countryCode: ${countryId}
		}
	}) {
		cart ${cartFields}
		userErrors {
			field
			message
		}
	}
}`;

export const cartLinesAdd = `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
	cartLinesAdd(cartId: $cartId, lines: $lines) {
		cart ${cartFields}
		userErrors {
			field
			message
		}
	}
}`;

export const cartLinesUpdate = `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
	cartLinesUpdate(cartId: $cartId, lines: $lines) {
		cart ${cartFields}
		userErrors {
			field
			message
		}
	}
}`;

export const cartAttributesUpdate = `mutation cartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {
	cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
		cart ${cartFields}
		userErrors {
			field
			message
		}
	}
}`;

export const cartNoteUpdate = `mutation cartNoteUpdate($cartId: ID!, $note: String) {
	cartNoteUpdate(cartId: $cartId, note: $note) {
		cart ${cartFields}
		userErrors {
			field
			message
		}
	}
}`;

export const cartBuyerIdentityUpdate = `mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
	cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
		cart ${cartFields}
		userErrors {
			field
			message
		}
	}
}`;

export const availableCountries = `query {
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
}`;
