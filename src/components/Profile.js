import {
  Avatar,
  Button,
  Stack,
  Backdrop,
  CircularProgress,
  Grid,
  Alert,
  TextField,
  Paper,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { auth } from "../fireConfig";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import Swal from "sweetalert2";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import { styled } from "@mui/material/styles";
import { storage } from "../fireConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Profile() {
  const [open, setOpen] = useState(false);
  const [userPass1, setUserPass1] = useState("");
  const [userPass2, setUserPass2] = useState("");
  const [newPass, setNewPass] = useState("");
  const [cNewPass, setNewCPass] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const flag = useRef(false);
  const [passAlert, setPassAlert] = useState({
    open: false,
    text: "",
    severity: "",
  });
  const [emailAlert, setEmailAlert] = useState({
    open: false,
    text: "",
    severity: "",
  });
  const [avatarAlert, setAvatarAlert] = useState({
    open: false,
    text: "",
    severity: "success",
  });

  const StyledButton = styled(Button)(() => ({
    textTransform: "none",
    letterSpacing: "1px",
    backgroundColor: "rgb(100 116 139)",
    ":hover": {
      backgroundColor: " rgb(71 85 105)",
    },
  }));

  const changeAvatar = async (e) => {
    if (!e.target.files[0]) {
      return;
    }
    setOpen(true);
    const storageRef = ref(storage, "avatars/" + auth.currentUser.uid);
    try {
      await uploadBytes(storageRef, e.target.files[0]);
      const avatarURL = await getDownloadURL(storageRef);
      await updateProfile(auth.currentUser, {
        photoURL: avatarURL,
      });
      setOpen(false);
      setAvatarAlert({
        open: true,
        text: "Avatar Updated Successfully!",
        severity: "success",
      });
    } catch (error) {
      console.log(error);
      setOpen(false);
      setAvatarAlert({
        open: true,
        text: "Something went wrong, Please try Again Later!",
        severity: "error",
      });
    }
  };

  const handlePassClick = () => {
    if (userPass1 === "" || newPass === "" || cNewPass === "") {
      setPassAlert({
        open: true,
        text: "Please Submit a Valid Form!",
        severity: "error",
      });
    } else if (newPass !== cNewPass) {
      setPassAlert({
        open: true,
        text: "New Password doesn't match with Confirm Password!",
        severity: "error",
      });
    } else if (newPass.length < 7 || userPass1.length < 7) {
      setPassAlert({
        open: true,
        text: "Password length is too short!",
        severity: "error",
      });
    } else {
      setOpen(true);
      flag.current = true;
      reauthenticate(userPass1);
    }
  };

  const handleEmailClick = () => {
    if (userPass2 === "" || newEmail === "") {
      setEmailAlert({
        open: true,
        text: "Please Submit a valid Form!",
        severity: "error",
      });
    } else if (userPass2.length < 7) {
      setEmailAlert({
        open: true,
        text: "Password length is too Short",
        severity: "error",
      });
    } else {
      setOpen(true);
      flag.current = false;
      console.log(flag);
      reauthenticate(userPass2);
    }
  };

  const ChangeEmail = () => {
    updateEmail(auth.currentUser, newEmail)
      .then(() => {
        setEmailAlert({
          open: true,
          text: "Email Updated Successfully!",
          severity: "success",
        });
        setOpen(false);
        setNewEmail("");
        setUserPass2("");
      })
      .catch((error) => {
        setEmailAlert({
          open: true,
          text: error.code,
          severity: "error",
        });
        setUserPass2("");
        setOpen(false);
        setNewEmail("");
      });
  };

  const ChangePass = () => {
    updatePassword(auth.currentUser, newPass)
      .then(() => {
        setPassAlert({
          open: true,
          text: "Password Updated Successfully!",
          severity: "success",
        });
        setOpen(false);
        setNewPass("");
        setNewCPass("");
        setUserPass1("");
      })
      .catch((error) => {
        setPassAlert({
          open: true,
          text: error.code,
          severity: "error",
        });
        setOpen(false);
        setNewPass("");
        setNewCPass("");
        setUserPass1("");
      });
    flag.current = false;
  };

  const reauthenticate = (password) => {
    const credentials = EmailAuthProvider.credential(
      auth.currentUser.email,
      password
    );
    reauthenticateWithCredential(auth.currentUser, credentials)
      .then(() => {
        if (flag.current) {
          ChangePass();
        } else {
          ChangeEmail();
        }
      })
      .catch(() => {
        Swal.fire("Incorrect Password!", "", "error");
        setOpen(false);
      });
  };

  return (
    <>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      <Stack
        direction="column"
        gap={3}
        sx={{ width: { xs: "90%", sm: "75%", md: "70%", lg: "65%" } }}
        mx="auto"
        mb={10}
      >
        {/* Account Details Paper */}
        <Paper
          elevation={3}
          style={{ padding: 25, backgroundColor: "#F5F5F5" }}
        >
          <form>
            <Stack direction="column" gap={2} alignItems="center" mb={3}>
              <Avatar
                style={{
                  width: 120,
                  height: 120,
                  backgroundColor: "#609EA2",
                }}
                src={
                  auth.currentUser.photoURL !== null &&
                  auth.currentUser.photoURL
                }
              >
                {auth.currentUser.photoURL === null &&
                  auth.currentUser.displayName.charAt(0).toUpperCase()}
              </Avatar>
              <StyledButton
                variant="contained"
                component="label"
                endIcon={<PhotoCamera />}
              >
                Change Avatar
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={changeAvatar}
                />
              </StyledButton>
              {avatarAlert.open && (
                <Alert
                  variant="filled"
                  severity={avatarAlert.severity}
                  onClose={() =>
                    setAvatarAlert({
                      open: false,
                      text: "",
                      severity: "",
                    })
                  }
                >
                  {avatarAlert.text}
                </Alert>
              )}
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  fullWidth
                  value={auth.currentUser.displayName}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} mx="auto">
                <TextField
                  label="Email"
                  fullWidth
                  value={auth.currentUser.email}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </form>
        </Paper>
        {/* Change Password Paper */}
        <Paper
          elevation={3}
          style={{ padding: 25, backgroundColor: "#F5F5F5" }}
        >
          <form>
            <Stack direction="column" gap={2} alignItems="center" mb={3}>
              <Avatar style={{ backgroundColor: "#F2CD5C" }}>
                <KeyIcon />
              </Avatar>
              <h2> Change Password</h2>
              {passAlert.open ? (
                <Alert
                  variant="filled"
                  severity={passAlert.severity}
                  onClose={() =>
                    setPassAlert({
                      open: false,
                      text: "",
                      severity: "",
                    })
                  }
                >
                  {passAlert.text}
                </Alert>
              ) : (
                <></>
              )}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Old Password"
                    fullWidth
                    required
                    value={userPass1}
                    onChange={(e) => setUserPass1(e.target.value)}
                    autoComplete="off"
                    type="password"
                    spellCheck="false"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="New Password"
                    fullWidth
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    autoComplete="off"
                    type="password"
                    spellCheck="false"
                  />
                </Grid>
                <Grid item xs={12} sm={6} mx="auto">
                  <TextField
                    label="Confirm Password"
                    fullWidth
                    required
                    value={cNewPass}
                    onChange={(e) => setNewCPass(e.target.value)}
                    autoComplete="off"
                    type="password"
                    spellCheck="false"
                  />
                </Grid>
              </Grid>
              <StyledButton
                variant="contained"
                onClick={handlePassClick}
                disabled={open}
              >
                Update Password
              </StyledButton>
            </Stack>
          </form>
        </Paper>
        {/* Change Email Paper */}
        <Paper
          elevation={3}
          style={{ padding: 25, backgroundColor: "#F5F5F5" }}
        >
          <form>
            <Stack direction="column" gap={2} alignItems="center" mb={3}>
              <Avatar style={{ backgroundColor: "#473C33" }}>
                <EmailIcon />
              </Avatar>
              <h2>Change Email</h2>
              {emailAlert.open ? (
                <Alert
                  variant="filled"
                  severity={emailAlert.severity}
                  onClose={() =>
                    setEmailAlert({
                      open: false,
                      text: "",
                      severity: "",
                    })
                  }
                >
                  {emailAlert.text}
                </Alert>
              ) : (
                <></>
              )}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Your Password"
                    fullWidth
                    required
                    value={userPass2}
                    type="password"
                    autoComplete="off"
                    spellCheck="false"
                    onChange={(e) => setUserPass2(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="New Email"
                    fullWidth
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    autoComplete="off"
                    type="email"
                    spellCheck="false"
                  />
                </Grid>
              </Grid>
              <StyledButton
                variant="contained"
                onClick={handleEmailClick}
                disabled={open}
              >
                Update Email
              </StyledButton>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </>
  );
}

export default Profile;
