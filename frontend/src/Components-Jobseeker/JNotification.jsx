import React, { useState, useEffect, useRef } from "react";
import './JNotification.css'
import bell from '../assets/header_bell.png'
import bell_dot from '../assets/header_bell_dot.png'
 
export const JNotification = ({ notificationsData, showNotification, setShowNotification }) => {
    const [notifications, setNotifications] = useState(notificationsData);
    const [activeMenuId, setActiveMenuId] = useState(null);
 
    const containerRef = useRef(null);
    const USER_ID = 1;
 
    useEffect(() => {
        setNotifications(notificationsData);
    }, [notificationsData]);
 
 
    const newNotificationsCount = notifications.filter(n => !n.isRead).length;
 
    // Toggle 3-dot menu
    const toggleMenu = (id, event) => {
        event.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };
 
    // MARK AS READ
    const handleMarkAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            )
        );
        fetch(`http://127.0.0.1:8000/api/notifications/${id}/mark-read/`, {method: "POST",}).catch(err => console.error(err));
        setActiveMenuId(null);
    };
 
    // MARK AS UNREAD
    const handleMarkAsUnread = (id) => {
        setNotifications(prev =>
            prev.map(n =>
                n.id === id ? { ...n, isRead: false } : n
            )
        );
        setActiveMenuId(null);
    };
 
    // DELETE ONE
    const handleDelete = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        fetch(`http://127.0.0.1:8000/api/notifications/${id}/delete/`, {method: "DELETE",}).catch(err => console.error(err));
 
        setActiveMenuId(null);
    };
 
    // CLEAR ALL
        const handleClearAll = () => {
            setNotifications([]);
            fetch(`http://127.0.0.1:8000/api/notifications/${USER_ID}/`, {method: "DELETE",}).catch(err => console.error(err));
            setActiveMenuId(null);
        };
 
    // CLOSE ON OUTSIDE CLICK
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setShowNotification(false);
            }
        };
 
        if (showNotification) {
            document.addEventListener("mousedown", handleClickOutside);
        }
 
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showNotification, setShowNotification]);
 
    return (
        <div
            ref={containerRef}
            className={`notifications-container ${showNotification ? "show-notification" : "hide-notification"}`}
        >
            {/* HEADER */}
            <div className="notifications-header">
                <div className="notifications-heading-container">
                    <img
                        className="notification-header-icons"
                        src={newNotificationsCount > 0 ? bell_dot : bell}
                        alt="Notifications"
                    />
                    <h2>Notifications</h2>
                </div>
                <button onClick={() => setShowNotification(false)} className="notifications-close-btn">
                    &times;
                </button>
            </div>
 
            {/* SUBHEADER */}
            <div className="notifications-subheader">
                <div>
                    <span>Stay Up to Date</span>
                    {newNotificationsCount > 0 && (
                        <span className="new-notifications-count">
                            {newNotificationsCount} New Notifications
                        </span>
                    )}
                </div>
 
                <button className="clear-all-btn" onClick={handleClearAll}>
                    Clear all
                </button>
            </div>
 
            {/* NOTIFICATION LIST */}
            <div className="notifications-list">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={notification.isRead ? "notification-old-item" : "notification-new-item"}
                    >
                        <div className="notification-content">
                            <p className="notification-text">{notification.text}</p>
                            <p className="notification-time">{notification.time}</p>
                        </div>
 
                        <div className="more-options-wrapper">
                            <button
                                className="more-options-btn"
                                onClick={(e) => toggleMenu(notification.id, e)}
                            >
                                ⋮
                            </button>
 
                            {activeMenuId === notification.id && (
                                <div className="overflow-menu">
                                    {notification.isRead ? (
                                        <button
                                            className="menu-item"
                                            onClick={() => handleMarkAsUnread(notification.id)}
                                        >
                                            Mark as unread
                                        </button>
                                    ) : (
                                        <button
                                            className="menu-item"
                                            onClick={() => handleMarkAsRead(notification.id)}
                                        >
                                            Mark as read
                                        </button>
                                    )}
 
                                    <button
                                        onClick={() => handleDelete(notification.id)}
                                        className="menu-item delete-item"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
 
                {notifications.length === 0 && (
                    <p style={{ padding: "20px", textAlign: "center", color: "#777" }}>
                        No notifications for you
                    </p>
                )}
            </div>
        </div>
    );
};
 