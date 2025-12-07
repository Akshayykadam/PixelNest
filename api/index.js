import axios from "axios";

const API_KEY = '45129367-a3ab32ab278cd966774a3e10e';

const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

const formatUrl = (param) => { //{q, page, category, order}
    // Force photo type and editor choice for quality. Pixabay doesn't have min_width/height in this free tier but editor_choice helps.
    let url = apiUrl + "&per_page=25&safesearch=true&editor_choice=true&image_type=photo&orientation=vertical"

    if (!param) return url;

    let paramKeys = Object.keys(param);
    paramKeys.map(key => {
        let value = key == 'q' ? encodeURIComponent(param[key]) : param[key];
        url += `&${key}=${value}`;
    });

    return url;
}

export const apiCall = async (param) => {
    try {
        const response = await axios.get(formatUrl(param))
        const { data } = response;
        return { success: true, data }
    } catch (error) {

        return { success: false, error: error.message };
    }
}