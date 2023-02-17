import { Stack, Typography, CircularProgress, Box } from "@mui/material";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, firestore } from "../fireConfig";
import { updateProfile } from "firebase/auth";
import Swal from "sweetalert2";
import Backdrop from "@mui/material/Backdrop";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { setDoc, doc } from "firebase/firestore";
import Toolbar from "@mui/material/Toolbar";
import { Link } from "react-router-dom";

function Signup_Login() {
  const [logIn, setlogIn] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [cpass, setCpass] = useState("");
  const [flag, setFlag] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    open: false,
    text: "",
  });

  const SignUp = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
    });
    if (name === "" || email === "" || pass === "") {
      setAlert({
        open: true,
        text: "Please submit a valid form!",
      });
      return;
    } else if (pass !== cpass) {
      setAlert({
        open: true,
        text: "Password doesn't match!",
      });
      setCpass("");
      setPass("");
      return;
    } else if (pass.length < 7) {
      setAlert({
        open: true,
        text: "Password length is too Short!",
      });
      return;
    }
    setFlag(true);
    createUserWithEmailAndPassword(auth, email, pass)
      .then(async (res) => {
        setFlag(true);
        const user = res.user;
        await updateProfile(user, {
          displayName: name,
          photoURL: "",
        });
        await setDoc(doc(firestore, "users", auth.currentUser.uid), {
          portfolio: [],
        });
        Toast.fire({
          icon: "success",
          title: "Registration Successful!",
        });
        navigate("/"); //navigating the user to home page
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          Swal.fire("Email already Exists!", "", "info");
        } else if (error.code === "auth/invalid-email") {
          Swal.fire("Please enter a valid email address!", "", "error");
        } else {
          Swal.fire(error.code, "", "error");
        }
        setFlag(false);
        setEmail("");
        setPass("");
        setName("");
        setCpass("");
      });
  };

  const Login = () => {
    if (email === "" || pass === "") {
      setAlert({
        open: true,
        text: "Please submit a valid form!",
      });
      return;
    }
    setFlag(true);
    signInWithEmailAndPassword(auth, email, pass)
      .then(() => {
        navigate("/"); //navigating the user to home page
      })
      .catch((error) => {
        if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
        ) {
          Swal.fire("Invalid Credentials!", "", "error");
        } else if (error.code === "auth/invalid-email") {
          Swal.fire("Please enter a valid email address!", "", "error");
        } else {
          Swal.fire(error.code, "", "error");
        }
        setPass("");
        setFlag(false);
      });
  };

  return (
    <>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={flag}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      <Stack
        direction="column"
        sx={{ height: "100vh" }}
        alignItems="center"
        justifyContent="center"
      >
        <Box position="fixed" top={0}>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                <h2 style={{ letterSpacing: "1.5px" }}>AlphaStock</h2>
              </Link>
            </Box>
          </Toolbar>
        </Box>

        <Box sx={{ width: { xs: "85%", sm: "60%", md: "30%", lg: "25%" } }}>
          <form>
            <Stack direction="column" gap={2} alignItems="center">
              <h1>
                {logIn ? "Create your account" : "Sign in to your account"}
              </h1>
              <Box sx={{ width: "100%" }}>
                {alert.open ? (
                  <Alert
                    severity="error"
                    onClose={() => {
                      setAlert({
                        open: false,
                        text: "",
                      });
                    }}
                  >
                    {alert.text}
                  </Alert>
                ) : (
                  <></>
                )}
              </Box>
              {logIn && (
                <TextField
                  label="Full Name"
                  fullWidth
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                  size="small"
                />
              )}
              <TextField
                label="Email"
                fullWidth
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                spellCheck="false"
                size="small"
              />
              <TextField
                label="Password"
                fullWidth
                required
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="off"
                spellCheck="false"
                size="small"
                type={showPass ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPass(!showPass)}
                        edge="end"
                      >
                        {showPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {logIn && (
                <TextField
                  label="Confirm Password"
                  fullWidth
                  required
                  value={cpass}
                  onChange={(e) => setCpass(e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                  size="small"
                  type={showCPass ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowCPass(!showCPass)}
                          edge="end"
                        >
                          {showCPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              {logIn && (
                <Button
                  variant="contained"
                  onClick={SignUp}
                  disabled={flag}
                  fullWidth={true}
                >
                  Create account
                </Button>
              )}
              {!logIn && (
                <Button
                  variant="contained"
                  onClick={Login}
                  disabled={flag}
                  fullWidth={true}
                >
                  Continue
                </Button>
              )}
              <Typography component="div">
                {logIn
                  ? " Already Have an Account ?"
                  : "Don't have an account?"}
                <Button
                  variant="text"
                  onClick={() => {
                    setlogIn(!logIn);
                    setAlert({
                      open: false,
                      text: "",
                    });
                  }}
                  size="small"
                >
                  {logIn ? "Sign in" : "Sign Up"}
                </Button>
              </Typography>
            </Stack>
          </form>
        </Box>
      </Stack>
    </>
  );
}

export default Signup_Login;
