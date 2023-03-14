import { NextPage } from "next";
import { ExampleForm1 } from "../containers/example-form-1";
import { Container, Typography } from "@mui/material";

const HomePage: NextPage = () => (
  <Container maxWidth="md">
    <Typography variant="h4" sx={{ marginBottom: 2 }}>
      Validation module example forms
    </Typography>
    <ExampleForm1 />
  </Container>
);

export default HomePage;
