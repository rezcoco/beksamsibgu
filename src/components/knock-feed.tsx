"use client";

import React, { PropsWithChildren } from "react";
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react";
import { useAuth } from "@clerk/nextjs";
import NotificationToaster from "./notification-toaster";
import "@knocklabs/react/dist/index.css";

const KnockFeed: React.FC<PropsWithChildren> = ({ children }) => {
  const { userId } = useAuth();
  const [isVisible, setIsVisible] = React.useState(false);
  const notifButtonRef = React.useRef(null);

  if (!userId) return <>{children}</>;

  return (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_API_KEY!}
      userId={userId}
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
