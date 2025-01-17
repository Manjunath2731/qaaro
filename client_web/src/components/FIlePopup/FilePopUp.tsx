import React from 'react';
import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';

const FilePopup = ({ open, onClose, fileUrl, fileType }) => {
    const getFileName = (fileUrl) => {
        const splitUrl = fileUrl.split('/');
        return splitUrl[splitUrl.length - 1];
    };

    const renderFile = () => {
        if (fileType.startsWith('image')) {
            return <img src={fileUrl} alt="File" style={{ maxWidth: '100%', maxHeight: '100%' }} />;
        } else if (fileType === 'application/pdf') {
            return (
                <embed
                    title="PDF Viewer"
                    src={fileUrl}
                    type="application/pdf"
                    width="100%"
                    height="90vh"
                    style={{
                        border: 'none',
                        width: '100%',
                        height: '100%',
                    }}
                />
            );
        } else if (
            fileType === 'application/vnd.ms-excel' ||
            fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
            return <Typography>Excel file preview is currently not supported.</Typography>;
        } else if (
            fileType === 'application/msword' || // for .doc
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // for .docx
        ) {
            // For .docx and .doc, provide a link to download or inform the user
            return (
                <Typography>
                    Word document preview is currently not supported.{' '}
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        Download
                    </a>
                </Typography>
            );
        } else {
            return <Typography>File type not supported: {fileType}</Typography>;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{getFileName(fileUrl)}</DialogTitle>
            <DialogContent style={{ overflow: 'auto', height: '100vh' }}>
                {renderFile()}
            </DialogContent>
        </Dialog>
    );
};

export default FilePopup;
