import { Box, InputAdornment, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'src/store';
import SearchIcon from '@mui/icons-material/Search';
import PageHeading from 'src/components/PageHeading/PageHeading';
import { fetchInvoiceListData } from 'src/slices/InvoiceList';
import { RootState } from 'src/store';
import LostValueAmount from '../InsuranceList/DataShow/TotalLostAmount';
import { useTranslation } from 'react-i18next';

const InvoiceList: React.FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();


    const { invoiceData, status, error } = useSelector((state: RootState) => state.invoiceList);
    const [complainNumberFilter, setComplainNumberFilter] = useState('');
    const [page, setPage] = useState(0); // State for page number
    const [rowsPerPage, setRowsPerPage] = useState(10); // Set rows per page to 10 by default

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchInvoiceListData());
        }
    }, [dispatch, status]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComplainNumberFilter(event.target.value);
    };

    const filteredInvoices = invoiceData.filter((item) =>
        (!complainNumberFilter || item.ticketData.complainNumber.includes(complainNumberFilter))
    );

    // Calculate the current page data
    const paginatedInvoices = filteredInvoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            <Box sx={{ padding: '40px', display: 'flex', justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <PageHeading>{t("locoInvoiceList")} ({filteredInvoices.length})</PageHeading>
                    <Box sx={{ mt: "10px" }}>
                        <LostValueAmount />
                    </Box>
                </Box>
                <Box sx={{ borderRadius: '0 4px 4px 0', width: 'fit-content' }}>
                    <InputBase
                        placeholder={t("complainNumber")}
                        value={complainNumberFilter}
                        onChange={handleSearchChange}
                        sx={{
                            width: '250px',
                            '& input': { px: 0, color: 'black' },
                            '& .MuiInputBase-input': { textAlign: 'center' },
                            backgroundColor: '#ffffff',
                            borderRadius: '20px 20px 20px 20px',
                            boxShadow: 'none',
                            pt: '6px',
                            pb: '6px',
                            pl: '10px',
                            pr: '10px',
                            border: '1.5px solid #A6C4E7',
                            color: '#007bff',
                        }}
                        startAdornment={(
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )}
                    />
                </Box>
            </Box>
            <Box sx={{ margin: "20px", mt: "-20px", pb: "30px" }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>{t("complainNumber")}</TableCell>
                                <TableCell>{t("packageNumber")}</TableCell>
                                <TableCell>{t("date")}</TableCell>
                                <TableCell>{("emailHeaderNumber")}</TableCell>
                                <TableCell>{t("dPDInvoiceNumber")}</TableCell>
                                <TableCell>{t("finalLostValue")}</TableCell>
                                <TableCell>{t("attachments")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedInvoices.map((item, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {page * rowsPerPage + index + 1}.
                                    </TableCell>
                                    <TableCell>{item.ticketData.complainNumber}</TableCell>
                                    <TableCell>{item.invoice.packageNumber}</TableCell>
                                    <TableCell>{new Date(item.invoice.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{item.invoice.mailHeaderNumber}</TableCell>
                                    <TableCell>{item.invoice.dpdInvoiceNumber}</TableCell>
                                    <TableCell>€ {item.invoice.finalLostAmmount}</TableCell>
                                    <TableCell sx={{ display: "flex", gap: "10px" }}>
                                        {item.invoice.attachment.files.map((file, index) => (
                                            <Box key={index}>
                                                <a href={file} target="_blank" rel="noopener noreferrer">File {index + 1}</a>
                                            </Box>
                                        ))}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredInvoices.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </Box>
        </Box>
    );
};

export default InvoiceList;
