-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 05, 2024 at 09:55 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bnsp`
--

-- --------------------------------------------------------

--
-- Table structure for table `produk`
--

CREATE TABLE `produk` (
  `no_produk` int(11) NOT NULL,
  `merk` varchar(255) NOT NULL,
  `ukuran` varchar(255) NOT NULL,
  `harga_jual` int(11) NOT NULL,
  `stok` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produk`
--

INSERT INTO `produk` (`no_produk`, `merk`, `ukuran`, `harga_jual`, `stok`) VALUES
(1, 'Topi Koki Ramos', '5', 73000, 106),
(2, 'Rojolele Super', '5 ', 63000, 72),
(3, 'Rojolele Super', '10', 120000, 53),
(4, 'Rojolele Super', '25', 300000, 7),
(5, 'BMW Setra Ramos', '5', 68000, 89),
(6, 'Bunga Ramos Setra', '5', 64000, 147),
(7, 'Bunga Ramos Setra', '10', 120000, 28),
(8, 'Maknyuss Premium', '5', 71000, 122),
(9, 'Maknyuss Premium ', '25', 338000, 34),
(10, 'Puregreen Beras Merah', '1', 22000, 64),
(11, 'Puregreen Beras Merah', '2', 45000, 37);

-- --------------------------------------------------------

--
-- Table structure for table `produk_transaksi`
--

CREATE TABLE `produk_transaksi` (
  `no_transaksi` int(11) DEFAULT NULL,
  `no_produk` int(11) DEFAULT NULL,
  `merk` varchar(100) DEFAULT NULL,
  `ukuran` varchar(100) DEFAULT NULL,
  `jumlah` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produk_transaksi`
--

INSERT INTO `produk_transaksi` (`no_transaksi`, `no_produk`, `merk`, `ukuran`, `jumlah`) VALUES
(3, 4, 'Rojolele Super', '25', 30),
(3, 9, 'Maknyuss Premium ', '25', 25),
(4, 7, 'Bunga Ramos Setra', '10', 4),
(5, 1, 'Topi Koki Ramos', '5', 1),
(6, 9, 'Maknyuss Premium ', '25', 40),
(7, 1, 'Topi Koki Ramos', '5', 5),
(7, 11, 'Puregreen Beras Merah', '2', 2),
(8, 8, 'Maknyuss Premium', '5', 32);

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `no_transaksi` int(11) NOT NULL,
  `tanggal` date DEFAULT NULL,
  `nama_pelanggan` varchar(100) DEFAULT NULL,
  `Keterangan` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaksi`
--

INSERT INTO `transaksi` (`no_transaksi`, `tanggal`, `nama_pelanggan`, `Keterangan`) VALUES
(3, '2026-02-01', 'Warteg Bahari Jaya', '-'),
(4, '2026-02-04', 'RM Padang Salero', '-'),
(5, '2026-02-01', 'Pak Rudi', '-'),
(6, '2026-02-13', 'Mang Adul', '-'),
(7, '2026-02-17', 'Kak Asih', '-'),
(8, '2026-02-23', 'Mang Udin', '-');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`no_produk`);

--
-- Indexes for table `produk_transaksi`
--
ALTER TABLE `produk_transaksi`
  ADD KEY `no_transaksi` (`no_transaksi`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`no_transaksi`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `produk`
--
ALTER TABLE `produk`
  MODIFY `no_produk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `no_transaksi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `produk_transaksi`
--
ALTER TABLE `produk_transaksi`
  ADD CONSTRAINT `produk_transaksi_ibfk_1` FOREIGN KEY (`no_transaksi`) REFERENCES `transaksi` (`no_transaksi`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
