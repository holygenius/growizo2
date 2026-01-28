import React from 'react';
import { Icon as IconifyIcon } from '@iconify/react';

/**
 * Unified Icon component using Iconify
 * Usage: <Icon icon="carbon:leaf" size={24} />
 * or: <Icon icon="mdi:lightning-bolt" size={20} />
 * 
 * The Iconify component properly renders inline SVGs that:
 * - Support CSS color inheritance via currentColor
 * - Have no external network requests after initial load
 * - Can be styled with standard CSS
 */
const Icon = ({ 
  icon, 
  size = 20, 
  color = 'currentColor',
  className = '',
  style = {},
  ...props 
}) => {
  // Parse icon to get collection and name
  // Format: "collection:icon-name" e.g., "carbon:leaf"
  const [collection, iconName] = icon.split(':');
  
  if (!collection || !iconName) {
    console.warn(`Invalid icon format: "${icon}". Expected format: "collection:icon-name"`);
    return null;
  }

  return (
    <IconifyIcon
      icon={icon}
      width={size}
      height={size}
      color={color}
      className={`icon ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style
      }}
      {...props}
    />
  );
};

export default Icon;

// Export common icon collections for easy reference
export const iconSets = {
  carbon: 'carbon',      // IBM Carbon Design System - technical icons
  mdi: 'mdi',           // Material Design Icons - comprehensive
  healthicons: 'healthicons', // Health/Growing related
  gameicons: 'gameicons',   // Thematic icons
  noto: 'noto',         // Emoji-style icons
};
