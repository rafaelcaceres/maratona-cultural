import { query } from "./_generated/server";
import { v } from "convex/values";

export const listByVenue = query({
  args: { venueId: v.id("venues") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("events")
      .withIndex("by_venue", (q) => q.eq("venueId", args.venueId))
      .collect();
  },
});

export const listByDate = query({
  args: {
    date: v.string(),
    type: v.optional(
      v.union(
        v.literal("show"),
        v.literal("exhibition"),
        v.literal("screening"),
        v.literal("workshop"),
        v.literal("performance"),
        v.literal("other")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.type) {
      return ctx.db
        .query("events")
        .withIndex("by_date_and_type", (q) =>
          q.eq("date", args.date).eq("type", args.type!)
        )
        .collect();
    }
    return ctx.db
      .query("events")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
  },
});

export const searchEvents = query({
  args: {
    queryText: v.string(),
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.queryText.trim()) return [];

    return ctx.db
      .query("events")
      .withSearchIndex("search_title", (q) => {
        let sq = q.search("title", args.queryText);
        if (args.date) sq = sq.eq("date", args.date);
        return sq;
      })
      .take(30);
  },
});
