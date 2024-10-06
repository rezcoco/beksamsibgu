"use client";

import React, { PropsWithChildren } from "react";
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react";
import { useAuth } from "@clerk/nextjs";
import "@knocklabs/react/dist/index.css";
import { useQuery } from "react-query";
import axios from "axios";

const KnockFeed: React.FC<PropsWithChildren> = ({ children }) => {
  const { userId, getToken } = useAuth();
  const [isVisible, setIsVisible] = React.useState(false);
  const notifButtonRef = React.useRef(null);
  const { data: token, isLoading } = useQuery<string>({
    queryKey: "notificationToken",
    queryFn: async () => {
      const res = await axios.get("/api/notification-token", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      return res.data.token;
    },
  });

  if (!userId) return <>{children}</>;

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_API_KEY!}
      userId={userId}
      userToken={token}
    >
      <KnockFeedProvider
        feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID!}
      >
        <NotificationIconButton
          onClick={(e) => setIsVisible(!isVisible)}
          ref={notifButtonRef}
        />
        <NotificationFeedPopover
          buttonRef={notifButtonRef}
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
        />
        {children}
      </KnockFeedProvider>
    </KnockProvider>
  );
};

export default KnockFeed;
