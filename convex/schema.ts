import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  auctions: defineTable({
    title: v.string(),
    image: v.string(),
    startPrice: v.number(),
    currentPrice: v.number(),
    endTime: v.number(),
    owner: v.string(),
  }),
  bids: defineTable({
    auctionId: v.id("auctions"),
    user: v.string(),
    price: v.number(),
    createdAt: v.number(),
  }),
  counters: defineTable({
    name: v.string(),
    shard: v.number(),
    value: v.number(),
  }),
});