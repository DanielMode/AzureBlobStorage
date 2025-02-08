const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    const fileName = req.query.fileName;
    if (!fileName) {
        context.res = { status: 400, body: "File name is required." };
        return;
    }

    const storageAccountName = process.env.STORAGE_ACCOUNT_NAME;
    const containerName = "documents";
    const sasToken = process.env.STORAGE_SAS_TOKEN;

    const blobServiceClient = new BlobServiceClient(
        `https://${storageAccountName}.blob.core.windows.net?${sasToken}`
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(fileName);

    const exists = await blobClient.exists();
    if (!exists) {
        context.res = { status: 404, body: "File not found." };
        return;
    }

    await blobClient.delete();
    context.res = { status: 200, body: "File deleted successfully." };
};
