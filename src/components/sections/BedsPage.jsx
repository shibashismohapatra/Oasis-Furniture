import { useState, useMemo, useCallback } from 'react';
import { ArrowLeft, Heart, ShoppingBag, SlidersHorizontal, X, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useToastStore } from '../../store/useToastStore';

const bedsData = [
  { id: 1,  name: 'Diwan',                       image: '/beds/Diwan.jpg',                        type: 'Diwan',   size: 'Single', storage: 'No Storage',       price: 24500,  originalPrice: 29000,  tag: 'Bestseller', specs: { type: 'Manual Lift Bed', height: '400 mm', matSize: '78 × 36 inch (1950 × 900 mm)', length: '78 inch', width: '36 inch', netWt: '78 KG' }, description: 'Experience comfort, elegance, and practicality with the Diwan, designed to enhance your bedroom with a modern and sophisticated look. Featuring clean lines and a stylish finish, this bed blends effortlessly with any bedroom décor. Built with a strong and durable frame using premium-quality materials, the Diwan offers excellent stability and long-lasting performance. The manual lift storage system allows you to easily raise or lower the mattress platform, creating additional storage space underneath. This smart feature helps keep your essentials organized while maximizing available space.Easy to assemble with user-friendly instructions, the Delonix Bed offers both convenience and luxury, making it an ideal choice for modern homes.Whether you are upgrading your bedroom interiors or looking for a comfortable sleeping solution, the Delonix Bed delivers style, functionality, and comfort in one perfect package.' },
  { id: 2,  name: 'Classic Queen Bed',            image: '/beds/Classic_Queen_Bed.jpg',            type: 'Storage', size: 'Queen',  storage: 'Hydraulic Storage', price: 38500,  originalPrice: 45000,  tag: 'New',        specs: { type: 'Hydraulic Storage Bed', height: '400 mm', matSize: '78 × 60 inch (1950 × 1500 mm)', length: '78 inch', width: '60 inch', netWt: '120 KG', grossWt: '130 KG' }, description: 'Experience comfort and convenience with the Classic Queen Bed, designed to bring style, functionality, and luxury to your bedroom. Equipped with an advanced hydraulic lift storage system, the bed allows easy access to spacious storage underneath the mattress platform. This smart storage solution helps keep your essentials organized while maximizing available space.With its user-friendly assembly design and premium finish, the Classic Queen Bed offers both convenience and elegance for modern living.Whether you are upgrading your bedroom décor or searching for a stylish and comfortable sleeping solution, the Classic Queen Bed is an ideal choice from our exclusive bedroom collection.' },
  { id: 3,  name: 'Classic King Size Bed',        image: '/beds/Classic_King_Size_Bed.jpg',        type: 'Storage', size: 'King',   storage: 'Manual Storage',    price: 44500,  originalPrice: 52000,  tag: 'Bestseller', specs: { type: 'Manual Storage Bed', material: 'PLPB with PVC Edge Banding', height: '400 mm', matSize: '78 × 72 inch (1950 × 1800 mm)', length: '78 inch', width: '72 inch', netWt: '130 KG', grossWt: '140 KG' }, description: 'Experience luxury, comfort, and functionality with the Classic King Bed, thoughtfully designed to enhance your bedroom space. Built with a strong frame using premium PLPB material with PVC edge banding, the bed offers excellent durability, stability, and long-lasting performance.Its clean lines and contemporary design blend seamlessly with any bedroom décor, adding a refined and sophisticated touch. The manual lift storage system provides easy access to spacious storage beneath the mattress platform, allowing you to organize bedding, essentials, and other items efficiently.Designed for comfort and convenience, the Classic King Bed features an easy installation process and premium craftsmanship, making it an ideal addition to modern homes.Whether you want to upgrade your bedroom interiors or create a luxurious sleeping space, the Classic King Bed offers the perfect combination of style, comfort, and smart storage.' },
  { id: 4,  name: 'Atlanta Queen Bed',            image: '/beds/Atlanta_Queen_Bed.jpg',            type: 'Storage', size: 'Queen',  storage: 'Hydraulic Storage', price: 41000,  originalPrice: 49000,  tag: 'Premium',    specs: { type: 'Hydraulic Storage Bed', height: '400 mm', matSize: '78 × 60 inch (1950 × 1500 mm)', length: '78 inch', width: '60 inch', netWt: '120 KG', grossWt: '130 KG' }, description: 'Experience comfort, elegance, and convenience with the Atlanta Queen Bed, crafted to enhance your bedroom with a stylish and modern appearance. The bed comes with a hydraulic storage system, allowing smooth and effortless access to spacious storage beneath the mattress platform. This intelligent storage solution helps keep your essentials organized while maximizing bedroom space efficiently.Designed for everyday comfort and convenience, the Atlanta King Bed is easy to assemble and offers excellent craftsmanship, making it an ideal choice for stylish and functional living spaces.Whether you are redesigning your bedroom or looking for a premium sleeping solution, the Atlanta King Bed delivers the perfect blend of luxury, storage, and comfort.' },
  { id: 5,  name: 'Atlanta King Bed',             image: '/beds/Atlanta_King_Bed.jpg',             type: 'Storage', size: 'King',   storage: 'Manual Storage',    price: 48000,  originalPrice: 57000,  tag: 'Premium',    specs: { type: 'Manual Storage Bed', material: 'PLPB with PVC Edge Banding', height: '400 mm', matSize: '78 × 72 inch (1950 × 1800 mm)', length: '78 inch', width: '72 inch', netWt: '130 KG', grossWt: '140 KG' }, description: 'Experience comfort, style, and convenience with the Atlanta King Bed, designed to bring elegance and functionality to modern bedrooms. The bed features a manual lift storage system, providing easy access to spacious storage underneath the mattress platform. This practical storage solution helps keep your essentials organized while maximizing available bedroom space.Designed for everyday comfort and convenience, the Atlanta King Bed is easy to assemble and offers excellent craftsmanship, making it an ideal choice for stylish and functional living spaces.Whether you are redesigning your bedroom or looking for a premium sleeping solution, the Atlanta King Bed delivers the perfect blend of luxury, storage, and comfort.' },
  { id: 6,  name: 'Aster King Bed',               image: '/beds/Aster_King_Bed.jpg',               type: 'Storage', size: 'King',   storage: 'Manual Storage',    price: 52000,  originalPrice: 62000,  tag: 'Bestseller', specs: { type: 'Manual Storage Bed', material: 'PLPB with PVC Edge Banding', height: '400 mm', matSize: '78 × 72 inch (1950 × 1800 mm)', length: '78 inch', width: '72 inch', netWt: '165 KG', grossWt: '175 KG' }, description: 'Experience premium comfort and convenience with the Aster King Bed, thoughtfully designed to elevate your bedroom with elegance and functionality. The bed is equipped with a manual lift storage system, allowing easy access to spacious storage beneath the mattress platform. This smart storage feature helps organize bedding, essentials, and other items efficiently while maximizing available space.Built with premium craftsmanship and easy assembly, the Aster King Bed is designed to deliver comfort, style, and everyday convenience.Whether you are upgrading your bedroom interiors or looking for a luxurious sleeping solution, the Aster King Bed offers the ideal combination of elegance, storage, and relaxation.' },
  { id: 7,  name: 'Orchid King Bed',              image: '/beds/Orchid_King_Bed.jpg',              type: 'Storage', size: 'King',   storage: 'Manual Storage',    price: 53500,  originalPrice: 64000,  tag: 'Premium',    specs: { type: 'Manual Storage Bed', material: 'PLPB with PVC Edge Banding', height: '400 mm', matSize: '78 × 72 inch (1950 × 1800 mm)', length: '78 inch', width: '72 inch', netWt: '165 KG', grossWt: '175 KG' }, description: 'Experience luxury and convenience with the Orchid King Bed, beautifully designed to bring style, comfort, and functionality to your bedroom. The bed features a manual lift storage system, allowing effortless access to spacious storage beneath the mattress platform. This intelligent storage solution helps maximize bedroom space while keeping essentials neatly organized and easily accessible.Designed with comfort and convenience in mind, the Orchid King Bed offers easy assembly and premium craftsmanship, making it an ideal addition to modern living spaces.Whether you are upgrading your interiors or searching for a stylish and comfortable sleeping solution, the Orchid King Bed delivers the perfect balance of luxury, storage, and elegance.' },
  { id: 8,  name: 'DS 1 Bed Without Storage',     image: '/beds/DS_1_Bed_Without_Storage.jpg',     type: 'Simple',  size: 'Single', storage: 'No Storage',       price: 22000,  originalPrice: 27000,  tag: 'New',        specs: { type: 'Bed Without Storage', material: 'MDF with Melamine Polish Finish', height: '400 mm', matSize: '78 × 36 inch (1950 × 900 mm)', length: '78 inch', width: '36 inch', netWt: '68 KG', grossWt: '78 KG' }, description: 'Experience comfort and modern simplicity with the DS 1 Bed Without Storage, designed to offer a stylish and comfortable sleeping solution. Crafted using high-quality materials with MDF Melamine Polish finish, the DS 1 Bed ensures durability, stability, and long-lasting performance. Designed without storage, this bed focuses on providing maximum comfort while maintaining a minimal and spacious appearance.The sturdy frame offers reliable support and a comfortable sleeping experience for everyday use.Easy to assemble and built with premium craftsmanship, the DS 1 Bed is an ideal choice for those looking for a simple yet elegant bedroom setup.Whether you are furnishing a new room or upgrading your interiors, the DS 1 Bed Without Storage delivers style, comfort, and practicality in one design.' },
  { id: 9,  name: 'DS 1 Queen Bed Without Storage', image: '/beds/DS_1_Queen_Bed_Without_Storage.jpg', type: 'Simple', size: 'Queen', storage: 'No Storage',      price: 28500,  originalPrice: 34000,  tag: 'New',        specs: { type: 'Bed Without Storage', material: 'MDF with Melamine Polish Finish', height: '400 mm', matSize: '78 × 48 inch (1950 × 1200 mm)', length: '78 inch', width: '48 inch', netWt: '83 KG', grossWt: '93 KG' }, description: 'Experience comfort and simplicity with the DS 1 Queen Bed Without Storage, thoughtfully designed to bring style and functionality to modern bedrooms. Made using premium-quality materials with MDF Melamine Polish finish, the DS 1 Queen Bed offers excellent durability, stability, and long-term performance. Designed without storage, this bed provides a spacious and minimal look, making it ideal for those who prefer a neat and modern bedroom setup.The sturdy frame ensures reliable support and everyday comfort.Easy to assemble and crafted with quality workmanship, the DS 1 Queen Bed is a perfect choice for creating a stylish and relaxing bedroom environment.Whether you are redesigning your room or looking for a premium sleeping solution, the DS 1 Queen Bed Without Storage delivers comfort, elegance, and practicality.' },
  { id: 10, name: 'DS 1 Queen Bed',               image: '/beds/DS_1_Queen_Bed.jpg',               type: 'Storage', size: 'Queen',  storage: 'Hydraulic Storage', price: 44000,  originalPrice: 53000,  tag: 'Bestseller', specs: { type: 'Hydraulic Storage Bed', height: '400 mm', matSize: '78 × 60 inch  (1950 × 1500 mm)', length: '78 inch', width: '60 inch', netWt: '130 KG', grossWt: '135 KG' }, description: 'Experience comfort, convenience, and modern luxury with the DS 1 Queen Bed, thoughtfully designed to enhance your bedroom with style and functionality. The bed comes with a hydraulic storage system, allowing easy and smooth access to spacious storage beneath the mattress platform. This smart storage feature helps maximize available space while keeping essentials neatly organized and within reach.Designed for both comfort and convenience, the DS 1 Queen Bed is easy to assemble and crafted with attention to detail, making it an ideal choice for contemporary homes.Whether you are upgrading your bedroom décor or looking for a stylish and comfortable sleeping solution, the DS 1 Queen Bed offers the perfect balance of elegance, storage, and relaxation.' },
  { id: 11, name: 'DS 1 King Bed',                image: '/beds/DS_1_King_Bed.jpg',                type: 'Storage', size: 'King',   storage: 'Manual Storage',    price: 51000,  originalPrice: 61000,  tag: 'Bestseller', specs: { type: 'Manual Storage Bed', height: '400 mm', matSize: '78 × 72 inch (1950 × 1800 mm)', length: '78 inch', width: '72 inch', netWt: '148 KG', grossWt: '158 KG' }, description: 'Experience luxury, comfort, and convenience with the DS 1 King Bed, designed to enhance your bedroom with modern elegance and practical functionality. The bed features a manual lift storage system, providing convenient access to spacious storage beneath the mattress platform. This practical storage solution helps maximize bedroom space while keeping essentials organized and easily accessible.Designed with user-friendly assembly and premium craftsmanship, the DS 1 King Bed delivers both functionality and aesthetic appeal, making it an ideal choice for modern homes.Whether you are upgrading your bedroom interiors or searching for a stylish sleeping solution, the DS 1 King Bed offers comfort, smart storage, and timeless elegance.' },
  { id: 12, name: 'ES 1 King Bed',                image: '/beds/ES_1_King_Bed.jpg',                type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 58000,  originalPrice: 70000,  tag: 'Premium',    specs: { type: 'Hydraulic Storage Bed', height: '400 mm', matSize: '78 × 72 inch (1980 × 1830 mm)', length: '78 inch', width: '72 inch', netWt: '145 KG', grossWt: '155 KG' }, description: 'Experience comfort, elegance, and convenience with the ES 1 King Bed, designed to transform your bedroom into a modern and luxurious space. Equipped with an advanced hydraulic storage system, the bed provides effortless access to spacious storage beneath the mattress platform. This smart storage solution helps maximize available space while keeping bedding and essentials neatly organized.The ES 1 King Bed is crafted with premium workmanship and an easy assembly design, ensuring both comfort and convenience for everyday use.Whether you are redesigning your bedroom or searching for a stylish and comfortable sleeping solution, the ES 1 King Bed delivers the perfect combination of luxury, storage, and modern functionality.' },
  { id: 13, name: 'ES 2 King Bed',                image: '/beds/ES_2_King_Bed.jpg',                type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 62000,  originalPrice: 74000,  tag: 'Premium',    specs: { type: 'Full Hydraulic Storage', height: '400 mm', matSize: '78 × 72 inch (1980 × 1830 mm)', length: '78 inch', width: '72 inch' }, description: 'Experience luxury, elegance, and modern functionality with the ES 2 King Bed. The bed comes equipped with a Full Hydraulic Storage System (HT 400 mm) that allows smooth lifting of the mattress platform while providing spacious hidden storage underneath. This smart storage feature helps maximize bedroom space and keeps bedding, pillows, blankets, and everyday essentials neatly organized and easily accessible.' },
  { id: 14, name: 'Delonix King Bed',             image: '/beds/Delonix_King_Bed.jpg',             type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 67000,  originalPrice: 80000,  tag: 'Bestseller', specs: { type: 'Hydraulic Storage Bed', height: '400 mm', matSize: '78 × 72 inch (1950 × 1800 mm)', length: '78 inch', width: '72 inch', netWt: '166 KG', grossWt: '176 KG' }, description: 'Experience elegance, comfort, and convenience with the Delonix King Bed, thoughtfully designed to bring sophistication and functionality to your bedroom. The bed features an advanced hydraulic storage system, allowing smooth and effortless access to spacious storage beneath the mattress platform. This smart storage solution helps maximize bedroom space while keeping essentials neatly organized and easily accessible.Designed with comfort and convenience in mind, the Delonix King Bed offers easy assembly and premium craftsmanship, making it a perfect addition to modern interiors.Whether you are upgrading your bedroom décor or creating a luxurious sleeping space, the Delonix King Bed delivers the ideal combination of comfort, storage, and timeless elegance.' },
  { id: 15, name: 'Austria King Bed',             image: '/beds/Austria_King_Bed.jpg',             type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 72000,  originalPrice: 86000,  tag: 'Premium',    specs: { type: 'Hydraulic Storage Bed', height: '400 mm', matSize: '78 × 72 inch  (1950 × 1800 mm)', length: '78 inch', width: '72 inch', netWt: '185 KG', grossWt: '195 KG' }, description: 'Experience elegance and convenience with the Austria King Bed, designed to bring modern luxury and superior comfort to your bedroom. Equipped with a hydraulic storage system, the bed provides smooth and effortless access to spacious storage beneath the mattress platform. This smart storage feature helps maximize room space and keeps bedding, essentials, and accessories neatly organized.Designed with comfort, convenience, and premium craftsmanship, the Austria King Bed is easy to assemble and ideal for creating a stylish and relaxing bedroom environment.Whether you are upgrading your interiors or searching for a luxurious sleeping solution, the Austria King Bed delivers the perfect balance of style, comfort, and smart storage.' },
  { id: 16, name: 'Korvy Queen Bed',              image: '/beds/Korvy_Queen_Bed.jpg',              type: 'Storage', size: 'Queen',  storage: 'Hydraulic Storage', price: 61000,  originalPrice: 73000,  tag: 'Bestseller', specs: { type: 'Hydraulic Storage Bed', height: '400 mm', matSize: '78 × 60 inch (1950 × 1500 mm)', length: '78 inch', width: '60 inch', netWt: '165 KG', grossWt: '175 KG' }, description: 'Experience luxury and convenience with the Korvy Queen Bed, designed to enhance your bedroom with modern style and practical functionality. The bed comes with an advanced hydraulic storage system, providing effortless access to spacious storage beneath the mattress platform. This practical storage solution helps maximize available space and keeps essentials neatly organized and within easy reach.Designed for comfort and everyday convenience, the Korvy Queen Bed features premium craftsmanship and an easy assembly process, making it a perfect addition to modern homes.Whether you are upgrading your bedroom interiors or searching for a stylish sleeping solution, the Korvy Queen Bed delivers the ideal blend of luxury, storage, and relaxation.' },
  { id: 17, name: 'Korvy King Bed',               image: '/beds/Korvy_King_Bed.jpg',               type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 72000,  originalPrice: 86000,  tag: 'Premium',    specs: { type: 'Hydraulic Storage Bed', height: '400 mm', matSize: '78 × 72 inch (1950 × 1800 mm)', length: '78 inch', width: '72 inch', netWt: '185 KG', grossWt: '195 KG' }, description: 'Experience elegance, comfort, and convenience with the Korvy King Bed, designed to create a stylish and relaxing bedroom environment. The bed is equipped with a hydraulic storage system, allowing smooth and effortless access to spacious storage beneath the mattress platform. This intelligent storage feature helps maximize room space while keeping bedding and daily essentials neatly organized.Designed with superior craftsmanship and easy installation, the Korvy King Bed offers both comfort and functionality, making it an ideal addition to modern interiors.Whether you are redesigning your bedroom or looking for a premium sleeping solution, the Korvy King Bed delivers the perfect combination of luxury, smart storage, and comfort.' },
  { id: 18, name: 'Ambely Queen Bed',             image: '/beds/Ambely_Queen_Bed.jpg',             type: 'Storage', size: 'Queen',  storage: 'Hydraulic Storage', price: 61000,  originalPrice: 73000,  tag: 'New',        specs: { type: 'Hydraulic Storage Bed', height: '400 mm', matSize: '78 × 60 inch (1950 × 1500 mm)', length: '78 inch', width: '60 inch', netWt: '165 KG', grossWt: '175 KG' }, description: 'Experience luxury and convenience with the Ambely Queen Bed, thoughtfully designed to enhance your bedroom with modern style and practical functionality. The bed is equipped with a hydraulic storage system, offering smooth and effortless access to spacious storage beneath the mattress platform. This smart storage solution helps maximize available space and keeps essentials neatly organized and easily accessible.Designed with superior craftsmanship and easy assembly, the Ambely Queen Bed delivers both comfort and convenience, making it an ideal addition to modern homes.Whether you are upgrading your interiors or looking for a luxurious sleeping solution, the Ambely Queen Bed provides the perfect combination of elegance, storage, and relaxation.' },
  { id: 19, name: 'Ambely King Bed',              image: '/beds/Ambely_King_Bed.jpg',              type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 72000,  originalPrice: 86000,  tag: 'New',        specs: { type: 'Hydraulic Storage Bed', height: '400 mm', matSize: '78 × 72 inch (1950 × 1800 mm)', length: '78 inch', width: '72 inch', netWt: '185 KG', grossWt: '195 KG' }, description: 'Experience elegance, comfort, and convenience with the Ambely King Bed, designed to bring modern sophistication and practical functionality to your bedroom. The bed features an advanced hydraulic storage system, allowing smooth and effortless access to spacious storage beneath the mattress platform. This intelligent storage solution helps maximize room space while keeping bedding and daily essentials neatly organized.Designed with superior craftsmanship and user-friendly assembly, the Ambely King Bed offers the perfect combination of comfort, storage, and convenience for modern homes.Whether you are upgrading your bedroom décor or creating a luxurious sleeping space, the Ambely King Bed delivers style, functionality, and premium comfort in one elegant design.' },
  { id: 20, name: 'Arena Queen Bed',              image: '/beds/Arena_Queen_Bed.jpg',              type: 'Storage', size: 'Queen',  storage: 'Manual Storage',    price: 57000,  originalPrice: 68000,  tag: 'Bestseller', specs: { type: 'Manual Lift Storage', matSize: '78 × 60 inch (1981 × 1524 mm)', length: '78 inch', width: '60 inch', netWt: '165 KG', grossWt: '175 KG' }, description: 'Experience luxury, comfort, and functionality with the Arena Queen Bed, designed to bring elegance and convenience to your bedroom. One of its standout features is the manual lift storage mechanism, allowing you to easily raise or lower the mattress platform. Whether you need additional storage space for bedding, pillows, or everyday essentials, the smart storage design helps keep your room organized and clutter-free.The bed is designed for easy installation with user-friendly instructions, ensuring a smooth setup experience without complications.Upgrade your bedroom with the perfect combination of luxury, storage, and comfort with the Arena Queen Bed — a stylish centerpiece built for modern living.' },
  { id: 21, name: 'Arena King Bed',               image: '/beds/Arena_King_Bed.jpg',               type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 69000,  originalPrice: 82000,  tag: 'Bestseller', specs: { type: 'Hydraulic Lift Storage', height: '400 mm', matSize: '78 × 72 inch (1950 × 1800 mm)', length: '78 inch', width: '72 inch', netWt: '185 KG', grossWt: '195 KG' }, description: 'Experience the perfect blend of elegance, comfort, and functionality with the Arena King Bed. The bed features an advanced hydraulic lift storage system, allowing you to conveniently lift the mattress platform and access spacious storage underneath. This smart storage solution helps maximize space while keeping bedding, pillows, and essentials neatly organized and within reach.Designed for convenience, the Arena King Bed is easy to assemble and provides both luxury and practicality for modern living.Upgrade your bedroom with the perfect combination of premium comfort, elegant design, and intelligent storage with the Arena King Bed.' },
  { id: 22, name: 'Vesta Queen Bed',              image: '/beds/Vesta_Queen_Bed.jpg',              type: 'Storage', size: 'Queen',  storage: 'Hydraulic Storage', price: 61000,  originalPrice: 73000,  tag: 'Premium',    specs: { type: 'Hydraulic Lift Storage', height: '400 mm', matSize: '78 × 60 inch (1950 × 1500 mm)', length: '78 inch', width: '60 inch', netWt: '165 KG', grossWt: '175 KG' }, description: 'Experience comfort, convenience, and timeless elegance with the Vesta Queen Bed. The bed comes with an advanced hydraulic lift storage system, making it easy to access the spacious storage area beneath the mattress platform. This smart storage feature helps maximize space and keeps your essentials neatly organized and easily accessible.With an easy installation process and user-friendly design, the Vesta Queen Bed provides both comfort and practicality for modern living.Bring home luxury, smart storage, and elegant craftsmanship with the Vesta Queen Bed — designed for premium comfort and modern lifestyles.' },
  { id: 23, name: 'Vesta King Bed',               image: '/beds/Vesta_King_Bed.jpg',               type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 72000,  originalPrice: 86000,  tag: 'Premium',    specs: { type: 'Hydraulic Lift Storage', height: '400 mm', matSize: '78 × 72 inch (1950 × 1800 mm)', length: '78 inch', width: '72 inch', netWt: '185 KG', grossWt: '195 KG' }, description: 'Experience luxury, comfort, and modern functionality with the Vesta King Bed. Equipped with an advanced hydraulic lift storage system, the bed provides easy access to spacious storage beneath the mattress platform. This smart storage solution helps maximize bedroom space and keeps your essentials neatly organized and within easy reach.The Vesta King Bed is thoughtfully designed for easy installation and hassle-free usage, allowing you to enjoy superior comfort and convenience every day.Upgrade your bedroom with the perfect combination of style, storage, and luxury with the Vesta King Bed.' },
  { id: 24, name: 'Prague King Bed',              image: '/beds/Prague_King_Bed.jpg',              type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 78000,  originalPrice: 94000,  tag: 'Premium',    specs: { type: 'Hydraulic Lift Storage', height: '400 mm', matSize: '78 × 72 inch  (1950 × 1800 mm)', length: '78 inch', width: '72 inch', netWt: '200 KG', grossWt: '210 KG' }, description: 'Bring elegance, comfort, and smart functionality into your bedroom with the Prague King Bed. The bed features an advanced hydraulic lift storage system, allowing smooth and convenient access to the spacious storage area beneath the mattress platform. This intelligent storage solution helps maximize room space while keeping blankets, pillows, and daily essentials neatly organized.Designed for convenience and easy installation, the Prague King Bed delivers both style and functionality, making it an ideal choice for modern homes.Transform your bedroom with the perfect combination of luxury, comfort, and smart storage with the Prague King Bed.' },
  { id: 25, name: 'Kosovo Queen Bed',             image: '/beds/Kosovo_Queen_Bed.jpg',             type: 'Simple',  size: 'Queen',  storage: 'No Storage',       price: 36000,  originalPrice: 43000,  tag: 'New',        specs: { matSize: '78 × 60 inch (1950 × 1500 mm)', length: '78 inch', width: '60 inch', netWt: '165 KG', grossWt: '175 KG' }, description: 'Experience the perfect balance of luxury, comfort, and functionality with the Kosovo Queen Bed. Designed with a sleek and contemporary style, this queen-sized bed enhances your sleeping experience while adding sophistication and charm to your bedroom décor. Crafted with a strong and durable frame using premium-quality materials, the Kosovo Bed offers excellent stability and long-lasting performance.Its elegant design, clean lines, and modern finish blend effortlessly with various bedroom interiors, creating a refined and stylish atmosphere.Designed for both comfort and practicality, the bed provides a spacious layout that ensures a relaxing sleeping experience while maintaining a premium aesthetic appeal.With a user-friendly structure and easy installation process, the Kosovo Queen Bed is built to deliver convenience and comfort for modern lifestyles.Upgrade your bedroom with the perfect combination of style, durability, and luxury with the Kosovo Queen Bed.' },
  { id: 26, name: 'Kosovo King Bed',              image: '/beds/Kosovo_King_Bed.jpg',              type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 66000,  originalPrice: 79000,  tag: 'Bestseller', specs: { type: 'Hydraulic Lift Storage', height: '400 mm', matSize: '78 × 72 inch (1950 × 1800 mm)', length: '78 inch', width: '72 inch', netWt: '185 KG', grossWt: '190 KG' }, description: 'Experience luxury, sophistication, and smart functionality with the Kosovo King Bed. The bed features a hydraulic lift storage system that provides easy access to spacious storage beneath the mattress platform. This smart storage solution helps maximize room space while keeping bedding, pillows, and essentials organized and easily accessible.Designed with convenience in mind, the Kosovo King Bed is easy to install and crafted to deliver superior comfort and everyday practicality.Upgrade your bedroom with the perfect blend of luxury, style, and intelligent storage with the Kosovo King Bed.' },  
  { id: 27, name: 'Parker King Bed',              image: '/beds/Parker_King_Bed.jpg',              type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 71000,  originalPrice: 85000,  tag: 'Premium',    specs: { type: 'Hydraulic Lift Storage', height: '400 mm', matSize: '78 × 72 inch  (1950 × 1800 mm)', length: '78 inch', width: '72 inch', netWt: '185 KG', grossWt: '195 KG' }, description: 'Experience comfort, elegance, and functionality with the Parker King Bed. The bed comes with an advanced hydraulic lift storage system, providing convenient access to spacious storage beneath the mattress platform. This smart storage solution helps maximize bedroom space and keeps bedding, cushions, and everyday essentials neatly organized.With an easy installation process and user-friendly design, the Parker King Bed delivers comfort, convenience, and luxury in one complete package.Upgrade your bedroom with modern elegance and intelligent storage through the Parker King Bed.' },
  { id: 28, name: 'Vienna King Bed',              image: '/beds/Vienna_King_Bed.jpg',              type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 69000,  originalPrice: 82000,  tag: 'Premium',    specs: { type: 'Hydraulic Lift Storage', height: '400 mm', matSize: '78 × 72 inch (1950 × 1800 mm)', length: '78 inch', width: '72 inch', netWt: '170 KG', grossWt: '175 KG' }, description: 'Experience premium comfort and modern sophistication with the Vienna King Bed. The bed is equipped with a hydraulic lift storage system, offering convenient access to spacious storage beneath the mattress platform. This smart storage feature helps maximize room space while keeping blankets, pillows, and daily essentials neatly organized.Designed for easy installation and everyday comfort, the Vienna King Bed provides the perfect combination of luxury, convenience, and modern living.Upgrade your bedroom with the stylish and functional Vienna King Bed.' },
  { id: 29, name: 'Madrid King Bed',              image: '/beds/Madrid_King_Bed.jpg',              type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 73000,  originalPrice: 88000,  tag: 'New',        specs: { type: 'Hydraulic Lift Storage', height: '400 mm', matSize: '78 × 72 inch (1950 × 1800 mm)', length: '78 inch', width: '72 inch', netWt: '185 KG', grossWt: '195 KG' }, description: 'Experience elegance, comfort, and modern functionality with the Madrid King Bed. The bed features an advanced hydraulic lift storage system, providing effortless access to spacious storage beneath the mattress platform. This smart storage solution helps maximize bedroom space while keeping blankets, pillows, and essentials neatly organized and within easy reach.With easy installation and a user-friendly design, the Madrid King Bed delivers superior comfort and everyday practicality for modern living.Upgrade your bedroom décor with the stylish and functional Madrid King Bed' },
  { id: 30, name: 'Pristine King Bed',            image: '/beds/Pristine_King_Bed.jpg',            type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 82000,  originalPrice: 98000,  tag: 'Premium',    specs: { type: 'Full Hydraulic Storage', height: '400 mm', matSize: '78 × 72 inch (1981 × 1828 mm)', length: '78 inch', width: '72 inch', netWt: '200 KG' }, description: 'Experience elegance, comfort, and smart functionality with the Pristine King Bed. Equipped with a Full Hydraulic Storage System (HT 400 mm), the bed allows smooth lifting of the mattress platform and provides spacious hidden storage beneath. This intelligent storage solution helps maximize room space while keeping bedding, pillows, and everyday essentials neatly organized and easily accessible.Designed for convenience and effortless installation, the Pristine King Bed offers both comfort and functionality for modern lifestyles.Upgrade your bedroom with the perfect blend of luxury, smart storage, and timeless design with the Pristine King Bed.' },
  { id: 31, name: 'Texas King Bed',               image: '/beds/Texas_King_Bed.jpg',               type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 79000,  originalPrice: 95000,  tag: 'New',        specs: { type: 'Full Hydraulic Storage', height: '400 mm', matSize: '78 × 72 inch (1981 × 1828 mm)', length: '78 inch', width: '72 inch' }, description: 'Experience premium comfort and elegant functionality with the Texas King Bed. The bed is equipped with a Full Hydraulic Storage System (HT 400 mm) that allows smooth lifting of the mattress platform and provides spacious storage underneath. This smart storage feature helps maximize room space while keeping blankets, pillows, and daily essentials neatly organized and easily accessible.Designed for convenience and effortless setup, the Texas King Bed offers both style and practicality for comfortable everyday living.Upgrade your bedroom with the perfect combination of luxury, smart storage, and timeless elegance with the Texas King Bed.' },
  { id: 32, name: 'Sony King Bed',                image: '/beds/Sony_King_Bed.jpg',                type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 76000,  originalPrice: 91000,  tag: 'Bestseller', specs: { type: 'Full Hydraulic Storage', height: '400 mm', matSize: '78 × 72 inch (1981 × 1828 mm)', length: '78 inch', width: '72 inch' }, description: 'Experience exceptional comfort and modern sophistication with the Sony King Bed. The bed features a Full Hydraulic Storage System (HT 400 mm) that allows smooth lifting of the mattress platform, providing spacious hidden storage underneath. This intelligent storage solution helps maximize bedroom space while keeping bedding, pillows, and everyday essentials neatly organized and easily accessible.With easy installation and a user-friendly design, the Sony King Bed offers comfort, convenience, and luxury for modern lifestyles.Upgrade your bedroom décor with the premium styling and smart storage features of the Sony King Bed.' },
  { id: 33, name: 'Haven King Bed',               image: '/beds/Haven_King_Bed.jpg',               type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 84000,  originalPrice: 100000, tag: 'Premium',    specs: { type: 'Full Hydraulic Storage', height: '400 mm', matSize: '78 × 72 inch (1981 × 1828 mm)', length: '78 inch', width: '72 inch' }, description: 'Experience sophistication, comfort, and modern functionality with the Haven King Bed. The bed comes equipped with a Full Hydraulic Storage System (HT 400 mm) that allows smooth lifting of the mattress platform and provides spacious hidden storage beneath. This intelligent storage solution helps maximize room space while keeping bedding, pillows, blankets, and essentials neatly organized.Designed with user convenience in mind, the Haven King Bed offers easy installation and hassle-free functionality, delivering comfort and practicality for everyday living.Transform your bedroom with the perfect combination of style, comfort, and intelligent storage with the Haven King Bed.' },
  { id: 34, name: 'Aria King Bed',                image: '/beds/Aria_King_Bed.jpg',                type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 86000,  originalPrice: 103000, tag: 'Premium',    specs: { type: 'Full Hydraulic Storage', height: '400 mm', matSize: '78 × 72 inch (1981 × 1828 mm)', length: '78 inch', width: '72 inch' }, description: 'Experience modern elegance, superior comfort, and smart functionality with the Aria King Bed. Equipped with a Full Hydraulic Storage System (HT 400 mm), the bed allows smooth lifting of the mattress platform and offers spacious hidden storage underneath. This intelligent storage feature helps maximize bedroom space while keeping bedding, pillows, blankets, and everyday essentials neatly organized and within reach.Designed with easy installation and user-friendly functionality, the Aria King Bed delivers both luxury and practicality for everyday comfort.Upgrade your bedroom with the perfect balance of elegance, smart storage, and premium comfort with the Aria King Bed.' },
  { id: 35, name: 'Orlov King Bed',               image: '/beds/Orlov_King_Bed.jpg',               type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 91000,  originalPrice: 109000, tag: 'Premium',    specs: { type: 'Full Hydraulic Storage', height: '400 mm', matSize: '78 × 72 inch (1981 × 1828 mm)', length: '78 inch', width: '72 inch' }, description: 'Experience exceptional comfort, elegant design, and smart functionality with the Orlov King Bed. The bed comes equipped with a Full Hydraulic Storage System (HT 400 mm), allowing effortless lifting of the mattress platform and providing spacious hidden storage underneath. This smart storage feature helps maximize room space while keeping bedding, pillows, blankets, and everyday essentials neatly organized.Designed for convenience and easy setup, the Orlov King Bed offers modern functionality without compromising on comfort or style.Transform your bedroom with the premium craftsmanship and intelligent storage features of the Orlov King Bed.' },
  { id: 36, name: 'Nelson King Bed',              image: '/beds/Nelson_King_Bed.jpg',              type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 88000,  originalPrice: 105000, tag: 'Bestseller', specs: { type: 'Full Hydraulic Storage', height: '400 mm', matSize: '78 × 72 inch (1981 × 1828 mm)', length: '78 inch', width: '72 inch' }, description: 'Experience luxury, comfort, and modern functionality with the Nelson King Bed. Equipped with a Full Hydraulic Storage System (HT 400 mm), the bed offers smooth lifting of the mattress platform and provides spacious hidden storage underneath. This innovative storage solution helps maximize bedroom space while keeping bedding, pillows, blankets, and everyday essentials neatly organized and easily accessible.Designed for easy installation and hassle-free usage, the Nelson King Bed delivers both style and practicality for modern living.Upgrade your bedroom with the perfect combination of comfort, luxury, and smart storage through the Nelson King Bed.' },
  { id: 37, name: 'Daisy King Bed',               image: '/beds/Daisy_King_Bed.jpg',               type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 87000,  originalPrice: 104000, tag: 'New',        specs: { type: 'Full Hydraulic Storage', height: '400 mm', matSize: '78 × 72 inch (1981 × 1828 mm)', length: '78 inch', width: '72 inch' }, description: 'Experience luxury, comfort, and modern elegance with the Daisy King Bed. The bed comes equipped with a Full Hydraulic Storage System (HT 400 mm), allowing smooth lifting of the mattress platform and providing spacious hidden storage beneath. This intelligent storage solution helps maximize room space while keeping bedding, pillows, blankets, and everyday essentials neatly organized and easily accessible.Designed for convenience and easy installation, the Daisy King Bed offers a perfect balance of luxury, functionality, and everyday comfort.Transform your bedroom with the elegance and smart storage features of the Daisy King Bed.' },
  { id: 38, name: 'Lexus King Bed',               image: '/beds/Lexus_King_Bed.jpg',               type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 93000,  originalPrice: 111000, tag: 'Premium',    specs: { type: 'Full Hydraulic Storage', height: '400 mm', matSize: '78 × 72 inch (1981 × 1828 mm)', length: '78 inch', width: '72 inch' }, description: 'Experience unmatched comfort, modern elegance, and smart functionality with the Lexus King Bed. Equipped with a Full Hydraulic Storage System (HT 400 mm), the bed allows smooth lifting of the mattress platform and provides spacious hidden storage underneath. This intelligent storage solution helps maximize bedroom space while keeping bedding, pillows, blankets, and essentials neatly organized and easily accessible.Designed for convenience and easy installation, the Lexus King Bed delivers the perfect balance of elegance, comfort, and functionality for everyday living.Upgrade your bedroom with premium styling and smart storage through the Lexus King Bed.' },
  { id: 39, name: 'London PLM King Bed',          image: '/beds/London_PLM_King_Bed.jpg',          type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 97000,  originalPrice: 116000, tag: 'Premium',    specs: { type: 'Full Hydraulic Storage', height: '400 mm', matSize: '78 × 72 inch (1981 × 1828 mm)', length: '78 inch', width: '72 inch' }, description: 'Experience superior comfort, modern elegance, and smart functionality with the London PLM King Bed. Equipped with a Full Hydraulic Storage System (HT 400 mm), the bed allows effortless lifting of the mattress platform and provides spacious hidden storage beneath. This innovative storage solution helps maximize bedroom space while keeping bedding, pillows, blankets, and daily essentials neatly organized and within easy reach.Designed for easy installation and user-friendly functionality, the London PLM King Bed delivers comfort, convenience, and premium living in one elegant design.Upgrade your bedroom décor with the luxury and smart storage features of the London PLM King Bed.' },
  { id: 40, name: 'Armour 1 King Bed',            image: '/beds/Armour_1_King_Bed.jpg',            type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 89000,  originalPrice: 107000, tag: 'Bestseller', specs: { type: 'Full Hydraulic Storage', height: '400 mm', matSize: '78 × 72 inch (1981 × 1828 mm)', length: '78 inch', width: '72 inch' }, description: 'Experience exceptional comfort, modern elegance, and smart functionality with the Armour 1 King Bed. The bed comes equipped with a Full Hydraulic Storage System (HT 400 mm), allowing smooth lifting of the mattress platform and providing spacious hidden storage underneath. This innovative storage solution helps maximize room space while keeping bedding, pillows, blankets, and daily essentials neatly organized and easily accessible.Designed with user convenience in mind, the Armour 1 King Bed offers easy installation and hassle-free functionality, delivering premium comfort for modern lifestyles.Transform your bedroom with the luxury, comfort, and smart storage features of the Armour 1 King Bed.' },
  { id: 41, name: 'Armour 3 King Bed',            image: '/beds/Armour_3_King_Bed.jpg',            type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 91000,  originalPrice: 109000, tag: 'Premium',    specs: { type: 'Full Hydraulic Storage', height: '400 mm', matSize: '78 × 72 inch (1981 × 1828 mm)', length: '78 inch', width: '72 inch' }, description: 'Experience superior comfort, elegant craftsmanship, and smart functionality with the Armour 3 King Bed. The bed comes equipped with a Full Hydraulic Storage System (HT 400 mm), allowing smooth and effortless lifting of the mattress platform while providing spacious hidden storage underneath. This smart storage solution helps maximize bedroom space and keeps bedding, pillows, blankets, and essentials neatly organized and easily accessible.Designed for convenience and easy installation, the Armour 3 King Bed delivers luxury, comfort, and everyday functionality in one beautifully crafted design.Upgrade your bedroom décor with the stylish and practical Armour 3 King Bed.' },
  { id: 42, name: 'Armour 1 Queen Bed',           image: '/beds/Armour_1_Queen_Bed.jpg',           type: 'Storage', size: 'Queen',  storage: 'Hydraulic Storage', price: 74000,  originalPrice: 89000,  tag: 'Bestseller', specs: { type: 'Full Hydraulic Storage', height: '400 mm', matSize: '78 × 60 inch (1981 × 1524 mm)', length: '78 inch', width: '60 inch' }, description: 'Experience luxury, comfort, and modern functionality with the Armour 1 Queen Bed. The bed is equipped with a Full Hydraulic Storage System (HT 400 mm) that allows smooth lifting of the mattress platform while providing spacious hidden storage underneath. This intelligent storage solution helps maximize room space and keeps bedding, pillows, blankets, and everyday essentials neatly organized and easily accessible.Designed for easy installation and user-friendly functionality, the Armour 1 Queen Bed delivers both comfort and convenience for modern living.Upgrade your bedroom décor with the stylish and practical Armour 1 Queen Bed.' },
  { id: 43, name: 'Berry PLM King Bed',           image: '/beds/Berry_PLM_King_Bed.jpg',           type: 'Storage', size: 'King',   storage: 'Hydraulic Storage', price: 95000,  originalPrice: 114000, tag: 'Premium',    specs: { type: 'Full Hydraulic Storage', height: '400 mm', matSize: '78 × 72 inch (1981 × 1828 mm)', length: '78 inch', width: '72 inch' }, description: 'Experience superior comfort, elegant craftsmanship, and smart functionality with the Berry PLM King Bed. The bed is equipped with a Full Hydraulic Storage System (HT 400 mm), allowing effortless lifting of the mattress platform and providing spacious hidden storage underneath. This innovative storage feature helps maximize room space while keeping bedding, pillows, blankets, and daily essentials neatly organized and easily accessible.Designed for convenience and easy installation, the Berry PLM King Bed offers luxury, comfort, and functionality for modern living.Upgrade your bedroom décor with the stylish and practical Berry PLM King Bed.' },
  { id: 44, name: 'AS 4 King Bed',                image: '/beds/AS_4_King_Bed.jpg',                type: 'Storage', size: 'King',   storage: 'Manual Storage',    price: 64000,  originalPrice: 77000,  tag: 'New',        specs: { type: 'Manual Lift Storage', height: '400 mm', matSize: '   78 × 72 inch (1981 × 1828 mm)', length: '78 inch', width: '72 inch' }, description: 'Experience luxury, functionality, and modern elegance with the AS 4 King Bed. The bed comes with a Manual Lift Storage System (HT 400 mm), allowing easy access to spacious storage beneath the mattress platform. This smart storage solution helps maximize bedroom space and keeps bedding, pillows, blankets, and daily essentials neatly organized and within easy reach.Designed with convenience in mind, the AS 4 King Bed offers simple installation and user-friendly functionality, making it an ideal choice for modern homes.Upgrade your bedroom décor with the perfect combination of luxury, comfort, and intelligent storage through the AS 4 King Bed.' },
  { id: 45, name: 'AS 6 King Bed',                image: '/beds/AS_6_King_Bed.jpg',                type: 'Storage', size: 'King',   storage: 'Manual Storage',    price: 68000,  originalPrice: 82000,  tag: 'New',        specs: { type: 'Manual Lift Storage', height: '400 mm', matSize: '   78 × 72 inch (1981 × 1828 mm)', length: '78 inch', width: '72 inch' }, description: 'Experience premium comfort, stylish design, and practical functionality with the AS 6 King Bed. The bed is equipped with a Manual Lift Storage System (HT 400 mm) that allows convenient access to spacious storage beneath the mattress platform. This intelligent storage solution helps maximize room space while keeping bedding, pillows, blankets, and daily essentials neatly organized and within easy reach.Designed for easy setup and user-friendly functionality, the AS 6 King Bed delivers both comfort and practicality for modern living.Upgrade your bedroom with the perfect blend of luxury, convenience, and smart storage through the AS 6 King Bed.' },
];

// Stable ratings seeded by id — avoids Math.random() in render
const stableRatings = bedsData.map(b => ({
  id: b.id,
  rating: +(4.4 + ((b.id * 17 + 3) % 7) / 10).toFixed(1),
  count: 20 + ((b.id * 31 + 7) % 120),
}));

const tagColors = {
  'New':        { bg: '#1a1714', color: '#fff' },
  'Bestseller': { bg: '#c9a96e', color: '#fff' },
  'Premium':    { bg: '#2c3e50', color: '#fff' },
  'Sale':       { bg: '#c0392b', color: '#fff' },
};

const sortOptions = [
  { label: 'Popularity',        value: 'popularity' },
  { label: 'Price — Low to High', value: 'price_asc' },
  { label: 'Price — High to Low', value: 'price_desc' },
  { label: 'Newest First',       value: 'newest' },
];

function StarRating({ rating = 4.5, count = 0 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={12} fill={s <= Math.floor(rating) ? '#c9a96e' : 'none'}
          stroke={s <= Math.ceil(rating) ? '#c9a96e' : '#ccc'} strokeWidth={1.5} />
      ))}
      {count > 0 && <span style={{ fontSize: '0.72rem', color: '#888', marginLeft: 2 }}>{count} reviews</span>}
    </div>
  );
}

function SpecRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: 8, fontSize: '0.82rem', padding: '5px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <span style={{ color: '#6b6359', minWidth: 120, flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#1a1714', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function BedsPage({ onBack }) {
  const [sortBy, setSortBy]         = useState('popularity');
  const [filterSize, setFilterSize] = useState([]);
  const [filterStore, setFilterStore] = useState([]);
  const [filterTag, setFilterTag]   = useState([]);
  const [priceMin, setPriceMin]     = useState('');
  const [priceMax, setPriceMax]     = useState('');
  const [selectedBed, setSelectedBed] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [openSections, setOpenSections] = useState({ size: true, storage: true, tag: true, price: true });
  const [wishlist, setWishlist]     = useState([]);

  const addToCart    = useCartStore(s => s.addItem);
  const toggleWishlistStore = useWishlistStore(s => s.toggle);
  const showToast = useToastStore(s => s.show);

  const toggleSection = (key) => setOpenSections(p => ({ ...p, [key]: !p[key] }));
  const toggleArr     = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let items = [...bedsData];
    if (filterSize.length)  items = items.filter(b => filterSize.includes(b.size));
    if (filterStore.length) items = items.filter(b => filterStore.some(s => b.storage.includes(s)));
    if (filterTag.length)   items = items.filter(b => filterTag.includes(b.tag));
    if (priceMin)           items = items.filter(b => b.price >= parseInt(priceMin));
    if (priceMax)           items = items.filter(b => b.price <= parseInt(priceMax));
    switch (sortBy) {
      case 'price_asc':  return items.sort((a,b) => a.price - b.price);
      case 'price_desc': return items.sort((a,b) => b.price - a.price);
      case 'newest':     return items.sort((a,b) => b.id - a.id);
      default:           return items;
    }
  }, [filterSize, filterStore, filterTag, priceMin, priceMax, sortBy]);

  const handleAddToCart = (bed, e) => {
    e.stopPropagation();
    addToCart({ id: bed.id, name: bed.name, price: bed.price, image: bed.image, quantity: 1 });
    showToast(`"${bed.name}" added to cart`, 'success');
  };
  const handleWishlist = (bed, e) => {
    e.stopPropagation();
    toggleWishlistStore({ id: bed.id, name: bed.name, price: bed.price, image: bed.image });
    showToast(wishlist.includes(bed.id) ? `Removed from Wishlist` : `"${bed.name}" added to Wishlist`, wishlist.includes(bed.id) ? 'success' : 'wishlist');
    setWishlist(w => w.includes(bed.id) ? w.filter(x => x !== bed.id) : [...w, bed.id]);
  };

  // FilterSection and CheckItem are memoized via useCallback to avoid
  // re-creation on every render (which would unmount inputs and lose focus)
  const renderFilterSection = useCallback((title, sectionKey, children) => (
    <div style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: 16, marginBottom: 16 }}>
      <button onClick={() => toggleSection(sectionKey)} style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: "'Jost', sans-serif", fontSize: '0.72rem', fontWeight: 700,
        letterSpacing: '0.10em', textTransform: 'uppercase', color: '#1a1714',
        padding: '0 0 10px 0'
      }}>
        {title}
        {openSections[sectionKey] ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
      {openSections[sectionKey] && children}
    </div>
  ), [openSections, toggleSection]);

  return (
    <>
      <style>{`
        .bp-root { min-height:100vh; background:#faf8f5; padding-top:110px; font-family:'Jost',sans-serif; }
        .bp-hero { background:#f5f0e8; padding:32px 40px 28px; border-bottom:1px solid rgba(0,0,0,0.07); }
        .bp-back { display:inline-flex;align-items:center;gap:8px;font-size:0.72rem;font-weight:500;
          letter-spacing:0.08em;text-transform:uppercase;color:#6b6359;background:none;border:none;
          cursor:pointer;padding:0;margin-bottom:14px;transition:color 0.2s; }
        .bp-back:hover { color:#1a1714; }
        .bp-heading { font-family:'Cormorant Garamond',serif;font-size:2.6rem;font-weight:700;
          color:#1a1714;margin:0 0 4px;letter-spacing:-0.01em; }
        .bp-sub { font-size:0.83rem;color:#6b6359;margin:0; }
        .bp-layout { display:grid;grid-template-columns:240px 1fr;gap:0;max-width:1320px;margin:0 auto; }
        .bp-sidebar { border-right:1px solid rgba(0,0,0,0.08);padding:28px 24px;background:#fff;
          position:sticky;top:72px;height:calc(100vh - 72px);overflow-y:auto; }
        .bp-main { padding:24px 32px 60px; }
        .bp-toolbar { display:flex;align-items:center;justify-content:space-between;
          margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid rgba(0,0,0,0.07); }
        .bp-count { font-size:0.78rem;color:#6b6359; }
        .bp-count strong { color:#1a1714;font-weight:600; }
        .bp-sort { display:flex;align-items:center;gap:8px;flex-wrap:nowrap;overflow-x:auto;
          -webkit-overflow-scrolling:touch;scrollbar-width:none;max-width:100%; }
        .bp-sort::-webkit-scrollbar { display:none; }
        .bp-sort-label { font-size:0.74rem;color:#6b6359;font-weight:500;letter-spacing:0.06em;
          text-transform:uppercase;white-space:nowrap;flex-shrink:0; }
        .bp-sort-btn { font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:500;color:#1a1714;
          background:none;border:1px solid rgba(0,0,0,0.12);padding:6px 12px;cursor:pointer;
          white-space:nowrap;flex-shrink:0;transition:all 0.18s; }
        .bp-sort-btn.active,.bp-sort-btn:hover { border-color:#c9a96e;color:#c9a96e; }

        /* Product list rows */
        .bp-list { display:flex;flex-direction:column;gap:16px; }
        .bp-row { background:#fff;border:1px solid rgba(0,0,0,0.07);display:flex;cursor:pointer;
          transition:box-shadow 0.25s,border-color 0.25s; overflow:hidden; }
        .bp-row:hover { box-shadow:0 6px 28px rgba(0,0,0,0.09);border-color:rgba(201,169,110,0.3); }
        .bp-row-img-wrap { position:relative;width:220px;flex-shrink:0;overflow:hidden; }
        .bp-row-img { width:100%;height:220px;object-fit:cover;transition:transform 0.5s ease; }
        .bp-row:hover .bp-row-img { transform:scale(1.04); }
        .bp-row-tag { position:absolute;top:10px;left:10px;font-size:0.58rem;font-weight:700;
          letter-spacing:0.12em;text-transform:uppercase;padding:4px 9px; }
        .bp-row-wish { position:absolute;top:9px;right:9px;background:#fff;border:none;
          width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:color 0.18s; }
        .bp-row-wish:hover { color:#c0392b; }
        .bp-row-body { flex:1;padding:18px 24px;display:flex;flex-direction:column;justify-content:space-between; }
        .bp-row-name { font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:600;
          color:#1a1714;margin:0 0 4px; }
        .bp-row-desc { font-size:0.8rem;color:#5a534a;line-height:1.55;
          display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;
          margin-bottom:10px; }
        .bp-spec-chip { display:inline-flex;align-items:center;gap:4px;font-size:0.7rem;font-weight:500;
          color:#6b6359;background:#f5f0e8;padding:3px 9px;margin:2px 3px 2px 0; }
        .bp-row-price-row { display:flex;align-items:baseline;gap:10px;margin-top:10px; }
        .bp-row-price { font-size:1.45rem;font-weight:700;color:#1a1714; }
        .bp-row-orig  { font-size:0.85rem;color:#aaa;text-decoration:line-through; }
        .bp-row-disc  { font-size:0.78rem;font-weight:600;color:#2ecc71; }
        .bp-row-atc { display:inline-flex;align-items:center;gap:7px;margin-top:14px;
          padding:10px 22px;background:#1a1714;color:#fff;border:none;cursor:pointer;
          font-family:'Jost',sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.12em;
          text-transform:uppercase;transition:background 0.2s; }
        .bp-row-atc:hover { background:#c9a96e; }

        /* Detail panel */
        .bp-detail-overlay { position:fixed;inset:0;background:rgba(26,23,20,0.55);z-index:500;
          display:flex;align-items:flex-start;justify-content:flex-end; }
        .bp-detail-panel { background:#fff;width:min(640px,100vw);height:100vh;overflow-y:auto;
          animation:slideIn 0.32s cubic-bezier(.22,1,.36,1);position:relative; }
        @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        .bp-detail-img { width:100%;height:340px;object-fit:cover; }
        .bp-detail-body { padding:28px 32px 48px; }
        .bp-detail-tag { font-size:0.64rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
          padding:4px 10px;display:inline-block;margin-bottom:12px; }
        .bp-detail-name { font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;
          color:#1a1714;margin:0 0 10px; }
        .bp-detail-price-row { display:flex;align-items:baseline;gap:12px;margin-bottom:16px; }
        .bp-detail-price { font-size:1.75rem;font-weight:700;color:#1a1714; }
        .bp-detail-orig  { font-size:1rem;color:#aaa;text-decoration:line-through; }
        .bp-detail-disc  { font-size:0.85rem;font-weight:600;color:#2ecc71; }
        .bp-detail-desc { font-size:0.85rem;line-height:1.7;color:#4a4340;margin-bottom:20px; }
        .bp-detail-specs { margin-bottom:24px; }
        .bp-detail-specs-title { font-size:0.72rem;font-weight:700;letter-spacing:0.10em;
          text-transform:uppercase;color:#1a1714;margin:0 0 10px; }
        .bp-detail-actions { display:flex;gap:12px;flex-wrap:wrap; }
        .bp-detail-atc { flex:1;display:flex;align-items:center;justify-content:center;gap:8px;
          padding:14px;background:#1a1714;color:#fff;border:none;cursor:pointer;
          font-family:'Jost',sans-serif;font-size:0.75rem;font-weight:600;letter-spacing:0.12em;
          text-transform:uppercase;min-width:180px;transition:background 0.2s; }
        .bp-detail-atc:hover { background:#c9a96e; }
        .bp-detail-close { position:sticky;top:16px;float:right;margin:16px 16px -54px 0;
          background:rgba(255,255,255,0.95);border:none;width:38px;height:38px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;
          box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:background 0.2s;flex-shrink:0; }
        .bp-detail-close:hover { background:#fff; }
        .mob-filter-btn { display:none!important; }
        @media (max-width:900px) {
          .bp-layout { grid-template-columns:1fr; }
          .bp-sidebar { display:none;position:fixed;inset:0;z-index:400;height:100vh;
            overflow-y:auto;padding:20px; }
          .bp-sidebar.open { display:block!important; }
          .mob-filter-btn { display:flex!important; }
          .bp-hero { padding:24px 16px 20px; }
          .bp-main { padding:16px 16px 60px; }
          .bp-row-img-wrap { width:140px; }
          .bp-row-img { height:160px; }
          .bp-row-name { font-size:1.1rem; }
          .bp-toolbar { flex-direction:column;align-items:flex-start;gap:12px; }
          .bp-sort { width:100%;overflow-x:auto;padding-bottom:4px; }
        }
        @media (max-width:540px) {
          .bp-row { flex-direction:column; }
          .bp-row-img-wrap { width:100%; }
          .bp-row-img { height:200px; }
          .bp-detail-panel { width:100vw; }
        }
      `}</style>

      <div className="bp-root">
        {/* Hero */}
        <div className="bp-hero" style={{ maxWidth: '100%' }}>
          <div style={{ maxWidth: 1320, margin: '0 auto' }}>
            <button className="bp-back" onClick={onBack}>
              <ArrowLeft size={13} strokeWidth={2.5} /> Back to Home
            </button>
            <h1 className="bp-heading">Beds</h1>
            <p className="bp-sub">Handcrafted beds — designed for the modern Indian home. Showing {filtered.length} of {bedsData.length} products.</p>
          </div>
        </div>

        <div className="bp-layout">
          {/* Sidebar filters */}
          <aside className={`bp-sidebar${filterOpen ? ' open' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: "'Jost',sans-serif", fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.10em', textTransform: 'uppercase', color: '#1a1714' }}>FILTERS</span>
              <button className="mob-filter-btn" onClick={() => setFilterOpen(false)}
                style={{ background:'none',border:'none',cursor:'pointer' }}><X size={18}/></button>
            </div>

            {renderFilterSection("BED SIZE", "size", <>
              
              {['Single','Queen','King'].map(s => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '0.8rem', color: '#3d3830', padding: '4px 0', userSelect: 'none' }}>
                <input type="checkbox" checked={filterSize.includes(s)} onChange={() => toggleArr(filterSize, setFilterSize, s)} style={{ accentColor: '#c9a96e', width: 14, height: 14, cursor: 'pointer' }} />
                {s}
              </label>
              ))}
            </>)}

            {renderFilterSection("STORAGE TYPE", "storage", <>
              
              {['Hydraulic Storage','Manual Storage','No Storage'].map(s => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '0.8rem', color: '#3d3830', padding: '4px 0', userSelect: 'none' }}>
                <input type="checkbox" checked={filterStore.includes(s)} onChange={() => toggleArr(filterStore, setFilterStore, s)} style={{ accentColor: '#c9a96e', width: 14, height: 14, cursor: 'pointer' }} />
                {s}
              </label>
              ))}
            </>)}

            {renderFilterSection("CATEGORY", "tag", <>
              
              {['New','Bestseller','Premium'].map(t => (
                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '0.8rem', color: '#3d3830', padding: '4px 0', userSelect: 'none' }}>
                <input type="checkbox" checked={filterTag.includes(t)} onChange={() => toggleArr(filterTag, setFilterTag, t)} style={{ accentColor: '#c9a96e', width: 14, height: 14, cursor: 'pointer' }} />
                {t}
              </label>
              ))}
            </>)}

            {renderFilterSection("PRICE RANGE", "price", <>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <input placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: "'Jost',sans-serif", fontSize: '0.8rem', color: '#1a1714', outline:'none' }} />
                <span style={{ color: '#aaa', flexShrink: 0 }}>to</span>
                <input placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: "'Jost',sans-serif", fontSize: '0.8rem', color: '#1a1714', outline:'none' }} />
              </div>
            </>)}

            {(filterSize.length > 0 || filterStore.length > 0 || filterTag.length > 0 || priceMin || priceMax) && (
              <button onClick={() => { setFilterSize([]); setFilterStore([]); setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
                style={{ fontFamily:"'Jost',sans-serif", fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.10em',
                  textTransform:'uppercase', color:'#c0392b', background:'none', border:'1px solid #c0392b',
                  padding:'8px 16px', cursor:'pointer', width:'100%', marginTop:4 }}>
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Main content */}
          <main className="bp-main">
            {/* Toolbar */}
            <div className="bp-toolbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="mob-filter-btn" onClick={() => setFilterOpen(true)}
                  style={{ display:'flex',alignItems:'center',gap:6,background:'none',border:'1px solid rgba(0,0,0,0.15)',
                    padding:'7px 14px',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'0.74rem',fontWeight:600,
                    letterSpacing:'0.08em',textTransform:'uppercase',color:'#1a1714' }}>
                  <SlidersHorizontal size={14}/> Filters
                </button>
                <span className="bp-count"><strong>{filtered.length}</strong> products</span>
              </div>
              <div className="bp-sort">
                <span className="bp-sort-label">Sort:</span>
                {sortOptions.map(o => (
                  <button key={o.value} className={`bp-sort-btn${sortBy === o.value ? ' active' : ''}`}
                    onClick={() => setSortBy(o.value)}>{o.label}</button>
                ))}
              </div>
            </div>

            {/* Product list */}
            <div className="bp-list">
              {filtered.map(bed => {
                const disc = bed.originalPrice ? Math.round((1 - bed.price / bed.originalPrice) * 100) : null;
                const tc = tagColors[bed.tag] || tagColors['New'];
                const inWl = wishlist.includes(bed.id);
                return (
                  <div key={bed.id} className="bp-row" onClick={() => setSelectedBed(bed)}>
                    <div className="bp-row-img-wrap">
                      <img className="bp-row-img" src={bed.image} alt={bed.name} loading="lazy" />
                      <span className="bp-row-tag" style={{ background: tc.bg, color: tc.color }}>{bed.tag}</span>
                      <button className="bp-row-wish" onClick={e => handleWishlist(bed, e)}
                        style={{ color: inWl ? '#c0392b' : '#1a1714' }}>
                        <Heart size={14} fill={inWl ? '#c0392b' : 'none'} stroke={inWl ? '#c0392b' : 'currentColor'} />
                      </button>
                    </div>
                    <div className="bp-row-body">
                      <div>
                        <h3 className="bp-row-name">{bed.name}</h3>
                        <StarRating rating={stableRatings.find(r => r.id === bed.id)?.rating ?? 4.5} count={stableRatings.find(r => r.id === bed.id)?.count ?? 42} />
                        <p className="bp-row-desc">{bed.description}</p>
                        <div>
                          {bed.specs.type && <span className="bp-spec-chip">· {bed.specs.type}</span>}
                          {bed.size && <span className="bp-spec-chip">· {bed.size} Size</span>}
                          {bed.specs.matSize && <span className="bp-spec-chip">· Mattress: {bed.specs.matSize}</span>}
                          {bed.specs.netWt && <span className="bp-spec-chip">· Net Weight: {bed.specs.netWt}</span>}
                        </div>
                      </div>
                      <div>
                        <div className="bp-row-price-row">
                          <span className="bp-row-price">₹{bed.price.toLocaleString('en-IN')}</span>
                          {bed.originalPrice && <span className="bp-row-orig">₹{bed.originalPrice.toLocaleString('en-IN')}</span>}
                          {disc && <span className="bp-row-disc">{disc}% off</span>}
                        </div>
                        {/* Add to Cart — temporarily hidden (client request) */}
                        {/* <button className="bp-row-atc" onClick={e => handleAddToCart(bed, e)}>
                          <ShoppingBag size={13} /> Add to Cart
                        </button> */}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ textAlign:'center', padding:'80px 0', color:'#6b6359',
                  fontFamily:"'Jost',sans-serif", fontSize:'0.9rem' }}>
                  No beds match your current filters. <br />
                  <button onClick={() => { setFilterSize([]); setFilterStore([]); setFilterTag([]); setPriceMin(''); setPriceMax(''); }}
                    style={{ marginTop:12,background:'none',border:'none',color:'#c9a96e',cursor:'pointer',
                      fontWeight:600,fontSize:'0.85rem',textDecoration:'underline' }}>
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Detail slide-in panel */}
      {selectedBed && (() => {
        const bed = selectedBed;
        const disc = bed.originalPrice ? Math.round((1 - bed.price / bed.originalPrice) * 100) : null;
        const tc = tagColors[bed.tag] || tagColors['New'];
        const inWl = wishlist.includes(bed.id);
        return (
          <div className="bp-detail-overlay" onClick={() => setSelectedBed(null)}>
            <div className="bp-detail-panel" onClick={e => e.stopPropagation()}>
              <button className="bp-detail-close" onClick={() => setSelectedBed(null)}><X size={16}/></button>
              <img className="bp-detail-img" src={bed.image} alt={bed.name} />
              <div className="bp-detail-body">
                <span className="bp-detail-tag" style={{ background: tc.bg, color: tc.color }}>{bed.tag}</span>
                <h2 className="bp-detail-name">{bed.name}</h2>
                <StarRating rating={4.7} count={87} />
                <div className="bp-detail-price-row">
                  <span className="bp-detail-price">₹{bed.price.toLocaleString('en-IN')}</span>
                  {bed.originalPrice && <span className="bp-detail-orig">₹{bed.originalPrice.toLocaleString('en-IN')}</span>}
                  {disc && <span className="bp-detail-disc">{disc}% off</span>}
                </div>
                <p className="bp-detail-desc">{bed.description}</p>
                <div className="bp-detail-specs">
                  <p className="bp-detail-specs-title">Specifications</p>
                  <SpecRow label="Bed Type"       value={bed.size + ' Size'} />
                  <SpecRow label="Storage Type"   value={bed.specs.type} />
                  <SpecRow label="Material"       value={bed.specs.material} />
                  <SpecRow label="Height"         value={bed.specs.height} />
                  <SpecRow label="Mattress Size"  value={bed.specs.matSize} />
                  <SpecRow label="Product Length" value={bed.specs.length} />
                  <SpecRow label="Product Width"  value={bed.specs.width} />
                  <SpecRow label="Net Weight"     value={bed.specs.netWt} />
                  <SpecRow label="Gross Weight"   value={bed.specs.grossWt} />
                </div>
                <div className="bp-detail-actions">
                  {/* Add to Cart — temporarily hidden (client request) */}
                  {/* <button className="bp-detail-atc" onClick={e => { handleAddToCart(bed, e); setSelectedBed(null); }}>
                    <ShoppingBag size={15}/> Add to Cart
                  </button> */}
                  <button onClick={e => handleWishlist(bed, e)} style={{
                    padding:'14px 18px',border:'1px solid rgba(0,0,0,0.15)',background:'#fff',
                    cursor:'pointer',display:'flex',alignItems:'center',gap:7,
                    fontFamily:"'Jost',sans-serif",fontSize:'0.7rem',fontWeight:600,
                    letterSpacing:'0.10em',textTransform:'uppercase',
                    color: inWl ? '#c0392b' : '#1a1714',
                    borderColor: inWl ? '#c0392b' : 'rgba(0,0,0,0.15)'
                  }}>
                    <Heart size={14} fill={inWl ? '#c0392b' : 'none'} />
                    {inWl ? 'Wishlisted' : 'Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}