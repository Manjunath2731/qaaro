// GlobalErrorBoundary.js
import React, { useState } from 'react';
import StatusMaintenance from '../Maintainance/Mantainace';

const GlobalErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = useState(false);

    const handleOnError = () => {
        setHasError(true);
    };

    return hasError ? <StatusMaintenance /> : children;
};

export default GlobalErrorBoundary;
