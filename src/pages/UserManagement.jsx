// import React from 'react';
// import { MdDelete } from 'react-icons/md';
// import { useNavigate } from 'react-router-dom';
// import {
//   useGetAllUserQuery,
//   useDeleteUserMutation,
// } from '../redux/apis/Userapi';
// import Loader from '../components/Loader';
// import { toast } from 'react-toastify';

// const UserManagement = () => {
//   const navigate = useNavigate();
//   const { data: response, isLoading, isError } = useGetAllUserQuery();
//   // Reverse the users array so that newly added users come first
//   const users = (response?.data ? [...response.data].reverse() : []);
//   console.log("this is user", users);

//   const [deleteUser] = useDeleteUserMutation();

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
//     try {
//       await deleteUser(id).unwrap();
//       toast.success("User Successfully Deleted !")
//     } catch (error) {
//       console.error("Error deleting user:", error?.data?.error || error);
//     }
//   };

//   function capitalizeFirstLetter(str) {
//     if (!str) return '';
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   }

//   if (isLoading) return <div><Loader/></div>;
//   if (isError) return <p>Error fetching users...</p>;

//   console.log(users)

//   return (
//     <div>
//       <div className='flex'>
//         <h2 className="text-xl font-semibold text-gray-800  mb-2 ml-7">
//           Booking
//         </h2>
//       </div>

//       {/* Desktop table */}
//       <div className="hidden lg:block">
//         <table
//           className="table-auto border-separate w-full mt-4"
//           style={{ borderSpacing: '0 10px' }}
//         >
//           <thead className="bg-white text-left shadow-md rounded-lg">
//             <tr>
//               <th className="px-4 py-4 rounded-l-lg">Name</th>
//               <th className="px-4 py-2">Email</th>
//               <th className="px-4 py-2">Status</th>
//               <th className="px-4 py-2">Created At</th>
//               <th className="px-4 py-2">Last Login</th>
//               {/* Swapped Columns */}
//               <th className="px-4 py-2 rounded-r-lg">Action</th>
//               <th className="px-4 py-2">View</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user._id} className="bg-white shadow-md rounded">
//                 <td className="px-4 py-4 rounded-l-lg">
//                   <span className="font-medium">{capitalizeFirstLetter(user.name)}</span>
//                 </td>
//                 <td className="px-4 py-2">{user.email}</td>
//                 <td className="px-4 py-2">{user.status || 'N/A'}</td>
//                 <td className="px-4 py-2">
//                   {new Date(user.createdAt).toLocaleDateString()}
//                 </td>
//                 <td className="px-4 py-2">
//                   {new Date(user.lastLogin).toLocaleDateString()}
//                 </td>

//                 {/* Swapped: Actions first */}
//                 <td className="px-4 py-2">
//                   <button
//                     onClick={() => handleDelete(user._id)}
//                     className="text-red-500 text-xl hover:text-red-600"
//                   >
//                     <MdDelete />
//                   </button>
//                 </td>

//                 {/* Swapped: View now at the last column */}
//                 <td className="px-4 py-2 rounded-r-lg">
//                   <button
//                     onClick={() =>
//                       navigate('/user-booking', { state: user })
//                     }
//                     className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
//                   >
//                     View All
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile card layout */}
//       <div className="lg:hidden space-y-4 mt-4">
//         {users.map((user) => (
//           <div
//             key={user._id}
//             className="bg-white shadow-md rounded-lg p-4 space-y-1"
//           >
//             <div className="font-semibold text-lg text-blue-800">
//               {user.name}
//             </div>
//             <div className="text-sm text-gray-600">Email: {user.email}</div>
//             <div className="text-sm text-gray-600">
//               Status: {user.status || "N/A"}
//             </div>
//             <div className="text-sm text-gray-600">
//               Created: {new Date(user.createdAt).toLocaleDateString()}
//             </div>
//             <div className="text-sm text-gray-600">
//               Last Login: {new Date(user.lastLogin).toLocaleDateString()}
//             </div>
//             <div className="flex justify-between items-center pt-2">
//               {/* Delete first */}
//               <button
//                 onClick={() => handleDelete(user._id)}
//                 className="text-red-500 text-xl hover:text-red-600"
//               >
//                 <MdDelete />
//               </button>

//               {/* View button */}
//               <button
//                 onClick={() =>
//                   navigate("/user-booking", { state: { user } })
//                 }
//                 className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
//               >
//                 View All
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// };

// export default UserManagement;




import React from 'react';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import {
  useGetAllUserQuery,
  useDeleteUserMutation,
} from '../redux/apis/Userapi';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const UserManagement = () => {
  const navigate = useNavigate();
  const { data: response, isLoading, isError } = useGetAllUserQuery();
  const users = (response?.data ? [...response.data].reverse() : []);
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id).unwrap();
      toast.success("User Successfully Deleted !");
    } catch (error) {
      console.error("Error deleting user:", error?.data?.error || error);
    }
  };

  function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // 🔹 Export PDF Function
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("User Management Report", 14, 10);

    // Convert data for table
    const tableData = users.map((user, index) => [
      index + 1,
      capitalizeFirstLetter(user.name),
      user.email,
      user.status || 'N/A',
      new Date(user.createdAt).toLocaleDateString(),
      new Date(user.lastLogin).toLocaleDateString(),
    ]);

    // ✅ Correct way (pass doc as first arg)
    autoTable(doc, {
      head: [["#", "Name", "Email", "Status", "Created At", "Last Login"]],
      body: tableData,
      startY: 20,
    });

    doc.save("user-details.pdf");
  };

  if (isLoading) return <div><Loader/></div>;
  if (isError) return <p>Error fetching users...</p>;

  return (
    <div>
      <div className='flex justify-between items-center px-7'>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Booking
        </h2>
        {/* 🔹 Export Button */}
        <button
          onClick={handleExportPDF}
          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
        >
          Export Details
        </button>
      </div>

      {/* Table (desktop) */}
      <div className="hidden lg:block">
        <table
          className="table-auto border-separate w-full mt-4"
          style={{ borderSpacing: '0 10px' }}
        >
          <thead className="bg-white text-left shadow-md rounded-lg">
            <tr>
              <th className="px-4 py-4 rounded-l-lg">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Last Login</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2 rounded-r-lg">View</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="bg-white shadow-md rounded">
                <td className="px-4 py-4 rounded-l-lg">
                  <span className="font-medium">
                    {capitalizeFirstLetter(user.name)}
                  </span>
                </td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.status || 'N/A'}</td>
                <td className="px-4 py-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  {new Date(user.lastLogin).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 text-xl hover:text-red-600"
                  >
                    <MdDelete />
                  </button>
                </td>
                <td className="px-4 py-2 rounded-r-lg">
                  <button
                    onClick={() => navigate('/user-booking', { state: user })}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                  >
                    View All
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="lg:hidden space-y-4 mt-4">
        {users.map((user) => (
          <div key={user._id} className="bg-white shadow-md rounded-lg p-4 space-y-1">
            <div className="font-semibold text-lg text-blue-800">
              {user.name}
            </div>
            <div className="text-sm text-gray-600">Email: {user.email}</div>
            <div className="text-sm text-gray-600">Status: {user.status || "N/A"}</div>
            <div className="text-sm text-gray-600">
              Created: {new Date(user.createdAt).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">
              Last Login: {new Date(user.lastLogin).toLocaleDateString()}
            </div>
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => handleDelete(user._id)}
                className="text-red-500 text-xl hover:text-red-600"
              >
                <MdDelete />
              </button>
              <button
                onClick={() => navigate("/user-booking", { state: { user } })}
                className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
              >
                View All
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;

