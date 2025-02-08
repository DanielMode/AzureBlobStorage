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

    const fileUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${fileName}`;
    
    context.res = { status: 200, body: { url: fileUrl } };
};
