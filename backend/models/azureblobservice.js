require('dotenv').config();

// MOCKED Azure Blob Service to prevent crashes due to expired SAS tokens
console.log("🛠️ Using MOCKED Azure Blob Service for local development.");

const getContainerClient = (containerName) => {
    console.log(`📡 Mocked Azure: Accessing container '${containerName}'`);
    
    // Mocked Blob Client
    const mockBlobClient = (blobName) => ({
        exists: async () => true, // Simulate file existence
        url: `https://mocked-azure.url/${containerName}/${blobName}`,
        delete: async () => console.log(`🗑️ Mocked Azure: Deleted blob '${blobName}'`),
        beginCopyFromURL: async (sourceUrl) => {
            console.log(`🔗 Mocked Azure: Copying from ${sourceUrl} to ${blobName}`);
            return { pollUntilDone: async () => ({}) };
        }
    });

    // Mocked Block Blob Client
    const mockBlockBlobClient = (blobName) => ({
        ...mockBlobClient(blobName),
        uploadData: async (data, options) => {
            console.log(`📤 Mocked Azure: Uploaded data to '${blobName}' (${options?.blobHTTPHeaders?.blobContentType || 'binary'})`);
            return { url: `https://mocked-azure.url/${containerName}/${blobName}` };
        }
    });

    return {
        getBlobClient: mockBlobClient,
        getBlockBlobClient: mockBlockBlobClient,
        listBlobsFlat: async function* (options) {
            console.log(`🔍 Mocked Azure: Listing blobs in '${containerName}' with prefix '${options?.prefix || ''}'`);
            // Mock returning a few blobs if a prefix is provided
            if (options?.prefix) {
                yield { name: `${options.prefix}mock1.png` };
                yield { name: `${options.prefix}mock2.png` };
            }
        }
    };
};

module.exports = { getContainerClient };
