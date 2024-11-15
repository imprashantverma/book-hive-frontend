import React, { useState } from 'react';
import Adminsidebar from '../../components/Adminsidebar';
import { useLocation } from 'react-router-dom';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const Addmember = () => {
  const [members, setMembers] = useState([]);
  const location = useLocation();
  const { data } = location.state || {};
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/admin/getAllMemberRequest');
      const result = await response.json();
      console.log("r:",result);
      if(result.data.length===0) toast.error('No member requests found');
      setMembers(result.data); // Extracting the data array
      setLoading(false);
    } catch (error) {
      console.error('Error fetching members:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (registrationId) => {
    try {
      setLoading(true);
      console.log(registrationId, data.adminId);
      const response = await fetch(`http://localhost:8080/admin/${data.adminId}/approveMember/${registrationId}`, {
        method: 'POST',
        body: null,
      });
      console.log(await response.json());
      if (response.ok) {
        toast.success('Member approved successfully');
        fetchMembers();
      } else {
        toast.error('Failed to approve member');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error approving member:', error);
      setLoading(false);
    }
  };

  const handleReject = async (registrationId) => {
    try {
      setLoading(true);
      console.log(registrationId, data.adminId);
      const response = await fetch(`http://localhost:8080/admin/rejectMember/${registrationId}`, {
        method: 'DELETE',
        body: null,
      });
      console.log(await response.json());
      if (response.ok) {
        toast.success('Member rejected successfully');
        fetchMembers();
      } else {
        toast.error('Failed to reject member');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error rejecting member:', error);
      setLoading(false);
    }
  };

  return (
    <div className='text-white flex flex-row min-h-screen bg-gray-900'>
      <div className='w-1/4'>
        <Adminsidebar />
      </div>
      <div className='w-3/4 p-8'>
        <button
          onClick={fetchMembers}
          className='mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 translate-x-[300%]'
        >
          Fetch Members
        </button>
        {loading ? (
          <Loader />
        ) : (
          members.length > 0 && (
            <table className='min-w-full bg-gray-800 text-white'>
              <thead>
                <tr>
                  <th className='py-2 px-4 border-b border-gray-700'>Registration ID</th>
                  <th className='py-2 px-4 border-b border-gray-700'>Name</th>
                  <th className='py-2 px-4 border-b border-gray-700'>Email</th>
                  <th className='py-2 px-4 border-b border-gray-700'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.registrationId} className='hover:bg-gray-700'>
                    <td className='py-2 px-4 border-b border-gray-700'>{member.registrationId}</td>
                    <td className='py-2 px-4 border-b border-gray-700'>{member.name}</td>
                    <td className='py-2 px-4 border-b border-gray-700'>{member.email}</td>
                    <td className='py-2 px-4 border-b border-gray-700'>
                      <button
                        onClick={() => handleApprove(member.registrationId)}
                        className='mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 border'
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(member.registrationId)}
                        className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 border'
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
};

export default Addmember;
