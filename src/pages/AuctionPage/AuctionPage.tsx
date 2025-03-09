import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import "../../styles/Styles.css";
import EmailButtons from "../../components/EmailButtons/EmailButtons";
import { webApiUrl } from "../../env/envVars";
import { useAuth } from "../../providers/AuthContext";
import useRequireAuth from "../../Hooks/useRequireAuth";
import redirectWithPost from "../../util/redirectWithPost";
import CustomModal from "../../components/CustomModal/CustomModal";
import PhotoDetailModal from "../../components/PhotoDetailModal/PhotoDetailModal";

// Açık artırma verileri için örnek DTO (AllPhotos’taki ReadAllPhotoResponseDto benzeri)
interface ReadAllAuctionResponseDto {
  id: string;
  file_path?: string;
  // İhtiyaç varsa başka alanlar: title, currentBid, vb.
}

const AuctionPage: React.FC = () => {
  const { user } = useAuth();
  const { open, requireAuth, handleClose, handleLogin } = useRequireAuth();

  // API’den gelecek açık artırma öğelerini saklayacağımız state
  const [auctionItems, setAuctionItems] = useState<ReadAllAuctionResponseDto[]>([]);
  // Modal’da gösterilecek seçili öğe
  const [selectedAuction, setSelectedAuction] = useState<ReadAllAuctionResponseDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Açık artırma verilerini API’den çekme
  const fetchAuctions = async () => {
    try {
      const response = await fetch(`${webApiUrl}/auctions`);
      if (!response.ok) {
        throw new Error("Failed to fetch auctions");
      }
      const data: ReadAllAuctionResponseDto[] = await response.json();

      // Her öğeye file_path ekleyelim (AllPhotos’taki mantıkla)
      data.forEach((item) => {
        item.file_path = `${webApiUrl}/auctions/${item.id}`;
      });

      setAuctionItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  // Teklif onay maili (veya benzer bir işlem) göndermek için
  const sendBidMail = async (item: ReadAllAuctionResponseDto) => {
    if (!user) {
      redirectWithPost("/auth/google");
      return;
    }

    try {
      const response = await fetch(`${webApiUrl}/mail/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Burada "Bid" aksiyonunu göndermeyi örnekledik
        body: JSON.stringify({ auctionId: item.id, action: "Bid" }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send mail. Status: ${response.status}, Message: ${errorText}`);
      }

      alert(`Bid mail sent successfully to ${user.email}!`);
      setSelectedAuction(null);
      setIsModalOpen(false);
      fetchAuctions(); // Listeyi yenilemek isterseniz tekrar çekebilirsiniz
    } catch (error) {
      console.error("Error sending mail:", error);
      alert("Failed to send mail. Check console for details.");
    }
  };

  // Resme tıklayınca önce auth kontrolü, sonra modal aç
  const handleAuctionClick = (item: ReadAllAuctionResponseDto) => {
    requireAuth(() => {
      setSelectedAuction(item);
      setIsModalOpen(true);
    });
  };

  // Modal’ı kapatma
  const handleCloseModal = () => {
    setSelectedAuction(null);
    setIsModalOpen(false);
  };

  return (
    <div className="container">
      {/* Tüm açık artırma öğelerini grid halinde gösteriyoruz */}
      <div className="imageGrid">
        {auctionItems.map((item, index) => (
          <div
            key={index}
            className="imageCard"
            onClick={() => handleAuctionClick(item)}
          >
            <img
              src={item.file_path}
              alt={`Auction ${index + 1}`}
              className="image"
            />
          </div>
        ))}
      </div>

      {/* Login için modal */}
      <CustomModal
        open={open}
        title="Login to View Auctions"
        onClose={handleClose}
        onConfirm={handleLogin}
        confirmText="Login with Google"
      />

      {/* Açık artırma detay modal’ı (PhotoDetailModal) */}
      {selectedAuction && (
        <PhotoDetailModal
          open={isModalOpen}
          onClose={handleCloseModal}
          photoUrl={selectedAuction.file_path || ""}
        >
          {/* İçeride EmailButtons örneğini kullandık */}
          <EmailButtons
            onApprove={() => selectedAuction && sendBidMail(selectedAuction)}
          />
        </PhotoDetailModal>
      )}
    </div>
  );
};

export default AuctionPage;
