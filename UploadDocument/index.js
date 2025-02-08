const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    if (!req.body || !req.body.fileName || !req.body.fileContent) {
        context.res = { status: 400, body: "Missing file data." };
        return;
    }

    const storageAccountName = process.env.STORAGE_ACCOUNT_NAME;
    const containerName = "documents";
    const sasToken = process.env.STORAGE_SAS_TOKEN;

    const blobServiceClient = new BlobServiceClient(
        `https://${storageAccountName}.blob.core.windows.net?${sasToken}`
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(req.body.fileName);

    const buffer = Buffer.from(req.body.fileContent, "base64");
    await blockBlobClient.uploadData(buffer);

    context.res = { status: 200, body: "File uploaded successfully." };
};
