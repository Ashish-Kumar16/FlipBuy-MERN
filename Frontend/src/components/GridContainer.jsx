import React from "react";
import { Grid } from "@mui/material";

export const GridContainer = ({ children, ...props }) => {
  return (
    <Grid component="div" container {...props}>
      {children}
    </Grid>
  );
};

// export default GridContainer;
