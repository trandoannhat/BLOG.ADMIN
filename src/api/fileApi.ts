// https://nhatdev.top
//src/api/fileApi.ts
import axiosClient from "./axiosClient";

const fileApi = {
  // Thêm tham số folder (mặc định là 'general' nếu không truyền)
  upload: (file: File, folder: string = "general") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    // Đường dẫn khớp với [Route("api/[controller]")] -> /Files/upload
    return axiosClient.post("/Files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default fileApi;
