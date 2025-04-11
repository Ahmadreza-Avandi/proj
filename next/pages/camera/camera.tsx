import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button, Typography, CircularProgress, Card, CardContent, TextField, Grid } from '@mui/material';
import { useRouter } from 'next/router';

const CameraComponent: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionMessage, setDetectionMessage] = useState("لطفاً به دوربین نگاه کنید");
  const [nationalCode, setNationalCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const router = useRouter();

  const handleImageCapture = async () => {
    if (webcamRef.current && !isProcessing) {
      setIsProcessing(true);
      const imageSrc = webcamRef.current.getScreenshot();

      if (!imageSrc) {
        setDetectionMessage("خطا در گرفتن تصویر. لطفاً دوباره تلاش کنید.");
        setIsProcessing(false);
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:5000/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: imageSrc,
            nationalCode,
            firstName,
            lastName,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setDetectionMessage(result.message || "چهره شناسایی شد!");
          router.push('/success');
        } else {
          setDetectionMessage(result.message || "خطا در شناسایی چهره.");
        }
      } catch (error) {
        console.error("Error sending image:", error);
        setDetectionMessage("خطا در ارتباط با سرور.");
      }

      setIsProcessing(false);
    }
  };

  return (
    <Card style={{ maxWidth: 600, margin: 'auto', padding: 16, backgroundColor: '#fff' }}>
      <CardContent>
        <Typography variant="h5" color="primary" style={{ textAlign: 'center', marginBottom: 16 }}>
          لطفاً به دوربین نگاه کنید
        </Typography>

        <Grid container spacing={2} style={{ marginBottom: 16 }}>
          <Grid item xs={12}>
            <TextField
              label="کد ملی"
              variant="outlined"
              fullWidth
              value={nationalCode}
              onChange={(e) => setNationalCode(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="نام"
              variant="outlined"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="نام خانوادگی"
              variant="outlined"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Grid>
        </Grid>

        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ width: '100%', borderRadius: 8 }}
          videoConstraints={{ facingMode: 'user' }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleImageCapture}
          style={{ width: '100%', marginTop: 16 }}
          disabled={isProcessing}
        >
          {isProcessing ? <CircularProgress size={24} color="secondary" /> : 'ارسال تصویر'}
        </Button>

        <Typography variant="h6" color="textSecondary" style={{ textAlign: 'center', marginTop: 16 }}>
          {detectionMessage}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CameraComponent;
