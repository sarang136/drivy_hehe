    import React from 'react';
    import { useGetdriverPaymentRequestQuery, useUpdateDriverBankStatusMutation } from '../redux/apis/Driverapi';
    import { MdCheckCircle, MdCancel } from 'react-icons/md';
import { toast } from 'react-toastify';

    const PaymentRequests = () => {
    const { data, isLoading, error, refetch } = useGetdriverPaymentRequestQuery();
    const [updateStatus, { isLoading: isUpdating }] = useUpdateDriverBankStatusMutation();

   const handleStatusChange = async (id, newStatus) => {
  try {
    const res = await updateStatus({ id, status: newStatus }).unwrap();
    toast.success("Status Updated Successfully")
    console.log("Update success:", res); 
    refetch();
  } catch (err) {
    console.error('❌ Error updating status:', err);
    alert('Something went wrong!');
  }
};


    const requests = data?.data || [];

    if (isLoading) return <p className="p-6 text-center text-gray-500">Loading...</p>;
    if (error) return <p className="p-6 text-center text-red-500">Failed to load payment requests.</p>;

    return (
        <div className="p-4 sm:p-6 bg-white min-h-screen">
        {/* <h1 className="text-3xl font-bold mb-6 text-[#CDFF00] text-center">
            Driver Payment Requests
        </h1> */}

        <div className="overflow-x-auto rounded shadow-lg border border-[#CDFF00]">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#CDFF00] text-black font-semibold text-sm">
                <tr>
                <th className="py-3 px-4 text-left">Driver</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">UPI / Account</th>
                <th className="py-3 px-4 text-left">IFSC</th>
                <th className="py-3 px-4 text-left">Remark</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Requested At</th>
                <th className="py-3 px-4 text-left">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
                {requests.map(({ _id, driverId, bankDetails, createdAt }) => (
                <tr key={_id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{driverId?.name}</td>
                    <td className="py-3 px-4">{driverId?.phone}</td>
                    <td className="py-3 px-4 font-medium">₹{bankDetails?.amount}</td>
                    <td className="py-3 px-4">{bankDetails?.bankAccountOrUpiId}</td>
                    <td className="py-3 px-4">{bankDetails?.ifscCode}</td>
                    <td className="py-3 px-4">{bankDetails?.remark}</td>
                    <td className="py-3 px-4 capitalize">
                    <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                        bankDetails?.statusofpayment === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : bankDetails?.statusofpayment === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {bankDetails?.statusofpayment}
                    </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 space-x-2 flex items-center">
                    <button
                        className="bg-[#CDFF00] hover:bg-lime-300 transition text-black px-3 py-1 rounded flex items-center gap-1 text-sm"
                        // onClick={() => handleStatusChange(_id, 'approved')}
                        onClick={() => handleStatusChange(_id, 'completed')} // 
                        disabled={isUpdating}
                    >
                        <MdCheckCircle /> Approve
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-600 transition text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                        onClick={() => handleStatusChange(_id, 'rejected')}
                        disabled={isUpdating}
                    >
                        <MdCancel /> Reject
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>

            {requests.length === 0 && (
            <p className="text-center py-6 text-gray-500">No payment requests found.</p>
            )}
        </div>
        </div>
    );
    };

    export default PaymentRequests;


    