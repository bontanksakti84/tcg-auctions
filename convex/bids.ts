import {query, mutation} from "./_generated/server";
import {v} from "convex/values";

// Query untuk mendapatkan semua bid pada sebuah lelang
export const getBids = query({
  args: {auctionId: v.id("auctions")},
  handler: async (ctx, args) => {
    return await ctx.db.query("bids")
      .filter((q) => q.eq(q.field("auctionId"), args.auctionId))
      .order("desc")
      .collect();
  },
});

// Mutation untuk menempatkan bid baru
export const placeBid = mutation({
  args: {auctionId: v.id("auctions"), user: v.string(), price: v.number()},
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