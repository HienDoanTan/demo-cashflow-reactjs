export async function groupBy(xs, f) {
    return await xs.reduce(
        (r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r),
        {}
    );
}

export function remove_duplicates_es6(arr) {
    const seen = {};
    const ret_arr = [];
    for (let i = 0; i < arr.length; i++) {
        if (!(arr[i] in seen)) {
            ret_arr.push(arr[i]);
            seen[arr[i]] = true;
        }
    }
    return ret_arr;
}

export function split_long_array_with_size(bigarray, size) {
    const arrayOfArrays = [];
    for (let i = 0; i < bigarray.length; i += size) {
        arrayOfArrays.push(bigarray.slice(i, i + size));
    }
    return arrayOfArrays;
}

export function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}

export function getExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

export function numberToWords(s) {
    let i;const th = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn'];

    const dg = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

    const tn = ['mười', 'mười một', 'mười hai', 'mười ba', 'mười bốn', 'mười lăm', 'mười sáu', 'mười bảy', 'mười tám', 'mười chín'];

    const tw = ['hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];

    s = s.toString();
    s = s.replace(/[\, ]/g, '');
    if (s != parseFloat(s)) return 'not a number';
    let x = s.indexOf('.');
    if (x == -1) x = s.length;
    if (x > 15) return 'too big';
    const n = s.split('');
    let str = '';
    let sk = 0;
    for (let i = 0; i < x; i++) {
        if ((x - i) % 3 == 2) {
            if (n[i] == '1') {
                str += tn[Number(n[i + 1])] + ' ';
                i++;
                sk = 1;
            } else if (n[i] != 0) {
                str += tw[n[i] - 2] + ' ';
                sk = 1;
            }
        } else if (n[i] != 0) {
            str += dg[n[i]] + ' ';
            if ((x - i) % 3 == 0) str += 'trăm ';
            sk = 1;
        }
        if ((x - i) % 3 == 1) {
            if (sk) str += th[(x - i - 1) / 3] + ' ';
            sk = 0;
        }
    }
    if (x != s.length) {
        const y = s.length;
        str += 'point ';
        for (let i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
    }
    return str.replace(/\s+/g, ' ');
}
