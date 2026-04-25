import type { APIRoute } from "astro";
import { srcDir } from "astro:config/server";
import { renderOgTemplate } from "../lib/og-template";
import { loadImageAsDataUrl, renderOgPng } from "../lib/og-render";
import { SITE_DESCRIPTION } from "../consts";

const profileImagePromise = loadImageAsDataUrl(
  new URL("./assets/profile.jpg", srcDir),
);

export const GET: APIRoute = async () =>
  renderOgPng(
    renderOgTemplate({
      eyebrow: "Portfolio",
      title: "伊藤 啓太",
      description: SITE_DESCRIPTION,
      keywords: ["Works", "Activities", "Skills", "Articles"],
      imageSrc: await profileImagePromise,
    }),
  );
