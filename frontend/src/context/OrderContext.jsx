import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-5531',
      orderId: 'ORD-5531',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'Pending',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Express (3 Hours)',
      customer: {
        name: 'Sadia Islam',
        phone: '01922334455',
        address: 'House 12, Road 4, Banani, Dhaka'
      },
      items: [
        { id: 'm1', name: 'Napa Extra 500mg', price: 35, quantity: 2, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf8QgTeefksxI4jClTU-PDm5OQGVzeqSviWKknUQk2hH5iwHllB_t5r66_8hNU2NhKf8S2XjuM3BefCKC0GCSUX9L8XVd-EYMaJ8JwU5NXz9caJugnojSHHG0KPp2KiwJ7iZ09un8E53fvU7vNufU9X3dKh4YjZkZJWIb_m6hwU39LDq6QaRO_pV86Q22FbrHsX90z9msuDxPMvrJera8fBrFq3NY17SYtrnRNfvCihcC4rvsIMXUk' },
        { id: 'm2', name: 'Maxpro 20mg Tablet', price: 70, quantity: 1, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQj3-lgFODFI5vzOkC4eapSi8EnH7Nb4M5OUcW69JUvPSPCmf7nRyL_hqSX_NHnikYAurvlLX6Qf6_zLn8f3f222UZya3RloN3579elgODymD0d9vZgOTp3MLu2R-Ma2o2APRT4kKjiZDY_9mQeD9hsxRUx6wr3MBuFfywXsSnyj_KkC_P96CwTtgWp_Nyxq05T9drSiozNdLu9jMasnthMq5A0Jn6QBebJ3jrIgQQn0miKJb-c8Vs' }
      ],
      subtotal: 140,
      deliveryFee: 60,
      discount: 0,
      total: 200
    },
    {
      id: 'ORD-5532',
      orderId: 'ORD-5532',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'Processing',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard (12-24 Hours)',
      customer: {
        name: 'Kamrul Hasan',
        phone: '01833445566',
        address: 'House 5, Road 2, Nasirabad, Chittagong'
      },
      items: [
        { id: 'm3', name: 'Monas 10', price: 70, quantity: 3, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeDFEaSDObBgWG7mxSHvgK6s8c859NxIdvWWrvxYar3WjA6_HnEcYy5GCRXaBbm81KYRHKnyjub6Kg2ltQjdV2Wm0x5-GKDthSatrXU1PkqH0MdjBlDFO_op3DKMEBAOWE7EDbmqStL4_aYS9MASteW9zDSlOus4G3KLEdl8ShmqtgRV8mJKJjG81UEA7Ge4Tde0CR81FCQv5fcVDMyJXAUQpe_WnxatKFDnpnsaBZ-LqhkoUa0TGg' }
      ],
      subtotal: 210,
      deliveryFee: 40,
      discount: 10,
      total: 240
    },
{
      id: 'ORD-5601',
      orderId: 'ORD-5601',
      createdAt: new Date(Date.now() - 8640000).toISOString(),
      status: 'Confirmed',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 1',
        phone: '01888222331',
        address: 'Dhaka'
      },
      items: [
        { id: 'm2', name: 'MockMed 2', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5602',
      orderId: 'ORD-5602',
      createdAt: new Date(Date.now() - 17280000).toISOString(),
      status: 'Processing',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 2',
        phone: '01888222332',
        address: 'Dhaka'
      },
      items: [
        { id: 'm3', name: 'MockMed 3', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5603',
      orderId: 'ORD-5603',
      createdAt: new Date(Date.now() - 25920000).toISOString(),
      status: 'Shipped',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 3',
        phone: '01888222333',
        address: 'Dhaka'
      },
      items: [
        { id: 'm4', name: 'MockMed 4', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5604',
      orderId: 'ORD-5604',
      createdAt: new Date(Date.now() - 34560000).toISOString(),
      status: 'Delivered',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 4',
        phone: '01888222334',
        address: 'Dhaka'
      },
      items: [
        { id: 'm5', name: 'MockMed 5', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5605',
      orderId: 'ORD-5605',
      createdAt: new Date(Date.now() - 43200000).toISOString(),
      status: 'Cancelled',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 5',
        phone: '01888222335',
        address: 'Dhaka'
      },
      items: [
        { id: 'm1', name: 'MockMed 1', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5606',
      orderId: 'ORD-5606',
      createdAt: new Date(Date.now() - 51840000).toISOString(),
      status: 'Pending',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 6',
        phone: '01888222336',
        address: 'Dhaka'
      },
      items: [
        { id: 'm2', name: 'MockMed 2', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5607',
      orderId: 'ORD-5607',
      createdAt: new Date(Date.now() - 60480000).toISOString(),
      status: 'Confirmed',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 7',
        phone: '01888222337',
        address: 'Dhaka'
      },
      items: [
        { id: 'm3', name: 'MockMed 3', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5608',
      orderId: 'ORD-5608',
      createdAt: new Date(Date.now() - 69120000).toISOString(),
      status: 'Processing',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 8',
        phone: '01888222338',
        address: 'Dhaka'
      },
      items: [
        { id: 'm4', name: 'MockMed 4', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5609',
      orderId: 'ORD-5609',
      createdAt: new Date(Date.now() - 77760000).toISOString(),
      status: 'Shipped',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 9',
        phone: '01888222339',
        address: 'Dhaka'
      },
      items: [
        { id: 'm5', name: 'MockMed 5', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5610',
      orderId: 'ORD-5610',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'Delivered',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 10',
        phone: '01888222330',
        address: 'Dhaka'
      },
      items: [
        { id: 'm1', name: 'MockMed 1', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5611',
      orderId: 'ORD-5611',
      createdAt: new Date(Date.now() - 95040000).toISOString(),
      status: 'Cancelled',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 11',
        phone: '01888222331',
        address: 'Dhaka'
      },
      items: [
        { id: 'm2', name: 'MockMed 2', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5612',
      orderId: 'ORD-5612',
      createdAt: new Date(Date.now() - 103680000).toISOString(),
      status: 'Pending',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 12',
        phone: '01888222332',
        address: 'Dhaka'
      },
      items: [
        { id: 'm3', name: 'MockMed 3', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5613',
      orderId: 'ORD-5613',
      createdAt: new Date(Date.now() - 112320000).toISOString(),
      status: 'Confirmed',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 13',
        phone: '01888222333',
        address: 'Dhaka'
      },
      items: [
        { id: 'm4', name: 'MockMed 4', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5614',
      orderId: 'ORD-5614',
      createdAt: new Date(Date.now() - 120960000).toISOString(),
      status: 'Processing',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 14',
        phone: '01888222334',
        address: 'Dhaka'
      },
      items: [
        { id: 'm5', name: 'MockMed 5', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5615',
      orderId: 'ORD-5615',
      createdAt: new Date(Date.now() - 129600000).toISOString(),
      status: 'Shipped',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 15',
        phone: '01888222335',
        address: 'Dhaka'
      },
      items: [
        { id: 'm1', name: 'MockMed 1', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5616',
      orderId: 'ORD-5616',
      createdAt: new Date(Date.now() - 138240000).toISOString(),
      status: 'Delivered',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 16',
        phone: '01888222336',
        address: 'Dhaka'
      },
      items: [
        { id: 'm2', name: 'MockMed 2', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5617',
      orderId: 'ORD-5617',
      createdAt: new Date(Date.now() - 146880000).toISOString(),
      status: 'Cancelled',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 17',
        phone: '01888222337',
        address: 'Dhaka'
      },
      items: [
        { id: 'm3', name: 'MockMed 3', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5618',
      orderId: 'ORD-5618',
      createdAt: new Date(Date.now() - 155520000).toISOString(),
      status: 'Pending',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 18',
        phone: '01888222338',
        address: 'Dhaka'
      },
      items: [
        { id: 'm4', name: 'MockMed 4', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5619',
      orderId: 'ORD-5619',
      createdAt: new Date(Date.now() - 164160000).toISOString(),
      status: 'Confirmed',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 19',
        phone: '01888222339',
        address: 'Dhaka'
      },
      items: [
        { id: 'm5', name: 'MockMed 5', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5620',
      orderId: 'ORD-5620',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      status: 'Processing',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 20',
        phone: '01888222330',
        address: 'Dhaka'
      },
      items: [
        { id: 'm1', name: 'MockMed 1', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5621',
      orderId: 'ORD-5621',
      createdAt: new Date(Date.now() - 181440000).toISOString(),
      status: 'Shipped',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 21',
        phone: '01888222331',
        address: 'Dhaka'
      },
      items: [
        { id: 'm2', name: 'MockMed 2', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5622',
      orderId: 'ORD-5622',
      createdAt: new Date(Date.now() - 190080000).toISOString(),
      status: 'Delivered',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 22',
        phone: '01888222332',
        address: 'Dhaka'
      },
      items: [
        { id: 'm3', name: 'MockMed 3', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5623',
      orderId: 'ORD-5623',
      createdAt: new Date(Date.now() - 198720000).toISOString(),
      status: 'Cancelled',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 23',
        phone: '01888222333',
        address: 'Dhaka'
      },
      items: [
        { id: 'm4', name: 'MockMed 4', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5624',
      orderId: 'ORD-5624',
      createdAt: new Date(Date.now() - 207360000).toISOString(),
      status: 'Pending',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 24',
        phone: '01888222334',
        address: 'Dhaka'
      },
      items: [
        { id: 'm5', name: 'MockMed 5', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5625',
      orderId: 'ORD-5625',
      createdAt: new Date(Date.now() - 216000000).toISOString(),
      status: 'Confirmed',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 25',
        phone: '01888222335',
        address: 'Dhaka'
      },
      items: [
        { id: 'm1', name: 'MockMed 1', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5626',
      orderId: 'ORD-5626',
      createdAt: new Date(Date.now() - 224640000).toISOString(),
      status: 'Processing',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 26',
        phone: '01888222336',
        address: 'Dhaka'
      },
      items: [
        { id: 'm2', name: 'MockMed 2', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5627',
      orderId: 'ORD-5627',
      createdAt: new Date(Date.now() - 233280000).toISOString(),
      status: 'Shipped',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 27',
        phone: '01888222337',
        address: 'Dhaka'
      },
      items: [
        { id: 'm3', name: 'MockMed 3', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5628',
      orderId: 'ORD-5628',
      createdAt: new Date(Date.now() - 241920000).toISOString(),
      status: 'Delivered',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 28',
        phone: '01888222338',
        address: 'Dhaka'
      },
      items: [
        { id: 'm4', name: 'MockMed 4', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5629',
      orderId: 'ORD-5629',
      createdAt: new Date(Date.now() - 250560000).toISOString(),
      status: 'Cancelled',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 29',
        phone: '01888222339',
        address: 'Dhaka'
      },
      items: [
        { id: 'm5', name: 'MockMed 5', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5630',
      orderId: 'ORD-5630',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      status: 'Pending',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 30',
        phone: '01888222330',
        address: 'Dhaka'
      },
      items: [
        { id: 'm1', name: 'MockMed 1', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5631',
      orderId: 'ORD-5631',
      createdAt: new Date(Date.now() - 267840000).toISOString(),
      status: 'Confirmed',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 31',
        phone: '01888222331',
        address: 'Dhaka'
      },
      items: [
        { id: 'm2', name: 'MockMed 2', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5632',
      orderId: 'ORD-5632',
      createdAt: new Date(Date.now() - 276480000).toISOString(),
      status: 'Processing',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 32',
        phone: '01888222332',
        address: 'Dhaka'
      },
      items: [
        { id: 'm3', name: 'MockMed 3', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5633',
      orderId: 'ORD-5633',
      createdAt: new Date(Date.now() - 285120000).toISOString(),
      status: 'Shipped',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 33',
        phone: '01888222333',
        address: 'Dhaka'
      },
      items: [
        { id: 'm4', name: 'MockMed 4', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5634',
      orderId: 'ORD-5634',
      createdAt: new Date(Date.now() - 293760000).toISOString(),
      status: 'Delivered',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 34',
        phone: '01888222334',
        address: 'Dhaka'
      },
      items: [
        { id: 'm5', name: 'MockMed 5', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5635',
      orderId: 'ORD-5635',
      createdAt: new Date(Date.now() - 302400000).toISOString(),
      status: 'Cancelled',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 35',
        phone: '01888222335',
        address: 'Dhaka'
      },
      items: [
        { id: 'm1', name: 'MockMed 1', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5636',
      orderId: 'ORD-5636',
      createdAt: new Date(Date.now() - 311040000).toISOString(),
      status: 'Pending',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 36',
        phone: '01888222336',
        address: 'Dhaka'
      },
      items: [
        { id: 'm2', name: 'MockMed 2', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5637',
      orderId: 'ORD-5637',
      createdAt: new Date(Date.now() - 319680000).toISOString(),
      status: 'Confirmed',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 37',
        phone: '01888222337',
        address: 'Dhaka'
      },
      items: [
        { id: 'm3', name: 'MockMed 3', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5638',
      orderId: 'ORD-5638',
      createdAt: new Date(Date.now() - 328320000).toISOString(),
      status: 'Processing',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 38',
        phone: '01888222338',
        address: 'Dhaka'
      },
      items: [
        { id: 'm4', name: 'MockMed 4', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5639',
      orderId: 'ORD-5639',
      createdAt: new Date(Date.now() - 336960000).toISOString(),
      status: 'Shipped',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 39',
        phone: '01888222339',
        address: 'Dhaka'
      },
      items: [
        { id: 'm5', name: 'MockMed 5', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    },
{
      id: 'ORD-5640',
      orderId: 'ORD-5640',
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      status: 'Delivered',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer 40',
        phone: '01888222330',
        address: 'Dhaka'
      },
      items: [
        { id: 'm1', name: 'MockMed 1', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    }
  ]);
  const { isLoggedIn, user } = useAuth();

  const addOrder = (order) => {
    // Only logged in users can add orders, but we assume Auth Guard handled this.
    // Attach a status if not present
    const newOrder = {
      ...order,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const getOrder = (orderId) => {
    return orders.find(o => o.id === orderId || o.orderId === orderId);
  };

  const updateOrderStatus = (orderId, newStatus, reason = null) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId || o.orderId === orderId) {
        return { ...o, status: newStatus, ...(reason && { cancellationReason: reason }) };
      }
      return o;
    }));
  };
  
  // Clear orders when user logs out
  // Simple mock: just keep the list for now, or reset if not logged in
  const userOrders = isLoggedIn ? orders : [];

  return (
    <OrderContext.Provider value={{
      orders: userOrders,
      addOrder,
      getOrder,
      updateOrderStatus
    }}>
      {children}
    </OrderContext.Provider>
  );
};
