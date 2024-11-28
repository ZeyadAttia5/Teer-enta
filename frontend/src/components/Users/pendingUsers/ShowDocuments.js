import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button, Spin, message } from "antd";
import { getProfile } from "../../../api/profile.ts";
import { acceptUser, rejectUser } from "../../../api/account.ts";

function ShowDocuments() {
  const navigate = useNavigate();
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
        if (["Advertiser", "Seller"].includes(fetchedUserRole)) {
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
      navigate("/pendingUsers");
      message.success("User accepted successfully");
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to accept user");
    }
  };

  const handleReject = async () => {
    try {
      await rejectUser(id);
      navigate("/pendingUsers");
      message.success("User rejected successfully");
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to reject user");
    }
  };

  const downloadFile = (url) => {
    window.open(url, "_blank");
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#1C325B] to-[#2A4575]">
          <Spin size="large" />
        </div>
    );
  }

  return (
      <div className="min-h-screen flex items-center justify-center p-8 ">
        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-8">
          {/* Heading */}
          <h2 className="text-3xl font-semibold text-center text-[#1C325B] mb-8">
            {user.username}'s Documents
          </h2>

          <div className="space-y-8">
            {/* ID Document Section */}
            <div>
              <div className="flex items-center gap-2 font-semibold text-[#1C325B]">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                ID Document:
              </div>
              {documents.idCardUrl ? (
                  <Button
                      type="link"
                      className="text-[#1C325B] font-medium underline hover:text-[#0E1D38] transition-colors duration-200"
                      onClick={() => downloadFile(documents.idCardUrl)}
                  >
                    Download ID Card
                  </Button>
              ) : (
                  <p className="text-sm text-gray-600">No ID Document available</p>
              )}
            </div>

            {/* Taxation Card Section */}
            {["Advertiser", "Seller"].includes(userRole) && (
                <div>
                  <div className="font-semibold text-[#1C325B]">Taxation Card:</div>
                  {documents.taxationCardUrl ? (
                      <Button
                          type="link"
                          className="text-[#1C325B] font-medium underline hover:text-[#0E1D38] transition-colors duration-200"
                          onClick={() => downloadFile(documents.taxationCardUrl)}
                      >
                        Download Taxation Card
                      </Button>
                  ) : (
                      <p className="text-sm text-gray-600">No Taxation Card available</p>
                  )}
                </div>
            )}

            {/* Certificates Section */}
            {userRole === "TourGuide" && (
                <div>
                  <div className="flex items-center gap-2 font-semibold text-[#1C325B]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
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
                                className="text-[#1C325B] font-medium underline hover:text-[#0E1D38] transition-colors duration-200"
                                onClick={() => downloadFile(certificate)}
                            >
                              Download Certificate {index + 1}
                            </Button>
                          </div>
                      ))
                  ) : (
                      <p className="text-sm text-gray-600">No Certificates found</p>
                  )}
                </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-8 mt-8">
            <Button
                type="primary"
                className="bg-[#1C325B] hover:bg-[#1C325B]/90 px-8 py-3 text-white rounded-full shadow-md transition duration-300 transform hover:scale-105"
                onClick={handleAccept}
            >
              Accept
            </Button>
            <Button
                type="primary"
                color={"red"}
                className="bg-red-600 hover:bg-red-500 px-8 py-3 text-white rounded-full shadow-md transition duration-300 transform hover:scale-105"
                onClick={handleReject}
            >
              Reject
            </Button>
          </div>
        </div>
      </div>
  );



}

export default ShowDocuments;
