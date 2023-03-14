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
import { formHelpers, validation } from "../../utils/form-helpers";
import immer from "immer";

type FormValue = Readonly<{
  haveInvitationCode: boolean;
  invidationCode: string;
  userId: string;
  checksum: string;
}>;

type FormState = formHelpers.State<FormValue>;

const initialState: FormState = formHelpers.initializeState({
  haveInvitationCode: false,
  invidationCode: "",
  userId: "",
  checksum: "",
});

const formValidator = formHelpers.buildFormValidator<FormValue>((config) => {
  if (config.values.haveInvitationCode) {
    config.add("invidationCode", [
      validation.stringRules.required({}),
      validation.stringRules.number({}),
      validation.stringRules.length({ size: 16 }),
    ]);
  } else {
    config.add("userId", [
      validation.stringRules.required({}),
      validation.stringRules.number({}),
      validation.stringRules.length({ size: 8 }),
    ]);
    config.add("checksum", [validation.stringRules.required({})]);
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
            window.alert(
              `validation passed!\n ${JSON.stringify(draft.values)}`
            );
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
            <Typography variant="body1">User ID</Typography>
            <TextField
              fullWidth
              variant="standard"
              label="8 digits"
              value={formState.values.userId}
              onChange={(e) => onChange("userId", e.target.value)}
              onBlur={() => onBlur("userId")}
              helperText={formState.errors["userId"]}
              error={formState.errors["userId"] != null}
            />
            <Typography variant="body1">Checksum</Typography>
            <TextField
              fullWidth
              variant="standard"
              label=""
              value={formState.values.checksum}
              onChange={(e) => onChange("checksum", e.target.value)}
              onBlur={() => onBlur("checksum")}
              helperText={formState.errors["checksum"]}
              error={formState.errors["checksum"] != null}
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
