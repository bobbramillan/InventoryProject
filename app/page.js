'use client'; // This is specific to Next.js

import React, { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Typography, Modal, Stack, TextField, Button } from '@mui/material';
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

export default function Home() {
  // state values
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // fetches and updates inventory from Firestore
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    console.log(inventoryList); //debugs updated list
  };

  //add item or quantity function
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  // remove item or decrease quantity function
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  // handles search, adding items
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddItem = () => {
    if (itemName.trim()) {
      addItem(itemName);
      setItemName('');
      handleClose();
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  //filter items based on search
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm)
  );

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      gap={2}>

      {/* Modal for adding new items */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position='absolute'
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)} 
            />
            <Button 
              variant='outlined' 
              onClick={()=>{
                addItem(itemName)
                setItemName('')
                handleClose()
            }}  
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Button to open the modal for adding a new item */}
      <Button variant="contained" onClick={()=>{
        handleOpen()
      }}
      >
        Add New Item
      </Button>
      
      {/* Search bar to filter inventory items */}
      <Stack width='800px' direction='row' spacing={2} mb={2}>
        <TextField
          variant='outlined'
          fullWidth
          placeholder='Search items...'
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Stack>

      {/* Inventory list display */}
      <Box border='1px solid #333'>
        <Box 
          width="800px" 
          height="100px"
          bgcolor="#ADD8E6" 
          display="flex"
          alignItems="center" 
          justifyContent="center"
        >
          <Typography variant='h2' color='#333'>
            Inventory Items
          </Typography>
        </Box>
      <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {filteredInventory.map(({name, quantity}) => (
            <Box 
            key={name} 
            width="100%"
            minHeight="150px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgColor = '#f0f0f0'
            padding={5}
            >
              <Typography 
                variant="h3" 
                color="#333" 
                textAlign="center"
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant="h3" 
                color="#333" 
                textAlign="center"
              >
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
              <Button 
                variant='contained' 
                onClick={()=>{
                  addItem(name)
                }}
              >
                Add
              </Button>
              <Button 
                variant='contained' 
                onClick={()=>{
                  removeItem(name)
                }}
              >
                Remove
              </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}