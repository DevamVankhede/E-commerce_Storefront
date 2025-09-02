import ProductCard from "@/components/ProductCard";

type PlpProduct = {
  id: string;
  title: string;
  price: number;
  image: string;
  undiscountedPrice?: number; // Added optional undiscountedPrice
};

export const revalidate = 60;

export default async function ProductsPage() {
  const BASE_URL = "https://saleor.kombee.co.in";
  const query = `query Products($first: Int!, $channel: String!) {\n  products(first: $first, channel: $channel) {\n    edges {\n      node {\n        id\n        name\n        media { url }\n        pricing { priceRange { start { gross { amount } } } }\n        variants {\n          pricing {\n            price { gross { amount } }\n            priceUndiscounted { gross { amount } }\n          }\n        }\n      }\n    }\n  }\n}`;

  const res = await fetch(`${BASE_URL}/graphql/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { first: 12, channel: "online-inr" },
    }),
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`Network error: ${res.status}`);
  const json = await res.json();
  console.log("Raw API Response:", JSON.stringify(json, null, 2));

  type ApiProductNode = {
    id: string;
    name: string;
    media?: Array<{ url?: string }>;
    pricing?: { priceRange?: { start?: { gross?: { amount?: number } } } };
    variants?: Array<{
      pricing?: {
        price?: { gross?: { amount?: number } };
        priceUndiscounted?: { gross?: { amount?: number } };
      };
    }>;
  };
  const edges: Array<{ node: ApiProductNode }> =
    json?.data?.products?.edges ?? [];
  const products: PlpProduct[] = edges.map(({ node: n }) => {
    const image = n.media?.[0]?.url ?? "/file.svg";
    const price =
      n.pricing?.priceRange?.start?.gross?.amount ??
      n.variants?.[0]?.pricing?.price?.gross?.amount ??
      n.variants?.[0]?.pricing?.priceUndiscounted?.gross?.amount ??
      0;
    const undiscountedPrice =
      n.variants?.[0]?.pricing?.priceUndiscounted?.gross?.amount ?? 0; // Extracted undiscounted price

    return { id: n.id, title: n.name, price, image, undiscountedPrice }; // Included undiscountedPrice in the returned object
  });
  console.log("Product Data :", products);

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-gray-900 dark:text-white leading-tight">
        Explore Our Collection
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No products available at the moment. Please check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
