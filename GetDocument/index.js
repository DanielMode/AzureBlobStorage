const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    const storageAccountName = process.env.STORAGE_ACCOUNT_NAME;
    const containerName = "documents";
    const sasToken = process.env.STORAGE_SAS_TOKEN;

    const blobServiceClient = new BlobServiceClient(
        `https://${storageAccountName}.blob.core.windows.net?${sasToken}`
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    let files = [];
    for await (const blob of containerClient.listBlobsFlat()) {
        files.push({
            name: blob.name,
            url: `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`,
        });
    }

    context.res = { status: 200, body: files };
};
