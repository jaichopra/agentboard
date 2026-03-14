import { z } from "zod";
import { WidgetSchema } from "./widget";

export const RefreshScheduleSchema = z.object({
  enabled: z.boolean(),
  cron: z.string().optional(),
  intervalSeconds: z.number().optional(),
});

export const DashboardThemeSchema = z.object({
  primaryColor: z.string().optional(),
  darkMode: z.boolean().default(true),
});

export const DashboardSpecSchema = z.object({
  id: z.string(),
  version: z.number().default(1),
  title: z.string(),
  description: z.string(),
  author: z.string(),
  authorId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  published: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  thumbnail: z.string().optional(),
  refreshSchedule: RefreshScheduleSchema.optional(),
  widgets: z.array(WidgetSchema),
  theme: DashboardThemeSchema.optional(),
});

export type DashboardSpec = z.infer<typeof DashboardSpecSchema>;
export type RefreshSchedule = z.infer<typeof RefreshScheduleSchema>;
export type DashboardTheme = z.infer<typeof DashboardThemeSchema>;

export const DashboardGenerationSchema = z.object({
  title: z.string(),
  description: z.string(),
  widgets: z.array(WidgetSchema),
  tags: z.array(z.string()).default([]),
  theme: DashboardThemeSchema.optional(),
});

export type DashboardGeneration = z.infer<typeof DashboardGenerationSchema>;
