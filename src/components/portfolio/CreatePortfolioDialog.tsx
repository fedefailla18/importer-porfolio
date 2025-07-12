import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
} from "@mui/icons-material";

interface CreatePortfolioDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (portfolioName: string, file?: File) => Promise<void>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`portfolio-tabpanel-${index}`}
      aria-labelledby={`portfolio-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CreatePortfolioDialog: React.FC<CreatePortfolioDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [portfolioName, setPortfolioName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError("");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!portfolioName.trim()) {
      setError("Portfolio name is required");
      return;
    }

    if (tabValue === 1 && !selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit(portfolioName.trim(), selectedFile || undefined);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create portfolio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPortfolioName("");
    setSelectedFile(null);
    setError("");
    setTabValue(0);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Portfolio</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Create Empty Portfolio" />
        <Tab label="Upload Transactions" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create a new empty portfolio and add your holdings manually.
          </Typography>
          <TextField
            fullWidth
            label="Portfolio Name"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            placeholder="e.g., My Crypto Portfolio"
            required
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Upload a CSV or Excel file with your transaction data. The file should contain 
            columns for date, symbol, side (BUY/SELL), amount, and price information.
          </Typography>
          <TextField
            fullWidth
            label="Portfolio Name"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            placeholder="e.g., Imported Portfolio"
            required
            sx={{ mb: 3 }}
          />
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: "center",
              border: "2px dashed",
              borderColor: selectedFile ? "success.main" : "grey.300",
              backgroundColor: selectedFile ? "success.50" : "grey.50",
            }}
          >
            <input
              accept=".csv,.xlsx,.xls"
              style={{ display: "none" }}
              id="portfolio-file-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="portfolio-file-upload">
              <Button
                component="span"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Choose File
              </Button>
            </label>
            {selectedFile && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="success.main">
                  ✓ {selectedFile.name} selected
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Size: {(selectedFile.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
            )}
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Supported formats: CSV, Excel (.xlsx, .xls). File should contain transaction data.
            </Typography>
          </Paper>
        </TabPanel>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || !portfolioName.trim()}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : <AddIcon />}
        >
          {isSubmitting ? "Creating..." : "Create Portfolio"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePortfolioDialog; 