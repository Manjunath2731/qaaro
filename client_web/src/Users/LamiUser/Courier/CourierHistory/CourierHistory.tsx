import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../../../store';
import {
  Avatar,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  InputBase,
  Checkbox,
  Grid,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageHeading from 'src/components/PageHeading/PageHeading';
import { fetchCourierHistory } from '../../../../slices/Ticket/CourierHistory';
import { RootState } from '../../../../store';
import SearchIcon from '@mui/icons-material/Search';
import HistoryDetails from './HistoryDetails';
import { fetchCourierHistoryDetails } from 'src/slices/Ticket/CourierHistoryDetails';

interface CourierHistoryTableProps {
  className?: string;
}

const CourierHistory: FC<CourierHistoryTableProps> = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [filterText, setFilterText] = useState('');
  const [selectedCourierId, setSelectedCourierId] = useState<string>(''); // Initialize with an empty string


  const courierHistory = useSelector((state: RootState) => state.courierHistory.couriers);


  useEffect(() => {
    dispatch(fetchCourierHistory());
  }, [dispatch]);


  useEffect(() => {
    if (courierHistory.length > 0) {
      setSelectedCourierId(courierHistory[0]._id);
    } else {
      setSelectedCourierId('');
    }
  }, [courierHistory]);


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCheckboxChange = (courierId: string) => {
    setSelectedCourierId(prevSelectedCourierId => {
      // If the clicked courier is already selected, deselect it
      if (prevSelectedCourierId === courierId) {
        return '';
      } else {
        // Otherwise, select the clicked courier
        return courierId;
      }
    });
  };

  const filteredCouriers = courierHistory.filter(courier =>
    courier.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <>
      <Box sx={{ margin: '35px', display: "flex", justifyContent: "space-between" }}>
        <PageHeading>{t('courierHistory')}</PageHeading>

        <Box sx={{ borderRadius: '0 4px 4px 0', width: 'fit-content' }}>
          <InputBase
            placeholder={t('courier')}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
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

      <Grid container spacing={0.5}>
        <Grid item xs={12} lg={8} md={6} xl={8}>
          <Card sx={{ margin: "20px", mt: "-1px", overflowX: "auto" }}>
            {filteredCouriers.length === 0 ? (
              <Box sx={{ padding: '20px', textAlign: 'center' }}>
                {filterText ? t('NO RESULT FOUND FOR THIS PARTICULAR SEARCH') : t('NO DATA AVAILABLE')}
              </Box>
            ) : (
              <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('select')}</TableCell> {/* Add header for the checkbox */}

                      <TableCell></TableCell>
                      <TableCell>{t('name')}</TableCell>
                      <TableCell>{t('open')}</TableCell>
                      <TableCell>{t('completed')}</TableCell>
                      <TableCell>{t('onTime')}</TableCell>
                      <TableCell>{t('lostTicketCount')}</TableCell>
                      <TableCell>{t('lostValue')}</TableCell>
                      <TableCell>{t('hrs24')}</TableCell>
                      <TableCell>{t('hrs48')}</TableCell>
                      <TableCell>{t('dueInDays')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCouriers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((courier) => (


                        <TableRow key={courier._id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedCourierId === courier._id} // Check if current courier is selected
                              onChange={() => handleCheckboxChange(courier._id)} // Pass courierId to handleCheckboxChange
                            />
                          </TableCell>
                          <TableCell>
                            <Avatar alt={courier.name} src={courier.avatar.url} />
                          </TableCell>
                          <TableCell>{courier.name}</TableCell>
                          <TableCell>{courier.open}</TableCell>
                          <TableCell>{courier.closed}</TableCell>
                          <TableCell>{courier.ontime}</TableCell>
                          <TableCell>{courier['lost-count']}</TableCell>
                          <TableCell>{courier['lost-value']}</TableCell>
                          <TableCell>{courier['upcomming-one-day']}</TableCell>
                          <TableCell>{courier['upcomming-two-day']}</TableCell>
                          <TableCell>{courier['upcomming-three-day']}</TableCell>

                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 8]}
                  component="div"
                  count={filteredCouriers.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} lg={4} md={6} xl={4}>
          <HistoryDetails courierId={selectedCourierId} />
        </Grid>
      </Grid>
    </>
  );
};

export default CourierHistory;
