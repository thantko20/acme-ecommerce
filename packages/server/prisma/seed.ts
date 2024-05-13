import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["info", "query"] });

const seed = async () => {
  const colorAttribute = await prisma.attribute.create({
    data: {
      name: "Color",
      values: {
        createMany: {
          data: [
            {
              name: "Red",
            },
            {
              name: "Blue",
            },
            {
              name: "Green",
            },
          ],
        },
      },
    },
    include: {
      values: true,
    },
  });

  const productA = await prisma.product.create({
    data: {
      name: "Man T-Shirt",
      description: "T Shirt for men",
      slug: "man-t-shirt",
      productAttributes: {
        create: {
          attributeId: colorAttribute.id,
        },
      },
    },
  });

  const skuOne = await prisma.sku.create({
    data: {
      sku: "SKU001",
      productId: productA.id,
      quantity: 15,
      unitPrice: 1000,
      attributeValues: {
        create: {
          attributeId: colorAttribute.id,
          valueId: colorAttribute.values[0].id,
        },
      },
    },
  });

  const p = await prisma.product.findFirst({
    include: {
      productAttributes: {
        include: {
          attribute: true,
        },
      },
      skus: {
        include: {
          attributeValues: {
            include: {
              attribute: true,
              value: true,
            },
          },
        },
      },
    },
  });

  const attributes = p?.productAttributes.map((a) => a.attribute.name);
  const skus =
    p?.skus.map((sku) => ({
      sku: sku.sku,
      values: sku.attributeValues.map((av) => ({
        valueName: av.value.name,
        attributeName: av.attribute.name,
      })),
    })) || [];

  console.log({
    name: p?.name,
    attributes,
    skuOne: skus[0],
    skuOneAttributes: skus[0].values,
  });
};

seed();
