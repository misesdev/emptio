
export const uploadImage = (base64: any) => {
    const form = new FormData()

    form.append("fileToUpload", base64)

    
}

