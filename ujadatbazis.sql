USE [master]
GO
/****** Object:  Database [gyakorstartDBuj]    Script Date: 2026. 11. 07. 12:52:45 ******/
CREATE DATABASE [gyakorstartDBuj]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'gyakorstartDBuj', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\gyakorstartDBuj.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'gyakorstartDBuj_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\gyakorstartDBuj_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [gyakorstartDBuj] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [gyakorstartDBuj].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [gyakorstartDBuj] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET ARITHABORT OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [gyakorstartDBuj] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [gyakorstartDBuj] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET  DISABLE_BROKER 
GO
ALTER DATABASE [gyakorstartDBuj] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [gyakorstartDBuj] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [gyakorstartDBuj] SET  MULTI_USER 
GO
ALTER DATABASE [gyakorstartDBuj] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [gyakorstartDBuj] SET DB_CHAINING OFF 
GO
ALTER DATABASE [gyakorstartDBuj] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [gyakorstartDBuj] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [gyakorstartDBuj] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [gyakorstartDBuj] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [gyakorstartDBuj] SET QUERY_STORE = ON
GO
ALTER DATABASE [gyakorstartDBuj] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [gyakorstartDBuj]
GO
/****** Object:  Table [dbo].[allas_elfogadott_szakok]    Script Date: 2026. 11. 07. 12:52:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[allas_elfogadott_szakok](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[allas_id] [varchar](50) NOT NULL,
	[szak_kod] [varchar](50) NULL,
	[szak_nev] [varchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[allas_hirdetesek]    Script Date: 2026. 11. 07. 12:52:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[allas_hirdetesek](
	[id] [varchar](50) NOT NULL,
	[ceg_felhasznalo_id] [int] NULL,
	[pozicio_nev] [varchar](100) NOT NULL,
	[ceg_nev] [varchar](100) NOT NULL,
	[ceg_bemutatkozas] [varchar](2000) NULL,
	[helyszin] [varchar](100) NOT NULL,
	[munkavegzes_mod] [varchar](20) NOT NULL,
	[minimum_felev] [varchar](5) NULL,
	[heti_ora_min] [tinyint] NULL,
	[heti_ora_max] [tinyint] NULL,
	[brutto_oraber] [varchar](50) NULL,
	[feladatok] [varchar](2000) NULL,
	[szakmai_elvarasok] [varchar](2000) NULL,
	[jelentkezesi_hatarido] [date] NULL,
	[statusz] [varchar](20) NULL,
	[szakma_terulet] [varchar](30) NULL,
	[nyelv_kapcsolat] [varchar](10) NULL,
	[letrehozva] [datetime2](0) NULL,
 CONSTRAINT [PK__allas_hi__3213E83F88572FE9] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[allas_nyelvi_elvarasok]    Script Date: 2026. 11. 07. 12:52:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[allas_nyelvi_elvarasok](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[allas_id] [varchar](50) NOT NULL,
	[nyelv_kod] [varchar](30) NOT NULL,
	[elvart_szint] [varchar](30) NOT NULL,
	[tipus] [varchar](20) NULL,
	[szukseges_nyelvvizsga] [bit] NULL,
	[nyelvvizsga_szint] [varchar](5) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ceges_profilok]    Script Date: 2026. 11. 07. 12:52:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ceges_profilok](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[felhasznalo_id] [int] NOT NULL,
	[ceg_nev] [varchar](180) NOT NULL,
	[adoszam] [varchar](20) NOT NULL,
	[cegjegyzekszam] [varchar](30) NULL,
	[kapcsolattarto_neve] [varchar](100) NOT NULL,
	[kapcsolattarto_telefon] [varchar](25) NOT NULL,
	[szekhely_iranyitoszam] [varchar](4) NOT NULL,
	[szekhely_telepules] [varchar](50) NOT NULL,
	[szekhely_kozterulet] [varchar](100) NOT NULL,
	[szekhely_hazszam] [varchar](20) NOT NULL,
	[weboldal] [varchar](200) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[felhasznalok]    Script Date: 2026. 11. 07. 12:52:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[felhasznalok](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[email] [varchar](254) NOT NULL,
	[jelszo_hash] [varchar](64) NOT NULL,
	[szerepkor] [varchar](15) NOT NULL,
	[letrehozva] [datetime2](0) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[hallgato_keszsegek]    Script Date: 2026. 11. 07. 12:52:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[hallgato_keszsegek](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[hallgato_id] [int] NOT NULL,
	[nev] [varchar](50) NOT NULL,
	[szint] [varchar](30) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[hallgato_nyelvek]    Script Date: 2026. 11. 07. 12:52:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[hallgato_nyelvek](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[hallgato_id] [int] NOT NULL,
	[nyelv_kod] [varchar](30) NOT NULL,
	[nyelv_nev] [varchar](50) NOT NULL,
	[beszedkeszseg_szint] [varchar](30) NULL,
	[van_nyelvvizsga] [bit] NULL,
	[nyelvvizsga_szint] [varchar](5) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[hallgato_projektek]    Script Date: 2026. 11. 07. 12:52:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[hallgato_projektek](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[hallgato_id] [int] NOT NULL,
	[projekt_nev] [varchar](100) NULL,
	[technologiak] [varchar](150) NULL,
	[leiras] [varchar](500) NULL,
	[projekt_url] [varchar](200) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[hallgato_tantargyak]    Script Date: 2026. 11. 07. 12:52:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[hallgato_tantargyak](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[hallgato_id] [int] NOT NULL,
	[tantargy_nev] [varchar](80) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[hallgato_tanulmanyok]    Script Date: 2026. 11. 07. 12:52:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[hallgato_tanulmanyok](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[hallgato_id] [int] NOT NULL,
	[intezmeny] [varchar](100) NULL,
	[kepzes] [varchar](100) NULL,
	[idoszak] [varchar](30) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[hallgato_tapasztalatok]    Script Date: 2026. 11. 07. 12:52:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[hallgato_tapasztalatok](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[hallgato_id] [int] NOT NULL,
	[tipus] [varchar](20) NULL,
	[ceg] [varchar](100) NULL,
	[pozicio] [varchar](100) NULL,
	[idoszak] [varchar](30) NULL,
	[leiras] [varchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[hallgatoi_profilok]    Script Date: 2026. 11. 07. 12:52:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[hallgatoi_profilok](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[felhasznalo_id] [int] NOT NULL,
	[teljes_nev] [varchar](100) NOT NULL,
	[szuletesi_datum] [date] NULL,
	[szuletesi_hely] [varchar](50) NULL,
	[egyetem] [varchar](100) NULL,
	[szak] [varchar](100) NULL,
	[szak_kod] [varchar](50) NULL,
	[aktualis_felev] [varchar](5) NULL,
	[telepules] [varchar](50) NULL,
	[telefonszam] [varchar](25) NULL,
	[bemutatkozas] [varchar](500) NULL,
	[heti_oraszam_min] [tinyint] NULL,
	[heti_oraszam_max] [tinyint] NULL,
	[munkavegzes_mod] [varchar](20) NULL,
	[jogositvany] [varchar](30) NULL,
	[legkorabbi_munkakezdes] [date] NULL,
	[linkedin_url] [varchar](200) NULL,
	[portfolio_url] [varchar](200) NULL,
	[profil_kep] [varchar](max) NULL,
	[tanusitvanyok] [varchar](300) NULL,
 CONSTRAINT [PK__hallgato__3213E83F5E6F39D6] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[jelentkezesek]    Script Date: 2026. 11. 07. 12:52:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[jelentkezesek](
	[id] [varchar](80) NOT NULL,
	[allas_id] [varchar](50) NOT NULL,
	[hallgato_id] [int] NOT NULL,
	[statusz] [varchar](20) NULL,
	[bemutatkozo_uzenet] [varchar](1000) NULL,
	[jelentkezes_ideje] [datetime2](0) NULL,
	[idovonal_esemenyek] [varchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[allas_hirdetesek] ADD  CONSTRAINT [DF__allas_hir__statu__5CD6CB2B]  DEFAULT ('active') FOR [statusz]
GO
ALTER TABLE [dbo].[allas_hirdetesek] ADD  CONSTRAINT [DF__allas_hir__nyelv__5DCAEF64]  DEFAULT ('all') FOR [nyelv_kapcsolat]
GO
ALTER TABLE [dbo].[allas_hirdetesek] ADD  CONSTRAINT [DF__allas_hir__letre__5EBF139D]  DEFAULT (getdate()) FOR [letrehozva]
GO
ALTER TABLE [dbo].[allas_nyelvi_elvarasok] ADD  DEFAULT ('required') FOR [tipus]
GO
ALTER TABLE [dbo].[allas_nyelvi_elvarasok] ADD  DEFAULT ((0)) FOR [szukseges_nyelvvizsga]
GO
ALTER TABLE [dbo].[felhasznalok] ADD  DEFAULT (getdate()) FOR [letrehozva]
GO
ALTER TABLE [dbo].[hallgato_nyelvek] ADD  DEFAULT ((0)) FOR [van_nyelvvizsga]
GO
ALTER TABLE [dbo].[jelentkezesek] ADD  DEFAULT ('new') FOR [statusz]
GO
ALTER TABLE [dbo].[jelentkezesek] ADD  DEFAULT (getdate()) FOR [jelentkezes_ideje]
GO
ALTER TABLE [dbo].[allas_elfogadott_szakok]  WITH CHECK ADD  CONSTRAINT [FK_Szak_Allas] FOREIGN KEY([allas_id])
REFERENCES [dbo].[allas_hirdetesek] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[allas_elfogadott_szakok] CHECK CONSTRAINT [FK_Szak_Allas]
GO
ALTER TABLE [dbo].[allas_hirdetesek]  WITH CHECK ADD  CONSTRAINT [FK_Allas_Ceg] FOREIGN KEY([ceg_felhasznalo_id])
REFERENCES [dbo].[felhasznalok] ([id])
ON DELETE SET NULL
GO
ALTER TABLE [dbo].[allas_hirdetesek] CHECK CONSTRAINT [FK_Allas_Ceg]
GO
ALTER TABLE [dbo].[allas_nyelvi_elvarasok]  WITH CHECK ADD  CONSTRAINT [FK_NyelviElvaras_Allas] FOREIGN KEY([allas_id])
REFERENCES [dbo].[allas_hirdetesek] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[allas_nyelvi_elvarasok] CHECK CONSTRAINT [FK_NyelviElvaras_Allas]
GO
ALTER TABLE [dbo].[ceges_profilok]  WITH CHECK ADD  CONSTRAINT [FK_Ceg_Felhasznalo] FOREIGN KEY([felhasznalo_id])
REFERENCES [dbo].[felhasznalok] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ceges_profilok] CHECK CONSTRAINT [FK_Ceg_Felhasznalo]
GO
ALTER TABLE [dbo].[hallgato_keszsegek]  WITH CHECK ADD  CONSTRAINT [FK_Keszseg_Hallgato] FOREIGN KEY([hallgato_id])
REFERENCES [dbo].[hallgatoi_profilok] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[hallgato_keszsegek] CHECK CONSTRAINT [FK_Keszseg_Hallgato]
GO
ALTER TABLE [dbo].[hallgato_nyelvek]  WITH CHECK ADD  CONSTRAINT [FK_Nyelv_Hallgato] FOREIGN KEY([hallgato_id])
REFERENCES [dbo].[hallgatoi_profilok] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[hallgato_nyelvek] CHECK CONSTRAINT [FK_Nyelv_Hallgato]
GO
ALTER TABLE [dbo].[hallgato_projektek]  WITH CHECK ADD  CONSTRAINT [FK_Projekt_Hallgato] FOREIGN KEY([hallgato_id])
REFERENCES [dbo].[hallgatoi_profilok] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[hallgato_projektek] CHECK CONSTRAINT [FK_Projekt_Hallgato]
GO
ALTER TABLE [dbo].[hallgato_tantargyak]  WITH CHECK ADD  CONSTRAINT [FK_Tantargy_Hallgato] FOREIGN KEY([hallgato_id])
REFERENCES [dbo].[hallgatoi_profilok] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[hallgato_tantargyak] CHECK CONSTRAINT [FK_Tantargy_Hallgato]
GO
ALTER TABLE [dbo].[hallgato_tanulmanyok]  WITH CHECK ADD  CONSTRAINT [FK_Tanulmany_Hallgato] FOREIGN KEY([hallgato_id])
REFERENCES [dbo].[hallgatoi_profilok] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[hallgato_tanulmanyok] CHECK CONSTRAINT [FK_Tanulmany_Hallgato]
GO
ALTER TABLE [dbo].[hallgato_tapasztalatok]  WITH CHECK ADD  CONSTRAINT [FK_Tapasztalat_Hallgato] FOREIGN KEY([hallgato_id])
REFERENCES [dbo].[hallgatoi_profilok] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[hallgato_tapasztalatok] CHECK CONSTRAINT [FK_Tapasztalat_Hallgato]
GO
ALTER TABLE [dbo].[hallgatoi_profilok]  WITH CHECK ADD  CONSTRAINT [FK_Hallgato_Felhasznalo] FOREIGN KEY([felhasznalo_id])
REFERENCES [dbo].[felhasznalok] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[hallgatoi_profilok] CHECK CONSTRAINT [FK_Hallgato_Felhasznalo]
GO
ALTER TABLE [dbo].[jelentkezesek]  WITH CHECK ADD  CONSTRAINT [FK_Jelentkezes_Allas] FOREIGN KEY([allas_id])
REFERENCES [dbo].[allas_hirdetesek] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[jelentkezesek] CHECK CONSTRAINT [FK_Jelentkezes_Allas]
GO
ALTER TABLE [dbo].[jelentkezesek]  WITH CHECK ADD  CONSTRAINT [FK_Jelentkezes_Hallgato] FOREIGN KEY([hallgato_id])
REFERENCES [dbo].[hallgatoi_profilok] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[jelentkezesek] CHECK CONSTRAINT [FK_Jelentkezes_Hallgato]
GO
ALTER TABLE [dbo].[allas_hirdetesek]  WITH CHECK ADD  CONSTRAINT [CK_allas_minimum_felev] CHECK  (([minimum_felev]='7+' OR [minimum_felev]='6' OR [minimum_felev]='5' OR [minimum_felev]='4' OR [minimum_felev]='3' OR [minimum_felev]='2' OR [minimum_felev]='1' OR [minimum_felev] IS NULL))
GO
ALTER TABLE [dbo].[allas_hirdetesek] CHECK CONSTRAINT [CK_allas_minimum_felev]
GO
ALTER TABLE [dbo].[allas_hirdetesek]  WITH CHECK ADD  CONSTRAINT [CK_allas_munkavegzes] CHECK  (([munkavegzes_mod]='Távoli' OR [munkavegzes_mod]='Hibrid' OR [munkavegzes_mod]='Irodai'))
GO
ALTER TABLE [dbo].[allas_hirdetesek] CHECK CONSTRAINT [CK_allas_munkavegzes]
GO
ALTER TABLE [dbo].[allas_hirdetesek]  WITH CHECK ADD  CONSTRAINT [CK_allas_nyelv_kapcsolat] CHECK  (([nyelv_kapcsolat]='any' OR [nyelv_kapcsolat]='all'))
GO
ALTER TABLE [dbo].[allas_hirdetesek] CHECK CONSTRAINT [CK_allas_nyelv_kapcsolat]
GO
ALTER TABLE [dbo].[allas_hirdetesek]  WITH CHECK ADD  CONSTRAINT [CK_allas_oraszam_max] CHECK  (([heti_ora_max] IS NULL OR [heti_ora_max]>=(5) AND [heti_ora_max]<=(40)))
GO
ALTER TABLE [dbo].[allas_hirdetesek] CHECK CONSTRAINT [CK_allas_oraszam_max]
GO
ALTER TABLE [dbo].[allas_hirdetesek]  WITH CHECK ADD  CONSTRAINT [CK_allas_oraszam_min] CHECK  (([heti_ora_min] IS NULL OR [heti_ora_min]>=(5) AND [heti_ora_min]<=(40)))
GO
ALTER TABLE [dbo].[allas_hirdetesek] CHECK CONSTRAINT [CK_allas_oraszam_min]
GO
ALTER TABLE [dbo].[allas_hirdetesek]  WITH CHECK ADD  CONSTRAINT [CK_allas_oraszam_sorrend] CHECK  (([heti_ora_min] IS NULL OR [heti_ora_max] IS NULL OR [heti_ora_min]<=[heti_ora_max]))
GO
ALTER TABLE [dbo].[allas_hirdetesek] CHECK CONSTRAINT [CK_allas_oraszam_sorrend]
GO
ALTER TABLE [dbo].[allas_hirdetesek]  WITH CHECK ADD  CONSTRAINT [CK_allas_statusz] CHECK  (([statusz]='expired' OR [statusz]='closed' OR [statusz]='paused' OR [statusz]='draft' OR [statusz]='active'))
GO
ALTER TABLE [dbo].[allas_hirdetesek] CHECK CONSTRAINT [CK_allas_statusz]
GO
ALTER TABLE [dbo].[allas_nyelvi_elvarasok]  WITH CHECK ADD  CONSTRAINT [CK_allas_nyelvvizsga_szint] CHECK  (([nyelvvizsga_szint]='C2' OR [nyelvvizsga_szint]='C1' OR [nyelvvizsga_szint]='B2' OR [nyelvvizsga_szint]='B1' OR [nyelvvizsga_szint]='A2' OR [nyelvvizsga_szint]='A1' OR [nyelvvizsga_szint] IS NULL))
GO
ALTER TABLE [dbo].[allas_nyelvi_elvarasok] CHECK CONSTRAINT [CK_allas_nyelvvizsga_szint]
GO
ALTER TABLE [dbo].[allas_nyelvi_elvarasok]  WITH CHECK ADD  CONSTRAINT [CK_nyelvi_tipus] CHECK  (([tipus]='preferred' OR [tipus]='required'))
GO
ALTER TABLE [dbo].[allas_nyelvi_elvarasok] CHECK CONSTRAINT [CK_nyelvi_tipus]
GO
ALTER TABLE [dbo].[ceges_profilok]  WITH CHECK ADD  CONSTRAINT [CK_ceg_iranyitoszam] CHECK  (([szekhely_iranyitoszam] like '[0-9][0-9][0-9][0-9]'))
GO
ALTER TABLE [dbo].[ceges_profilok] CHECK CONSTRAINT [CK_ceg_iranyitoszam]
GO
ALTER TABLE [dbo].[ceges_profilok]  WITH CHECK ADD  CONSTRAINT [CK_ceg_telefon] CHECK  (([kapcsolattarto_telefon] like '+36%' OR [kapcsolattarto_telefon] like '06%'))
GO
ALTER TABLE [dbo].[ceges_profilok] CHECK CONSTRAINT [CK_ceg_telefon]
GO
ALTER TABLE [dbo].[felhasznalok]  WITH CHECK ADD  CONSTRAINT [CK_felhasznalok_email] CHECK  (([email] like '%@%.%'))
GO
ALTER TABLE [dbo].[felhasznalok] CHECK CONSTRAINT [CK_felhasznalok_email]
GO
ALTER TABLE [dbo].[felhasznalok]  WITH CHECK ADD  CONSTRAINT [CK_felhasznalok_szerepkor] CHECK  (([szerepkor]='company' OR [szerepkor]='student'))
GO
ALTER TABLE [dbo].[felhasznalok] CHECK CONSTRAINT [CK_felhasznalok_szerepkor]
GO
ALTER TABLE [dbo].[hallgato_nyelvek]  WITH CHECK ADD  CONSTRAINT [CK_hallgato_nyelvvizsga_szint] CHECK  (([nyelvvizsga_szint]='C2' OR [nyelvvizsga_szint]='C1' OR [nyelvvizsga_szint]='B2' OR [nyelvvizsga_szint]='B1' OR [nyelvvizsga_szint]='A2' OR [nyelvvizsga_szint]='A1' OR [nyelvvizsga_szint] IS NULL))
GO
ALTER TABLE [dbo].[hallgato_nyelvek] CHECK CONSTRAINT [CK_hallgato_nyelvvizsga_szint]
GO
ALTER TABLE [dbo].[hallgato_tapasztalatok]  WITH CHECK ADD  CONSTRAINT [CK_tapasztalat_tipus] CHECK  (([tipus]='other' OR [tipus]='professional' OR [tipus] IS NULL))
GO
ALTER TABLE [dbo].[hallgato_tapasztalatok] CHECK CONSTRAINT [CK_tapasztalat_tipus]
GO
ALTER TABLE [dbo].[hallgatoi_profilok]  WITH CHECK ADD  CONSTRAINT [CK_hallgato_felev] CHECK  (([aktualis_felev]='7+' OR [aktualis_felev]='6' OR [aktualis_felev]='5' OR [aktualis_felev]='4' OR [aktualis_felev]='3' OR [aktualis_felev]='2' OR [aktualis_felev]='1' OR [aktualis_felev] IS NULL))
GO
ALTER TABLE [dbo].[hallgatoi_profilok] CHECK CONSTRAINT [CK_hallgato_felev]
GO
ALTER TABLE [dbo].[hallgatoi_profilok]  WITH CHECK ADD  CONSTRAINT [CK_hallgato_munkavegzes] CHECK  (([munkavegzes_mod]='Mindegy' OR [munkavegzes_mod]='Távoli' OR [munkavegzes_mod]='Hibrid' OR [munkavegzes_mod]='Irodai' OR [munkavegzes_mod] IS NULL))
GO
ALTER TABLE [dbo].[hallgatoi_profilok] CHECK CONSTRAINT [CK_hallgato_munkavegzes]
GO
ALTER TABLE [dbo].[hallgatoi_profilok]  WITH CHECK ADD  CONSTRAINT [CK_hallgato_oraszam_max] CHECK  (([heti_oraszam_max] IS NULL OR [heti_oraszam_max]>=(5) AND [heti_oraszam_max]<=(40)))
GO
ALTER TABLE [dbo].[hallgatoi_profilok] CHECK CONSTRAINT [CK_hallgato_oraszam_max]
GO
ALTER TABLE [dbo].[hallgatoi_profilok]  WITH CHECK ADD  CONSTRAINT [CK_hallgato_oraszam_min] CHECK  (([heti_oraszam_min] IS NULL OR [heti_oraszam_min]>=(5) AND [heti_oraszam_min]<=(40)))
GO
ALTER TABLE [dbo].[hallgatoi_profilok] CHECK CONSTRAINT [CK_hallgato_oraszam_min]
GO
ALTER TABLE [dbo].[hallgatoi_profilok]  WITH CHECK ADD  CONSTRAINT [CK_hallgato_telefonszam] CHECK  (([telefonszam] like '+36%' OR [telefonszam] like '06%' OR [telefonszam] IS NULL))
GO
ALTER TABLE [dbo].[hallgatoi_profilok] CHECK CONSTRAINT [CK_hallgato_telefonszam]
GO
ALTER TABLE [dbo].[jelentkezesek]  WITH CHECK ADD  CONSTRAINT [CK_jelentkezes_statusz] CHECK  (([statusz]='rejected' OR [statusz]='interview' OR [statusz]='new'))
GO
ALTER TABLE [dbo].[jelentkezesek] CHECK CONSTRAINT [CK_jelentkezes_statusz]
GO
USE [master]
GO
ALTER DATABASE [gyakorstartDBuj] SET  READ_WRITE 
GO
