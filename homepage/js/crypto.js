const crypto      = require('crypto');

let create_crypto = str => new Promise (res => res(crypto.createHash('sha512').update(str).digest('hex')));

const algorithm = 'aes-256-cbc';
const salt = "spnualbutddy%@!@$";
const key = crypto.scryptSync("!@#$%pnu*)(&^buddy2323332",salt, 32);
const iv = Buffer.from('44022cae0f279409376f3aaf1f50557a', "hex");
let create_aes = str => new Promise(res => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let cipher_str = cipher.update(str, 'utf8', 'hex');
    cipher_str += cipher.final('hex');
    // console.log(cipher_str);
    res(cipher_str);
});
let decrypt_aes = str => new Promise(res => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decipher_str = decipher.update(str, 'hex', 'utf8');
    decipher_str += decipher.final('utf8');
    // console.log(decipher_str);
    res(decipher_str);
});

module.exports = {create_crypto, create_aes, decrypt_aes};