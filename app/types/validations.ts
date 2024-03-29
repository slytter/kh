import { z } from "zod";

// Define Zod schema for Photo
export const PhotoSchema = z.object({
  id: z.string(),
  url: z.string(),
  project_id: z.string().optional(),
  created_at: z.number(),
  send_at: z.number(),
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
  created_at: z.number(),
  receivers: z.array(z.string()),
  selfReceive: z.boolean(),
  generationProps: TimeGenerationPropsSchema,
});
