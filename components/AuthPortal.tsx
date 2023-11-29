import React, { useState, ChangeEvent } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "./Button";

import { TabProps } from '@mui/material/Tab';
interface StyledTabProps extends TabProps {}

const StyledTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: "rgba(255, 118, 0, 0.6)", 
  },
});

const StyledTab = styled((props: StyledTabProps) => (
    <Tab disableRipple {...props} />
  ))(() => ({
    textTransform: "none",
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.85)",
    "&:hover": {
      color: "rgba(255, 118, 0, 0.6)",
      opacity: 1,
    },
    "&.Mui-selected": {
      color: "rgba(255, 118, 0, 0.6)",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
  }));

const AuthTabs = {
  Login: "login",
  Register: "register",
};

type AuthPortalProps = {
  open: boolean;
  onClose: () => void;
  activeTab: string;
  onChangeActiveTab: (newTab: string) => void;
};

const AuthPortal: React.FC<AuthPortalProps> = ({
  open,
  onClose,
  activeTab,
  onChangeActiveTab,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isPasswordMatch = password === confirmPassword;

  const handleChangeTab = (event: ChangeEvent<{}>, newValue: string) => {
    onChangeActiveTab(newValue);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        PaperProps={{
          style: {
            height: "550px",
            maxWidth: "600px",
            width: "100%",
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle
          id="form-dialog-title"
          className="text-center font-bold text-4xl"
        >
          {activeTab === AuthTabs.Login ? "Login" : "Register"}
        </DialogTitle>
        <StyledTabs
          value={activeTab}
          onChange={handleChangeTab}
          centered
          TabIndicatorProps={{
            children: <span className="MuiTabs-indicatorSpan" />,
          }}
        >
          <StyledTab label="Login" value={AuthTabs.Login} />
          <StyledTab label="Register" value={AuthTabs.Register} />
        </StyledTabs>
        <DialogContent>
          {activeTab === AuthTabs.Login && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
              />
              <TextField
                margin="dense"
                label="Password"
                type="password"
                fullWidth
              />
              {/* Add additional login fields if necessary */}
            </>
          )}
          {activeTab === AuthTabs.Register && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Full Name"
                type="text"
                fullWidth
              />
              <TextField
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
              />
              <TextField
                margin="dense"
                label="Password"
                type="password"
                fullWidth
              />
              <TextField
                margin="dense"
                label="Confirm Password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!isPasswordMatch}
                helperText={!isPasswordMatch ? "Passwords do not match" : ""}
              />
              {/* Add additional registration fields if necessary */}
            </>
          )}
        </DialogContent>
        <DialogActions className="justify-center p-6">
          <Button
            type="button"
            title="Cancel"
            variant="btn_cancel"
            onClick={onClose}
          />
          <Button
            type="submit"
            title={activeTab === AuthTabs.Login ? "Login" : "Register"}
            variant="btn_login"
            onClick={onClose}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AuthPortal;
