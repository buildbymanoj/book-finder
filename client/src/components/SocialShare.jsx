/**
 * SocialShare Component
 * Social sharing buttons for book cards
 */

import React, { useState } from 'react';
import { FiShare2, FiTwitter, FiFacebook, FiLink, FiMessageCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './SocialShare.css';

const SocialShare = ({ book }) => {
  const [showMenu, setShowMenu] = useState(false);

  const shareUrl = window.location.href;
  const shareText = `Check out "${book.title}" by ${book.author}`;

  const shareOptions = [
    {
      name: 'Twitter',
      icon: FiTwitter,
      color: '#1DA1F2',
      handler: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank', 'width=550,height=420');
        setShowMenu(false);
      }
    },
    {
      name: 'Facebook',
      icon: FiFacebook,
      color: '#4267B2',
      handler: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank', 'width=550,height=420');
        setShowMenu(false);
      }
    },
    {
      name: 'WhatsApp',
      icon: FiMessageCircle,
      color: '#25D366',
      handler: () => {
        const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        window.open(url, '_blank');
        setShowMenu(false);
      }
    },
    {
      name: 'Copy Link',
      icon: FiLink,
      color: '#6b7280',
      handler: async () => {
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Link copied to clipboard!');
          setShowMenu(false);
        } catch (error) {
          toast.error('Failed to copy link');
        }
      }
    }
  ];

  // Check if native sharing is available
  const canShare = navigator.share !== undefined;

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: book.title,
        text: shareText,
        url: shareUrl
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error('Failed to share');
      }
    }
  };

  return (
    <div className="social-share">
      <button
        className="share-btn"
        onClick={() => canShare ? handleNativeShare() : setShowMenu(!showMenu)}
        aria-label="Share book"
        aria-expanded={showMenu}
      >
        <FiShare2 />
      </button>

      {showMenu && !canShare && (
        <>
          <div className="share-backdrop" onClick={() => setShowMenu(false)} />
          <div className="share-menu" role="menu">
            <div className="share-menu-header">
              <h4>Share this book</h4>
              <button
                onClick={() => setShowMenu(false)}
                className="close-menu-btn"
                aria-label="Close share menu"
              >
                ×
              </button>
            </div>
            <div className="share-options">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.name}
                    onClick={option.handler}
                    className="share-option"
                    role="menuitem"
                  >
                    <div
                      className="share-icon"
                      style={{ backgroundColor: option.color }}
                    >
                      <Icon />
                    </div>
                    <span>{option.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialShare;
