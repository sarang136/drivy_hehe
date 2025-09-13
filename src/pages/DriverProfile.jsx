// import React, { useState } from "react";
// import { HiArrowLeft } from "react-icons/hi";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   useGetDriverByIdQuery,
//   useDeleteDriverMutation,
//   useGetAllDriverQuery,
// } from "../redux/apis/Driverapi";
// import { toast } from "react-toastify";

// const DriverProfile = () => {
//   const [imageURL, setImageUrl] = useState(null);
//   const [imageModal, setImageModal] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const userId = location.state?.userId;

//   const {
//     data: driverData,
//     isLoading,
//     isError,
//   } = useGetDriverByIdQuery(userId, {
//     pollingInterval: 2000,
//     refetchOnMountOrArgChange: true,
//     refetchOnFocus: true,
//     refetchOnReconnect: true,
//     skip: !userId,
//   });

//   const { data: allDrivers, refetch: refetchAllDrivers } =
//     useGetAllDriverQuery();

//   console.log("Driver Data", driverData);

//   const [deleteDriver] = useDeleteDriverMutation();
//   const [activeTab, setActiveTab] = useState(null);

//   const Detail = ({ label, value }) => (
//     <div>
//       <label className="text-gray-600">{label}</label>
//       <div className="bg-gray-100 p-2 rounded mt-1">{value}</div>
//     </div>
//   );

//   const handleDelete = async () => {
//     if (window.confirm("Are you sure you want to delete this driver?")) {
//       try {
//         await deleteDriver(userId).unwrap();
//         toast.success("Driver deleted successfully!");
//         refetchAllDrivers();
//         navigate("/drivers");
//       } catch (error) {
//         console.error("Failed to delete driver:", error);
//         toast.error("Error occurred while deleting the driver.");
//       }
//     }
//   };

//   if (isLoading) return <p className="p-4">Loading driver details...</p>;
//   if (isError || !driverData)
//     return <p className="p-4 text-red-600">Failed to fetch driver details.</p>;

//   function capitalizeFirstLetter(str) {
//     if (!str) return "";
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   }
//   console.log(driverData);

//   return (
//     <div className="bg-gray-100 min-h-screen p-4">
//       {/* Stats Cards */}
//       {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//         <div
//           onClick={() => setActiveTab("revenue")}
//           className={`bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-lime-50 border-2 ${activeTab === "revenue" ? "border-[#CDFF00]" : "border-transparent"
//             }`}
//         >
//           <h3 className="text-sm text-gray-500">Number Of Trips</h3>
//           <p className="text-2xl font-bold text-green-600">
//             {driverData.noOfTrips || 0}
//           </p>
//         </div>

//         <div
//           onClick={() => setActiveTab("bookings")}
//           className={`bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-lime-50 border-2 ${activeTab === "bookings" ? "border-[#CDFF00]" : "border-transparent"
//             }`}
//         >
//           <h3 className="text-sm text-gray-500">Total Bookings</h3>
//           <p className="text-2xl font-bold">{driverData.totalBookings || 0}</p>
//           <p className="text-xs text-green-500">{driverData.growth || ""}</p>
//         </div>
//       </div> */}

//       {/* Revenue Tab */}
//       {activeTab === "revenue" && (
//         <div className="p-2 rounded-lg mb-6">
//           <div className="flex justify-between items-center">
//             <h3 className="text-lg font-medium mb-4">Revenue Transactions</h3>
//             <button
//               onClick={() => setActiveTab(null)}
//               className="text-sm text-blue-600 underline"
//             >
//               Back
//             </button>
//           </div>
//           <table className="w-full text-sm text-left bg-white rounded-lg shadow-md">
//             <thead>
//               <tr>
//                 <th className="p-3">User</th>
//                 <th className="p-3">Date</th>
//                 <th className="p-3">Amount</th>
//                 <th className="p-3">Commission</th>
//                 <th className="p-3">Driver Payout</th>
//                 <th className="p-3">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {driverData.revenueTransactions?.map((tx) => (
//                 <tr key={tx._id} className="border-t">
//                   <td className="p-3">{tx.user}</td>
//                   <td className="p-3">{tx.date}</td>
//                   <td className="p-3 text-green-600 font-semibold">
//                     {tx.amount}
//                   </td>
//                   <td className="p-3">{tx.commission}</td>
//                   <td className="p-3">{tx.driverPayout}</td>
//                   <td className="p-3">
//                     <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
//                       {tx.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Bookings Tab */}
//       {activeTab === "bookings" && (
//         <div className="p-2 rounded-lg mb-6">
//           <div className="flex justify-between items-center">
//             <h3 className="text-lg font-medium mb-4">Bookings</h3>
//             <button
//               onClick={() => setActiveTab(null)}
//               className="text-sm text-blue-600 underline"
//             >
//               Back
//             </button>
//           </div>
//           <table className="w-full text-sm text-left bg-white rounded-lg shadow-md">
//             <thead>
//               <tr>
//                 <th className="p-3">User</th>
//                 <th className="p-3">Date</th>
//                 <th className="p-3">Amount</th>
//                 <th className="p-3">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {driverData.bookings?.map((b) => (
//                 <tr key={b._id} className="border-t">
//                   <td className="p-3">{b.user}</td>
//                   <td className="p-3">{b.date}</td>
//                   <td className="p-3 text-green-600 font-semibold">
//                     {b.amount}
//                   </td>
//                   <td className="p-3">
//                     <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
//                       {b.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Details Card */}
//       {activeTab === null && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h3 className="text-lg font-semibold border-b-2 border-lime-400 mb-4 pb-2">
//               Personal Details
//             </h3>
//             <div className="flex items-center gap-4 mb-4">
//               {/* <img
//                 src={
//                   driverData?.profilePicture
//                     ? `${driverData.profilePicture}?t=${Date.now()}`
//                     : ""
//                 }
//                 alt="Profile"
//                 className="w-20 h-20 rounded-full object-cover"
//               /> */}
//               <img
//                 className="w-20 h-20 rounded-full object-cover"
//                 src={
//                   driverData?.profilePicture
//                     ? `${driverData.profilePicture}?t=${Date.now()}`
//                     : ""
//                 }
//               />
//             </div>
//             <div className="space-y-3 text-sm">
//               <Detail
//                 label="Full Name"
//                 value={capitalizeFirstLetter(driverData.name)}
//               />
//               <Detail label="Phone Number" value={driverData.phone} />
//               <Detail label="Email Id" value={driverData.email} />
//               <Detail
//                 label="Experience"
//                 value={
//                   driverData.yearofexperience
//                     ? `${driverData.yearofexperience} years`
//                     : "N/A"
//                 }
//               />
//               <Detail label="Language" value={driverData.Langauge || "N/A"} />
//               <Detail label="Address" value={driverData.address} />
//               <Detail
//                 label="Documents"
//                 value={
//                   <div className="flex flex-wrap gap-6">
//                     <div>
//                       <p>Aadhar image</p>
//                       <img
//                         className="max-h-[120px] cursor-pointer"
//                         src={driverData?.AdharCard}
//                         onClick={() => {
//                           setImageUrl(driverData?.AdharCard);
//                           setImageModal(true);
//                         }}
//                       />
//                     </div>
//                     <div>
//                       <p>Profile image</p>
//                       <img
//                         className="max-h-[120px] cursor-pointer"
//                         src={driverData?.profilePicture}
//                         onClick={() => {
//                           setImageUrl(driverData?.profilePicture);
//                           setImageModal(true);
//                         }}
//                       />
//                     </div>
//                     <div>
//                       <p>License image</p>
//                       <img
//                         className="max-h-[120px] cursor-pointer"
//                         src={driverData?.license}
//                         onClick={() => {
//                           setImageUrl(driverData?.license);
//                           setImageModal(true);
//                         }}
//                       />
//                     </div>
//                   </div>
//                 }
//               />
//             </div>
//             <button
//               onClick={handleDelete}
//               className="mt-6 text-red-600 border border-red-500 px-4 py-2 rounded hover:bg-red-100 transition"
//             >
//               Delete Driver
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Image Modal */}
//       {imageModal && (
//         <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-4 rounded shadow-lg max-w-sm">
//             <img
//               src={imageURL}
//               alt="Document"
//               className="max-h-[400px] w-auto object-contain"
//             />
//             <button
//               className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//               onClick={() => setImageModal(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// export default DriverProfile;


import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useGetDriverByIdQuery,
  useDeleteDriverMutation,
  useGetAllDriverQuery,
} from "../redux/apis/Driverapi";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DriverProfile = () => {
  const [imageURL, setImageUrl] = useState(null);
  const [imageModal, setImageModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const {
    data: driverData,
    isLoading,
    isError,
  } = useGetDriverByIdQuery(userId, {
    pollingInterval: 2000,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: !userId,
  });

  const { refetch: refetchAllDrivers } = useGetAllDriverQuery();
  const [deleteDriver] = useDeleteDriverMutation();
  const [activeTab, setActiveTab] = useState(null);

  const Detail = ({ label, value }) => (
    <div>
      <label className="text-gray-600">{label}</label>
      <div className="bg-gray-100 p-2 rounded mt-1">{value}</div>
    </div>
  );

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        await deleteDriver(userId).unwrap();
        toast.success("Driver deleted successfully!");
        refetchAllDrivers();
        navigate("/drivers");
      } catch (error) {
        console.error("Failed to delete driver:", error);
        toast.error("Error occurred while deleting the driver.");
      }
    }
  };

  const handleExport = () => {
    const pdf = new jsPDF("p", "mm", "a4");

    pdf.setFontSize(18);
    pdf.text("Driver Details Report", 105, 20, { align: "center" });

    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        if (!src) return resolve(null);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    };

    (async () => {
      const [profileImg, adharImg, licenseImg] = await Promise.all([
        loadImage(driverData?.profilePicture),
        loadImage(driverData?.AdharCard),
        loadImage(driverData?.license),
      ]);

      let y = 40;
      pdf.setFontSize(12);

      autoTable(pdf, {
        startY: y,
        head: [["Field", "Details"]],
        body: [
          ["Full Name", driverData?.name || "N/A"],
          ["Phone", driverData?.phone || "N/A"],
          ["Email", driverData?.email || "N/A"],
          [
            "Experience",
            driverData?.yearofexperience
              ? `${driverData.yearofexperience} years`
              : "N/A",
          ],
          ["Language", driverData?.Langauge || "N/A"],
          ["Address", driverData?.address || "N/A"],
        ],
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
      });

      y = pdf.lastAutoTable.finalY + 10;

      autoTable(pdf, {
        startY: y,
        head: [["Document", "Status"]],
        body: [
          ["Aadhar", driverData?.AdharCard ? "Uploaded" : "N/A"],
          ["License", driverData?.license ? "Uploaded" : "N/A"],
          ["Profile", driverData?.profilePicture ? "Uploaded" : "N/A"],
        ],
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
      });

      y = pdf.lastAutoTable.finalY + 15;

      pdf.setFontSize(13);
      pdf.text("Documents:", 14, y - 5);

      const imgWidth = 60;
      const imgHeight = 45;
      const gap = 20;
      const leftX = 20;
      const rightX = leftX + imgWidth + gap;

      let topRowY = y + 2;

      if (adharImg) {
        pdf.text("Aadhar", leftX + imgWidth / 2, y, { align: "center" });
        pdf.addImage(adharImg, "JPEG", leftX, topRowY, imgWidth, imgHeight);
      }

      if (licenseImg) {
        pdf.text("License", rightX + imgWidth / 2, y, { align: "center" });
        pdf.addImage(licenseImg, "JPEG", rightX, topRowY, imgWidth, imgHeight);
      }

      if (profileImg) {
        const profileY = topRowY + imgHeight + 15;
        pdf.text("Profile", leftX + imgWidth / 2, profileY - 5, { align: "center" });
        pdf.addImage(profileImg, "JPEG", leftX, profileY, imgWidth, imgHeight);
      }

      pdf.save(`${driverData?.name || "driver"}-details.pdf`);
    })();
  };



  if (isLoading) return <p className="p-4">Loading driver details...</p>;
  if (isError || !driverData)
    return <p className="p-4 text-red-600">Failed to fetch driver details.</p>;

  function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export Details
        </button>
      </div>

      {activeTab === null && (
        <div
          id="driver-details"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold border-b-2 border-lime-400 mb-4 pb-2">
              Personal Details
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <img
                crossOrigin="anonymous"
                className="w-20 h-20 rounded-full object-cover"
                src={
                  driverData?.profilePicture
                    ? `${driverData.profilePicture}?t=${Date.now()}`
                    : ""
                }
                alt="Profile"
              />
            </div>
            <div className="space-y-3 text-sm">
              <Detail
                label="Full Name"
                value={capitalizeFirstLetter(driverData.name)}
              />
              <Detail label="Phone Number" value={driverData.phone} />
              <Detail label="Email Id" value={driverData.email} />
              <Detail
                label="Experience"
                value={
                  driverData.yearofexperience
                    ? `${driverData.yearofexperience} years`
                    : "N/A"
                }
              />
              <Detail label="Language" value={driverData.Langauge || "N/A"} />
              <Detail label="Address" value={driverData.address} />
              <Detail
                label="Documents"
                value={
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <p>Aadhar image</p>
                      <img
                        crossOrigin="anonymous"
                        className="max-h-[120px] cursor-pointer"
                        src={driverData?.AdharCard}
                        alt="Aadhar"
                        onClick={() => {
                          setImageUrl(driverData?.AdharCard);
                          setImageModal(true);
                        }}
                      />
                    </div>
                    <div>
                      <p>Profile image</p>
                      <img
                        crossOrigin="anonymous"
                        className="max-h-[120px] cursor-pointer"
                        src={driverData?.profilePicture}
                        alt="Profile"
                        onClick={() => {
                          setImageUrl(driverData?.profilePicture);
                          setImageModal(true);
                        }}
                      />
                    </div>
                    <div>
                      <p>License image</p>
                      <img
                        crossOrigin="anonymous"
                        className="max-h-[120px] cursor-pointer"
                        src={driverData?.license}
                        alt="License"
                        onClick={() => {
                          setImageUrl(driverData?.license);
                          setImageModal(true);
                        }}
                      />
                    </div>
                  </div>
                }
              />
            </div>
            <button
              onClick={handleDelete}
              className="mt-6 text-red-600 border border-red-500 px-4 py-2 rounded hover:bg-red-100 transition"
            >
              Delete Driver
            </button>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {imageModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-sm">
            <img
              src={imageURL}
              alt="Document"
              className="max-h-[400px] w-auto object-contain"
            />
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => setImageModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverProfile;



