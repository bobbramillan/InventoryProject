'use client'; // This is specific to Next.js

import React, { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Typography, Modal, Stack, TextField, Button, Paper } from '@mui/material';
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
  };

  const addItem = async (item) => {
    const capitalizedItem = capitalizeWords(item);
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
      gap={4}
      sx={{
        backgroundColor: '#f5f5f5',
        padding: '2rem',
      }}
    >
      {/* Modal for adding new items */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position='absolute'
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width={400}
          bgcolor="background.paper"
          borderRadius="12px"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Typography variant="h6" align="center" gutterBottom>
            Add New Item
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField 
              variant='outlined'
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)} 
            />
            <Button 
              variant='contained' 
              onClick={handleAddItem}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#115293',
                },
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Button to open the modal for adding a new item */}
      <Button 
        variant="contained" 
        onClick={handleOpen}
        sx={{
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#115293',
          },
          padding: '0.5rem 2rem',
          fontSize: '1rem',
        }}
      >
        Add New Item
      </Button>
      
      {/* Search bar to filter inventory items */}
      <Stack width='100%' maxWidth='800px' direction='row' spacing={2} mb={2}>
        <TextField
          variant='outlined'
          fullWidth
          placeholder='Search items...'
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#1976d2',
              },
              '&:hover fieldset': {
                borderColor: '#42a5f5',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#42a5f5',
              },
            },
          }}
        />
      </Stack>

      {/* Inventory list display */}
      <Box
        border='1px solid #e0e0e0'
        borderRadius="8px"
        overflow="hidden"
        width="100%"
        maxWidth="800px"
      >
        <Box 
          bgcolor="#1976d2" 
          p={2}
          display="flex"
          justifyContent="center"
        >
          <Typography variant='h4' color='#ffffff'>
            Inventory Items
          </Typography>
        </Box>
        <Stack
          width="100%"
          height="300px"
          spacing={2}
          overflow="auto"
          sx={{
            padding: '1rem',
            backgroundColor: '#fafafa',
          }}
        >
          {filteredInventory.map(({name, quantity}) => (
            <Paper
              key={name} 
              elevation={3}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                '&:hover': {
                  boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Typography 
                variant="h5" 
                color="#333" 
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant="h6" 
                color="#666"
              >
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant='contained' 
                  onClick={() => addItem(name)}
                  sx={{
                    backgroundColor: '#4caf50',
                    '&:hover': {
                      backgroundColor: '#388e3c',
                    },
                  }}
                >
                  Add
                </Button>
                <Button 
                  variant='contained' 
                  onClick={() => removeItem(name)}
                  sx={{
                    backgroundColor: '#f44336',
                    '&:hover': {
                      backgroundColor: '#d32f2f',
                    },
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
