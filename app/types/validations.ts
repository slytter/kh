import { z } from "zod";

// Define Zod schema for Photo
export const PhotoSchema = z.object({
  id: z.string(),
  url: z.string(),
  created_at: z.string(),
  project_id: z.number().optional(),
  send_at: z.number(),
  did_send: z.boolean(),
  message: z.string(),
});

export const PhotoArraySchema = z.array(PhotoSchema);

// Define Zod schema for TimeGenerationProps
export const TimeGenerationPropsSchema = z.object({
  interval: z.enum(["weekly", "daily"]),
  startDate: z.number(), // Assuming Date objects are used directly, Zod has support for Date validation
  sendHour: z.number(),
});

export const ProjectSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  owner: z.string(),
  // either string or number HOTFIX:
  created_at: z.union([z.string(), z.number()]),
  receivers: z.array(z.string()),
  self_receive: z.boolean(),
  generation_props: TimeGenerationPropsSchema,
  photos_count: z.number(),
  sent_photos_count: z.number(),
});
