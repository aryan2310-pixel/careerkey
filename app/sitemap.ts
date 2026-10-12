import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { College } from "@/models/College";
import { Insight } from "@/models/Insight";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://careerkey.in";

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/colleges`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/book-counselling`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    await connectDB();

    const [colleges, insights] = await Promise.all([
      College.find().select("slug updatedAt").lean(),
      Insight.find().select("slug updatedAt").lean(),
    ]);

    const collegeRoutes: MetadataRoute.Sitemap = colleges.map((c) => ({
      url: `${baseUrl}/colleges/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const insightRoutes: MetadataRoute.Sitemap = insights.map((i) => ({
      url: `${baseUrl}/insights/${i.slug}`,
      lastModified: i.updatedAt ? new Date(i.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...collegeRoutes, ...insightRoutes];
  } catch (err) {
    console.error("Failed to generate dynamic sitemap routes:", err);
    return staticRoutes;
  }
}
