import { Container, Grid, Typography } from "@mui/material";
import empty_box from "../../assets/images/empty-box.png";

interface EmptyResultProps {
  title?: string;
  subtitle?: string;
}

const EmptyResult: React.FC<EmptyResultProps> = ({
  title = "No Result!",
  subtitle = "We cannot find the item you are searching for, try again.",
}) => {
  return (
    <Container maxWidth="lg">
      <Grid
        container
        direction="row"
        style={{
          height: "40vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item className="empty-cart-cls" textAlign="center">
          <img
            alt=""
            src={empty_box}
            width="130"
            height="130"
            className="img-fluid mb-4 mr-3"
          />
          <Typography color="primary" variant="h4">
            <strong>{title}</strong>
          </Typography>
          <Typography color="secondary" variant="subtitle1">
            {subtitle}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmptyResult;
