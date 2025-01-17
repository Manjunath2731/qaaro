import React, { ReactNode } from 'react';
import { Typography } from '@mui/material';

interface PageHeadingProps {
    children: ReactNode;
}

const PageHeading: React.FC<PageHeadingProps> = ({ children }) => {
    return (
        <Typography
            variant="h1"
            component="h1"
           
        >
            {children}
        </Typography>
    );
};

export default PageHeading;
