import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  venues: defineTable({
    name: v.string(),
    address: v.string(),
    classification: v.union(
      v.literal("livre"),
      v.literal("10 anos"),
      v.literal("12 anos"),
      v.literal("14 anos"),
      v.literal("16 anos"),
      v.literal("18 anos")
    ),
    section: v.union(
      v.literal("principal"),
      v.literal("eventos_parceiros"),
      v.literal("programacao_off")
    ),
    date: v.string(), // "2026-03-20"
  })
    .index("by_date", ["date"])
    .index("by_date_and_section", ["date", "section"]),

  events: defineTable({
    venueId: v.id("venues"),
    date: v.string(),
    timeStart: v.optional(v.string()),
    timeEnd: v.optional(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    curadoria: v.optional(v.string()),
    origin: v.optional(v.string()),
    type: v.union(
      v.literal("show"),
      v.literal("exhibition"),
      v.literal("screening"),
      v.literal("workshop"),
      v.literal("performance"),
      v.literal("other")
    ),
    price: v.optional(v.string()),
  })
    .index("by_venue", ["venueId"])
    .index("by_date", ["date"])
    .index("by_date_and_type", ["date", "type"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["date", "type"],
    }),

  feiras: defineTable({
    name: v.string(),
    address: v.string(),
    timeStart: v.string(),
    timeEnd: v.string(),
    date: v.string(),
  }).index("by_date", ["date"]),
});
