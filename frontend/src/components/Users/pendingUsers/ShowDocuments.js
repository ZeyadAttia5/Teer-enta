import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Spin, message } from "antd";
import { getProfile } from "../../../api/profile.ts";
import { acceptUser, rejectUser } from "../../../api/account.ts";
import { useLocation, useNavigate } from "react-router-dom";

function ShowDocuments() {
  const navigate = useNavigate();
  const location = useLocation();
//   const { setUsers } = location.state;
  const { id } = useParams();
  const [documents, setDocuments] = useState({
    idCardUrl: null,
    taxationCardUrl: null,
    certificates: [],
  });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await getProfile(id);
        setUser(response.data);
        const fetchedUserRole = response.data.userRole;

        setUserRole(fetchedUserRole);
        if (fetchedUserRole === "Advertiser" || fetchedUserRole === "Seller") {
          setDocuments({
            idCardUrl: response.data.idCardUrl,
            taxationCardUrl: response.data.taxationCardUrl,
            certificates: [],
          });
        } else if (fetchedUserRole === "TourGuide") {
          setDocuments({
            idCardUrl: response.data.idCardUrl,
            taxationCardUrl: null,
            certificates: response.data.certificates,
          });
        } else {
          message.error("User role not supported");
        }
      } catch (error) {
        message.error("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [id]);

  const handleAccept = async () => {
    try {
      await acceptUser(id);
      //   setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      navigate("/pendingUsers");
      message.success("User accepted successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to accept user";
      message.error(errorMessage);
    }
  };

  const handleReject = async () => {
    try {
      await rejectUser(id);
      //   setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      navigate("/pendingUsers");
      message.success("User rejected successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to reject user";
      message.error(errorMessage);
    }
  };

  const downloadFile = (url) => {
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

return (
    <div className="p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">
            {user.username}'s Documents
        </h2>
        <div className="mb-4">
            <h3 className="font-semibold">ID Document:</h3>
            {documents.idCardUrl ? (
                <Button type="link" onClick={() => downloadFile(documents.idCardUrl)}>
                    Download ID Card
                </Button>
            ) : (
                <p>No ID Document available</p>
            )}
        </div>
        {userRole === "Advertiser" || userRole === "Seller" ? (
            <div className="mb-4">
                <h3 className="font-semibold">Taxation Card:</h3>
                {documents.taxationCardUrl ? (
                    <Button
                        type="link"
                        onClick={() => downloadFile(documents.taxationCardUrl)}
                    >
                        Download Taxation Card
                    </Button>
                ) : (
                    <p>No Taxation Card available</p>
                )}
            </div>
        ) : null}
        {userRole === "TourGuide" ? (
            <div className="mb-4">
                <h3 className="font-semibold">Certificates:</h3>
                {documents.certificates.length > 0 ? (
                    documents.certificates.map((certificate, index) => (
                        <div key={index}>
                            <Button type="link" onClick={() => downloadFile(certificate)}>
                                Download Certificate {index + 1}
                            </Button>
                        </div>
                    ))
                ) : (
                    <p>No Certificates found</p>
                )}
            </div>
        ) : null}
        <div className="flex justify-center space-x-4 mt-6">
            <Button type="primary" onClick={handleAccept}>
                Accept
            </Button>
            <Button type="danger" onClick={handleReject}>
                Reject
            </Button>
        </div>
    </div>
);
}

export default ShowDocuments;
