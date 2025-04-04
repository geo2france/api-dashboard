import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  // API WFS retourne toujours un code http 200, y compris en cas d'erreur.
  // Une réponse est présumée valide si elle renvoie un objet json valide. (Sinon c'est un xml)
  // TODO parser le XML retourné en cas d'erreur
  (response) => {
      if(typeof response.data === "object"){
        return response;
      }else{
        const customError = {
          message: response.data,
          statusCode: response.status,
        };
        return Promise.reject(customError);
    }
  },
  (error) => {
    const customError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    };

    return Promise.reject(customError);
  }
);

export { axiosInstance };
