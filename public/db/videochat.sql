-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-04-2023 a las 23:17:45
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `videochat`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carreras`
--

CREATE TABLE `carreras` (
  `id_carrera` int(10) NOT NULL,
  `nombre_carrera` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `carreras`
--

INSERT INTO `carreras` (`id_carrera`, `nombre_carrera`) VALUES
(1, 'Ing. Industrial'),
(2, 'Ing. Computación');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `defensores`
--

CREATE TABLE `defensores` (
  `id_defensor` int(10) NOT NULL,
  `nombre_defensor` text NOT NULL,
  `apellido_defensor` text NOT NULL,
  `cedula_defensor` int(11) NOT NULL,
  `correo_defensor` varchar(50) NOT NULL,
  `id_carrera_defensor` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `defensores`
--

INSERT INTO `defensores` (`id_defensor`, `nombre_defensor`, `apellido_defensor`, `cedula_defensor`, `correo_defensor`, `id_carrera_defensor`) VALUES
(1, 'nulo', 'nulo', 0, 'nulo', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jueces`
--

CREATE TABLE `jueces` (
  `id_juez` int(10) NOT NULL,
  `nombre_juez` text NOT NULL,
  `apellido_juez` text NOT NULL,
  `correo_juez` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tesis`
--

CREATE TABLE `tesis` (
  `id_tesis` int(10) NOT NULL,
  `titulo_tesis` text NOT NULL,
  `descripcion_tesis` text NOT NULL,
  `pridefensor_tesis` int(10) NOT NULL,
  `segdefensor_tesis` int(10) NOT NULL,
  `prijuez_tesis` int(10) NOT NULL,
  `segjuez_tesis` int(10) NOT NULL,
  `terjuez_tesis` int(10) NOT NULL,
  `codigo_tesis` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carreras`
--
ALTER TABLE `carreras`
  ADD PRIMARY KEY (`id_carrera`);

--
-- Indices de la tabla `defensores`
--
ALTER TABLE `defensores`
  ADD PRIMARY KEY (`id_defensor`),
  ADD KEY `id_carrera_defensor` (`id_carrera_defensor`);

--
-- Indices de la tabla `jueces`
--
ALTER TABLE `jueces`
  ADD PRIMARY KEY (`id_juez`);

--
-- Indices de la tabla `tesis`
--
ALTER TABLE `tesis`
  ADD PRIMARY KEY (`id_tesis`),
  ADD KEY `pridefensor_tesis` (`pridefensor_tesis`,`segdefensor_tesis`,`prijuez_tesis`,`segjuez_tesis`,`terjuez_tesis`),
  ADD KEY `segdefensor_tesis` (`segdefensor_tesis`),
  ADD KEY `prijuez_tesis` (`prijuez_tesis`),
  ADD KEY `segjuez_tesis` (`segjuez_tesis`),
  ADD KEY `terjuez_tesis` (`terjuez_tesis`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carreras`
--
ALTER TABLE `carreras`
  MODIFY `id_carrera` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `defensores`
--
ALTER TABLE `defensores`
  MODIFY `id_defensor` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `jueces`
--
ALTER TABLE `jueces`
  MODIFY `id_juez` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tesis`
--
ALTER TABLE `tesis`
  MODIFY `id_tesis` int(10) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `defensores`
--
ALTER TABLE `defensores`
  ADD CONSTRAINT `defensores_ibfk_1` FOREIGN KEY (`id_carrera_defensor`) REFERENCES `carreras` (`id_carrera`);

--
-- Filtros para la tabla `tesis`
--
ALTER TABLE `tesis`
  ADD CONSTRAINT `tesis_ibfk_1` FOREIGN KEY (`pridefensor_tesis`) REFERENCES `defensores` (`id_defensor`),
  ADD CONSTRAINT `tesis_ibfk_2` FOREIGN KEY (`segdefensor_tesis`) REFERENCES `defensores` (`id_defensor`),
  ADD CONSTRAINT `tesis_ibfk_3` FOREIGN KEY (`prijuez_tesis`) REFERENCES `jueces` (`id_juez`),
  ADD CONSTRAINT `tesis_ibfk_4` FOREIGN KEY (`segjuez_tesis`) REFERENCES `jueces` (`id_juez`),
  ADD CONSTRAINT `tesis_ibfk_5` FOREIGN KEY (`terjuez_tesis`) REFERENCES `jueces` (`id_juez`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
