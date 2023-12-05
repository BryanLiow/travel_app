import React, { useState, ChangeEvent } from "react";
import { useAuth } from "./contexts/AuthContext";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "./Button";
import Axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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

interface UserData {
  id: number;
  name: string;
  email: string;
  username: string;
  headline: string;
  gender: string;
  country: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

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
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const isPasswordMatch = password === confirmPassword;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  const handleChangeTab = (event: ChangeEvent<{}>, newValue: string) => {
    setPassword("");
    setConfirmPassword("");
    setLoginError("");
    setRegisterError("");
    onChangeActiveTab(newValue);
  };

  const handleLogin = async (registered: boolean) => {
    try {
      const response = await Axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });
      // Handle success response
      console.log(response.data);
      if (!registered) {
        setSnackbarMessage("Login successfully!");
        setSnackbarOpen(true);
      }

      const { token, user } = response.data;
      const expiryTimestamp = new Date().getTime() + 60 * 60 * 1000;

      login({ username: user.username, token, expiry: expiryTimestamp });
      const tokenData = localStorage.getItem("token");
      if (tokenData) {
        let parsedTokenData;
        try {
          parsedTokenData = JSON.parse(tokenData);
        } catch (error) {
          console.error("Error parsing token data:", error);
          return;
        }

        const { token, expiry } = parsedTokenData;
        if (expiry && Date.now() > expiry) {
          console.error("Token expired");
          // Handle expired token (e.g., redirect to login)
          return;
        }

        Axios.get("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            setUserData(response.data);
            sessionStorage.setItem("userData", JSON.stringify(response.data));
          })
          .catch((error) => {
            console.error("There was an error!", error);
          });
      }
      onClose();
      setEmail("");
      setPassword("");
      setFullName("");
      setConfirmPassword("");
      setUsername("");
    } catch (error) {
      if (Axios.isAxiosError(error) && error.response) {
        // Extracting the API response message
        const apiErrorMessage = error.response.data.message;
        setLoginError(apiErrorMessage);
      } else {
        // Fallback error message
        setLoginError("An unknown error occurred");
      }
    }
  };

  // Function to handle registration
  const handleRegister = async () => {
    try {
      const response = await Axios.post("http://127.0.0.1:8000/api/register", {
        username: username,
        name: fullName,
        email: email,
        password: password,
        password_confirmation: confirmPassword,
      });
      setSnackbarMessage("Register successfully!"); // You can customize this message
      setSnackbarOpen(true);

      handleLogin(true);
      // Handle success response
      console.log(response.data);
      onClose(); // Close the dialog after successful registration
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUsername("");
      setFullName("");
    } catch (error) {
      if (Axios.isAxiosError(error) && error.response) {
        // Extracting the API response message
        const apiErrorMessage = error.response.data.message;
        setRegisterError(apiErrorMessage);
      } else {
        // Fallback error message
        setRegisterError("An unknown error occurred");
      }
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={action}
      />
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        PaperProps={{
          style: {
            height: "580px",
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
                type={passwordVisible ? "text" : "password"} // Use the passwordVisible state to toggle between "text" and "password"
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          passwordVisible ? "Hide Password" : "Show Password"
                        }
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {passwordVisible ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {loginError && <div className="text-red-500">{loginError}</div>}
            </>
          )}
          {activeTab === AuthTabs.Register && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Username"
                type="text"
                fullWidth
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Full Name"
                type="text"
                fullWidth
                onChange={(e) => setFullName(e.target.value)}
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
              {registerError && (
                <div className="text-red-500">{registerError}</div>
              )}
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
                handleLogin(false);
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
