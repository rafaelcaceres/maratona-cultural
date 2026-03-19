import { query } from "./_generated/server";
import { v } from "convex/values";

export const listByDate = query({
  args: {
    date: v.string(),
    section: v.optional(
      v.union(
        v.literal("principal"),
        v.literal("eventos_parceiros"),
        v.literal("programacao_off")
      )
    ),
  },
  handler: async (ctx, args) => {
    const venues = await ctx.db
      .query("venues")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();

    if (args.section) {
      return venues.filter((v) => v.section === args.section);
    }
    return venues;
  },
});

export const getVenue = query({
  args: { id: v.id("venues") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});
