import React, { useEffect, useState } from 'react'
import './JHeader.css'
import { Link, NavLink, useLocation } from 'react-router-dom';
import breifcase from '../assets/header_case.png'
import chat from '../assets/header_message.png'
import bell from '../assets/header_bell.png'
import { JNotification } from './JNotification';
import bell_dot from '../assets/header_bell_dot.png'
import { AvatarMenu } from './AvatarMenu';
 
export const JHeader = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [notificationsData, setNotificationsData] = useState([]);
    const newNotificationsCount = notificationsData.filter(n => !n.isRead).length;
 
    const Location = useLocation();
 
    useEffect(() => {
    fetch("http://127.0.0.1:8000/api/notifications/1/")
        .then(res => res.json())
        .then(data => {
            const mappedData = data.map(n => ({
                id: n.id,
                text: n.text,
                time: n.time,
                isRead: !n.is_new  
            }));
            setNotificationsData(mappedData);
        })
        .catch(err => console.error(err));
}, []);
 
 
    const NavLinks = [
        { name: 'Home', path: '/Job-portal/jobseeker/' },
        { name: 'Jobs', path: '/Job-portal/jobseeker/jobs' },
        { name: 'Companies', path: '/Job-portal/jobseeker/companies' },
    ];
    const NavIcons = [
        { image: breifcase, path: "/Job-portal/jobseeker/myjobs" },
        { image: chat, path: "" }
    ]
 
    ///const handleNavClick = (e) => {
    ///    setActiveItem(e);
    //}
 
 
    return (
        <header className="header">
            <div className="logo">job portal</div>
            <nav className="jheader-nav-links">
                {NavLinks.map((n) => {
                    const isActive = Location.pathname === n.path
                    return (
                        <NavLink key={n.name} to={n.path} className={isActive ? 'jheader-nav-active' : 'jheader-nav-items'}>{n.name}</NavLink >)
                })}
            </nav>
 
            <div className="auth-links">
                {NavIcons.map((n,index) => {
                    const isActive = Location.pathname === n.path
                    return (
                        <Link key={index} className='nav-icons' to={n.path}><img className={isActive ? 'jheader-icons-active' : 'jheader-icons'} src={n.image} alt='My Jobs' /></Link>
                    )
                })}
                <div onClick={() => setShowNotification(!showNotification)}><img className='jheader-icons' src={newNotificationsCount > 0 ? bell_dot : bell} alt='Notifications' /></div>
                <AvatarMenu />
            </div>
            <JNotification notificationsData={notificationsData} showNotification={showNotification} setShowNotification={setShowNotification} />
        </header>
    )
}
 