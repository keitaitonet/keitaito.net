import type { APIRoute } from "astro";
import { renderOgTemplate } from "../lib/og-template";
import { renderOgPng } from "../lib/og-render";
import { SITE_DESCRIPTION } from "../consts";

export const GET: APIRoute = () =>
  renderOgPng(
    renderOgTemplate({
      eyebrow: "Portfolio",
      title: "伊藤 啓太",
      description: SITE_DESCRIPTION,
      keywords: ["Works", "Activities", "Skills", "Articles"],
    }),
  );
