import React, { useState, useEffect } from 'react';

const TabsContext = React.createContext(null);

const Tabs = ({ children, defaultTab, onChange, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || null);
  
  // If no defaultTab, set the first tab as active
  useEffect(() => {
    if (!activeTab && React.Children.count(children) > 0) {
      const firstTabId = React.Children.toArray(children)[0].props.id;
      setActiveTab(firstTabId);
    }
  }, [children, activeTab]);
  
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };
  
  return (
    <TabsContext.Provider value={{ activeTab, onChange: handleTabChange }}>
      <div className={`tabs-container ${className}`}>
        <div className="tabs-header" role="tablist">
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return null;
            
            const { id, label, icon, disabled } = child.props;
            const isActive = activeTab === id;
            
            return (
              <button
                role="tab"
                aria-selected={isActive}
                aria-controls={`tab-panel-${id}`}
                id={`tab-${id}`}
                className={`tab-button ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && handleTabChange(id)}
                disabled={disabled}
                tabIndex={isActive ? 0 : -1}
              >
                {icon && <span className="tab-icon">{icon}</span>}
                <span className="tab-label">{label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="tabs-content">
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return null;
            
            return React.cloneElement(child, {
              isActive: activeTab === child.props.id
            });
          })}
        </div>
      </div>
    </TabsContext.Provider>
  );
};

const Tab = ({ id, isActive, children, className = '', ...props }) => {
  return (
    <div
      role="tabpanel"
      id={`tab-panel-${id}`}
      aria-labelledby={`tab-${id}`}
      className={`tab-panel ${isActive ? 'active' : ''} ${className}`}
      hidden={!isActive}
      {...props}
    >
      {isActive ? children : null}
    </div>
  );
};

Tabs.Tab = Tab;

export default Tabs;