export function calculateSum(array, property) {
    const total = array.reduce((accumulator, object) => {
        return parseInt(accumulator) + parseInt(object[property]);
    }, 0);

    return total;
}
