import fetch from 'node-fetch';
const token = 'DV9WqbvRzGXDMfkRlARnRRBx13Ltum9lUR5yEQus';
const storeId = '14592750'; // Assuming first store, or I'll just fetch stores first.
async function run() {
  const storeRes = await fetch('https://api.printful.com/stores', { headers: { 'Authorization': `Bearer ${token}` }});
  const storeData = await storeRes.json();
  const sId = storeData.result[0].id;
  const prodsRes = await fetch('https://api.printful.com/store/products', { headers: { 'Authorization': `Bearer ${token}`, 'X-PF-Store-Id': sId.toString() }});
  const prodsData = await prodsRes.json();
  const pId = prodsData.result[0].id;
  const varRes = await fetch(`https://api.printful.com/store/products/${pId}`, { headers: { 'Authorization': `Bearer ${token}`, 'X-PF-Store-Id': sId.toString() }});
  const varData = await varRes.json();
  console.log(JSON.stringify(varData.result, null, 2));
}
run();
