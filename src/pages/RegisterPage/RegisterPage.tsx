import React, { useCallback, useEffect, useState } from "react";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { webApiUrl } from "../../env/envVars"; 
import { toastError, toastSuccess } from "../../util/toastUtil";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (formValues.email !== formValues.confirmEmail) {
      toastError("Emails do not match!");
      return;
    }

    if (formValues.password !== formValues.confirmPassword) {
      toastError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`${webApiUrl}/auth/register`, {
        method: "POST",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formValues.email,
          password: formValues.password,
          first_name: formValues.firstName,
          last_name: formValues.lastName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      toastSuccess("Registration successful! Please verify your email by clicking the link in the email we sent you before logging in.");
      navigate("/home");
    } catch (error: unknown) {
            const err = error as { message?: string }; 
            toastError(err.message || "Registration is failed");
          }
  }, [formValues, navigate]);

  useEffect(() => {
    const keyEventHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit(e as unknown as React.FormEvent);
      }
    };

    window.addEventListener("keydown", keyEventHandler);

    return () => {
      window.removeEventListener("keydown", keyEventHandler);
    };
  }, [handleSubmit]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/home")}
          sx={{
            borderColor: "#000000",
            color: "#000000",
            '&:hover': {
              borderColor: "#333333",
              color: "#333333",
            },
          }}
        >
          Back to Home
        </Button>
      </Box>

      <Box sx={{ mt: 8, p: 4, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create an Account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField fullWidth margin="normal" label="First Name" name="firstName" value={formValues.firstName} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Last Name" name="lastName" value={formValues.lastName} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Email" name="email" type="email" value={formValues.email} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Confirm Email" name="confirmEmail" type="email"value={formValues.confirmEmail} onChange={handleChange} required/>
          <TextField fullWidth margin="normal" label="Password" name="password" type="password" value={formValues.password} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Confirm Password" name="confirmPassword" type="password" value={formValues.confirmPassword} onChange={handleChange} required />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, py: 1.5, borderRadius: 2, backgroundColor: "#000000", color: "#ffffff", "&:hover": { backgroundColor: "#333333" } }}>
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
