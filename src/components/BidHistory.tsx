import { formatRupiah } from "../lib/format";

type Props = {
  bids: any[];
};

export default function BidHistory({ bids }: Props) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Bid History</h3>
      {bids?.map((b) => (
        <div key={b._id} style={{ borderBottom: "1px solid #eee", padding: 6 }}>
          <strong>{b.user}</strong> - {formatRupiah(b.price)} -{" "}
          {new Date(b.createdAt).toLocaleTimeString()}
        </div>
      ))}
      {bids?.length === 0 && <p>Belum ada bid.</p>}
    </div>
  );
}