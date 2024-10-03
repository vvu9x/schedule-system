BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Event] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [start] DATETIME2 NOT NULL,
    [end] DATETIME2 NOT NULL,
    [resourceId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Event_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Resource] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [avatarUrl] NVARCHAR(1000),
    CONSTRAINT [Resource_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Event] ADD CONSTRAINT [Event_resourceId_fkey] FOREIGN KEY ([resourceId]) REFERENCES [dbo].[Resource]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
