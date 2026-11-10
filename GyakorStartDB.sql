USE [master]
GO
CREATE DATABASE [GyakorStartDB]
GO
ALTER DATABASE [GyakorStartDB] SET COMPATIBILITY_LEVEL = 160
GO
USE [GyakorStartDB]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE dbo.Users (
    UserID UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Users_UserID DEFAULT NEWSEQUENTIALID(),
    Email NVARCHAR(254) NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(10) NOT NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Users_IsActive DEFAULT (1),
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Users_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Users PRIMARY KEY (UserID),
    CONSTRAINT UQ_Users_Email UNIQUE (Email),
    CONSTRAINT CK_Users_Email CHECK (Email LIKE N'%_@_%._%'),
    CONSTRAINT UQ_Users_UserID_Role UNIQUE (UserID, Role),
    CONSTRAINT CK_Users_Role CHECK (Role IN (N'student', N'company'))
);
GO

CREATE TABLE dbo.StudyPrograms (
    StudyProgramID INT IDENTITY(1,1) NOT NULL,
    ProgramCode NVARCHAR(100) NOT NULL,
    ProgramName NVARCHAR(180) NOT NULL,
    ProgramGroup NVARCHAR(100) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_StudyPrograms_IsActive DEFAULT (1),
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_StudyPrograms_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_StudyPrograms PRIMARY KEY (StudyProgramID),
    CONSTRAINT UQ_StudyPrograms_Code UNIQUE (ProgramCode),
    CONSTRAINT CK_StudyPrograms_Code_NotBlank CHECK (NULLIF(LTRIM(RTRIM(ProgramCode)), N'') IS NOT NULL),
    CONSTRAINT CK_StudyPrograms_Name_NotBlank CHECK (NULLIF(LTRIM(RTRIM(ProgramName)), N'') IS NOT NULL)
);
GO

CREATE TABLE dbo.StudentProfiles (
    StudentID UNIQUEIDENTIFIER NOT NULL,
    UserRole NVARCHAR(10) NOT NULL CONSTRAINT DF_StudentProfiles_UserRole DEFAULT (N'student'),
    FullName NVARCHAR(150) NOT NULL,
    BirthDate DATE NOT NULL,
    BirthPlace NVARCHAR(100) NOT NULL,
    University NVARCHAR(180) NOT NULL,
    StudyProgramID INT NOT NULL,
    Semester NVARCHAR(3) NULL,
    City NVARCHAR(100) NULL,
    Phone NVARCHAR(40) NULL,
    Introduction NVARCHAR(500) NULL,
    ProfileImageStorageKey NVARCHAR(1000) NULL,
    WeeklyHoursMin TINYINT NULL,
    WeeklyHoursMax TINYINT NULL,
    WorkMode NVARCHAR(10) NULL,
    DrivingLicense NVARCHAR(40) NULL,
    AvailabilityDate DATE NULL,
    LinkedInUrl NVARCHAR(500) NULL,
    PortfolioUrl NVARCHAR(500) NULL,
    RelevantCourses NVARCHAR(MAX) NULL,
    Certifications NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_StudentProfiles_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_StudentProfiles_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_StudentProfiles PRIMARY KEY (StudentID),
    CONSTRAINT CK_StudentProfiles_UserRole CHECK (UserRole = N'student'),
    CONSTRAINT FK_StudentProfiles_UserRole FOREIGN KEY (StudentID, UserRole)
        REFERENCES dbo.Users(UserID, Role),
    CONSTRAINT FK_StudentProfiles_StudyProgram FOREIGN KEY (StudyProgramID)
        REFERENCES dbo.StudyPrograms(StudyProgramID),
    CONSTRAINT CK_StudentProfiles_Semester CHECK (Semester IS NULL OR Semester IN (N'1',N'2',N'3',N'4',N'5',N'6',N'7+')),
    CONSTRAINT CK_StudentProfiles_WeeklyHours CHECK (
        (WeeklyHoursMin IS NULL AND WeeklyHoursMax IS NULL)
        OR (WeeklyHoursMin IS NOT NULL AND WeeklyHoursMax IS NOT NULL AND WeeklyHoursMin BETWEEN 5 AND 40 AND WeeklyHoursMax BETWEEN 5 AND 40 AND WeeklyHoursMin <= WeeklyHoursMax)
    ),
    CONSTRAINT CK_StudentProfiles_WorkMode CHECK (WorkMode IS NULL OR WorkMode IN (N'Irodai',N'Hibrid',N'Távoli',N'Mindegy'))
);
GO

CREATE TABLE dbo.Languages (
    LanguageID INT IDENTITY(1,1) NOT NULL,
    LanguageCode NVARCHAR(40) NOT NULL,
    LanguageName NVARCHAR(100) NOT NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Languages_IsActive DEFAULT (1),
    CONSTRAINT PK_Languages PRIMARY KEY (LanguageID),
    CONSTRAINT UQ_Languages_Code UNIQUE (LanguageCode),
    CONSTRAINT UQ_Languages_Name UNIQUE (LanguageName)
);
GO

CREATE TABLE dbo.StudentLanguages (
    StudentID UNIQUEIDENTIFIER NOT NULL,
    LanguageID INT NOT NULL,
    ProficiencyLevel CHAR(2) NOT NULL,
    HasExam BIT NOT NULL CONSTRAINT DF_StudentLanguages_HasExam DEFAULT (0),
    ExamLevel CHAR(2) NULL,
    CONSTRAINT PK_StudentLanguages PRIMARY KEY (StudentID, LanguageID),
    CONSTRAINT FK_StudentLanguages_Student FOREIGN KEY (StudentID) REFERENCES dbo.StudentProfiles(StudentID),
    CONSTRAINT FK_StudentLanguages_Language FOREIGN KEY (LanguageID) REFERENCES dbo.Languages(LanguageID),
    CONSTRAINT CK_StudentLanguages_Level CHECK (ProficiencyLevel IN ('A1','A2','B1','B2','C1','C2')),
    CONSTRAINT CK_StudentLanguages_Exam CHECK (
        (HasExam = 0 AND ExamLevel IS NULL)
        OR (HasExam = 1 AND ExamLevel IS NOT NULL AND ExamLevel IN ('A1','A2','B1','B2','C1','C2'))
    )
);
GO

CREATE TABLE dbo.StudentSkills (
    StudentSkillID BIGINT IDENTITY(1,1) NOT NULL,
    StudentID UNIQUEIDENTIFIER NOT NULL,
    SkillName NVARCHAR(120) NOT NULL,
    SkillLevel NVARCHAR(40) NULL,
    SortOrder SMALLINT NOT NULL CONSTRAINT DF_StudentSkills_SortOrder DEFAULT (0),
    CONSTRAINT PK_StudentSkills PRIMARY KEY (StudentSkillID),
    CONSTRAINT FK_StudentSkills_Student FOREIGN KEY (StudentID) REFERENCES dbo.StudentProfiles(StudentID),
    CONSTRAINT UQ_StudentSkills_Student_Skill UNIQUE (StudentID, SkillName),
    CONSTRAINT CK_StudentSkills_Level CHECK (SkillLevel IS NULL OR SkillLevel IN (N'Tanulom',N'Alapszint',N'Önállóan használom',N'Magabiztos',N'Haladó')),
    CONSTRAINT CK_StudentSkills_NameNotBlank CHECK (NULLIF(LTRIM(RTRIM(SkillName)), N'') IS NOT NULL)
);
GO

CREATE TABLE dbo.StudentEducation (
    EducationID BIGINT IDENTITY(1,1) NOT NULL,
    StudentID UNIQUEIDENTIFIER NOT NULL,
    Institution NVARCHAR(180) NULL,
    Program NVARCHAR(180) NULL,
    Period NVARCHAR(80) NULL,
    SortOrder SMALLINT NOT NULL CONSTRAINT DF_StudentEducation_SortOrder DEFAULT (0),
    CONSTRAINT PK_StudentEducation PRIMARY KEY (EducationID),
    CONSTRAINT FK_StudentEducation_Student FOREIGN KEY (StudentID) REFERENCES dbo.StudentProfiles(StudentID),
    CONSTRAINT CK_StudentEducation_Content CHECK (
        NULLIF(LTRIM(RTRIM(Institution)), N'') IS NOT NULL
        OR NULLIF(LTRIM(RTRIM(Program)), N'') IS NOT NULL
    )
);
GO

CREATE TABLE dbo.StudentExperience (
    ExperienceID BIGINT IDENTITY(1,1) NOT NULL,
    StudentID UNIQUEIDENTIFIER NOT NULL,
    ExperienceType NVARCHAR(20) NOT NULL,
    CompanyName NVARCHAR(180) NULL,
    RoleTitle NVARCHAR(180) NULL,
    Period NVARCHAR(80) NULL,
    Description NVARCHAR(1000) NULL,
    SortOrder SMALLINT NOT NULL CONSTRAINT DF_StudentExperience_SortOrder DEFAULT (0),
    CONSTRAINT PK_StudentExperience PRIMARY KEY (ExperienceID),
    CONSTRAINT FK_StudentExperience_Student FOREIGN KEY (StudentID) REFERENCES dbo.StudentProfiles(StudentID),
    CONSTRAINT CK_StudentExperience_Type CHECK (ExperienceType IN (N'professional',N'other')),
    CONSTRAINT CK_StudentExperience_Content CHECK (
        NULLIF(LTRIM(RTRIM(CompanyName)), N'') IS NOT NULL
        OR NULLIF(LTRIM(RTRIM(RoleTitle)), N'') IS NOT NULL
    )
);
GO

CREATE TABLE dbo.StudentProjects (
    ProjectID BIGINT IDENTITY(1,1) NOT NULL,
    StudentID UNIQUEIDENTIFIER NOT NULL,
    ProjectName NVARCHAR(180) NULL,
    Technologies NVARCHAR(500) NULL,
    Period NVARCHAR(80) NULL,
    Description NVARCHAR(1500) NULL,
    ProjectUrl NVARCHAR(500) NULL,
    SortOrder SMALLINT NOT NULL CONSTRAINT DF_StudentProjects_SortOrder DEFAULT (0),
    CONSTRAINT PK_StudentProjects PRIMARY KEY (ProjectID),
    CONSTRAINT FK_StudentProjects_Student FOREIGN KEY (StudentID) REFERENCES dbo.StudentProfiles(StudentID),
    CONSTRAINT CK_StudentProjects_Content CHECK (
        NULLIF(LTRIM(RTRIM(ProjectName)), N'') IS NOT NULL
        OR NULLIF(LTRIM(RTRIM(Description)), N'') IS NOT NULL
    )
);
GO

CREATE TABLE dbo.CompanyProfiles (
    CompanyID UNIQUEIDENTIFIER NOT NULL,
    UserRole NVARCHAR(10) NOT NULL CONSTRAINT DF_CompanyProfiles_UserRole DEFAULT (N'company'),
    CompanyName NVARCHAR(180) NOT NULL,
    TaxNumber NVARCHAR(20) NOT NULL,
    CompanyRegistrationNumber NVARCHAR(40) NULL,
    ContactName NVARCHAR(150) NOT NULL,
    Phone NVARCHAR(40) NOT NULL,
    PostalCode NVARCHAR(12) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    Street NVARCHAR(150) NOT NULL,
    HouseNumber NVARCHAR(30) NOT NULL,
    Website NVARCHAR(500) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_CompanyProfiles_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_CompanyProfiles_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_CompanyProfiles PRIMARY KEY (CompanyID),
    CONSTRAINT CK_CompanyProfiles_UserRole CHECK (UserRole = N'company'),
    CONSTRAINT FK_CompanyProfiles_UserRole FOREIGN KEY (CompanyID, UserRole)
        REFERENCES dbo.Users(UserID, Role),
    CONSTRAINT UQ_CompanyProfiles_TaxNumber UNIQUE (TaxNumber),
    CONSTRAINT CK_CompanyProfiles_TaxNumber_Format CHECK (
        TaxNumber LIKE N'[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]-[0-9]-[0-9][0-9]'
    )
);
GO

CREATE TABLE dbo.JobPostings (
    JobID UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_JobPostings_JobID DEFAULT NEWSEQUENTIALID(),
    CompanyID UNIQUEIDENTIFIER NOT NULL,
    PositionTitle NVARCHAR(180) NULL,
    City NVARCHAR(100) NULL,
    WorkMode NVARCHAR(10) NULL,
    ExpiresOn DATE NULL,
    MinimumSemester NVARCHAR(3) NULL,
    MinWeeklyHours TINYINT NULL,
    MaxWeeklyHours TINYINT NULL,
    HourlyRateHUF DECIMAL(10,2) NULL,
    CompanyDescription NVARCHAR(2000) NULL,
    TasksDescription NVARCHAR(2000) NULL,
    RequirementsDescription NVARCHAR(2000) NULL,
    LanguageRelation NVARCHAR(3) NOT NULL CONSTRAINT DF_JobPostings_LanguageRelation DEFAULT (N'all'),
    FieldCategory NVARCHAR(50) NULL,
    Status NVARCHAR(10) NOT NULL CONSTRAINT DF_JobPostings_Status DEFAULT (N'draft'),
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_JobPostings_CreatedAt DEFAULT SYSUTCDATETIME(),
    PublishedAt DATETIME2(0) NULL,
    UpdatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_JobPostings_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_JobPostings PRIMARY KEY (JobID),
    CONSTRAINT FK_JobPostings_Company FOREIGN KEY (CompanyID) REFERENCES dbo.CompanyProfiles(CompanyID),
    CONSTRAINT CK_JobPostings_WorkMode CHECK (WorkMode IS NULL OR WorkMode IN (N'Irodai',N'Hibrid',N'Távoli')),
    CONSTRAINT CK_JobPostings_Semester CHECK (MinimumSemester IS NULL OR MinimumSemester IN (N'1',N'2',N'3',N'4',N'5',N'6',N'7+')),
    CONSTRAINT CK_JobPostings_Hours CHECK (
        (MinWeeklyHours IS NULL AND MaxWeeklyHours IS NULL)
        OR (MinWeeklyHours IS NOT NULL AND MaxWeeklyHours IS NOT NULL AND MinWeeklyHours BETWEEN 5 AND 40 AND MaxWeeklyHours BETWEEN 5 AND 40 AND MinWeeklyHours <= MaxWeeklyHours)
    ),
    CONSTRAINT CK_JobPostings_HourlyRate CHECK (HourlyRateHUF IS NULL OR HourlyRateHUF >= 0),
    CONSTRAINT CK_JobPostings_LanguageRelation CHECK (LanguageRelation IN (N'all',N'any')),
    CONSTRAINT CK_JobPostings_Status CHECK (Status IN (N'draft',N'active',N'paused',N'closed',N'expired')),
    CONSTRAINT CK_JobPostings_ActiveComplete CHECK (
        Status <> N'active' OR (
            NULLIF(LTRIM(RTRIM(PositionTitle)), N'') IS NOT NULL
            AND NULLIF(LTRIM(RTRIM(City)), N'') IS NOT NULL
            AND WorkMode IS NOT NULL AND ExpiresOn IS NOT NULL
            AND MinimumSemester IS NOT NULL
            AND MinWeeklyHours IS NOT NULL AND MaxWeeklyHours IS NOT NULL
            AND NULLIF(LTRIM(RTRIM(TasksDescription)), N'') IS NOT NULL
            AND NULLIF(LTRIM(RTRIM(RequirementsDescription)), N'') IS NOT NULL
        )
    )
);
GO

CREATE TABLE dbo.JobStudyPrograms (
    JobID UNIQUEIDENTIFIER NOT NULL,
    StudyProgramID INT NOT NULL,
    CONSTRAINT PK_JobStudyPrograms PRIMARY KEY (JobID, StudyProgramID),
    CONSTRAINT FK_JobStudyPrograms_Job FOREIGN KEY (JobID) REFERENCES dbo.JobPostings(JobID),
    CONSTRAINT FK_JobStudyPrograms_Program FOREIGN KEY (StudyProgramID) REFERENCES dbo.StudyPrograms(StudyProgramID)
);
GO

CREATE TABLE dbo.JobLanguageRequirements (
    JobID UNIQUEIDENTIFIER NOT NULL,
    LanguageID INT NOT NULL,
    MinimumCEFRLevel CHAR(2) NOT NULL,
    RequirementType NVARCHAR(10) NOT NULL,
    ExamRequired BIT NOT NULL CONSTRAINT DF_JobLanguageRequirements_ExamRequired DEFAULT (0),
    ExamLevel CHAR(2) NULL,
    CONSTRAINT PK_JobLanguageRequirements PRIMARY KEY (JobID, LanguageID),
    CONSTRAINT FK_JobLanguageRequirements_Job FOREIGN KEY (JobID) REFERENCES dbo.JobPostings(JobID),
    CONSTRAINT FK_JobLanguageRequirements_Language FOREIGN KEY (LanguageID) REFERENCES dbo.Languages(LanguageID),
    CONSTRAINT CK_JobLanguageRequirements_Level CHECK (MinimumCEFRLevel IN ('A1','A2','B1','B2','C1','C2')),
    CONSTRAINT CK_JobLanguageRequirements_Type CHECK (RequirementType IN (N'required',N'preferred')),
    CONSTRAINT CK_JobLanguageRequirements_Exam CHECK (
        (ExamRequired = 0 AND ExamLevel IS NULL)
        OR (ExamRequired = 1 AND ExamLevel IS NOT NULL AND ExamLevel IN ('A1','A2','B1','B2','C1','C2'))
    )
);
GO

CREATE TABLE dbo.Applications (
    ApplicationID UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Applications_ID DEFAULT NEWSEQUENTIALID(),
    JobID UNIQUEIDENTIFIER NOT NULL,
    StudentID UNIQUEIDENTIFIER NOT NULL,
    ApplicationNote NVARCHAR(1000) NOT NULL,
    Status NVARCHAR(12) NOT NULL CONSTRAINT DF_Applications_Status DEFAULT (N'new'),
    AppliedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Applications_AppliedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Applications_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Applications PRIMARY KEY (ApplicationID),
    CONSTRAINT FK_Applications_Job FOREIGN KEY (JobID) REFERENCES dbo.JobPostings(JobID),
    CONSTRAINT FK_Applications_Student FOREIGN KEY (StudentID) REFERENCES dbo.StudentProfiles(StudentID),
    CONSTRAINT UQ_Applications_Job_Student UNIQUE (JobID, StudentID),
    CONSTRAINT CK_Applications_Status CHECK (Status IN (N'new',N'interview',N'accepted',N'rejected')),
    CONSTRAINT CK_Applications_Note_NotBlank CHECK (NULLIF(LTRIM(RTRIM(ApplicationNote)), N'') IS NOT NULL)
);
GO

CREATE TABLE dbo.ApplicationStatusHistory (
    HistoryID BIGINT IDENTITY(1,1) NOT NULL,
    ApplicationID UNIQUEIDENTIFIER NOT NULL,
    PreviousStatus NVARCHAR(12) NULL,
    NewStatus NVARCHAR(12) NOT NULL,
    Message NVARCHAR(1000) NULL,
    ChangedByUserID UNIQUEIDENTIFIER NULL,
    ChangedAt DATETIME2(0) NOT NULL CONSTRAINT DF_ApplicationStatusHistory_ChangedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_ApplicationStatusHistory PRIMARY KEY (HistoryID),
    CONSTRAINT FK_ApplicationStatusHistory_Application FOREIGN KEY (ApplicationID) REFERENCES dbo.Applications(ApplicationID),
    CONSTRAINT FK_ApplicationStatusHistory_User FOREIGN KEY (ChangedByUserID) REFERENCES dbo.Users(UserID),
    CONSTRAINT CK_ApplicationStatusHistory_PreviousStatus CHECK (PreviousStatus IS NULL OR PreviousStatus IN (N'new',N'interview',N'accepted',N'rejected')),
    CONSTRAINT CK_ApplicationStatusHistory_NewStatus CHECK (NewStatus IN (N'new',N'interview',N'accepted',N'rejected'))
);
GO

CREATE INDEX IX_JobPostings_Status_ExpiresOn ON dbo.JobPostings(Status, ExpiresOn);
CREATE INDEX IX_JobPostings_City_Status ON dbo.JobPostings(City, Status);
CREATE INDEX IX_JobPostings_Company_Status ON dbo.JobPostings(CompanyID, Status);
CREATE INDEX IX_Applications_Student_AppliedAt ON dbo.Applications(StudentID, AppliedAt DESC);
CREATE INDEX IX_Applications_Job_Status ON dbo.Applications(JobID, Status);
CREATE INDEX IX_ApplicationStatusHistory_Application_ChangedAt
    ON dbo.ApplicationStatusHistory(ApplicationID, ChangedAt, HistoryID);
CREATE INDEX IX_StudentSkills_Student ON dbo.StudentSkills(StudentID);
CREATE INDEX IX_StudentLanguages_Language_Level ON dbo.StudentLanguages(LanguageID, ProficiencyLevel);
CREATE INDEX IX_StudyPrograms_Active_Name ON dbo.StudyPrograms(IsActive, ProgramName);
GO

INSERT INTO dbo.Languages(LanguageCode, LanguageName) VALUES
(N'english',N'Angol'),
(N'german',N'Német'),
(N'hungarian',N'Magyar'),
(N'french',N'Francia'),
(N'spanish',N'Spanyol'),
(N'italian',N'Olasz'),
(N'russian',N'Orosz'),
(N'chinese',N'Kínai'),
(N'japanese',N'Japán'),
(N'slovak',N'Szlovák');
GO

INSERT INTO dbo.StudyPrograms(ProgramCode, ProgramName, ProgramGroup) VALUES
(N'engineering-informatics',N'Mérnökinformatikus',N'Informatika'),
(N'computer-science',N'Programtervező informatikus',N'Informatika'),
(N'business-informatics',N'Gazdaságinformatikus',N'Informatika'),
(N'software-engineering',N'Üzemmérnök-informatikus',N'Informatika'),
(N'ai-informatics',N'Mesterséges intelligencia informatikus',N'Informatika'),
(N'data-science',N'Adattudomány',N'Informatika'),
(N'electrical-engineering',N'Villamosmérnök',N'Műszaki és mérnöki'),
(N'mechanical-engineering',N'Gépészmérnök',N'Műszaki és mérnöki'),
(N'vehicle-engineering',N'Járműmérnök',N'Műszaki és mérnöki'),
(N'mechatronics',N'Mechatronikai mérnök',N'Műszaki és mérnöki'),
(N'logistics-engineering',N'Logisztikai mérnök',N'Műszaki és mérnöki'),
(N'transport-engineering',N'Közlekedésmérnök',N'Műszaki és mérnöki'),
(N'civil-engineering',N'Építőmérnök',N'Műszaki és mérnöki'),
(N'architecture',N'Építészmérnök',N'Műszaki és mérnöki'),
(N'industrial-design',N'Ipari termék- és formatervező mérnök',N'Műszaki és mérnöki'),
(N'environmental-engineering',N'Környezetmérnök',N'Műszaki és mérnöki'),
(N'chemical-engineering',N'Vegyészmérnök',N'Természettudomány és agrár'),
(N'biochemical-engineering',N'Biomérnök',N'Természettudomány és agrár'),
(N'food-engineering',N'Élelmiszermérnök',N'Természettudomány és agrár'),
(N'agricultural-engineering',N'Mezőgazdasági mérnök',N'Természettudomány és agrár'),
(N'agricultural-food-machinery',N'Mezőgazdasági és élelmiszeripari gépészmérnök',N'Természettudomány és agrár'),
(N'management',N'Gazdálkodási és menedzsment',N'Gazdaság és üzlet'),
(N'finance-accounting',N'Pénzügy és számvitel',N'Gazdaság és üzlet'),
(N'commerce-marketing',N'Kereskedelem és marketing',N'Gazdaság és üzlet'),
(N'international-business',N'Nemzetközi gazdálkodás',N'Gazdaság és üzlet'),
(N'human-resources',N'Emberi erőforrások',N'Gazdaság és üzlet'),
(N'tourism-hospitality',N'Turizmus-vendéglátás',N'Gazdaság és üzlet'),
(N'communication-media',N'Kommunikáció- és médiatudomány',N'Társadalom és bölcsészet'),
(N'law',N'Jogász',N'Társadalom és bölcsészet'),
(N'psychology',N'Pszichológia',N'Társadalom és bölcsészet'),
(N'teacher-training',N'Tanárképzés',N'Társadalom és bölcsészet'),
(N'biology',N'Biológia',N'Természettudomány és agrár'),
(N'mathematics',N'Matematika',N'Természettudomány és agrár'),
(N'physics',N'Fizika',N'Természettudomány és agrár'),
(N'chemistry',N'Kémia',N'Természettudomány és agrár'),
(N'nursing',N'Ápolás és betegellátás',N'Egészségtudomány'),
(N'public-health',N'Népegészségügyi',N'Egészségtudomány'),
(N'sport-science',N'Edző',N'Sport és művészet'),
(N'design',N'Tervezőgrafika',N'Sport és művészet'),
(N'informatics-librarian',N'Informatikus könyvtáros',N'Informatika'),
(N'garden-engineering',N'Kertészmérnök',N'Természettudomány és agrár'),
(N'plant-production-engineering',N'Növénytermesztő mérnök',N'Természettudomány és agrár'),
(N'animal-husbandry-engineering',N'Állattenyésztő mérnök',N'Természettudomány és agrár'),
(N'food-safety-engineering',N'Élelmiszerbiztonsági és -minőségi mérnök',N'Természettudomány és agrár'),
(N'international-studies',N'Nemzetközi tanulmányok',N'Társadalom és bölcsészet'),
(N'teacher',N'Osztatlan tanárképzés',N'Társadalom és bölcsészet');
GO
