import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAuctions = query({
  handler: async (ctx) => {
    return await ctx.db.query("auctions").collect();
  },
});

export const getAuction = query({
  args: { id: v.id("auctions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBidCount = query({
  args: { auctionId: v.id("auctions") },
  handler: async (ctx, args) => {
    const bids = await ctx.db
      .query("bids")
      .filter((q) => q.eq(q.field("auctionId"), args.auctionId))
      .collect();

    return bids.length;
  },
});

export const placeBid = mutation({
  args: { auctionId: v.id("auctions"), user: v.string(), price: v.number() },
  handler: async (ctx, args) => {
    const auction = await ctx.db.get(args.auctionId);
    if (!auction) throw new Error("Auction not found");

    if (args.price <= auction.currentPrice) {
      throw new Error("Bid must be higher");
    }

    await ctx.db.insert("bids", {
      auctionId: args.auctionId,
      user: args.user,
      price: args.price,
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.auctionId, {
      currentPrice: args.price,
    });
  },
});


export const seedAuctions = mutation({
  handler: async (ctx) => {
    const now = Date.now();

    await ctx.db.insert("auctions", {
      title: "Pikachu Illustrator 1998",
      image: "https://picsum.photos/300",
      startPrice: 1000000,
      currentPrice: 1000000,
      endTime: now + 3600000,
      owner: "Ash",
    });

    await ctx.db.insert("auctions", {
      title: "Charizard Base Set",
      image: "https://picsum.photos/301",
      startPrice: 500000,
      currentPrice: 500000,
      endTime: now + 1800000,
      owner: "Red",
    });

    await ctx.db.insert("auctions", {
      title: "Michael Jordan Rookie",
      image: "https://picsum.photos/302",
      startPrice: 2000000,
      currentPrice: 2000000,
      endTime: now + 5400000,
      owner: "NBA Collector",
    });
  },
});