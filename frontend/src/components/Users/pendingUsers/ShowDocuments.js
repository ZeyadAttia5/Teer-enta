import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin, ConfigProvider, notification ,message } from "antd";
import {
  IdcardOutlined,
  FileDoneOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { getProfile } from "../../../api/profile.ts";
import { acceptUser, rejectUser } from "../../../api/account.ts";

const ShowDocuments = () => {
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
            certificates: response.data.certificates || [],
          });
        } else {
          message.warning("User role not found");
        }
      } catch (error) {
        message.warning(error.response.data.message||"Failed to fetch documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [id]);

  const handleAccept = async () => {
    try {
      await acceptUser(id);
      message.success("User accepted successfully")
      navigate("/pendingUsers");
    } catch (error) {
      message.warning(error.response.data.message);
    }
  };

  const handleReject = async () => {
    try {
      await rejectUser(id);
      message.success("User rejected successfully");
      navigate("/pendingUsers");
    } catch (error) {
      message.warning(error.response.data.message);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Spin size="large" />
        </div>
    );
  }

  return (
      <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1C325B",
            },
          }}
      >
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 text-white mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <IdcardOutlined className="text-xl" />
                  <h3 className="text-lg font-semibold m-0">
                    {user.username}'s Documents
                  </h3>
                </div>
                <p className="text-gray-200 mt-2 mb-0 opacity-90">
                  Review verification documents
                </p>
              </div>

              {/* Documents Section */}
              <div className="space-y-8">
                {/* ID Document */}
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <IdcardOutlined className="text-[#1C325B] text-xl" />
                    <h4 className="font-semibold text-[#1C325B] m-0">ID Document</h4>
                  </div>
                  {documents.idCardUrl ? (
                      <Button
                          type="default"
                          icon={<DownloadOutlined />}
                          onClick={() => window.open(documents.idCardUrl, "_blank")}
                          className="border-[#1C325B] text-[#1C325B] hover:bg-[#1C325B]/5"
                      >
                        Download ID Card
                      </Button>
                  ) : (
                      <p className="text-gray-500">No ID Document available</p>
                  )}
                </div>

                {/* Taxation Card */}
                {["Advertiser", "Seller"].includes(userRole) && (
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <FileTextOutlined className="text-[#1C325B] text-xl" />
                        <h4 className="font-semibold text-[#1C325B] m-0">Taxation Card</h4>
                      </div>
                      {documents.taxationCardUrl ? (
                          <Button
                              type="default"
                              icon={<DownloadOutlined />}
                              onClick={() => window.open(documents.taxationCardUrl, "_blank")}
                              className="border-[#1C325B] text-[#1C325B] hover:bg-[#1C325B]/5"
                          >
                            Download Taxation Card
                          </Button>
                      ) : (
                          <p className="text-gray-500">No Taxation Card available</p>
                      )}
                    </div>
                )}

                {/* Certificates */}
                {userRole === "TourGuide" && (
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <FileDoneOutlined className="text-[#1C325B] text-xl" />
                        <h4 className="font-semibold text-[#1C325B] m-0">Certificates</h4>
                      </div>
                      {documents.certificates.length > 0 ? (
                          <div className="space-y-3">
                            {documents.certificates.map((certificate, index) => (
                                <Button
                                    key={index}
                                    type="default"
                                    icon={<DownloadOutlined />}
                                    onClick={() => window.open(certificate, "_blank")}
                                    className="border-[#1C325B] text-[#1C325B] hover:bg-[#1C325B]/5 block"
                                >
                                  Download Certificate {index + 1}
                                </Button>
                            ))}
                          </div>
                      ) : (
                          <p className="text-gray-500">No Certificates available</p>
                      )}
                    </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={handleAccept}
                    size="large"
                    className="bg-[#1C325B] hover:bg-[#1C325B]/90 px-8"
                >
                  Accept User
                </Button>
                <Button
                    danger
                    type="primary"
                    icon={<CloseCircleOutlined />}
                    onClick={handleReject}
                    size="large"
                    className="px-8"
                >
                  Reject User
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ConfigProvider>
  );
};

export default ShowDocuments;