import {
  Paper,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useCallback, useState } from "react";

export const ExampleForm1: React.FC = () => {
  const [haveInvitationCode, setHasInvitationCode] = useState(false);
  const toggleHasInvitationCode = useCallback((): void => {
    setHasInvitationCode((state) => !state);
  }, [setHasInvitationCode]);

  return (
    <Paper sx={{ padding: 4 }}>
      <Typography variant="h6" sx={{ marginBottom: 4 }}>
        Simple conditional validation
      </Typography>
      <FormControlLabel
        label="I have an invitation code."
        control={
          <Switch
            value={haveInvitationCode}
            onChange={toggleHasInvitationCode}
          />
        }
      />
      {haveInvitationCode ? (
        <Grid container columnGap={4}>
          <Grid xs={6}>
            <TextField
              fullWidth
              variant="standard"
              label="Invitation codes (12 digits)"
            />
          </Grid>
        </Grid>
      ) : (
        <Grid container columnGap={4}>
          <Grid xs={12}>
            <Typography variant="body1">Customer ID</Typography>
          </Grid>
          <Grid xs={4}>
            <TextField fullWidth variant="standard" label="First 4 digits" />
          </Grid>
          <Grid xs={6}>
            <TextField fullWidth variant="standard" label="Last 8 digits" />
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};
