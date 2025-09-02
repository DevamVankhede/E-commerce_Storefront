import ProductDetailClient from "@/components/ProductDetailClient";

async function fetchProduct(id: string) {
  const BASE_URL = "https://saleor.kombee.co.in";
  const query = `query GetProduct($id: ID, $channel: String) {\n  product(id: $id, channel: $channel) {\n    id\n    name\n    description\n    media { url }\n    defaultVariant {\n      pricing {\n        price { gross { amount } }\n        priceUndiscounted { gross { amount } }\n      }\n    }\n    variants {\n      pricing {\n        price { gross { amount } }\n        priceUndiscounted { gross { amount } }\n      }\n    }\n  }\n}`;
  const res = await fetch(`${BASE_URL}/graphql/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { id, channel: "online-inr" } }),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch product");
  const json = await res.json();
  const p = json?.data?.product;
  if (!p) return null;
  // Parse Saleor rich-text description if it's JSON
  let parsedDescription: string = "";
  if (typeof p.description === "string") {
    try {
      const descObj = JSON.parse(p.description);
      interface DescriptionBlock {
        data?: {
          text?: string;
        };
      }
      if (descObj && Array.isArray(descObj.blocks)) {
        parsedDescription = descObj.blocks
          .map((b: DescriptionBlock) =>
            typeof b?.data?.text === "string" ? b.data.text : ""
          )
          .filter(Boolean)
          .join("\n\n");
      } else {
        parsedDescription = p.description;
      }
    } catch {
      parsedDescription = p.description as string;
    }
  }

  const defaultPrice =
    p.defaultVariant?.pricing?.price?.gross?.amount ??
    p.defaultVariant?.pricing?.priceUndiscounted?.gross?.amount;
  const firstVariantPrice =
    p.variants?.[0]?.pricing?.price?.gross?.amount ??
    p.variants?.[0]?.pricing?.priceUndiscounted?.gross?.amount;
  const resolvedPrice = (defaultPrice ?? firstVariantPrice ?? 0) as number;

  return {
    id: p.id as string,
    title: p.name as string,
    image: (p.media?.[0]?.url as string) ?? "/file.svg",
    price: resolvedPrice,
    description: parsedDescription,
  } as {
    id: string;
    title: string;
    image: string;
    price: number;
    description: string;
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const product = await fetchProduct(decodedId);
  if (!product) return <p className="p-6">Product Not Found</p>;
  return <ProductDetailClient product={product} />;
}
