{activeTab === 'bookings' && (
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium mb-4">Bookings</h3>
                        <button onClick={() => setActiveTab(null)} className="text-sm text-blue-600 underline">Back</button>
                    </div>
                    <table className="w-full text-sm text-left mt-10">
                        <thead className=" rounded-lg shadow-md">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-3">From</th>
                                <th className="p-3">To</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>

                        {/* Gap below header */}
                        <tbody>
                            <tr>
                                <td colSpan="7" className="h-4"></td>
                            </tr>
                        </tbody>

                        {/* Booking Rows */}
                        {driverData.bookings.map(b => (
                            <tbody key={b.id}>
                                <tr className="bg-white shadow-md rounded-lg">
                                    <td className="p-4">{b.user}</td>
                                    <td className="p-4">{b.from}</td>
                                    <td className="p-4">{b.to}</td>
                                    <td className="p-4">{b.date}</td>
                                    <td className="p-4 text-green-600 font-semibold">{b.amount}</td>
                                    <td className="p-4">
                                        <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-red-500 cursor-pointer"><MdDelete /></td>
                                </tr>
                                <tr>
                                    <td colSpan="7" className="h-4"></td>
                                </tr>
                            </tbody>
                        ))}
                    </table>

                </div>
            )}