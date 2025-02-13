import axios from "axios";

const getUserData = async (): Promise<any> => {
    try {
        const response = await axios.get(import.meta.env.VITE_ME, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            }
        });
        return response.data; 
    } catch (error) {
        console.error("Error fetching user data", error);
        return null; 
    }
};

export { getUserData };