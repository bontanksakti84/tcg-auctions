import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useEffect, useState } from "react";

import Timer from "../components/Timer";
import BidHistory from "../components/BidHistory";
import { formatRupiah } from "../lib/format";
import { getUser } from "../lib/user";

export default function AuctionDetail() {
  
  const { id } = useParams<{ id: string }>();
  const auctionId = id as Id<"auctions">;

 
  const auction = useQuery(api.auctions.getAuction, { id: auctionId });
  const bids = useQuery(api.bids.getBids, { auctionId });

  const views = useQuery(api.counters.getCount, {
    name: "view_" + auctionId,
  });

  const bidCount = useQuery(api.counters.getCount, {
    name: "bid_" + auctionId,
  });

  
  const placeBid = useMutation(api.bids.placeBid);
  const increment = useMutation(api.counters.increment);

  
  const [price, setPrice] = useState(0);
  const [optimisticPrice, setOptimisticPrice] = useState<number | null>(null);
  
  useEffect(() => {
    if (auctionId) {
      increment({ name: "view_" + auctionId });
    }
  }, [auctionId, increment]);

  
  useEffect(() => {
    if (auction) {
      setPrice(auction.currentPrice + 50000);
    }
  }, [auction]);

  
  if (!auction) return <div style={{ padding: 20 }}>Loading...</div>;

  
  const handleBid = async () => {
    try {
      if (price <= auction.currentPrice) {
        alert("Bid harus lebih tinggi!");
        return;
      }
  
      if (Date.now() > auction.endTime) {
        alert("Lelang sudah berakhir!");
        return;
      }
  
      
      setOptimisticPrice(price);
  
      await placeBid({
        auctionId,
        user: getUser(),
        price,
      });
  
      await increment({ name: "bid_" + auctionId });
  
      
      setPrice(price + 50000);
  
    
      setOptimisticPrice(null);
    } catch (err) {
      console.error(err);
  
      
      setOptimisticPrice(null);
  
      alert("Gagal melakukan bid");
    }
  };

  
  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <img
        src={auction.image}
        alt={auction.title}
        style={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 12,
          marginBottom: 20,
        }}
      />

      <h1>{auction.title}</h1>

      <p style={{ color: "#666" }}>Owner: {auction.owner}</p>

      <h2>
        {formatRupiah(optimisticPrice ?? auction.currentPrice)}
      </h2>

      <p>
        Ends in: <Timer endTime={auction.endTime} />
      </p>

      <p style={{ fontSize: 14, color: "#888" }}>
        👁 {views ?? 0} viewers • {bidCount ?? 0} bids
      </p>

      
      <div style={{ marginTop: 20 }}>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          style={{
            padding: 8,
            marginRight: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />

        <button onClick={handleBid} style={{ marginRight: 8 }}>
          Place Bid
        </button>

        <button
          onClick={() => setPrice(auction.currentPrice + 50000)}
          style={{ marginRight: 8 }}
        >
          +50K
        </button>

        <button
          onClick={() => setPrice(auction.currentPrice + 100000)}
        >
          +100K
        </button>
      </div>

     
      <div style={{ marginTop: 30 }}>
        <h3>Bid History</h3>
        <BidHistory bids={bids ?? []} />
      </div>
    </div>
  );
}