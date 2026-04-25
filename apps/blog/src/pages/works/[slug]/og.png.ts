import type { APIRoute, GetStaticPaths } from "astro";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import sharp from "sharp";

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

type Props = { work: CollectionEntry<"works"> };

export const getStaticPaths = (async () => {
  const works = await getCollection("works");
  return works.map((work) => ({
    params: { slug: work.id },
    props: { work } satisfies Props,
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<Props> = async () => {
  const png = await sharp({
    create: {
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      channels: 4,
      background: { r: 0, g: 114, b: 104, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
