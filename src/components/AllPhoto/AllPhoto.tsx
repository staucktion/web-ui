import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import "../../styles/Styles.css";
import EmailButtons from "../EmailButtons/EmailButtons";
import { webApiUrl } from "../../env/envVars";
import { useAuth } from "../../providers/AuthContext";
import ReadAllPhotoResponseDto from "../../dto/photo/ReadAllPhotoResponseDto";
import useRequireAuth from "../../Hooks/useRequireAuth";
import redirectWithPost from "../../util/redirectWithPost";
import CustomModal from "../CustomModal/CustomModal"; // Login için modal
import PhotoDetailModal from "../PhotoDetailModal/PhotoDetailModal"; // Fotoğraf önizleme modal

const AllPhoto: React.FC = () => {
  const { user } = useAuth();
  const { open, requireAuth, handleClose, handleLogin } = useRequireAuth();

  const [watermarkedImages, setWatermarkedImages] = useState<ReadAllPhotoResponseDto[]>([]);
  const [selectedImage, setSelectedImage] = useState<ReadAllPhotoResponseDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // API'den fotoğrafları çekme (tüm fotoğraflar)
  const fetchWatermarkedImages = async () => {
    try {
      const response = await fetch(`${webApiUrl}/photos`);
      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }
      const data: ReadAllPhotoResponseDto[] = await response.json();

      // Her fotoğrafın file_path'ini ayarla
      data.forEach((img) => {
        img.file_path = `${webApiUrl}/photos/${img.id}`;
      });

      // Tüm fotoğrafları state'e koy
      setWatermarkedImages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWatermarkedImages();
  }, []);

  // Satın alım onay maili gönderme
  const sendApproveMail = async (img: ReadAllPhotoResponseDto) => {
    if (!user) {
      redirectWithPost("/auth/google");
      return;
    }

    try {
      const response = await fetch(`${webApiUrl}/mail/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId: img.id, action: "Approve Purchase" }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send mail. Status: ${response.status}, Message: ${errorText}`);
      }

      alert(`Purchase approved mail sent successfully to ${user.email}!`);
      setSelectedImage(null);
      setIsModalOpen(false);
      fetchWatermarkedImages();
    } catch (error) {
      console.error("Error sending mail:", error);
      alert("Failed to send mail. Check console for details.");
    }
  };

  // Fotoğrafa tıklayınca önce auth kontrolü, sonra modal aç
  const handleImageClick = (img: ReadAllPhotoResponseDto) => {
    requireAuth(() => {
      setSelectedImage(img);
      setIsModalOpen(true);
    });
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  return (
    <div className="container">
      <div className="imageGrid">
        {watermarkedImages.map((img, index) => (
          <div key={index} className="imageCard" onClick={() => handleImageClick(img)}>
            <img
              src={img.file_path}
              alt={`Watermarked ${index + 1}`}
              className="image"
            />
          </div>
        ))}
      </div>

      {/* Login için modal */}
      <CustomModal
        open={open}
        title="Login to View Images"
        onClose={handleClose}
        onConfirm={handleLogin}
        confirmText="Login with Google"
      />

      {/* Fotoğraf önizleme modal'ı: PhotoDetailModal kullanılıyor */}
      {selectedImage && (
        <PhotoDetailModal
          open={isModalOpen}
          onClose={handleCloseModal}
          photoUrl={selectedImage.file_path}
        >
          <EmailButtons onApprove={() => selectedImage && sendApproveMail(selectedImage)} />
        </PhotoDetailModal>
      )}
    </div>
  );
};

export default AllPhoto;
