import React, { useState } from "react";
import { Button } from "@mui/material";
import AddTransactionDrawer from "./AddTransactionDrawer";

interface AddTransactionButtonProps {
  defaultPortfolioName?: string;
  onSuccess?: () => void;
  children?: React.ReactNode;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "inherit";
}

const AddTransactionButton = ({
  defaultPortfolioName,
  onSuccess,
  children,
  variant = "contained",
  color = "primary",
}: AddTransactionButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button variant={variant} color={color} onClick={handleOpen}>
        {children || "Add Transaction"}
      </Button>
      <AddTransactionDrawer
        open={open}
        onClose={handleClose}
        defaultPortfolioName={defaultPortfolioName}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default AddTransactionButton; 