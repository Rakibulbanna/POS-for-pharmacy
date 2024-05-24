export const fullStringCheck = (str, target) => {
    for (const i of str) {
        if (i !== target) {
            return false;
        }
    }
    return true;
}

