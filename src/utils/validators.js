export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPassword = (password) => {
    const cleanedPassword = password.replace(/\s/g, "");
    return cleanedPassword.length >= 6;
}

export const isValidUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{4,}$/; //dài tối thiểu 4 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới
    return usernameRegex.test(username);
}