import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import AuctionCard from "../components/AuctionCard";
import { Link } from "react-router-dom";

export default function AuctionList() {
  const auctions = useQuery(api.auctions.listAuctions);
  const seed = useMutation(api.auctions.seedAuctions);
  if (!auctions) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>TCG Auction</h1>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {auctions.map((item) => (
          <Link key={item._id} to={`/auction/${item._id}`}>
            <AuctionCard item={item} />
          </Link>
        ))}

        {auctions?.length === 0 && (
          <button onClick={() => seed()}>
            Generate Dummy Data
          </button>
        )}
      </div>
    </div>
  );
}