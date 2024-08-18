'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { Firestore } from "firebase/firestore";
import { Container, Typography } from "@mui/material";
import '@fontsource/roboto'

export default function Home() {
  return (
    <>
    <Container component = "header">
      <Typography variant = "h4" component = "h1" align = 'center' sx = {{'bgcolor': 'beige'}} >
            Inventory Management System
      </Typography>
    </Container>
    
    </>
  );
}
