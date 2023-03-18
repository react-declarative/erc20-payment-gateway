import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export const Loader = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      minHeight: "315px",
      marginTop: -2,
    }}
  >
    <CircularProgress size={56} />
  </Box>
);

export default Loader;
