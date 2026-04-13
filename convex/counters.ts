import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const NUM_SHARDS = 5;

export const increment = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const shard = Math.floor(Math.random() * NUM_SHARDS);

    const existing = await ctx.db
      .query("counters")
      .filter((q) => q.eq(q.field("name"), args.name))
      .filter((q) => q.eq(q.field("shard"), shard))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: existing.value + 1,
      });
    } else {
      await ctx.db.insert("counters", {
        name: args.name,
        shard,
        value: 1,
      });
    }
  },
});

export const getCount = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const shards = await ctx.db
      .query("counters")
      .filter((q) => q.eq(q.field("name"), args.name))
      .collect();

    return shards.reduce((acc, s) => acc + s.value, 0);
  },
});