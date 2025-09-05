export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPassword = (password) => {
    const cleanedPassword = password.replace(/\s/g, "");
    return cleanedPassword.length >= 8;
}

export const isValidUsername = (username) => {
    const usernameRegex = /^[\p{L}0-9_\s]{3,}$/u;
    // \p{L} = mọi ký tự chữ (bao gồm có dấu, tiếng Việt, tiếng Nhật, v.v.)
    // 0-9 = số
    // _   = dấu gạch dưới
    // \s  = khoảng trắng (space, tab, xuống dòng)
    // {3,} = tối thiểu 3 ký tự
    return usernameRegex.test(username);
};
export const isValidProductImageCount = (quantity) => {
    return quantity >= 0 && quantity < 4;
}

const validators = {
    isValidEmail,
    isValidPassword,
    isValidUsername,
    isValidProductImageCount
};

export default validators;