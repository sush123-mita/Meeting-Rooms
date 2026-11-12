import api from "./api"


//register naya employee

export const registerUser = async (userData) =>{
    const response = await api.post("auth/register/", userData);
    return response.data;
}

//login 


export const loginUser = async (credentials) => {
    const response = await api.post("auth/token/", credentials);

    localStorage.setItem("token",response.data.token);

    return response.data;
};


//logout getout

export const logoutUser = () =>{
    localStorage.removeItem("token");
}