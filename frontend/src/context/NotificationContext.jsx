import React, { createContext, useReducer, useCallback } from 'react';

export const NotificationContext = createContext();

const initialState = {
  notifications: [],
  unreadCount: 0
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    case 'MARK_AS_READ':
      const updatedNotifications = state.notifications.map(n =>
        n._id === action.payload ? { ...n, read: true } : n
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.read).length
      };
    case 'DELETE_NOTIFICATION':
      const filtered = state.notifications.filter(n => n._id !== action.payload);
      return {
        ...state,
        notifications: filtered,
        unreadCount: filtered.filter(n => !n.read).length
      };
    case 'CLEAR_ALL':
      return initialState;
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const setNotifications = useCallback((notifications) => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
  }, []);

  const addNotification = useCallback((notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  }, []);

  const markAsRead = useCallback((notificationId) => {
    dispatch({ type: 'MARK_AS_READ', payload: notificationId });
  }, []);

  const deleteNotification = useCallback((notificationId) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: notificationId });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const value = {
    ...state,
    setNotifications,
    addNotification,
    markAsRead,
    deleteNotification,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
