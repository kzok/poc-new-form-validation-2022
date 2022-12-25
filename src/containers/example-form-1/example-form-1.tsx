import {
  Paper,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Stack,
  Button,
} from "@mui/material";
import { useState } from "react";
import * as validation from "../../utils/validation";
import * as formHelpers from "../../utils/form-helpers";
import immer from "immer";

type FormValue = Readonly<{
  haveInvitationCode: boolean;
  invidationCode: string;
  customerId: string;
}>;

type FormState = formHelpers.FormState<FormValue>;

const initialState: FormState = formHelpers.initializeFormState({
  haveInvitationCode: false,
  invidationCode: "",
  customerId: "",
});

const formValidator = formHelpers.buildFormValidator<FormValue>((config) => {
  if (config.values.haveInvitationCode) {
    config.add("invidationCode", [
      validation.rules.required({}),
      validation.rules.number({}),
      validation.rules.length({ size: 16 }),
    ]);
  } else {
    config.add("customerId", [
      validation.rules.required({}),
      validation.rules.number({}),
      validation.rules.length({ size: 8 }),
    ]);
  }
});

const useFormState = () => {
  const [formState, setFormState] = useState<FormState>(initialState);

  return {
    formState,
    onChange: <K extends keyof FormValue>(key: K, value: FormValue[K]) => {
      setFormState((prev) =>
        immer(prev, (draft) => {
          draft.values[key] = value;
          if (key === "haveInvitationCode") {
            draft.touches[key] = true;
            draft.errors = formValidator(draft);
          }
        })
      );
    },
    onBlur: (key: keyof FormValue) => {
      setFormState((prev) =>
        immer(prev, (draft) => {
          draft.touches[key] = true;
          draft.errors = formValidator(draft);
        })
      );
    },
    submit: () => {
      setFormState((prev) =>
        immer(prev, (draft) => {
          draft.touches = formHelpers.touchAll(draft);
          draft.errors = formValidator(draft);
          if (formHelpers.isAllValid(draft)) {
            window.alert(`submitted! ${JSON.stringify(draft.values)}`);
          }
        })
      );
    },
  };
};

export const ExampleForm1: React.FC = () => {
  const { formState, onChange, onBlur, submit } = useFormState();
  return (
    <Paper sx={{ padding: 4 }}>
      <Typography variant="h6" sx={{ marginBottom: 4 }}>
        Simple conditional validation
      </Typography>
      <Stack sx={{ paddingY: 1 }} spacing={1}>
        <FormControlLabel
          label="I have an invitation code."
          control={
            <Switch
              value={formState.values.haveInvitationCode}
              onChange={() =>
                onChange(
                  "haveInvitationCode",
                  !formState.values.haveInvitationCode
                )
              }
            />
          }
        />
        {formState.values.haveInvitationCode ? (
          <>
            <Typography variant="body1">Invitation code</Typography>
            <TextField
              fullWidth
              variant="standard"
              label="16 digits"
              value={formState.values.invidationCode}
              onChange={(e) => onChange("invidationCode", e.target.value)}
              onBlur={() => onBlur("invidationCode")}
              helperText={formState.errors["invidationCode"]}
              error={formState.errors["invidationCode"] != null}
            />
          </>
        ) : (
          <>
            <Typography variant="body1">Customer ID</Typography>
            <TextField
              fullWidth
              variant="standard"
              label="8 digits"
              value={formState.values.customerId}
              onChange={(e) => onChange("customerId", e.target.value)}
              onBlur={() => onBlur("customerId")}
              helperText={formState.errors["customerId"]}
              error={formState.errors["customerId"] != null}
            />
          </>
        )}
      </Stack>
      <Button variant="contained" onClick={submit}>
        Submit
      </Button>
    </Paper>
  );
};
