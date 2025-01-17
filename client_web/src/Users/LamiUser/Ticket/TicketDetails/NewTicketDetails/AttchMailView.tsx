import React, { FC, useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, Typography, Checkbox, Button } from '@mui/material';
import { useSelector } from 'src/store';
import { useTranslation } from 'react-i18next';

interface AttachView {
    open: boolean;
    onClose: () => void;
    mailContent: string;
    ticketId: string | null;
}

const AttachView: FC<AttachView> = ({ open, onClose, mailContent, ticketId }) => {
    const { t } = useTranslation();
    console.log("MAILCONTENT", mailContent);


    const handleClose = () => {
        onClose();
    };

    console.log("MAILCONTENT",)


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontWeight: "bold", fontSize: "20px" }}>{t("emailView")}</DialogTitle>
            <DialogContent>
                <style>
                    {`
                            ::-webkit-scrollbar {
                                width: 12px;
                                border-radius:"10px
                            }

                            ::-webkit-scrollbar-track {
                                background: white;
                            }

                            ::-webkit-scrollbar-thumb {
                                background-color: #dedede;
                                border-radius: 20px;
                                border: 3px solid #e2edff;
                            }
                        `}
                </style>

                <Typography dangerouslySetInnerHTML={{ __html: mailContent }}></Typography>
            </DialogContent>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                <Button variant='contained' onClick={handleClose}>
                    {t("close")}
                </Button>
            </Box>





        </Dialog>
    );
};

export default AttachView;
