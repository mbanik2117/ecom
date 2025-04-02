"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/app/firebase'; // Adjust the import according to your project structure
import { doc, getDoc } from 'firebase/firestore';

type UserDetails = {
  email: string;
  id: string;
  mobile: string;
  name: string;
};

export default function AccountPage() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async (userId: string) => {
      try {
        const userDoc = doc(db, 'users', userId); // Adjust the collection name if necessary
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUserDetails(userSnapshot.data() as UserDetails);
        } else {
          console.error("User details not found");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        fetchUserDetails(user.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userDetails) {
    return <div>No user details found.</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Account Details</h1>
        <div className="space-y-2 text-gray-700">
          <p className="text-lg font-semibold">Name: <span className="font-normal">{userDetails.name}</span></p>
          <p className="text-lg font-semibold">Email: <span className="font-normal">{userDetails.email}</span></p>
          <p className="text-lg font-semibold">Mobile: <span className="font-normal">{userDetails.mobile}</span></p>
        </div>
      </div>
    </div>
  );
}
