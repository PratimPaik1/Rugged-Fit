import ImageKit from '@imagekit/nodejs';

import { Config } from "../config/config.js";
const client = new ImageKit({
    privateKey: Config.IMAGEKIT_PVT_KEY, // This is the default and can be omitted
});


export async function uploadFile({ buffer, fileName, folder = "RegeedFit" }) {


    const result = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    })

    return result
}