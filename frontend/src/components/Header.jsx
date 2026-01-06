/**
 * Header Component
 * Application header with branding
 */

import { FaBrain } from 'react-icons/fa';

const Header = () => {
    return (
        <header className="app-header glass animate-fade-in">
            <div className="header-content">
                <div className="logo">
                    <FaBrain className="logo-icon" />
                    <h1>DocuMind AI</h1>
                </div>
            </div>
        </header>
    );
};

export default Header;