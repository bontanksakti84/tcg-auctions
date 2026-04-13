import Timer from "./Timer";
import { formatRupiah } from "../lib/format";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type Props = {
  item: any;
};

export default function AuctionCard({ item }: Props) {
  const bidCount = useQuery(api.bids.getBids, { auctionId: item._id });

  return (
    <div
  style={{
    border: "1px solid #e5e5e5",
    borderRadius: 12,
    padding: 16,
    width: 260,
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    cursor: "pointer",
    transition: "0.2s",
  }}
>
  <img
    src={item.image}
    alt={item.title}
    style={{
      width: "100%",
      height: 160,
      objectFit: "cover",
      borderRadius: 8,
      marginBottom: 12,
    }}
  />

  <h3 style={{ fontSize: 16, marginBottom: 6, color: "#111" }}>
    {item.title}
  </h3>

  <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>
    {formatRupiah(item.currentPrice)}
  </p>

  <p style={{ fontSize: 12, color: "#888", marginTop: 6 }}>
    Ends in: <Timer endTime={item.endTime} />
  </p>

  <p style={{ fontSize: 12, color: "#666" }}>
    {bidCount?.length || 0} bids
  </p>
</div>
  );
}