import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("launches").collect();
  },
});

export const getByYear = query({
  args: { year: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("launches")
      .withIndex("by_year", (q) => q.eq("year", args.year))
      .collect();
  },
});

export const getAllGroupedByYear = query({
  args: {},
  handler: async (ctx) => {
    const launches = await ctx.db.query("launches").collect();

    // group by year
    const launchesByYear: Record<number, any[]> = {};

    for (const launch of launches) {
      const year = launch.year;
      if (!launchesByYear[year]) {
        launchesByYear[year] = [];
      }
      launchesByYear[year].push(launch);
    }

    return launchesByYear;
  },
});

export const getByTime = query({
  args: { currentDay: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("launches")
      .withIndex("by_timestamp_days", (q) =>
        q
          .gte("timestamp_days", args.currentDay - 30) // 1-month window
          .lte("timestamp_days", args.currentDay)
      )
      .collect();
  },
});
