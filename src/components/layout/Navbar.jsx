import { useState, useEffect, useRef, Fragment } from 'react';
import logoImg from '../../assets/logo.png';
import { Search, Heart, ShoppingBag, ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { featured, bestSellers } from '../../data/products';

// ── Beds ──
const bedsData = [
  { id: 1,  name: 'Diwan',                    image: '/beds/Diwan.jpg',                        category: 'Beds', price: 24500  },
  { id: 2,  name: 'Classic Queen Bed',         image: '/beds/Classic_Queen_Bed.jpg',            category: 'Beds', price: 38500  },
  { id: 3,  name: 'Classic King Size Bed',     image: '/beds/Classic_King_Size_Bed.jpg',        category: 'Beds', price: 44500  },
  { id: 4,  name: 'Atlanta Queen Bed',         image: '/beds/Atlanta_Queen_Bed.jpg',            category: 'Beds', price: 41000  },
  { id: 5,  name: 'Atlanta King Bed',          image: '/beds/Atlanta_King_Bed.jpg',             category: 'Beds', price: 48000  },
  { id: 6,  name: 'Aster King Bed',            image: '/beds/Aster_King_Bed.jpg',               category: 'Beds', price: 52000  },
  { id: 7,  name: 'Orchid King Bed',           image: '/beds/Orchid_King_Bed.jpg',              category: 'Beds', price: 53500  },
  { id: 8,  name: 'DS 1 Bed Without Storage',  image: '/beds/DS_1_Bed_Without_Storage.jpg',     category: 'Beds', price: 22000  },
  { id: 9,  name: 'DS 1 Queen Bed',            image: '/beds/DS_1_Queen_Bed.jpg',               category: 'Beds', price: 44000  },
  { id: 10, name: 'DS 1 King Bed',             image: '/beds/DS_1_King_Bed.jpg',                category: 'Beds', price: 51000  },
  { id: 11, name: 'ES 1 King Bed',             image: '/beds/ES_1_King_Bed.jpg',                category: 'Beds', price: 58000  },
  { id: 12, name: 'ES 2 King Bed',             image: '/beds/ES_2_King_Bed.jpg',                category: 'Beds', price: 62000  },
  { id: 13, name: 'Delonix King Bed',          image: '/beds/Delonix_King_Bed.jpg',             category: 'Beds', price: 67000  },
  { id: 14, name: 'Austria King Bed',          image: '/beds/Austria_King_Bed.jpg',             category: 'Beds', price: 72000  },
  { id: 15, name: 'Korvy Queen Bed',           image: '/beds/Korvy_Queen_Bed.jpg',              category: 'Beds', price: 61000  },
  { id: 16, name: 'Korvy King Bed',            image: '/beds/Korvy_King_Bed.jpg',               category: 'Beds', price: 72000  },
  { id: 17, name: 'Ambely Queen Bed',          image: '/beds/Ambely_Queen_Bed.jpg',             category: 'Beds', price: 61000  },
  { id: 18, name: 'Ambely King Bed',           image: '/beds/Ambely_King_Bed.jpg',              category: 'Beds', price: 72000  },
  { id: 19, name: 'Arena Queen Bed',           image: '/beds/Arena_Queen_Bed.jpg',              category: 'Beds', price: 57000  },
  { id: 20, name: 'Arena King Bed',            image: '/beds/Arena_King_Bed.jpg',               category: 'Beds', price: 69000  },
  { id: 21, name: 'Vesta Queen Bed',           image: '/beds/Vesta_Queen_Bed.jpg',              category: 'Beds', price: 61000  },
  { id: 22, name: 'Vesta King Bed',            image: '/beds/Vesta_King_Bed.jpg',               category: 'Beds', price: 72000  },
  { id: 23, name: 'Prague King Bed',           image: '/beds/Prague_King_Bed.jpg',              category: 'Beds', price: 78000  },
  { id: 24, name: 'Kosovo Queen Bed',          image: '/beds/Kosovo_Queen_Bed.jpg',             category: 'Beds', price: 36000  },
  { id: 25, name: 'Kosovo King Bed',           image: '/beds/Kosovo_King_Bed.jpg',              category: 'Beds', price: 66000  },
  { id: 26, name: 'Parker King Bed',           image: '/beds/Parker_King_Bed.jpg',              category: 'Beds', price: 71000  },
  { id: 27, name: 'Vienna King Bed',           image: '/beds/Vienna_King_Bed.jpg',              category: 'Beds', price: 69000  },
  { id: 28, name: 'Madrid King Bed',           image: '/beds/Madrid_King_Bed.jpg',              category: 'Beds', price: 73000  },
  { id: 29, name: 'Pristine King Bed',         image: '/beds/Pristine_King_Bed.jpg',            category: 'Beds', price: 82000  },
  { id: 30, name: 'Texas King Bed',            image: '/beds/Texas_King_Bed.jpg',               category: 'Beds', price: 79000  },
  { id: 31, name: 'Sony King Bed',             image: '/beds/Sony_King_Bed.jpg',                category: 'Beds', price: 76000  },
  { id: 32, name: 'Haven King Bed',            image: '/beds/Haven_King_Bed.jpg',               category: 'Beds', price: 84000  },
  { id: 33, name: 'Aria King Bed',             image: '/beds/Aria_King_Bed.jpg',                category: 'Beds', price: 86000  },
  { id: 34, name: 'Orlov King Bed',            image: '/beds/Orlov_King_Bed.jpg',               category: 'Beds', price: 91000  },
  { id: 35, name: 'Nelson King Bed',           image: '/beds/Nelson_King_Bed.jpg',              category: 'Beds', price: 88000  },
  { id: 36, name: 'Daisy King Bed',            image: '/beds/Daisy_King_Bed.jpg',               category: 'Beds', price: 87000  },
  { id: 37, name: 'Lexus King Bed',            image: '/beds/Lexus_King_Bed.jpg',               category: 'Beds', price: 93000  },
  { id: 38, name: 'London PLM King Bed',       image: '/beds/London_PLM_King_Bed.jpg',          category: 'Beds', price: 97000  },
  { id: 39, name: 'Armour 1 King Bed',         image: '/beds/Armour_1_King_Bed.jpg',            category: 'Beds', price: 89000  },
  { id: 40, name: 'Armour 3 King Bed',         image: '/beds/Armour_3_King_Bed.jpg',            category: 'Beds', price: 91000  },
  { id: 41, name: 'Armour 1 Queen Bed',        image: '/beds/Armour_1_Queen_Bed.jpg',           category: 'Beds', price: 74000  },
  { id: 42, name: 'Berry PLM King Bed',        image: '/beds/Berry_PLM_King_Bed.jpg',           category: 'Beds', price: 95000  },
  { id: 43, name: 'AS 4 King Bed',             image: '/beds/AS_4_King_Bed.jpg',                category: 'Beds', price: 64000  },
  { id: 44, name: 'AS 6 King Bed',             image: '/beds/AS_6_King_Bed.jpg',                category: 'Beds', price: 68000  },
  { id: 45, name: 'DS 1 King Bed 1',           image: '/beds/DS_1_King_Bed_1.jpg',              category: 'Beds', price: 51000  },
];

// ── Bedside Tables ──
const bedSideTablesData = [
  { id: 1,  name: 'Classic Bed Side Table',      image: '/bedside-tables/Classic Side Table.jpg',          category: 'Bedside Tables', price: 8500  },
  { id: 2,  name: 'ES 1 Bed Side Table',         image: '/bedside-tables/ES-1 Bed Side Table.jpg',         category: 'Bedside Tables', price: 9200  },
  { id: 3,  name: 'Delonix Bed Side Table',      image: '/bedside-tables/Delonix Bed Side Table.jpg',      category: 'Bedside Tables', price: 10500 },
  { id: 4,  name: 'Austria Bed Side Table',      image: '/bedside-tables/Austria Bed Side TAble.jpg',      category: 'Bedside Tables', price: 11000 },
  { id: 5,  name: 'Korvy Bed Side Table',        image: '/bedside-tables/Korvy Bed Side Table.jpg',        category: 'Bedside Tables', price: 11000 },
  { id: 6,  name: 'Ambely Bed Side Table',       image: '/bedside-tables/Ambely Bed Side Table.jpg',       category: 'Bedside Tables', price: 11000 },
  { id: 7,  name: 'Arena Bed Side Table',        image: '/bedside-tables/Arena Bed Side Table.jpg',        category: 'Bedside Tables', price: 11000 },
  { id: 8,  name: 'Kosovo Bed Side Table',       image: '/bedside-tables/Kosovo Bed Side Table.jpg',       category: 'Bedside Tables', price: 10000 },
  { id: 9,  name: 'Vienna Bed Side Table',       image: '/bedside-tables/Vienna Bed Side Table.jpg',       category: 'Bedside Tables', price: 9500  },
  { id: 10, name: 'Madrid Bed Side Table',       image: '/bedside-tables/Madrid Bed Side Table.jpg',       category: 'Bedside Tables', price: 10500 },
  { id: 11, name: 'Aria Bed Side Table',         image: '/bedside-tables/Aria Bed Side Table.jpg',         category: 'Bedside Tables', price: 12000 },
  { id: 12, name: 'Nelson Bed Side Table',       image: '/bedside-tables/Nelson Bed Side Table.jpg',       category: 'Bedside Tables', price: 11500 },
  { id: 13, name: 'Lexus Bed Side Table',        image: '/bedside-tables/Lexus Bed Side Table.jpg',        category: 'Bedside Tables', price: 14500 },
  { id: 14, name: 'London Bed Side Table',       image: '/bedside-tables/London Bed Side Table.jpg',       category: 'Bedside Tables', price: 13500 },
  { id: 15, name: 'Berry Ignoo Bed Side Table',  image: '/bedside-tables/Berry Ignoo Bed Side Table.jpg',  category: 'Bedside Tables', price: 13000 },
  { id: 16, name: 'Vesta Bed Side Table',        image: '/bedside-tables/Vesta Bed Side Table.jpg',        category: 'Bedside Tables', price: 14000 },
];

// ── Recliners ──
const reclinersNavData = [
  { id: 1,  name: 'ELIO Half Leather Electric Recliner',               image: '/recliners/ELIO HALF LEATHER ELECTRIC RECLINER.jpg',                              category: 'Recliner Sofa', price: 42000  },
  { id: 2,  name: 'ELIO Half Leather 3-Seater Electric Recliner',      image: '/recliners/ELIO HALF LEATHER 3STR ELECTRIC RECLINER.jpg',                          category: 'Recliner Sofa', price: 98000  },
  { id: 3,  name: 'Levanto Half Leather Zero Wall Recliner Ocean Blue', image: '/recliners/Levanto Half Leather Zero Wall Electric Recliner  Ocean Blue.jpg',      category: 'Recliner Sofa', price: 48000  },
  { id: 4,  name: 'Levanto Half Leather Zero Wall Recliner Slate Grey', image: '/recliners/Levanto Half Leather Zero Wall Electric Recliner Slate Grey.jpg',       category: 'Recliner Sofa', price: 48000  },
  { id: 5,  name: 'Haven Leatherette Manual Recliner 3 Seater',        image: '/recliners/Haven Leatherette Manual Recliner  3 Seater  Dark Brown.jpg',            category: 'Recliner Sofa', price: 68000  },
  { id: 6,  name: 'QUANTUM Half Leather 3S Recliner Light Grey',       image: '/recliners/QUANTUM HALF LEATHER 3S RECLINER LT GREY.jpg',                           category: 'Recliner Sofa', price: 88000  },
  { id: 7,  name: 'Bradford Electric Fabric Recliner Beige',           image: '/recliners/BRADFORD 1S ELEC FABRIC REC BEIGE ELITE (2).jpg',                        category: 'Recliner Sofa', price: 38000  },
  { id: 8,  name: 'RIO Fabric Rocker Recliner Brown',                  image: '/recliners/RIO FABRIC 1 STR ROCKER RECLINER BROWN.jpg',                             category: 'Recliner Sofa', price: 28000  },
  { id: 9,  name: 'Charles Half Leather 3-Seater Recliner Brown',      image: '/recliners/Charles Half Leather Three Seater Recliner.jpg',                         category: 'Recliner Sofa', price: 82000  },
  { id: 10, name: 'Emilia Half Leather 3-Seater Electric Recliner',    image: '/recliners/Emilia Half Leather Three seater Electric Recliner.jpg',                 category: 'Recliner Sofa', price: 105000 },
  { id: 11, name: 'Zenora Double Electric Recliner Brown',             image: '/recliners/Zenora 1 Seater Double Electric Recliner Sofa-BROWN.jpg',                 category: 'Recliner Sofa', price: 56000  },
  { id: 12, name: 'Plush 3-Seater Leather Electric Recliner Burgundy', image: '/recliners/Plush 3 Seater Leather Electric Recliner Sofa-BURGUNDY.jpg',             category: 'Recliner Sofa', price: 115000 },
];

// ── Mattress ──
const mattressNavData = [
  { id: 1,  name: 'Club Class Grande Pocket Spring King Mattress',         image: '/mattress/Club Class Grande Pocket Spring King Mattress in White Colour - 78x72x6 Inch.jpg',                category: 'Mattress', price: 28500 },
  { id: 2,  name: 'Club Class Grande Pocket Spring Single Mattress',       image: '/mattress/Club Class Grande Pocket Spring Single Mattress in White Colour - 75x36x8 Inch.jpg',              category: 'Mattress', price: 14500 },
  { id: 3,  name: 'Club Class Natura Orthopedic Pocket Spring Queen Mattress', image: '/mattress/Club Class Natura Orthopedic Pocket Spring Queen Mattress for Back Pain in Grey Colour - 72x60x8 Inch.jpg', category: 'Mattress', price: 24500 },
  { id: 4,  name: 'Dreamer Orthopedic Dual Comfort Memory Foam Mattress',  image: '/mattress/Dreamer Orthopedic 3 Layered Dual Comfort 8 Inch Memory & HR Foam Mattress In King Size.jpg',    category: 'Mattress', price: 18500 },
  { id: 5,  name: 'Dual Roll Back Reversible HR Foam King Mattress',       image: '/mattress/Dual Roll Back Reversible 6 Inch HR Foam King Size Mattress.jpg',                                category: 'Mattress', price: 11500 },
  { id: 6,  name: 'FLIP Dual Comfort Foam King Mattress',                  image: '/mattress/FLIP Dual Comfort Hard & Soft Roll Packed 6 Inch Foam Mattress In King Size.jpg',                category: 'Mattress', price: 10500 },
  { id: 7,  name: 'Hemp Organic Orthopedic Memory Foam King Mattress',     image: '/mattress/Hemp Organic Orthopedic 10 inch Memory Foam King Size Mattress.jpg',                             category: 'Mattress', price: 32000 },
  { id: 8,  name: 'Original BodyIQ Memory Foam King Mattress',             image: '/mattress/Original BodyIQ 8 inch Memory Foam King Size Mattress.jpg',                                      category: 'Mattress', price: 22000 },
  { id: 9,  name: 'Restonic Carousel Pocket Spring King Mattress',         image: '/mattress/Restonic Carousel Pocket Spring King Mattress in Cream Colour - 78x72x6 Inch.jpg',               category: 'Mattress', price: 26000 },
  { id: 10, name: 'Sleepables Orthopedic Memory Foam King Mattress',       image: '/mattress/Sleepables Orthopedic 8 Inch Memory Foam & HR Foam mattress In King Size Inches.jpg',            category: 'Mattress', price: 19500 },
  { id: 11, name: 'Spine Guard Bonnel Spring Queen Mattress',              image: '/mattress/Spine Guard Bonnel Spring Queen Mattress for Back Pain in Grey Colour - 78x60x8 Inch.jpg',        category: 'Mattress', price: 17500 },
  { id: 12, name: 'Springkoil Bonnel Spring Queen Mattress',               image: '/mattress/Springkoil Bonnel Spring Queen Mattress in Maroon Colour - 78x60x10 Inch.jpg',                   category: 'Mattress', price: 21000 },
  { id: 13, name: 'Truben Pinhole Latex Foam King Mattress',               image: '/mattress/Truben Pinhole Latex Foam 10 Inches King Size Mattress.jpg',                                     category: 'Mattress', price: 35000 },
];

// ── Coffee Tables ──
const coffeeTableNavData = [
  { id: 1,  name: 'Antwerp Center Table in Sheesham Colour',              image: '/coffee-tables/Antwerp Center Table in Sheesham Colour.jpg',                                          category: 'Coffee Table', price: 18500 },
  { id: 2,  name: 'Antwerp Sheesham Wood Center Table with Black Glass',  image: '/coffee-tables/Antwerp Sheesham Wood Center Table with Black Glass Top in Sheesham Colour.jpg',       category: 'Coffee Table', price: 16500 },
  { id: 3,  name: 'Cady Metal Nesting Coffee Table Set In Black',         image: '/coffee-tables/Cady Metal Nesting Coffee Table Set In Black Finish (Set of 2).jpg',                  category: 'Coffee Table', price: 22000 },
  { id: 4,  name: 'Christine Marble Top Center Table with Two Stools',    image: '/coffee-tables/Christine Marble Top Center Table with Two Stools in Brown Colour.jpg',               category: 'Coffee Table', price: 32000 },
  { id: 5,  name: 'Elvas S Metal Round Nesting Coffee Table Gold',        image: '/coffee-tables/Elvas S Metal Round Nesting Coffee Table Set In Gold Finish with White Porcelain Top (Set of 2).jpg', category: 'Coffee Table', price: 25500 },
  { id: 6,  name: 'Giove Marble & Iron Center Table White & Gold',        image: '/coffee-tables/Giove Marble & Iron Center Table in White & Gold Colour.jpg',                         category: 'Coffee Table', price: 38000 },
  { id: 7,  name: 'GLACIA 4 Seater Marble Finish Dining Table',           image: '/coffee-tables/GLACIA 4 STR MARBLE FINISH DINING TABLE.jpg',                                         category: 'Coffee Table', price: 28000 },
  { id: 8,  name: 'GLAMORA Marble Top 6 Seater Dining Table',             image: '/coffee-tables/GLAMORA MARBLE TOP 6 STR DINING TABLE.jpg',                                           category: 'Coffee Table', price: 42000 },
  { id: 9,  name: 'Luxe Coffee Table in White and Gold Colour',           image: '/coffee-tables/Luxe Coffee Table in White and Gold Colour.jpg',                                       category: 'Coffee Table', price: 19500 },
  { id: 10, name: 'Manastir Coffee Table Set Panther Marble',             image: '/coffee-tables/Manastir Coffee Table Set In Natural Finish With Panther Marble Top (Set of 3 ).jpg', category: 'Coffee Table', price: 45000 },
  { id: 11, name: 'Maysville Glass Top Center Table Walnut',              image: '/coffee-tables/Maysville Glass Top Center Table in Walnut Colour.jpg',                               category: 'Coffee Table', price: 17500 },
  { id: 12, name: 'Modern Marble Top Nesting Coffee Table Gold Finish',   image: '/coffee-tables/Modern Marble Top Nesting Coffee Table In Gold Finish.jpg',                           category: 'Coffee Table', price: 21000 },
  { id: 13, name: 'OREN Sintered Stone Top Coffee Table',                 image: '/coffee-tables/OREN SINTERED STONE TOP COFFEE TABLE.jpg',                                            category: 'Coffee Table', price: 26000 },
  { id: 14, name: 'Ryleigh Metal Nesting Coffee Table Set Brown',         image: '/coffee-tables/Ryleigh Metal Nesting Coffee Table Set in Brown Finish.jpg',                          category: 'Coffee Table', price: 34000 },
  { id: 15, name: 'Square Marble Nesting Coffee Table Black & Gold',      image: '/coffee-tables/Square Marble Nesting Coffee Table In Black & Matt Gold Finish (Set of 2).jpg',       category: 'Coffee Table', price: 23000 },
];

// ── Dining Furniture ──
const diningNavData = [
  { id: 'dn1',  name: 'CARDIFF ELITE 4 Seater Round Dining Set',     image: '/dining/CARDIFF ELITE 4 SEATER ROUND DINING SET.jpg',                                                                         category: 'Dining Furniture', price: 42000  },
  { id: 'dn2',  name: 'DILUX CERAMIC TOP 4 Seater Dining Set',       image: '/dining/DILUX CERAMIC TOP 4 SEATER DINING SET.jpg',                                                                           category: 'Dining Furniture', price: 68000  },
  { id: 'dn3',  name: 'AMIRA CERAMIC TOP 6 Seater Dining Set',       image: '/dining/AMIRA CERAMIC TOP 6 SEATER DINING SET.jpg',                                                                           category: 'Dining Furniture', price: 88000  },
  { id: 'dn4',  name: 'ASTERIA MARBLE TOP 6 Seater Dining Table',    image: '/dining/ASTERIA MARBLE TOP 6 STR DINING TABLE.jpg',                                                                           category: 'Dining Furniture', price: 72000  },
  { id: 'dn5',  name: 'Austin Dining Table Set 8 Seater',            image: '/dining/Austin Dining Table Set 8 Seater In Brown.jpg',                                                                       category: 'Dining Furniture', price: 145000 },
  { id: 'dn6',  name: 'NEROVA MARBLE FINISH 6 Seater Dining Set',    image: '/dining/NEROVA MARBLE FINISH 6STR DINNING SET.jpg',                                                                           category: 'Dining Furniture', price: 118000 },
  { id: 'dn7',  name: 'OREN SINTERED STONE 6 Seater Dining Set',     image: '/dining/OREN SINTERED STONE 6 STR DINING SET.jpg',                                                                            category: 'Dining Furniture', price: 105000 },
  { id: 'dn8',  name: 'Fablo Marble Top 6 Seater Dining Set',        image: '/dining/Fablo Marble Top 6 Seater Dining Set With Bench.jpg',                                                                 category: 'Dining Furniture', price: 78000  },
  { id: 'dn9',  name: 'GLACIA 4 Seater Marble Finish Dining Table',  image: '/dining/GLACIA 4 STR MARBLE FINISH DINING TABLE.jpg',                                                                         category: 'Dining Furniture', price: 38000  },
  { id: 'dn10', name: 'WAVYNOX Sintered Stone 6 Seater Table',       image: '/dining/WAVYNOX SINTERED STONE 6STR DINING TABLE.jpg',                                                                        category: 'Dining Furniture', price: 72000  },
  { id: 'dn11', name: 'Travertine 4 Seater Marble Dining Table',     image: '/dining/Travertine 4 Seater Marble Dining Table With Solid Fluted Base In Beige Colour.jpg',                                  category: 'Dining Furniture', price: 95000  },
  { id: 'dn12', name: 'Alamo Sheesham Wood Dining Chairs',           image: '/dining/Alamo Sheesham Wood Dining Chairs In Scratch Resistant Provincial Teak Finish (Set Of 2).jpg',                        category: 'Dining Furniture', price: 18500  },
  { id: 'dn13', name: 'NEROVA Swivel Dining Chair Set of 2',         image: '/dining/NEROVA SWIVEL DINING CHAIR SET OF 2 BROWN.jpg',                                                                       category: 'Dining Furniture', price: 28000  },
  { id: 'dn14', name: 'GLAMORA Dining Chair Set of 2 Dark Grey',     image: '/dining/GLAMORA DINING CHAIR SET OF 2 DARK GREY.jpg',                                                                         category: 'Dining Furniture', price: 24000  },
];

// ── Sofa Sets ──
const sofaNavData = [
  { id: 1,  name: 'Bombay Brown (3 Seater)',                          image: '/sofas/Bombay-brown-3.jpg',                                                             category: 'Sofa Set', price: 42000  },
  { id: 2,  name: 'Bingo Fabric 3 Seater Sofa (Grey)',                image: '/sofas/bingo-fabric-3-seater-sofa-in-grey-colour-bingo-fabric-3-seater-sofa-in-grey-colour-2timof.jpg', category: 'Sofa Set', price: 28000  },
  { id: 3,  name: 'ALEXA ELITE Half Leather Sofa (Beige)',            image: '/sofas/ALEXA ELITE HALF LEATHER BEIGE.jpg',                                             category: 'Sofa Set', price: 58000  },
  { id: 4,  name: 'ELOWEN Fabric Sofa Steel Grey (2 Seater)',         image: '/sofas/ELOWEN FABRIC SOFA STEEL GREY.jpg',                                              category: 'Sofa Set', price: 22000  },
  { id: 5,  name: 'ELOWEN Fabric 3 Seater Sofa Steel Grey',          image: '/sofas/ELOWEN FABRIC 3 SEATER SOFA STEEL GREY.jpg',                                     category: 'Sofa Set', price: 32000  },
  { id: 6,  name: 'KINGS Fabric Sofa Beige & Gold',                   image: '/sofas/KINGS FABRIC SOFA BEIGE & GOLD.jpg',                                             category: 'Sofa Set', price: 48000  },
  { id: 7,  name: 'Hazel Fabric Sofa (Beige)',                        image: '/sofas/Hazel Fabric Sofa Beige.jpg',                                                    category: 'Sofa Set', price: 38000  },
  { id: 8,  name: 'Magnific Velvet Sofa',                             image: '/sofas/Magnific Velvet Sofa.jpg',                                                       category: 'Sofa Set', price: 45000  },
  { id: 9,  name: 'Grace Fabric Sofa',                                image: '/sofas/Grace Fabric Sofa.jpg',                                                         category: 'Sofa Set', price: 35000  },
  { id: 10, name: 'Garcia Fabric Sofa (Single Seater)',               image: '/sofas/Garcia Fabric Sofa.jpg',                                                        category: 'Sofa Set', price: 18000  },
  { id: 11, name: 'Garcia Fabric Three Seater Sofa',                  image: '/sofas/Garcia Fabric Three Seater Sofa.jpg',                                           category: 'Sofa Set', price: 38000  },
  { id: 12, name: 'Garcia Fabric Two Seater Sofa',                    image: '/sofas/Garcia Fabric Two Seater Sofa.jpg',                                             category: 'Sofa Set', price: 28000  },
  { id: 13, name: 'Legacy (3+2+2) Sofa Set',                          image: '/sofas/Legacy (3+2+2) Sofa Set.jpg',                                                   category: 'Sofa Set', price: 88000  },
  { id: 14, name: 'LAVISTA Sofa Bed (Brown)',                         image: '/sofas/LAVISTA SOFA BED BROWN.jpg',                                                    category: 'Sofa Set', price: 36000  },
  { id: 15, name: 'Paddington 3 Seater Sofa (Grey)',                  image: '/sofas/Paddington 3 Seater Sofa in Grey 100% Polyester Fabric.jpg',                    category: 'Sofa Set', price: 42000  },
  { id: 16, name: 'Riga Lyra 3 Seater Sofa (Grey Velvet)',            image: '/sofas/Riga Lyra 3 Seater Sofa in Grey Velvet Upholstery Fabric.jpg',                  category: 'Sofa Set', price: 55000  },
  { id: 17, name: 'Riga Lyra Single Seater Sofa (Dark Grey Velvet)',  image: '/sofas/Riga Lyra Single Seater Sofa in Dark Grey Velvet Upholstery Fabric.jpg',         category: 'Sofa Set', price: 24000  },
  { id: 18, name: 'Riga Lyra 2 Seater Sofa (Brown Velvet)',           image: '/sofas/Riga Lyra 2 Seater Sofa in Brown Velvet Upholstery Fabric.jpg',                 category: 'Sofa Set', price: 36000  },
  { id: 19, name: 'Perth Fabric Two Seater Sofa (Beige)',             image: '/sofas/Perth Fabric Two Seater Sofa in Beige Colour.jpg',                              category: 'Sofa Set', price: 32000  },
  { id: 20, name: 'Perth Fabric Three Seater Sofa (Beige)',           image: '/sofas/Perth Fabric Three Seater Sofa in Beige Colour.jpg',                            category: 'Sofa Set', price: 42000  },
  { id: 21, name: 'Arizona 3 Seater Sofa (Beige & Chenille)',         image: '/sofas/Arizona 3 Seater Sofa Set in Beige & Colour Chenille fabric.jpg',               category: 'Sofa Set', price: 38000  },
  { id: 22, name: 'ALABASTER Half Leather Sofa (2 Seater)',           image: '/sofas/ALABASTER HALF LEATHER SOFA 2 seater.jpg',                                      category: 'Sofa Set', price: 52000  },
  { id: 23, name: 'ALABASTER Half Leather Sofa (3 Seater)',           image: '/sofas/ALABASTER HALF LEATHER SOFA 3 seater.jpg',                                      category: 'Sofa Set', price: 68000  },
  { id: 24, name: 'Elise Velvet Fabric Sofa',                         image: '/sofas/Elise Velvet Fabric Sofa.jpg',                                                  category: 'Sofa Set', price: 48000  },
  { id: 25, name: 'Valentina Fabric Sofa (Walnut)',                   image: '/sofas/Valentina Fabric Sofa In Walnut.jpg',                                           category: 'Sofa Set', price: 58000  },
  { id: 26, name: 'Thames Fabric Sofa (Beige)',                       image: '/sofas/Thames Fabric Sofa In Beige Color.jpg',                                         category: 'Sofa Set', price: 45000  },
  { id: 27, name: 'Siam Solidwood Sofa (Beige)',                      image: '/sofas/Siam Solidwood Sofa In Beige Color.jpg',                                        category: 'Sofa Set', price: 72000  },
  { id: 28, name: 'Riga Fabric Sofa (Beige)',                         image: '/sofas/Riga Fabric Sofa In Beige Color.jpg',                                           category: 'Sofa Set', price: 42000  },
  { id: 29, name: 'Plume Velvet Fabric Sofa (Brown)',                 image: '/sofas/Plume Velvet Fabric Sofa In Brown Color.jpg',                                   category: 'Sofa Set', price: 46000  },
  { id: 30, name: 'Malta 1 Seater Sofa (Brown)',                      image: '/sofas/Malta 1 Seater Sofa Set In Brown Color.jpg',                                    category: 'Sofa Set', price: 18000  },
  { id: 31, name: 'Hercules Sofa (Beige)',                            image: '/sofas/Hercules Sofa In Beige Color.jpg',                                              category: 'Sofa Set', price: 78000  },
  { id: 32, name: 'Haku Fabric Sofa (Grey)',                          image: '/sofas/Haku Fabric Sofa In Grey Color.jpg',                                            category: 'Sofa Set', price: 38000  },
  { id: 33, name: 'Genova Leatherette Sofa (Tan)',                    image: '/sofas/Genova Leatherette Sofa In Tan Color.jpg',                                      category: 'Sofa Set', price: 65000  },
  { id: 34, name: 'Bellrose Velvet Fabric Sofa (Brown)',              image: '/sofas/Bellrose Velvet Fabric Sofa In Brown Color.jpg',                                category: 'Sofa Set', price: 48000  },
  { id: 35, name: 'Asher Fabric Sofa (Grey)',                         image: '/sofas/Asher Fabric Sofa In Grey Color.jpg',                                           category: 'Sofa Set', price: 32000  },
  { id: 36, name: 'Audi L Shape Sofa',                                image: '/sofas/Audi L Shape Sofa.jpg',                                                         category: 'L Shape Sofa', price: 95000  },
  { id: 37, name: 'CAIRO (3+2)',                                       image: '/sofas/CAIRO (3+2).jpg',                                                               category: 'Sofa Set', price: 72000  },
  { id: 38, name: 'ARROW 3S',                                          image: '/sofas/ARROW 3S.jpg',                                                                  category: 'Sofa Set', price: 35000  },
  { id: 39, name: 'Reno L Shape Sofa',                                image: '/sofas/Reno-L-Shape.jpg',                                                              category: 'L Shape Sofa', price: 88000  },
  { id: 40, name: 'Cappuccino L Shape Sofa',                          image: '/sofas/Cappuccino L Shape Sofa.jpg',                                                   category: 'L Shape Sofa', price: 82000  },
  { id: 41, name: 'Harley L Shape & Divider Sofa',                    image: '/sofas/Harley L Shape & Divider Sofa.jpg',                                             category: 'L Shape Sofa', price: 115000 },
  { id: 42, name: 'Flair (3+2+2)',                                     image: '/sofas/Flair (3+2+2).jpg',                                                             category: 'Sofa Set', price: 95000  },
  { id: 43, name: 'Caffino L Shape (3+2+Corner+2 Round Chair)',        image: '/sofas/Caffino L Shape (3+2+CORNER+2 ROUND CHAIR).jpg',                                category: 'L Shape Sofa', price: 125000 },
  { id: 44, name: 'Ontario (3+1+1) Sofa Set',                         image: '/sofas/Ontario (3+1+1) Sofa Set.jpg',                                                  category: 'Sofa Set', price: 0      },
  { id: 45, name: 'Oyster (3+2+2) Sofa Set',                          image: '/sofas/Oyster (3+2+2) Sofa Set.jpg',                                                   category: 'Sofa Set', price: 0      },
  { id: 46, name: 'TURKEY (3+2)',                                      image: '/sofas/TURKEY (3+2).jpg',                                                              category: 'Sofa Set', price: 0      },
];

// ── Custom Wardrobe ──
const customWardrobeNavData = [
  { id: 'cw1',  name: 'Utsav 4 Door Wardrobe in Wenge Finish',                                       image: '/wardrobes/Utsav 4 door wardrobe in Wenge Finish.jpg',                                           category: 'Custom Wardrobe', price: 26999 },
  { id: 'cw2',  name: 'Allen Plus 4 Door Wardrobe with Mirror White',                                 image: '/wardrobes/ALLEN PLUS 4 DOOR WARDROBE WITH MIRROR WHITE.jpg',                                    category: 'Custom Wardrobe', price: 23999 },
  { id: 'cw3',  name: 'Willy Plus 3 Door Wardrobe Walnut',                                            image: '/wardrobes/WILLY PLUS 3 DOOR WARDROBE WALNUT.jpg',                                               category: 'Custom Wardrobe', price: 14999 },
  { id: 'cw4',  name: 'Archer Three Door Wardrobe Walnut',                                            image: '/wardrobes/Archer Three door Wardrobe in Walnut Colour.jpg',                                     category: 'Custom Wardrobe', price: 21900 },
  { id: 'cw5',  name: 'Tiago Engineered Wood Three Door Wardrobe Wenge',                              image: '/wardrobes/Tiago Engineered Wood Three Door Wardrobe in Wenge Colour.jpg',                       category: 'Custom Wardrobe', price: 25900 },
  { id: 'cw6',  name: 'Kibo 2 Door Wardrobe Lyon Walnut With Drawer',                                 image: '/wardrobes/Kibo 2 Door Wardrobe In Lyon Walnut Finish With Drawer.jpg',                          category: 'Custom Wardrobe', price: 18500 },
  { id: 'cw7',  name: 'Maya 2 Door Wardrobe Wenge Finish',                                            image: '/wardrobes/Maya 2 Door Wardrobe In Wenge Finish.jpg',                                            category: 'Custom Wardrobe', price: 16500 },
  { id: 'cw8',  name: 'Kibo 3 Door Wardrobe Lyon Walnut With Drawer Adjustable Shelves Mirror',       image: '/wardrobes/Kibo 3 Door Wardrobe In Lyon Walnut Finish With Drawer& Adjustable Shelves & Mirror.jpg', category: 'Custom Wardrobe', price: 28500 },
  { id: 'cw9',  name: 'Milford 3 Door Wardrobe Urban Teak Finish',                                    image: '/wardrobes/Milford 3 Door Wardrobe in Urban Teak Finish.jpg',                                    category: 'Custom Wardrobe', price: 22500 },
  { id: 'cw10', name: 'Kosmo Flexton 3 Door Wardrobe Modern Ash Natural Teak With Drawer',            image: '/wardrobes/Kosmo Flexton 3 Door Wardrobe In Modern Ash & Natural Teak Finish With Drawer.jpg',   category: 'Custom Wardrobe', price: 24500 },
  { id: 'cw11', name: 'Abran 4 Door Wardrobe with Mirror Locker High Gloss White',                    image: '/wardrobes/Abran 4 Door Wardrobe With Mirror & Locker In High Gloss White Finish.jpg',            category: 'Custom Wardrobe', price: 38999 },
];

// ── TV Panel / Unit ──
const tvPanelNavData = [
  { id: 1,  name: 'Skiddo TV Unit In Brown Maple & White Finish For TV Upto 50 Inch',          image: '/tv-panel/Skiddo TV Unit In Brown Maple & White Finish For TV Upto 50 Inch.jpg',          category: 'TV Unit', price: 18500 },
  { id: 2,  name: 'Segur Sheesham Wood TV Console In Provincial Teak Finish For TVs Up To 55', image: '/tv-panel/Segur Sheesham Wood TV Console In Provincial Teak Finish For TVs Up To 55.jpg', category: 'TV Unit', price: 32000 },
  { id: 3,  name: 'Piccadilly Sheesham Wood Tv Unit In Dual Tone Finish',                       image: '/tv-panel/Piccadilly Sheesham Wood Tv Unit In Dual Tone Finish.jpg',                       category: 'TV Unit', price: 36000 },
  { id: 4,  name: 'Radiant Tv Console In Columbian Walnut Finish',                              image: '/tv-panel/Radiant Tv Console In Columbian Walnut Finish.jpg',                              category: 'TV Unit', price: 27500 },
  { id: 5,  name: "Muar Tv Unit In Black And Brown Color For Tv's Upto 55",                    image: "/tv-panel/Muar Tv Unit In Black And Brown Color For Tv'S Upto 55.jpg",                    category: 'TV Unit', price: 55000 },
  { id: 6,  name: 'Marin Tv Unit In Dual Finish For Tvs Up To 60',                             image: '/tv-panel/Marin Tv Unit In Dual Finish For Tvs Up To 60.jpg',                             category: 'TV Unit', price: 42000 },
  { id: 7,  name: 'Verona TV Unit in White Finish',                                             image: '/tv-panel/Verona TV Unit in White Finish.jpg',                                             category: 'TV Unit', price: 22000 },
  { id: 8,  name: 'Aurello TV Unit in White Finish',                                            image: '/tv-panel/Aurello TV Unit in White Finish.jpg',                                            category: 'TV Unit', price: 24000 },
  { id: 9,  name: 'Striado TV Unit in Walnut',                                                  image: '/tv-panel/Striado TV Unit in Walnut.jpg',                                                  category: 'TV Unit', price: 21000 },
  { id: 10, name: 'HexaLuxe TV Unit in Walnut Finish',                                          image: '/tv-panel/HexaLuxe TV Unit in Walnut finsh.jpg',                                           category: 'TV Unit', price: 26500 },
  { id: 11, name: 'Texas American Tv Unit In Black Finish',                                     image: '/tv-panel/Texas American Tv Unit In Black Finish.jpg',                                     category: 'TV Unit', price: 35000 },
  { id: 12, name: "Genting TV Unit In Brown & Grey Finish for TV's Upto 55",                   image: "/tv-panel/Genting TV Unit In Brown & Grey Finish for TV's Upto 55.jpg",                   category: 'TV Unit', price: 72000 },
  { id: 13, name: 'Gotti TV Unit in Off White & Demolicao Finish for TVs up to 55',             image: '/tv-panel/Gotti TV Unit in Off White & Demolicao Finish for TVs up to 55.jpg',             category: 'TV Unit', price: 48000 },
  { id: 14, name: 'Gotti TV Unit in Glossy Black Finish for TVs up to 55',                     image: '/tv-panel/Gotti TV Unit in Glossy Black Finish for TVs up to 55.jpg',                     category: 'TV Unit', price: 46000 },
  { id: 15, name: 'Striado TV Unit in Walnut & White Finish',                                   image: '/tv-panel/Striado TV Unit in Walnut & White Finish.jpg',                                   category: 'TV Unit', price: 23000 },
];

// ── Merge all product pools (deduplicate by id) ──
const spwBedsNavData = [
  { id: 46,  name: 'Royce King Bed',               image: '/bed-sets/Royce.jpg',    category: 'Beds', price: 112998 },
  { id: 47,  name: 'Royce Queen Bed',              image: '/bed-sets/Royce.jpg',    category: 'Beds', price: 94264  },
  { id: 48,  name: 'Adore King Bed',               image: '/bed-sets/Adore.jpg',    category: 'Beds', price: 112998 },
  { id: 49,  name: 'Adore Queen Bed',              image: '/bed-sets/Adore.jpg',    category: 'Beds', price: 85264  },
  { id: 50,  name: 'Desire King Bed',              image: '/bed-sets/Desire.jpg',   category: 'Beds', price: 106998 },
  { id: 51,  name: 'Desire Queen Bed',             image: '/bed-sets/Desire.jpg',   category: 'Beds', price: 85264  },
  { id: 52,  name: 'Morgan King Bed',              image: '/bed-sets/Morgan.jpg',   category: 'Beds', price: 108778 },
  { id: 53,  name: 'Morgan Queen Bed',             image: '/bed-sets/Morgan.jpg',   category: 'Beds', price: 92485  },
  { id: 54,  name: 'Akira King Bed',               image: '/bed-sets/Akira.jpg',    category: 'Beds', price: 109996 },
  { id: 55,  name: 'Akira Queen Bed',              image: '/bed-sets/Akira.jpg',    category: 'Beds', price: 89064  },
  { id: 56,  name: 'Artisan King Bed',             image: '/bed-sets/Artisan.jpg',  category: 'Beds', price: 103730 },
  { id: 57,  name: 'Artisan Queen Bed',            image: '/bed-sets/Artisan.jpg',  category: 'Beds', price: 87574  },
  { id: 58,  name: 'Jupiter King Bed',             image: '/bed-sets/Jupiter.jpg',  category: 'Beds', price: 114304 },
  { id: 59,  name: 'Jupiter Queen Bed',            image: '/bed-sets/Jupiter.jpg',  category: 'Beds', price: 94811  },
  { id: 60,  name: 'Nora King Bed',                image: '/bed-sets/Nora.jpg',     category: 'Beds', price: 96286  },
  { id: 61,  name: 'Nora Queen Bed',               image: '/bed-sets/Nora.jpg',     category: 'Beds', price: 85250  },
  { id: 62,  name: 'Alaska King Bed',              image: '/bed-sets/Alaska.jpg',   category: 'Beds', price: 99098  },
  { id: 63,  name: 'Alaska Queen Bed',             image: '/bed-sets/Alaska.jpg',   category: 'Beds', price: 83611  },
  { id: 64,  name: 'Sahara King Bed',              image: '/bed-sets/Sahara.jpg',   category: 'Beds', price: 84042  },
  { id: 65,  name: 'Sahara Queen Bed',             image: '/bed-sets/Sahara.jpg',   category: 'Beds', price: 69455  },
  { id: 66,  name: 'Gloria King Bed',              image: '/bed-sets/Gloria.jpg',   category: 'Beds', price: 86411  },
  { id: 67,  name: 'Gloria Queen Bed',             image: '/bed-sets/Gloria.jpg',   category: 'Beds', price: 74957  },
  { id: 68,  name: 'Pearl King Bed',               image: '/bed-sets/Pearl.jpg',    category: 'Beds', price: 93250  },
  { id: 69,  name: 'Pearl Queen Bed',              image: '/bed-sets/Pearl.jpg',    category: 'Beds', price: 74877  },
  { id: 70,  name: 'Alina King Bed',               image: '/bed-sets/Alina.jpg',    category: 'Beds', price: 71284  },
  { id: 71,  name: 'Alina Queen Bed',              image: '/bed-sets/Alina.jpg',    category: 'Beds', price: 66580  },
  { id: 72,  name: 'Boston King Bed',              image: '/bed-sets/Boston.jpg',   category: 'Beds', price: 93517  },
  { id: 73,  name: 'Boston Queen Bed',             image: '/bed-sets/Boston.jpg',   category: 'Beds', price: 77113  },
  { id: 74,  name: 'Amazon King Bed',              image: '/bed-sets/Amazon.jpg',   category: 'Beds', price: 105860 },
  { id: 75,  name: 'Amazon Queen Bed',             image: '/bed-sets/Amazon.jpg',   category: 'Beds', price: 89764  },
  { id: 76,  name: 'Maple King Bed',               image: '/bed-sets/Maple.jpg',    category: 'Beds', price: 84460  },
  { id: 77,  name: 'Maple Queen Bed',              image: '/bed-sets/Maple.jpg',    category: 'Beds', price: 65373  },
  { id: 78,  name: 'Monarch King Bed',             image: '/bed-sets/Monarch.jpg',  category: 'Beds', price: 67375  },
  { id: 79,  name: 'Monarch Queen Bed',            image: '/bed-sets/Monarch.jpg',  category: 'Beds', price: 50066  },
  { id: 80,  name: 'Maximus King Bed',             image: '/bed-sets/Maximus.jpg',  category: 'Beds', price: 73450  },
  { id: 81,  name: 'Maximus Queen Bed',            image: '/bed-sets/Maximus.jpg',  category: 'Beds', price: 65620  },
  { id: 82,  name: 'Cleo King Bed',                image: '/bed-sets/Cleo.jpg',     category: 'Beds', price: 65001  },
  { id: 83,  name: 'Cleo Queen Bed',               image: '/bed-sets/Cleo.jpg',     category: 'Beds', price: 54548  },
  { id: 84,  name: 'Asta King Bed (Box Storage)',  image: '/bed-sets/Asta.jpg',     category: 'Beds', price: 45554  },
  { id: 85,  name: 'Asta Queen Bed (Box Storage)', image: '/bed-sets/Asta.jpg',     category: 'Beds', price: 40768  },
  { id: 86,  name: 'Asta King Bed (No Storage)',   image: '/bed-sets/Asta.jpg',     category: 'Beds', price: 40369  },
  { id: 87,  name: 'Asta Queen Bed (No Storage)',  image: '/bed-sets/Asta.jpg',     category: 'Beds', price: 36123  },
  { id: 88,  name: 'Nester King Bed',              image: '/bed-sets/Nester.jpg',   category: 'Beds', price: 58813  },
  { id: 89,  name: 'Nester Queen Bed',             image: '/bed-sets/Nester.jpg',   category: 'Beds', price: 52336  },
  { id: 90,  name: 'Nester King Bed (Pull-Out)',   image: '/bed-sets/Nester.jpg',   category: 'Beds', price: 56332  },
  { id: 91,  name: 'Nester Queen Bed (Pull-Out)',  image: '/bed-sets/Nester.jpg',   category: 'Beds', price: 50324  },
  { id: 92,  name: 'Carnival King Bed',            image: '/bed-sets/Carnival.jpg', category: 'Beds', price: 55228  },
  { id: 93,  name: 'Carnival Queen Bed',           image: '/bed-sets/Carnival.jpg', category: 'Beds', price: 50564  },
  { id: 94,  name: 'Carnival King Bed (Box)',      image: '/bed-sets/Carnival.jpg', category: 'Beds', price: 51562  },
  { id: 95,  name: 'Carnival Queen Bed (Box)',     image: '/bed-sets/Carnival.jpg', category: 'Beds', price: 47205  },
  { id: 96,  name: 'Comfy King Bed',               image: '/bed-sets/Comfy.jpg',    category: 'Beds', price: 58813  },
  { id: 97,  name: 'Comfy Queen Bed',              image: '/bed-sets/Comfy.jpg',    category: 'Beds', price: 50564  },
  { id: 98,  name: 'Eco King Bed',                 image: '/bed-sets/Eco.jpg',      category: 'Beds', price: 55636  },
  { id: 99,  name: 'Eco Queen Bed',                image: '/bed-sets/Eco.jpg',      category: 'Beds', price: 50819  },
];

const allProducts = [
  ...bedsData,
  ...spwBedsNavData,
  ...bedSideTablesData,
  ...reclinersNavData,
  ...mattressNavData,
  ...coffeeTableNavData,
  ...diningNavData,
  ...sofaNavData,
  ...tvPanelNavData,
  ...customWardrobeNavData,
  ...(featured || []).map(p => ({ ...p, category: p.category || 'Featured' })),
  ...(bestSellers || []).map(p => ({ ...p, category: p.category || 'Best Sellers' })),
];

const fmt = (n) => n > 0 ? `₹${n.toLocaleString('en-IN')}` : 'Price on Request';

// Category → page slug mapping
const categoryToSlug = {
  'Beds':             'beds',
  'Bed Sets':         'bed-sets',
  'Bedside Tables':   'bedside-tables',
  'Recliner Sofa':    'recliner-sofa',
  'Mattress':         'mattress',
  'Coffee Table':     'coffee-table',
  'Center Table':     'center-table',
  'Dining Furniture': 'dining-furniture',
  'Sofa Set':         'sofa-set',
  'L Shape Sofa':     'sofa-set',
  'TV Unit':          'tv-unit',
  'Custom Wardrobe':  'custom-wardrobe',
};

const announcements = [
  '✦  New Arrivals: Kaveri Teak Dining Series — Shop Now',
  '✦  Visit Our Showrooms in Bhubaneswar & Cuttack',
  '✦  Free Shipping on Orders Above ₹15,000',
];

const navLinks = [
  { label: 'New Arrivals', section: 'new-arrivals', isNewArrivals: true },
  {
    label: 'Living Room',
    section: 'categories',
    drop: ['Sofa Set', 'L Shape Sofa', 'Recliner Sofa', 'Center Table', 'TV Unit / TV Cabinet', 'Coffee Table', 'Side Table'],
    dropSlug: { 'Sofa Set': 'sofa-set', 'L Shape Sofa': 'l-shape-sofa', 'Recliner Sofa': 'recliner-sofa', 'Center Table': 'center-table', 'TV Unit / TV Cabinet': 'tv-unit', 'Coffee Table': 'coffee-table', 'Side Table': 'side-table' },
  },
  {
    label: 'Bedroom',
    section: 'categories',
    bedsInDrop: true,
    drop: ['Beds', 'Bed Sets', 'Wardrobe', 'Dressing Table', 'Bedside Tables', 'Mattress', 'Storage Bed'],
    dropSlug: { 'Bed Sets': 'bed-sets', 'Wardrobe': 'wardrobe', 'Dressing Table': 'dressing-table', 'Mattress': 'mattress', 'Storage Bed': 'storage-bed' },
  },
  {
    label: 'Dining',
    section: 'categories',
    drop: ['All Dining Sets'],
    dropSlug: { 'All Dining Sets': 'dining-furniture' },
  },
  {
    label: 'Customized',
    section: 'categories',
    drop: ['Modular Kitchen', 'Custom Wardrobe', 'TV Panel', 'Interior Furniture Design'],
    dropSlug: { 'Modular Kitchen': 'modular-kitchen', 'Custom Wardrobe': 'custom-wardrobe', 'TV Panel': 'tv-unit-1', 'Interior Furniture Design': 'interior-furniture-design' },
  },
  { label: 'Best Sellers', section: 'bestsellers' },
  { label: 'Sale', sale: true, section: 'bestsellers' },
];

const ANN_H  = 38;
const NAV_H  = 72;
const TOTAL_H = ANN_H + NAV_H;
export { ANN_H, NAV_H, TOTAL_H };

// Category label badge colors
const catColors = {
  'Beds':             '#6b4c2a',
  'Bed Sets':         '#8b5e2a',
  'Bedside Tables':   '#6b4c2a',
  'Mattress':         '#3d6b8a',
  'Sofa Set':         '#4a7c59',
  'L Shape Sofa':     '#4a7c59',
  'Recliner Sofa':    '#7c4a6b',
  'Coffee Table':     '#8a6b3d',
  'Dining Furniture': '#3d5c8a',
  'TV Unit':          '#5c3d8a',
  'Custom Wardrobe':  '#4a6b5c',
  'Featured':         '#8a3d3d',
  'Best Sellers':     '#1a1714',
};

export default function Navbar({ onLogoClick, onNavigate, onWishlist, onNewArrivals }) {
  const [annIdx,     setAnnIdx]     = useState(0);
  const [annFade,    setAnnFade]    = useState(true);
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal,  setSearchVal]  = useState('');
  const [activeIdx,  setActiveIdx]  = useState(-1);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const count      = useCartStore(s => s.count());
  const toggleCart = useCartStore(s => s.toggleCart);
  const wlCount    = useWishlistStore(s => s.count());

  // Live search — fuzzy match on name + category, max 8 results
  const results = searchVal.trim().length >= 1
    ? allProducts.filter(p => {
        const q = searchVal.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q)
        );
      }).slice(0, 8)
    : [];

  // Group results by category for display
  const grouped = results.reduce((acc, p) => {
    const cat = p.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  // Popular categories shown when search bar is empty
  const popularCategories = [
    { label: 'Beds', slug: 'beds' },
    { label: 'Sofa Sets', slug: 'sofa-set' },
    { label: 'Recliners', slug: 'recliner-sofa' },
    { label: 'Dining Sets', slug: 'dining-furniture' },
    { label: 'Mattress', slug: 'mattress' },
    { label: 'TV Units', slug: 'tv-unit' },
    { label: 'Coffee Tables', slug: 'coffee-table' },
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setAnnFade(false);
      setTimeout(() => { setAnnIdx(i => (i + 1) % announcements.length); setAnnFade(true); }, 300);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Escape') { closeSearch(); return; }
      if (!searchOpen || results.length === 0) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); }
      if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); handleResultClick(results[activeIdx]); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [searchOpen, results, activeIdx]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
    setActiveIdx(-1);
  }, [searchOpen, searchVal]);

  const closeSearch = () => { setSearchOpen(false); setSearchVal(''); setActiveIdx(-1); };

  const handleResultClick = (p) => {
    const slug = categoryToSlug[p.category];
    if (slug) {
      onNavigate?.('category', slug, p.category, p.id);
    } else {
      onNavigate?.('category', (p.category || '').toLowerCase().replace(/\s+/g, '-'), p.category, p.id);
    }
    closeSearch();
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = scrolled ? NAV_H + 16 : TOTAL_H + 16;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <>
      <style>{`
        .nb-root *, .nb-root *::before, .nb-root *::after { box-sizing: border-box; font-family: 'Jost', sans-serif; }
        .ann-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 102; height: ${ANN_H}px; background: #1a1714; display: flex; align-items: center; justify-content: center; overflow: hidden; transition: height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.38s ease; }
        .ann-bar.hidden { height: 0; opacity: 0; pointer-events: none; }
        .ann-text { font-size: 0.775rem; font-weight: 400; letter-spacing: 0.07em; color: #fff; white-space: nowrap; transition: opacity 0.28s ease; }
        .ann-text.out { opacity: 0; } .ann-text.in { opacity: 1; }
        .main-nav { position: fixed; left: 0; right: 0; z-index: 100; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.08); transition: top 0.38s cubic-bezier(.4,0,.2,1), box-shadow 0.38s ease; }
        .main-nav.expanded { top: ${ANN_H}px; box-shadow: none; }
        .main-nav.scrolled { top: 0; box-shadow: 0 2px 24px rgba(0,0,0,0.09); }
        .nav-inner { max-width: 1440px; margin: 0 auto; padding: 0 32px; height: ${NAV_H}px; display: flex; align-items: center; }
        .nb-logo { display: flex; align-items: center; gap: 14px; text-decoration: none; flex-shrink: 0; margin-right: 32px; cursor: pointer; background: #f5f0e8; border-radius: 6px; padding: 8px 14px; }
        .nb-logo-img { height: 57px; width: auto; display: block; object-fit: contain; flex-shrink: 0; }
        .nb-logo-text { display: flex; flex-direction: column; gap: 2px; border-left: 1.5px solid rgba(26,23,20,0.15); padding-left: 14px; }
        .nb-logo-name { font-family: 'Cormorant Garamond', serif !important; font-size: 1.18rem; font-weight: 700; color: #1a1714; letter-spacing: 0.12em; line-height: 1; text-transform: uppercase; white-space: nowrap; }
        .nb-logo-sub { font-size: 0.48rem; font-weight: 500; letter-spacing: 0.30em; color: #8a8278; text-transform: uppercase; white-space: nowrap; }
        .nb-ul { flex: 1; display: flex; align-items: center; justify-content: center; list-style: none; margin: 0; padding: 0; gap: 0; }
        .nb-li { position: relative; }
        .nb-btn { display: flex; align-items: center; gap: 4px; background: none; border: none; padding: 10px 12px; font-size: 0.875rem; font-weight: 600; color: #1a1714; cursor: pointer; white-space: nowrap; line-height: 1; transition: color 0.18s; height: ${NAV_H}px; }
        .nb-btn:hover, .nb-btn.sale:hover { color: #c9a96e; }
        .nb-btn.sale { color: #c0392b; }
        .nb-chevron { opacity: 0.45; margin-top: 1px; flex-shrink: 0; transition: opacity 0.18s, transform 0.22s; }
        .nb-li:hover .nb-chevron { opacity: 0.75; transform: rotate(180deg); }
        .nb-drop { position: absolute; top: 100%; left: 50%; transform: translateX(-50%) translateY(8px); background: #fff; border: 1px solid rgba(0,0,0,0.07); border-top: 2px solid #c9a96e; box-shadow: 0 20px 60px rgba(0,0,0,0.13); min-width: 240px; padding: 10px 0; opacity: 0; pointer-events: none; transition: opacity 0.22s ease, transform 0.22s cubic-bezier(.22,1,.36,1); z-index: 200; }
        .nb-li:hover .nb-drop { opacity: 1; pointer-events: auto; transform: translateX(-50%) translateY(0); }
        .nb-drop a { display: flex; align-items: center; gap: 10px; padding: 11px 22px; font-size: 0.92rem; font-weight: 500; color: #2a2520; text-decoration: none; transition: color 0.18s, background 0.18s, padding-left 0.18s; white-space: nowrap; letter-spacing: 0.01em; position: relative; }
        .nb-drop a::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 2px; height: 0; background: #c9a96e; transition: height 0.18s ease; border-radius: 0 2px 2px 0; }
        .nb-drop a:hover { color: #c9a96e; background: #faf7f2; padding-left: 28px; }
        .nb-drop a:hover::before { height: 60%; }
        .nb-drop-divider { height: 1px; background: rgba(0,0,0,0.06); margin: 6px 0; }
        .nb-actions { display: flex; align-items: center; gap: 18px; flex-shrink: 0; }
        .nb-icon { background: none; border: none; color: #1a1714; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 6px; position: relative; transition: color 0.18s; }
        .nb-icon:hover { color: #c9a96e; }
        .nb-badge { position: absolute; top: -3px; right: -5px; min-width: 17px; height: 17px; background: #c9a96e; color: #fff; font-size: 9px; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 0 2px; }

        /* ── Search overlay ── */
        .nb-search-overlay { position: fixed; inset: 0; z-index: 500; background: rgba(10,8,6,0.72); backdrop-filter: blur(6px); display: flex; align-items: flex-start; justify-content: center; padding-top: 90px; opacity: 0; pointer-events: none; transition: opacity 0.28s ease; }
        .nb-search-overlay.open { opacity: 1; pointer-events: auto; }
        .nb-search-wrap { width: 100%; max-width: 660px; padding: 0 20px; }

        /* Search input box */
        .nb-search-box { background: #fff; display: flex; align-items: center; padding: 0 20px; box-shadow: 0 8px 40px rgba(0,0,0,0.28); border-radius: 2px 2px 0 0; }
        .nb-search-input { flex: 1; border: none; outline: none; font-family: 'Cormorant Garamond', serif; font-size: 1.45rem; font-weight: 400; color: #1a1714; padding: 18px 0; background: transparent; letter-spacing: 0.01em; }
        .nb-search-input::placeholder { color: rgba(26,23,20,0.28); }
        .nb-search-close { background: none; border: none; cursor: pointer; color: #8a8278; padding: 4px; display: flex; align-items: center; transition: color 0.2s; }
        .nb-search-close:hover { color: #1a1714; }

        /* Results panel */
        .nb-search-panel { background: #fff; box-shadow: 0 20px 50px rgba(0,0,0,0.18); max-height: 460px; overflow-y: auto; border-radius: 0 0 2px 2px; border-top: 1px solid #f0ebe3; scroll-behavior: smooth; }
        .nb-search-panel::-webkit-scrollbar { width: 4px; }
        .nb-search-panel::-webkit-scrollbar-thumb { background: #e8e1d8; border-radius: 2px; }

        /* Category header in results */
        .nb-res-cat-header { padding: 10px 16px 6px; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #8a8278; display: flex; align-items: center; gap: 8px; }
        .nb-res-cat-header::after { content: ''; flex: 1; height: 1px; background: #f0ebe3; }

        /* Individual result row */
        .nb-search-result { display: flex; align-items: center; gap: 14px; padding: 10px 16px; cursor: pointer; transition: background 0.13s; border-bottom: 1px solid #faf7f3; }
        .nb-search-result:last-child { border-bottom: none; }
        .nb-search-result:hover, .nb-search-result.active { background: #faf7f2; }
        .nb-res-img-wrap { width: 54px; height: 54px; flex-shrink: 0; background: #f5f0e8; overflow: hidden; }
        .nb-res-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s; }
        .nb-search-result:hover .nb-res-img-wrap img { transform: scale(1.06); }
        .nb-res-info { flex: 1; min-width: 0; }
        .nb-res-name { font-family: 'Cormorant Garamond', serif; font-size: 1.02rem; font-weight: 600; color: #1a1714; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3; }
        .nb-res-cat-pill { display: inline-block; margin-top: 3px; font-size: 0.60rem; font-weight: 600; letter-spacing: 0.10em; text-transform: uppercase; padding: 2px 7px; border-radius: 20px; color: #fff; }
        .nb-res-price { font-size: 0.92rem; font-weight: 700; color: #c9a96e; white-space: nowrap; letter-spacing: -0.01em; }
        .nb-res-price.por { font-size: 0.70rem; color: #8a8278; font-weight: 500; }
        .nb-res-arrow { color: #d4c4a8; flex-shrink: 0; transition: color 0.15s, transform 0.15s; }
        .nb-search-result:hover .nb-res-arrow { color: #c9a96e; transform: translateX(3px); }

        /* Empty state */
        .nb-search-empty { padding: 32px 20px; text-align: center; }
        .nb-search-empty-icon { font-size: 2rem; margin-bottom: 10px; opacity: 0.3; }
        .nb-search-empty-text { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: #8a8278; }
        .nb-search-empty-sub { font-size: 0.78rem; color: #b0a898; margin-top: 4px; }

        /* Popular categories (shown when no query) */
        .nb-search-popular { padding: 16px 16px 12px; }
        .nb-search-popular-title { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #8a8278; margin-bottom: 10px; }
        .nb-popular-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .nb-popular-chip { display: flex; align-items: center; gap: 6px; padding: 7px 14px; background: #f5f0e8; border: none; border-radius: 2px; cursor: pointer; font-size: 0.82rem; font-weight: 500; color: #2a2520; transition: background 0.15s, color 0.15s; letter-spacing: 0.01em; }
        .nb-popular-chip:hover { background: #c9a96e; color: #fff; }

        /* Hint */
        .nb-search-hint { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 12px; }
        .nb-search-hint span { font-size: 0.68rem; letter-spacing: 0.12em; color: rgba(255,255,255,0.35); text-transform: uppercase; display: flex; align-items: center; gap: 5px; }
        .nb-search-hint kbd { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.18); padding: 1px 6px; border-radius: 3px; font-size: 0.65rem; font-family: monospace; }
        .nb-res-count { padding: 8px 16px 4px; font-size: 0.68rem; color: #b0a898; letter-spacing: 0.05em; border-bottom: 1px solid #f5f0e8; }

        /* Mobile menu */
        .mob-menu { position: fixed; inset: 0; background: #1a1714; z-index: 400; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; transition: opacity 0.32s ease, transform 0.32s cubic-bezier(.22,1,.36,1); }
        .mob-menu.closed { opacity: 0; pointer-events: none; transform: translateX(100%); }
        .mob-menu.open   { opacity: 1; pointer-events: auto; transform: translateX(0); }
        .mob-link { font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; font-weight: 400; color: #fff; padding: 6px 0; transition: color 0.2s; background: none; border: none; cursor: pointer; }
        .mob-link:hover { color: #c9a96e; }
        .mob-close { position: absolute; top: 24px; right: 24px; background: none; border: none; color: #fff; cursor: pointer; padding: 6px; transition: color 0.2s; }
        .mob-close:hover { color: #c9a96e; }
        @media (max-width: 1024px) { .nb-btn { font-size: 0.80rem; padding: 10px 9px; } }
        @media (max-width: 900px)  { .nb-ul { display: none !important; } #nb-mob-btn { display: flex !important; } }
        @media (min-width: 901px)  { #nb-mob-btn { display: none !important; } }
      `}</style>

      <div className="nb-root">
        {/* Announcement bar */}
        <div className={`ann-bar${scrolled ? ' hidden' : ''}`}>
          <span className={`ann-text ${annFade ? 'in' : 'out'}`}>{announcements[annIdx]}</span>
        </div>

        {/* Main nav */}
        <nav className={`main-nav ${scrolled ? 'scrolled' : 'expanded'}`}>
          <div className="nav-inner">
            <a href="/" className="nb-logo" onClick={e => { e.preventDefault(); onLogoClick?.(); }}>
              <img src={logoImg} alt="OASIS Furniture" className="nb-logo-img" />
              <div className="nb-logo-text">
                <span className="nb-logo-name">OASIS Furniture</span>
                <span className="nb-logo-sub">and Furnishing</span>
              </div>
            </a>

            <ul className="nb-ul">
              {navLinks.map(({ label, drop, sale, section, bedsInDrop, dropSlug, isNewArrivals }, idx) => (
                <Fragment key={label}>
                  {idx > 0 && <li aria-hidden="true" style={{ width: '1px', height: '14px', background: 'rgba(0,0,0,0.15)', flexShrink: 0, alignSelf: 'center', listStyle: 'none' }} />}
                  <li className="nb-li">
                    <button className={`nb-btn${sale ? ' sale' : ''}`} onClick={() => {
                        if (isNewArrivals) { onNavigate?.('category', 'new-arrivals', 'New Arrivals'); }
                        else { section && scrollToSection(section); }
                      }}>
                      {label}
                      {drop && <ChevronDown size={12} className="nb-chevron" />}
                    </button>
                    {drop && (
                      <div className="nb-drop">
                        {drop.map(d => (
                          <a key={d} href="#" onClick={e => {
                            e.preventDefault();
                            if (d === 'Beds') onNavigate?.('category', 'beds', 'Beds');
                            else if (d === 'Bed Sets') onNavigate?.('category', 'bed-sets', 'Bed Sets');
                            else if (d === 'Bedside Tables') onNavigate?.('category', 'bedside-tables', 'Bedside Tables');
                            else if (dropSlug?.[d]) onNavigate?.('category', dropSlug[d], d);
                            else if (bedsInDrop) onNavigate?.('category', d.toLowerCase().replace(/\s+/g, '-'), d);
                            else scrollToSection(section);
                          }}>{d}</a>
                        ))}
                      </div>
                    )}
                  </li>
                </Fragment>
              ))}
            </ul>

            <div className="nb-actions">
              <button className="nb-icon" aria-label="Search" onClick={() => setSearchOpen(true)}>
                <Search size={20} strokeWidth={1.8} />
              </button>
              <button className="nb-icon" aria-label="Wishlist" onClick={onWishlist}>
                <Heart size={20} strokeWidth={1.8} />
                {wlCount > 0 && <span className="nb-badge">{wlCount}</span>}
              </button>
              <button className="nb-icon" onClick={toggleCart} aria-label="Cart">
                <ShoppingBag size={20} strokeWidth={1.8} />
                {count > 0 && <span className="nb-badge">{count}</span>}
              </button>
              <button id="nb-mob-btn" className="nb-icon" style={{ display: 'none' }} onClick={() => setMobileOpen(o => !o)}>
                <Menu size={22} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </nav>

        {/* ── Search overlay ── */}
        <div className={`nb-search-overlay${searchOpen ? ' open' : ''}`} onClick={closeSearch}>
          <div className="nb-search-wrap" onClick={e => e.stopPropagation()}>
            {/* Input */}
            <div className="nb-search-box">
              <Search size={18} style={{ color: '#8a8278', flexShrink: 0, marginRight: 12 }} />
              <input
                ref={inputRef}
                className="nb-search-input"
                placeholder="Search sofas, beds, dining, TV units..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
              />
              {searchVal && (
                <button className="nb-search-close" onClick={() => setSearchVal('')} style={{ marginRight: 8 }}>
                  <X size={16} />
                </button>
              )}
              <button className="nb-search-close" onClick={closeSearch}>
                <X size={18} />
              </button>
            </div>

            {/* Results panel */}
            <div className="nb-search-panel" ref={resultsRef}>
              {searchVal.trim().length === 0 ? (
                /* Popular categories */
                <div className="nb-search-popular">
                  <div className="nb-search-popular-title">Browse by Category</div>
                  <div className="nb-popular-chips">
                    {popularCategories.map(cat => (
                      <button key={cat.slug} className="nb-popular-chip" onClick={() => {
                        onNavigate?.('category', cat.slug, cat.label);
                        closeSearch();
                      }}>
                        {cat.label}
                        <ArrowRight size={12} />
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className="nb-res-count">{results.length} result{results.length !== 1 ? 's' : ''} for "{searchVal}"</div>
                  {Object.entries(grouped).map(([cat, items]) => (
                    <div key={cat}>
                      <div className="nb-res-cat-header">{cat}</div>
                      {items.map((p, idx) => {
                        const globalIdx = results.indexOf(p);
                        return (
                          <div
                            key={p.id}
                            className={`nb-search-result${activeIdx === globalIdx ? ' active' : ''}`}
                            onClick={() => handleResultClick(p)}
                          >
                            <div className="nb-res-img-wrap">
                              <img src={p.image} alt={p.name} loading="lazy" />
                            </div>
                            <div className="nb-res-info">
                              <div className="nb-res-name">{p.name}</div>
                              <span
                                className="nb-res-cat-pill"
                                style={{ background: catColors[p.category] || '#555' }}
                              >
                                {p.category}
                              </span>
                            </div>
                            <div className={`nb-res-price${p.price === 0 ? ' por' : ''}`}>
                              {fmt(p.price)}
                            </div>
                            <ArrowRight size={14} className="nb-res-arrow" />
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </>
              ) : (
                <div className="nb-search-empty">
                  <div className="nb-search-empty-icon">🔍</div>
                  <div className="nb-search-empty-text">No results for "{searchVal}"</div>
                  <div className="nb-search-empty-sub">Try searching for sofas, beds, mattress, dining...</div>
                </div>
              )}
            </div>

            <div className="nb-search-hint">
              <span><kbd>↑↓</kbd> navigate</span>
              <span><kbd>↵</kbd> select</span>
              <span><kbd>Esc</kbd> close</span>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`mob-menu ${mobileOpen ? 'open' : 'closed'}`}>
          <button className="mob-close" onClick={() => setMobileOpen(false)}><X size={28} strokeWidth={1.6} /></button>
          {navLinks.map(({ label, section, drop, bedsInDrop, dropSlug }) => (
            <div key={label}>
              <button className="mob-link" onClick={() => { section && scrollToSection(section); if (!drop) setMobileOpen(false); }}>
                {label}
              </button>
              {drop && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 6 }}>
                  {drop.map(d => (
                    <button key={d} style={{ fontFamily: "'Jost', sans-serif", fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', transition: 'color 0.2s' }}
                      onClick={() => {
                        if (d === 'Beds') { onNavigate?.('category', 'beds', 'Beds'); setMobileOpen(false); }
                        else if (d === 'Bed Sets') { onNavigate?.('category', 'bed-sets', 'Bed Sets'); setMobileOpen(false); }
                        else if (d === 'Bedside Tables') { onNavigate?.('category', 'bedside-tables', 'Bedside Tables'); setMobileOpen(false); }
                        else if (dropSlug?.[d]) { onNavigate?.('category', dropSlug[d], d); setMobileOpen(false); }
                        else if (bedsInDrop) { onNavigate?.('category', d.toLowerCase().replace(/\s+/g, '-'), d); setMobileOpen(false); }
                        else { section && scrollToSection(section); setMobileOpen(false); }
                      }}>{d}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}