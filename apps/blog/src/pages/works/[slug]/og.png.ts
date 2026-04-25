import type { APIRoute, GetStaticPaths } from "astro";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { renderOgTemplate } from "../../../lib/og-template";
import { renderOgPng } from "../../../lib/og-render";

type Props = { work: CollectionEntry<"works"> };

export const getStaticPaths = (async () => {
  const works = await getCollection("works");
  return works.map((work) => ({
    params: { slug: work.id },
    props: { work } satisfies Props,
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<Props> = ({ props: { work } }) =>
  renderOgPng(
    renderOgTemplate({
      eyebrow: "Works",
      title: work.data.title,
      description: work.data.description,
      keywords: work.data.keywords,
    }),
  );
