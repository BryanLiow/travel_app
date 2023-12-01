import React, { useState, ChangeEvent } from "react";
import { useAuth } from "./cotexts/AuthContext";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "./Button";
import Axios from "axios"; // Import Axios

import { TabProps } from "@mui/material/Tab";
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
  const { login } = useAuth(); // Use the useAuth hook to access login function
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState(""); // Declare 'name' variable for Full Name
  const isPasswordMatch = password === confirmPassword;

  const handleChangeTab = (event: ChangeEvent<{}>, newValue: string) => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    onChangeActiveTab(newValue);
  };

  // Function to handle login
  const handleLogin = async () => {
    try {
      const response = await Axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });
      // Handle success response
      console.log(response.data);
      const { token, user } = response.data;
      login({ username: user.name, token }); // Assuming 'user.name' is the username

      onClose(); // Close the dialog after successful login
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
    } catch (error) {
      // Handle error
      console.error("Login failed:", error);
    }
  };

  // Function to handle registration
  const handleRegister = async () => {
    try {
      const response = await Axios.post("http://127.0.0.1:8000/api/register", {
        name,
        email,
        password,
        confirmPassword,
      });
      // Handle success response
      console.log(response.data);
      onClose(); // Close the dialog after successful registration
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
    } catch (error) {
      // Handle error
      console.error("Registration failed:", error);
    }
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
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Password"
                type="password"
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
              />
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
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Password"
                type="password"
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
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
            onClick={() => {
              if (activeTab === AuthTabs.Login) {
                handleLogin();
              } else {
                handleRegister();
              }
            }}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AuthPortal;
