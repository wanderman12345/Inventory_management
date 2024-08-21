'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { Firestore, updateDoc } from "firebase/firestore";
import { styled } from '@mui/material/styles';
import { collection, addDoc, getDocs, query,  where, deleteDoc, doc } from "firebase/firestore";
import * as React from 'react';
import { db } from '../firebase.js';
import '@fontsource/roboto'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Jersey_10, Preahvihear } from "next/font/google";
import {Card, CardContent} from "@mui/material";
// import Button from "@mui/material";
import {
  Container, Typography, Grid, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField
} from "@mui/material";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Home() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const q = query(collection(db, "inventoryItems"));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInventoryItems(items);
    } catch (error) {
      console.error("Error fetching inventory items: ", error);
    }
  };

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setNewItem({name: '' , quantity: ''});
  }
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewItem({name: '' ,quantity: ''});
  };



  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setNewItem(prevItem => ({...prevItem, [name]: value}));
  }
  const handleDeleteSubmit = async () => {
    if (newItem.name) {
      try {
        // query item from db with same name
        const q = query(collection(db, "inventoryItems"), where("name", "==", newItem.name));
        const querySnapshot = await getDocs(q);

        // obtain name if exists and delete item
        if (!querySnapshot.empty) {
          const docToDelete = querySnapshot.docs[0];
          await deleteDoc(doc(db, "inventoryItems", docToDelete.id));
          console.log("Item deleted successfully");
          handleCloseDeleteModal();
          fetchInventoryItems(); // Refresh the list after deleting
        } else {
          console.log("Item not found");
          // Optionally, you can show an error message to the user here
        }
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  }

  const handleSubmit = async () => {
    if (newItem.name && newItem.quantity) {
      try {

        const q = query(collection(db, "inventoryItems"), where("name", "==", newItem.name));
        const querySnapshot = await getDocs(q);

          // check if an item with the same name already exists
        if (!querySnapshot.empty){
          const existingItem = querySnapshot.docs[0];
          // const existingQuantity = existingItem.data().quantity || 0;
          const newQuantity = newItem.quantity;
          await updateDoc(doc(db, "inventoryItems", existingItem.id), {
            quantity: newQuantity.toString()
          });

          console.log("Item updated successfully");
        }
        else{
        await addDoc(collection(db, "inventoryItems"), newItem);
        }
        handleCloseModal();
        fetchInventoryItems(); // Refresh the list after adding
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };


  return (
    <>
    <Typography variant = "h4" component = "h1" align = 'center' sx = {{'bgcolor': 'beige', py: 2}} >
            Inventory Management System
    </Typography>
    <Container component = "header" sx = {{width: '100%'}}>
      {inventoryItems.length > 0 ? (
        <Grid container spacing={2} sx={{ mt: 4 }}>
            {inventoryItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card sx = {{'bgcolor': '#ADD8E6'}}>
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography>Quantity: {item.quantity}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
      ) : (
        <Typography variant="h6" align="center" sx = {{mt: 20}}>
          No items in inventory. Add some items to get started.
        </Typography>
      )}
      {/* Add button to enter Items */}
      <Button
       variant = "contained"
       color = "primary"
       onClick = {handleOpenModal}
       sx = {{
              display: 'block',
              margin: '0 auto',
              mt: 10}
            }
      >
        Add new Item
      </Button>
      {/* Modal */}
      <Dialog open = {openModal} onClose = {handleCloseModal}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin = "dense"
            name = "name"
            label = "Item name"
            type = "text"
            fullWidth
            variant = "standard"
            value = {newItem.name}
            onChange = {handleInputChange}
          />
          <TextField
            margin = "dense"
            name = "quantity"
            label = "Quantity"
            type = "number"
            fullWidth
            variant = "standard"
            value = {newItem.quantity}
            onChange = {handleInputChange}
            />
        </DialogContent>
        <DialogActions>
        <Button onClick={handleCloseModal} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Add
        </Button>
        </DialogActions>
      </Dialog>
      {/* add another button + modal to delete item */}
      <Button
       variant = "contained"
       color = "primary"
       onClick = {handleOpenDeleteModal}
       sx = {{
              display: 'block',
              margin: '0 auto',
              mt: 5}
            }
      >
        Delete Item
      </Button>
      <Dialog open = {openDeleteModal} onClose = {handleCloseDeleteModal}>
        <DialogTitle>Remove Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin = "dense"
            name = "name"
            label = "Item name"
            type = "text"
            fullWidth
            variant = "standard"
            value = {newItem.name}
            onChange = {handleInputChange}
          />
        </DialogContent>
        <DialogActions>
        <Button onClick={handleCloseDeleteModal} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDeleteSubmit} color="primary" variant="contained">
          Delete
        </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </>
  );
}
