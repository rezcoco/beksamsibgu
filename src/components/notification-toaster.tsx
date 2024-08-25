"use client";

import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import {
  useAuthenticatedKnockClient,
  useKnockClient,
  useKnockFeed,
  useNotifications,
} from "@knocklabs/react";

const NotificationToaster = ({ userId }: { userId: string }) => {
  // const { feedClient } = useKnockFeed();

  const knock = useAuthenticatedKnockClient(
    process.env.NEXT_PUBLIC_KNOCK_API_KEY!,
    userId
  );

  const notificationFeed = useNotifications(
    knock,
    process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID!
  );

  useEffect(() => {
    const onNotificationsReceived = ({ items }: { items: any }) => {
      console.log("notified");
      // Whenever we receive a new notification from our real-time stream, show a toast
      // (note here that we can receive > 1 items in a batch)
      items.forEach((notification: any) => {
        //Use toast.custom to render the HTML content of the notification
        toast.custom(
          <div
            dangerouslySetInnerHTML={{
              __html: notification.blocks[0].rendered,
            }}
          ></div>,
          { id: notification.id }
        );
      });

      // Optionally, you may want to mark them as "seen" as well
      // feedClient.markAsSeen(items);
    };

    // Receive all real-time notifications on our feed
    notificationFeed.on("items.received.realtime", () => console.log("test"));

    // Cleanup
    return () =>
      notificationFeed.off("items.received.realtime", () =>
        console.log("cleanup")
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Toaster />;
};

export default NotificationToaster;
