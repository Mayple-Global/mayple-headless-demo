const ShopifyProduct = ({
  product,
}: {
  product: {
    imageUrl: string;
    title: string;
    price: string;
    currencyCode: string;
    currencySymbol: string;
  };
}) => {
  return (
    <div className="flex flex-col gap-2 mt-4 p-4 border border-white rounded-md">
      <img
        src={product.imageUrl}
        alt={product.title}
        width={300}
        height={300}
      />
      <div>
        <h1 className="text-xl font-bold">{product.title}</h1>
        <p className="text-lg">
          {product.currencySymbol}
          {parseFloat(product.price).toFixed(2)} {product.currencyCode}
        </p>
      </div>
      <button className="bg-white text-black px-4 py-1 rounded-md">
        Add to Cart
      </button>
    </div>
  );
};

export default ShopifyProduct;
