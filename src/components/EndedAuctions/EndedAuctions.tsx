import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Alert,
  Dialog,
  DialogContent,
} from "@mui/material";

interface AuctionPhoto {
  id: number;
  title: string;
  endedAt: string;
  finalPrice: number;
  winner: string;
  photoUrl: string;
}

const EndedAuctions: React.FC = () => {
  const [auctions, setAuctions] = useState<AuctionPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auctions?status=ended")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data: AuctionPhoto[]) => setAuctions(data))
      .catch(() => setError("Failed to load ended auctions"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={2}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (auctions.length === 0) {
    return <Typography>No ended auctions found.</Typography>;
  }

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Ended At</TableCell>
            <TableCell>Photo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {auctions.map((a) => (
            <TableRow key={a.id}>
              <TableCell>{a.id}</TableCell>
              <TableCell>{a.title}</TableCell>
              <TableCell>{new Date(a.endedAt).toLocaleString()}</TableCell>
              <TableCell>
                <img
                  src={a.photoUrl}
                  alt={a.title}
                  style={{ width: 100, cursor: "pointer" }}
                  onClick={() => setSelectedPhoto(a.photoUrl)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedPhoto} onClose={() => setSelectedPhoto(null)} maxWidth="md">
        <DialogContent>
          {selectedPhoto && (
            <img
              src={selectedPhoto}
              alt="Selected Auction Photo"
              style={{ width: "100%", height: "auto" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EndedAuctions;
