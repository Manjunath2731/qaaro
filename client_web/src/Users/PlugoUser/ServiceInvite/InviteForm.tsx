import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    Box,
    CircularProgress,
    MenuItem,
    Select,
    SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store'; // Adjust the import based on your project structure
import { register, clearState as clearRegisterState } from 'src/slices/ServiceInviter/EmailInvite'; // Adjust the import based on your project structure
import { registerUpload, clearState as clearRegisterUploadState } from 'src/slices/ServiceInviter/UploadExcelInvite'; // Adjust the import based on your project structure
import { fetchLanguages } from 'src/slices/GetLanguage';

const CustomButton = styled(Button)({
    borderRadius: '10px',
    border: '1px solid #A6C4E7',
    backgroundColor: '#FFFFFF',
    color: '#9C9C9C',
    textTransform: 'none',
    padding: '8px 18px',
    fontSize: '16px',
});

const PopupTitle = styled(DialogTitle)({
    fontWeight: 'bold',
    fontSize: '24px',
});

const CustomDialogContent = styled(DialogContent)({
    minWidth: '500px',
});

const CustomTextField = styled(TextField)({
    fontSize: '18px',
});

const InvitePopup: React.FC = () => {
    const languages = useSelector((state: RootState) => state.languages.languages); // Get languages from the Redux state
    const loadingLanguages = useSelector((state: RootState) => state.languages.loading); // Get languages loading state

    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('email');
    const [emails, setEmails] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [language, setLanguage] = useState('en');

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchLanguages());
    }, [dispatch]);

    const { loading: registerLoading, successMessage: registerSuccess, error: registerError } = useSelector((state: RootState) => state.register);
    const { loading: registerUploadLoading, successMessage: registerUploadSuccess, error: registerUploadError } = useSelector((state: RootState) => state.registerUpload);
    const submitStatus = useSelector((state: RootState) => state.register.status);

    useEffect(() => {
        if (registerSuccess || registerUploadSuccess) {
            handleClose();
            dispatch(clearRegisterState());
            dispatch(clearRegisterUploadState());
        }
    }, [registerSuccess, registerUploadSuccess, dispatch]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEmails('');
        setFile(null);
        setSelectedOption('email');
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
        }
    };

    const handleEmailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmails(event.target.value);
    };

    const handleSubmit = () => {
        if (selectedOption === 'email') {
            dispatch(register({ emails, language }));
        } else if (selectedOption === 'excel' && file) {
            dispatch(registerUpload({ file, language }));
        }
    };

    const handleLanguageChange = (event: SelectChangeEvent<string>) => {
        setLanguage(event.target.value);
    };

    const isSubmitDisabled = (selectedOption === 'email' && !emails.trim()) || (selectedOption === 'excel' && !file);

    return (
        <div>
            <CustomButton onClick={handleClickOpen}>Invite</CustomButton>
            <Dialog open={open} onClose={handleClose} maxWidth="md">
                <PopupTitle>Invite Service Providers</PopupTitle>
                <CustomDialogContent>
                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="inviteOption"
                            name="inviteOption"
                            value={selectedOption}
                            onChange={handleChange}
                            row
                        >
                            <FormControlLabel value="email" control={<Radio />} label="E-mail Address" />
                            <FormControlLabel value="excel" control={<Radio />} label="Upload Excel file" />
                        </RadioGroup>
                    </FormControl>

                    <Select
                        value={language}
                        onChange={handleLanguageChange}
                        size="small"
                        disabled={loadingLanguages} // Disable while loading languages
                    >
                        {languages.map((lang: any) => (
                            <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
                        ))}
                    </Select>

                    {selectedOption === 'email' && (
                        <Box mt={2} p={2} border="1px solid #ccc" borderRadius="4px">
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold", }}>E-mail Address</Typography>
                            <CustomTextField
                                autoFocus
                                margin="dense"
                                id="email"
                                label="(Separate by commas)"
                                type="email"
                                fullWidth
                                multiline
                                rows={4}
                                value={emails}
                                onChange={handleEmailsChange}
                            />
                        </Box>
                    )}
                    {selectedOption === 'excel' && (
                        <Box mt={2} p={2} border="1px solid #ccc" borderRadius="4px">
                            <Button variant="outlined" component="label">
                                Upload Excel File
                                <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                            </Button>
                            {file && (
                                <Typography variant="body2" style={{ marginTop: '8px' }}>
                                    {file.name}
                                </Typography>
                            )}
                        </Box>
                    )}
                </CustomDialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant='outlined' color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained" disabled={isSubmitDisabled}>
                        {submitStatus === 'loading' ? <CircularProgress size={24} /> : ('Submit')}

                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default InvitePopup;
