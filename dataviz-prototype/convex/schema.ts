import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  launches: defineTable({
    Name: v.string(),
    Status: v.string(),
    Provider: v.string(),
    Rocket: v.string(),
    Mission: v.string(),
    LaunchPad: v.string(),
    lat: v.union(v.number(), v.null()),
    lon: v.union(v.number(), v.null()),
    datetime_iso: v.string(),
    timestamp_days: v.number(),
    year: v.number(),
  })
    .index("by_year", ["year"])
    .index("by_timestamp_days", ["timestamp_days"]),
});
