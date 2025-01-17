import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'src/store';
import { addAcceptedPdf } from 'src/slices/CustomerContact/AddAcceptedPdf';
import { fetchTicketDetails } from 'src/slices/CustomerContact/LinkTicketDetails';
import SignatureCanvas from 'react-signature-canvas';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, Paper, Typography, Card, CardContent, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface FormData {
  pkgReceiveDate: string;
  currentDate: string;
  place: string;
  customerName: string;
  ticketId: string;
  linkId: string;
}

const CustomerForm1View = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { state } = location;
  const formData = state as FormData;

  const { ticketId, linkId } = formData;
  const { ticketDetails } = useSelector((state: any) => state.newTicketDetails);

  const canvasRef = useRef<SignatureCanvas>(null);
  const [pdfLocation, setPdfLocation] = useState<string | null>(null);
  const [isSignatureCleared, setIsSignatureCleared] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);


  useEffect(() => {
    dispatch(fetchTicketDetails(ticketId));
  }, [ticketId, dispatch]);

  const handleSavePDF = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const signatureImage = canvas.toDataURL('image/png');
      const base64String = signatureImage.split(',')[1];

      const dateAndPlace = `${formData.place}, ${new Date(formData.currentDate).toDateString()}`;

      setIsLoading(true);

      try {
        const response = await dispatch(addAcceptedPdf({
          linkId,
          packageDate: formData.pkgReceiveDate,
          cname: ticketDetails?.parcelLabelAddress?.name ?? '',
          address: ticketDetails?.parcelLabelAddress?.address ?? '',
          ticketId,
          signatureImage: base64String,
          name: formData.customerName,
          place: dateAndPlace
        }));

        if ((response.payload as any)?.status) {
          const pdfLocation = (response.payload as any).data?.pdfLocation;
          if (pdfLocation) {
            setPdfLocation(pdfLocation);
            setIsSignatureCleared(true);
            setOpenDialog(true);
            setShowSuccessMessage(true); // Show success message after successful PDF save

          } else {
            console.error('Failed to save PDF: No pdfLocation in response');
          }
        } else {
          console.error('Failed to save PDF: No status in response');
        }
      } catch (error) {
        console.error('Failed to save PDF:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    navigate(`/customer-form/${ticketId}/${linkId}`);
  };

  const handleCloseWindow = () => {
    // Close the current window or tab
    window.close();
  };

  const handleClearSignature = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      setIsSignatureCleared(true);
    }
  };

  return (
    <div className="content" style={{ padding: "25px", background: "white" }}>
      {showSuccessMessage ? (


        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'rgb(255, 255, 255)' }}>
          <div style={{ textAlign: 'center' }}>
            <Box>
              <img
                src="/success.jpg" // Replace with the correct path to your image
                alt="Logo"
                style={{ height: '30vh', maxWidth: '100%', marginBottom: '20px' }}
              />
            </Box>

            <Typography variant="h3" gutterBottom>
              Das Dokument wurde erfolgreich übermittelt
            </Typography>
            <Typography variant="h5" color={"grey"} paragraph>
              Jetzt können Sie dieses Fenster schließen<br></br>                    Vielen Dank!

            </Typography>
            <Button
              variant="contained"
              color="error" // Change to appropriate MUI color if needed
              style={{ marginTop: '20px' }}
              onClick={handleCloseWindow} // Call handleCloseWindow function on click
            >
              Schließen
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="header">

          </div>
          <div className="content">
            <h1 className="heading" style={{ color: 'rgb(255, 0, 0)', fontSize: '30px', marginTop: '35px' }}>
              Empfangsbestätigung Empfänger <br /> Acknowledgement of receipt of recipient
            </h1>
            <h3 className="tableDesc" style={{ color: '#040303', fontSize: '17px', marginTop: '90px' }}>
              Bitte senden Sie uns das Formular ausgefüllt zurück.
            </h3>
            <div className="table-container" style={{ marginTop: '40px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '25%', border: '1px solid black', borderLeft: 'none', padding: '12px', textAlign: 'left', color: 'black' }}>
                      Zustelldatum
                    </td>
                    <td className="dynamic-data" style={{ border: '1px solid black', borderRight: 'none', padding: '12px', textAlign: 'left', fontSize: 'small', fontWeight: 'bold' }}>
                      {new Date(formData?.pkgReceiveDate).toDateString()}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: '25%', border: '1px solid black', borderLeft: 'none', padding: '12px', textAlign: 'left', color: 'black' }}>
                      Paketscheinnummer
                    </td>
                    <td className="dynamic-data" style={{ border: '1px solid black', borderRight: 'none', padding: '12px', textAlign: 'left', fontSize: 'small', fontWeight: 'bold' }}>
                      {ticketDetails && ticketDetails.packageNumber !== null ? (
                        ticketDetails.packageNumber
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: '25%', border: '1px solid black', borderLeft: 'none', padding: '12px', textAlign: 'left', color: 'black' }}>
                      Firma / Name <br />Empfänger Adresse
                    </td>
                    {ticketDetails && (
                      <td className="dynamic-data" style={{ border: '1px solid black', borderRight: 'none', padding: '12px', textAlign: 'left', fontSize: 'small', fontWeight: 'bold' }}>
                        {ticketDetails?.parcelLabelAddress?.name}<br />{ticketDetails?.parcelLabelAddress?.address}
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="signature-container" style={{ marginTop: '50px', paddingTop: '10px' }}>
              <h3 className="tablebelowsec" style={{ color: '#040303', fontSize: 'medium' }}>Empfangsbestätigung des Empfängers</h3>
              <p style={{ fontSize: 'smaller', color: "black" }}>Hiermit bestätige Ich den Erhalt des oben genannten Paketes.</p>
              <p style={{ fontSize: 'smaller', color: "black" }}>I hereby confirm receipt of the above package.</p>
            </div>
            <div className="final-container" style={{ paddingRight: '5%', marginTop: '100px' }}>
              <div className="place-date-container" style={{ paddingTop: '10px', marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '40%' }}>
                  <p className="dynamic-data">{formData?.place}, {new Date(formData?.currentDate).toDateString()}</p>
                  <hr />
                  <p style={{ marginTop: '-5px', fontSize: 'small', color: "black" }}>Ort, Datum </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ width: '100%', }}>
                      <SignatureCanvas
                        ref={canvasRef}
                        canvasProps={{ width: 400, height: 200, className: 'sigCanvas', style: { border: '1px solid black', maxWidth: '100%' } }}
                        backgroundColor="white"
                        penColor="black"
                        onEnd={() => setIsSignatureCleared(false)}
                        clearOnResize={false}
                        onBegin={() => setIsSignatureCleared(false)}
                      />
                      <h6
                        className="ButtonAriya"
                        style={{
                          border: 'none',
                          outline: 'none',
                          cursor: 'pointer',
                          padding: '10px 20px',
                          color: 'black',
                          borderRadius: '5px',
                          marginTop: '20px',
                          marginLeft: '10px',
                          textDecoration: 'underline',
                          display: 'inline-block',
                          opacity: isSignatureCleared ? 0.5 : 1,
                          pointerEvents: isSignatureCleared ? 'none' : 'auto',
                        }}
                        onClick={!isSignatureCleared ? handleClearSignature : undefined}
                      >
                        CLEAR SIGNATURE
                      </h6>
                      <hr />
                      <p style={{ marginTop: '-5px', fontSize: 'small', color: "black" }}>Unterschrift, Firmenstempel</p>
                      <p style={{ marginTop: '-5px', fontSize: 'small', color: "black" }}>{formData?.customerName}</p>
                    </div>
                    <hr />
                    <p style={{ marginTop: '-5px', fontSize: 'small', color: "black" }}>Vor- und Nachname (in Druckbuchstaben)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ paddingRight: '10px' }}>
                  <p style={{ fontWeight: '600', fontSize: 'small' }}>NETWORK <br /> MEMBER OF</p>
                </div>
                <hr />
                <div style={{ paddingLeft: '10px' }}>
                  <div>
                    <img
                      className="logo"
                      src="/dpd.svg"
                      alt="Logo"
                      style={{ width: '70px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="button-container" style={{ marginTop: '20px' }}>
            <button
              className="ButtonAriya"
              style={{
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '5px',
                marginTop: '20px',
                pointerEvents: isSignatureCleared ? 'none' : 'auto',
                opacity: isSignatureCleared ? 0.5 : 1,
              }}
              onClick={handleSavePDF}
              disabled={isSignatureCleared}
            >
              {isLoading ? 'LOADING...' : 'Dokument Speichern'}
            </button>
            <button
              className="ButtonAriya"
              style={{
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                padding: '10px 20px',
                backgroundColor: 'rgb(221, 14, 14)',
                color: 'white',
                borderRadius: '5px',
                marginTop: '20px',
                marginLeft: '10px',
              }}
              onClick={handleCancel}
            >
              {t("cancel")}
            </button>
          </div>
        </>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Das Dokument wurde erfolgreich übermittelt</DialogTitle>
        <DialogContent>
          <iframe src={pdfLocation} style={{ width: '100%', height: '500px', border: 'none' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Schließen</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomerForm1View;
