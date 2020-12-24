import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((_theme) =>
  createStyles({
    box: {}
  })
);

export const SectionFooter = ({ children }) => {
  const classes = useStyles();
  return <Box className={classes.box}>{children}</Box>;
};
