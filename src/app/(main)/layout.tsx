import Layout from "@/components/layout";
import React, { PropsWithChildren } from "react";

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default MainLayout;
