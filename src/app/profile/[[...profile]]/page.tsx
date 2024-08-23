import { UserProfile } from "@clerk/nextjs";
import React from "react";

const Profile = () => {
  return <UserProfile path="/profile" />;
};

export default Profile;
