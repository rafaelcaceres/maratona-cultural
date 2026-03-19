import { query } from "./_generated/server";
import { v } from "convex/values";

export const listByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("feiras")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
  },
});
