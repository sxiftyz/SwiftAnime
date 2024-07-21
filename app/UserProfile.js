import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from './firebaseConfig'; // Adjust the import as necessary

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth(app);
      const firestore = getFirestore(app);
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
          setVerified(userDoc.data().notifications?.verified === 'true'); // Handle string vs boolean
        }
      }
    };

    fetchUserData();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      {verified && <span className="verified-checkmark">✔️</span>}
    </div>
  );
};

export default UserProfile;
