import { internalAction, internalMutation } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import sextaData from "./data/maratona-sexta.json";
import sabadoData from "./data/maratona-sabado.json";
import domingoData from "./data/maratona-domingo.json";
import segundaData from "./data/maratona-segunda.json";

type EventType =
  | "show"
  | "exhibition"
  | "screening"
  | "workshop"
  | "performance"
  | "other";

type Classification =
  | "livre"
  | "10 anos"
  | "12 anos"
  | "14 anos"
  | "16 anos"
  | "18 anos";

type Section = "principal" | "eventos_parceiros" | "programacao_off";

interface RawEvent {
  timeStart: string | null;
  timeEnd: string | null;
  title: string;
  description?: string | null;
  curadoria?: string | null;
  origin?: string | null;
  type: EventType;
  price?: string | null;
}

interface RawVenue {
  name: string;
  address: string;
  classification: Classification;
  section: Section;
  events: RawEvent[];
}

interface RawFeira {
  name: string;
  address: string;
  timeStart: string;
  timeEnd: string;
}

interface DayData {
  venues: RawVenue[];
  feiras: RawFeira[];
}

const DAYS: { data: DayData; date: string }[] = [
  { data: sextaData as DayData, date: "2026-03-20" },
  { data: sabadoData as DayData, date: "2026-03-21" },
  { data: domingoData as DayData, date: "2026-03-22" },
  { data: segundaData as DayData, date: "2026-03-23" },
];

export const runSeed = internalAction({
  args: {},
  handler: async (ctx) => {
    for (const day of DAYS) {
      await ctx.runMutation(internal.seeds.seedAll.insertDayData, {
        date: day.date,
        venues: day.data.venues as unknown[],
        feiras: (day.data.feiras ?? []) as unknown[],
      });
    }
    console.log("Seed completo!");
  },
});

export const clearAll = internalMutation({
  args: {},
  handler: async (ctx) => {
    for (const row of await ctx.db.query("events").collect())
      await ctx.db.delete(row._id);
    for (const row of await ctx.db.query("venues").collect())
      await ctx.db.delete(row._id);
    for (const row of await ctx.db.query("feiras").collect())
      await ctx.db.delete(row._id);
    console.log("Banco limpo.");
  },
});

export const insertDayData = internalMutation({
  args: {
    date: v.string(),
    venues: v.array(v.any()),
    feiras: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    for (const venue of args.venues as RawVenue[]) {
      const venueId = await ctx.db.insert("venues", {
        name: venue.name,
        address: venue.address,
        classification: venue.classification,
        section: venue.section,
        date: args.date,
      });

      for (const event of venue.events) {
        await ctx.db.insert("events", {
          venueId,
          date: args.date,
          timeStart: event.timeStart ?? undefined,
          timeEnd: event.timeEnd ?? undefined,
          title: event.title,
          description: event.description ?? undefined,
          curadoria: event.curadoria ?? undefined,
          origin: event.origin ?? undefined,
          type: event.type,
          price: event.price ?? undefined,
        });
      }
    }

    for (const feira of args.feiras as RawFeira[]) {
      await ctx.db.insert("feiras", {
        name: feira.name,
        address: feira.address,
        timeStart: feira.timeStart,
        timeEnd: feira.timeEnd,
        date: args.date,
      });
    }
  },
});
