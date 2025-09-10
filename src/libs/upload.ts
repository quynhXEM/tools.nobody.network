

export const UploadImage = async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file, index) => {
        formData.append("files", file)
    })
    
    
    const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData
    }).then(data => data.json())
    
    return response;
}