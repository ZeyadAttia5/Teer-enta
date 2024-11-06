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
    <div className="flex justify-center">
      <div className="p-6 flex flex-col gap-40 justify-between">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {user.username}'s Documents
        </h2>
        <div>
          <div className="mb-4">
            <div className="font-semibold flex gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              ID Document:
            </div>
            {documents.idCardUrl ? (
              <Button
                type="link"
                onClick={() => downloadFile(documents.idCardUrl)}
              >
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
              <div className="font-semibold flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                  />
                </svg>
                Certificates:
              </div>
              {documents.certificates.length > 0 ? (
                documents.certificates.map((certificate, index) => (
                  <div key={index}>
                    <Button
                      type="link"
                      onClick={() => downloadFile(certificate)}
                    >
                      Download Certificate {index + 1}
                    </Button>
                  </div>
                ))
              ) : (
                <p>No Certificates found</p>
              )}
            </div>
          ) : null}
        </div>
        <div className="flex justify-center space-x-4 mt-6">
          <Button type="primary" onClick={handleAccept}>
            Accept
          </Button>
          <Button type="danger" onClick={handleReject}>
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShowDocuments;
