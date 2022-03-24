import Api from './api'

class FileUploadService {
  upload(file, url) {
    let formData = new FormData();

    formData.append("file", file)
    return Api().put(`${url}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data;boundary=<calculated when request is sent>",
      },
    });
  }

  uploadGeneral(file, url) {
    let formData = new FormData();

    formData.append("file", file)
    return Api().post(`${url}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data;boundary=<calculated when request is sent>",
      },
    });
  }

}

export default new FileUploadService();