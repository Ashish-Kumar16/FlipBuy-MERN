import React from "react";
import { Grid } from "@mui/material";

export const GridItem = ({ children, ...props }) => {
  return (
    <Grid component="div" item {...props}>
      {children}
    </Grid>
  );
};

// export default GridItem;
