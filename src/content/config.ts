import { defineCollection, z } from 'astro:content';

const packages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    category: z.enum(['trekking', 'expedition', 'climbing']),
    featured: z.boolean().default(false),
    heroImage: z.string(),
    galleryImages: z.array(z.string()).optional(),
    duration: z.string(),
    maxAltitude: z.string(),
    difficulty: z.enum(['Easy', 'Moderate', 'Challenging', 'Difficult', 'Extreme']),
    season: z.string(),
    price: z.string(),
    shortDescription: z.string(),
    highlights: z.array(z.string()),
    includes: z.array(z.string()),
    excludes: z.array(z.string()),
    itinerary: z.array(
      z.object({
        day: z.number(),
        title: z.string(),
        description: z.string(),
      })
    ),
    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .optional(),
  }),
});

const testimonials = defineCollection({
  type: 'data',
  schema: z.object({
    testimonials: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        location: z.string(),
        trip: z.string(),
        quote: z.string(),
        image: z.string().optional(),
        rating: z.number().min(1).max(5).default(5),
      })
    ),
  }),
});

export const collections = {
  packages,
  testimonials,
};
