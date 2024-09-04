import {  emitter } from '~/lib/utils/emitter.server';
import { EVENTS } from '~/lib/constants/events.contstent';
import { eventStream } from 'remix-utils/sse/server';
import { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { json } from '@remix-run/react';

export async function loader({ request }: LoaderFunctionArgs) {
    // return json({name : "sanchya"})
    return eventStream(request.signal, function setup(send) {
  
      // Handle permissions updates
      const handlePermissions = (permissionData: object) => {
        const eventData = JSON.stringify({ permissionData, date: Date.now() });
        send({ event: EVENTS.PERMISSIONS_UPDATED.NAME, data: eventData });
      };
  
      // Handle notifications updates
      const handleNotifications = (notificationData: object) => {
        const eventData = JSON.stringify({ notificationData, date: Date.now() });
        send({ event: EVENTS.NOTIFICATIONS_UPDATED.NAME, data: eventData });
      };

      // Handle logout
      const handleLogout = ( data: { customerId: string, message: string }) => {
        const eventData = JSON.stringify({ customerId: data.customerId, message: data.message });

      send({ event: "logout-event", data: eventData });
      };

      // Send a heartbeat message every 15 seconds
      const heartbeatInterval = setInterval(() => {
        send({ event: 'heartbeat', data: JSON.stringify({ date: Date.now() }) });
      }, 15000);

  
      // Add listeners for both permission and notification events
      emitter.addListener("logout", handleLogout);
      emitter.addListener(EVENTS.PERMISSIONS_UPDATED.KEY, handlePermissions);
      emitter.addListener(EVENTS.NOTIFICATIONS_UPDATED.KEY, handleNotifications);
  
      // Remove the event listeners when the event stream is closed
      return () => {
        emitter.removeListener("logout", handleLogout);
        emitter.removeListener(EVENTS.PERMISSIONS_UPDATED.KEY, handlePermissions);
        emitter.removeListener(EVENTS.NOTIFICATIONS_UPDATED.KEY, handleNotifications);
        clearInterval(heartbeatInterval);

      };
    });
  }
  